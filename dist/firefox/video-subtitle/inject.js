(() => {
  var c = {
    BUILD_TIME: "2025-07-11T08:31:24.000Z",
    VERSION: "1.19.2",
    PROD: "1",
    REDIRECT_URL: "https://dash.immersivetranslate.com/auth-done/",
    PROD_API: "1",
    BETA: "0",
    userscript_domains:
      '["google.com","translate.googleapis.com","api-edge.cognitive.microsofttranslator.com","edge.microsoft.com","transmart.qq.com","translate.yandex.net","tmt.tencentcloudapi.com","www2.deepl.com","w.deepl.com","immersive-translate.owenyoung.com","generativelanguage.googleapis.com","chat.openai.com","bing.com","www.bing.com","open.volcengineapi.com","fanyi.baidu.com","api.fanyi.baidu.com","api.interpreter.caiyunai.com","api-free.deepl.com","api.deepl.com","api.openl.club","openapi.youdao.com","translate.volcengine.com","api.niutrans.com","immersivetranslate.com","test-api2.immersivetranslate.com","api2.immersivetranslate.com","config.immersivetranslate.com","app.immersivetranslate.com","dash.immersivetranslate.com","api.immersivetranslate.com","immersive-translate.deno.dev","www.googleapis.com","www.google-analytics.com","translate-pa.googleapis.com","api.cognitive.microsofttranslator.com","api.groq.com","api.x.ai","api.papago-chrome.com","api.openai.com","api.interpreter.caiyunai.com","api.cognitive.microsofttranslator.com","aidemo.youdao.com","dict.youdao.com","openai.azure.com","mt.aliyuncs.com","subhub.weixin.so","api.anthropic.com","localhost","127.0.0.1","ai.immersivetranslate.com","test-ai.immersivetranslate.com","openrouter.ai","dashscope.aliyuncs.com","api.deepseek.com","aip.baidubce.com","ark.cn-beijing.volces.com","hunyuan.tencentcloudapi.com","public-beta-api.siliconflow.cn","api.siliconflow.cn","open.bigmodel.cn","store.immersivetranslate.com","qianfan.baidubce.com"]',
    MOCK: "0",
    DEBUG: "0",
    IMMERSIVE_TRANSLATE_FIREFOX: "1",
    INSTALL_FROM: "firefox_zip",
  };
  var h = "imt-subtitle-inject",
    E = class {
      from;
      to;
      constructor(e, n) {
        ((this.from = e), (this.to = n));
      }
      sendMessages(e) {
        globalThis.postMessage({
          eventType: h,
          to: this.to,
          from: this.from,
          type: e.type,
          data: e.data,
          id: e.id || new Date().getTime(),
          isAsync: !1,
        });
      }
      getRandomId() {
        return (new Date().getTime() + Math.random()) * Math.random();
      }
      sendAsyncMessages({ type: e, data: n }) {
        return new Promise((t) => {
          let a = this.getRandomId();
          globalThis.postMessage({
            eventType: h,
            to: this.to,
            from: this.from,
            type: e,
            data: n,
            id: a,
            isAsync: !0,
          });
          let s = (g) => {
            let f = g.data;
            h === f.eventType &&
              f.id === a &&
              f.to === this.from &&
              (t(f.data), globalThis.removeEventListener("message", s));
          };
          globalThis.addEventListener("message", s);
        });
      }
      handleMessageOnce(e) {
        return new Promise((n) => {
          let t = (a) => {
            let s = a.data;
            h === s.eventType &&
              s.type === e &&
              s.to === this.from &&
              (n(s.data), globalThis.removeEventListener("message", t));
          };
          globalThis.addEventListener("message", t);
        });
      }
      handleMessage(e, n) {
        let t = (a) => {
          let s = a.data;
          h === s.eventType && s.type === e && s.to === this.from && n(s);
        };
        return (
          globalThis.addEventListener("message", t),
          () => {
            globalThis.removeEventListener("message", t);
          }
        );
      }
      handleMessages(e) {
        let n = ({ data: t }) => {
          h === t.eventType && t.to === this.from && e(t);
        };
        return (
          globalThis.addEventListener("message", n),
          () => {
            globalThis.removeEventListener("message", n);
          }
        );
      }
    },
    re = new E("content-script", "inject"),
    T = new E("inject", "content-script"),
    V = {
      get(r, e, n) {
        return e in r
          ? (...t) => {
              let a = r[e];
              return typeof a == "function"
                ? a.apply(r, t)
                : Reflect.get(r, e, n);
            }
          : (t) => r.sendAsyncMessages({ type: e, data: t });
      },
    },
    C = new Proxy(T, V),
    xe = new Proxy(re, V);
  function _(r) {
    if (!r) return null;
    try {
      let e = r;
      return (
        r.startsWith("//")
          ? (e = globalThis.location.protocol + r)
          : r.startsWith("/")
            ? (e = `${globalThis.location.protocol}//${globalThis.location.host}${r}`)
            : r.startsWith("http") ||
              (e = `${globalThis.location.protocol}//${r}`),
        new URL(e).toString()
      );
    } catch (e) {
      return (console.error(e), r);
    }
  }
  var i = class {
    content = C;
    config;
    constructor(e) {
      ((this.config = e),
        T.handleMessages(async ({ type: n, id: t, data: a }) => {
          let s = this[n];
          if (!s) return;
          let g = s.apply(this, [a]);
          (g instanceof Promise && (g = await g),
            T.sendMessages({ id: t, data: g }));
        }));
    }
    triggerSubtitle(e) {}
    async translateSubtitle(e) {
      let n = await this.content.requestSubtitle({ url: _(e._url) });
      if (n) {
        if (this.config.responseType == "document") {
          let a = new DOMParser().parseFromString(n, "text/xml");
          (Object.defineProperty(e, "responseXML", { value: a, writable: !1 }),
            Object.defineProperty(e, "response", { value: a, writable: !1 }));
          return;
        }
        let t = n;
        ((e.responseType == "arraybuffer" ||
          this.config.responseType == "arraybuffer") &&
          typeof n == "string" &&
          (t = new TextEncoder().encode(n).buffer),
          Object.defineProperty(e, "responseText", { value: t, writable: !1 }),
          Object.defineProperty(e, "response", { value: t, writable: !1 }));
      }
    }
    async translateSubtitleWithResponse(e, n) {
      return await this.content.requestSubtitle({ url: _(e), responseText: n });
    }
    startRequestSubtitle(e) {
      this.content.startRequestSubtitle({ url: _(e) });
    }
    subtitleRequestError(e) {
      this.content.subtitleRequestError({ ...e, url: _(e.url) });
    }
    async isOnlyResponse() {
      return this.config.hookType.includes("xhr_response");
    }
    async translateSubtitleWithFetch(e, n) {
      let t = { ...n },
        a;
      return (
        typeof e == "string"
          ? (a = { url: e, method: "GET", headers: {} })
          : (a = await oe(e)),
        t?.body && (t.body = z(t.body)),
        this.content.requestSubtitle({
          fetchInfo: JSON.stringify({ input: a, options: t }),
        })
      );
    }
    async getVideoMeta(e) {}
    getCurrentTime() {
      return null;
    }
    getCurrentDuration() {
      return null;
    }
    isSubtitleRequest(e) {
      return !this.config || !this.config.subtitleUrlRegExp || !e
        ? !1
        : new RegExp(this.config.subtitleUrlRegExp).test(e || "");
    }
  };
  function oe(r) {
    if (r instanceof URL) return { url: r.href, method: "GET", headers: {} };
    let e = r.clone(),
      n = {
        url: r.url,
        method: r.method,
        headers: Object.fromEntries(r.headers.entries()),
      };
    if (e.body) {
      let t = z(e.body);
      if (e.body !== t) return e.text().then((a) => ((n.body = a), n));
      n.body = t;
    }
    return Promise.resolve(n);
  }
  function z(r) {
    if (!r) return r;
    if (r instanceof FormData || r instanceof URLSearchParams) {
      let e = {};
      for (let [n, t] of r.entries()) e[n] = t;
      return ((e._formatBodyType = "FormData"), e);
    }
    return r;
  }
  var P = class extends i {
    timer = null;
    triggerSubtitle({ force: e }) {
      setTimeout(() => {
        if (this.config?.subtitleButtonSelector) {
          let n = document.querySelector(this.config.subtitleButtonSelector);
          if (n) {
            let t = n.getAttribute("aria-pressed") === "true";
            t && e
              ? (n.click(),
                setTimeout(() => {
                  n.click();
                }, 100))
              : t || n.click();
            return;
          }
        }
        if (this.config?.videoPlayerSelector) {
          let n = document.querySelector(this.config.videoPlayerSelector);
          (n?.toggleSubtitles(),
            setTimeout(() => {
              n?.toggleSubtitles();
            }, 100));
        }
      }, 1e3);
    }
    async getVideoMeta() {
      if (!this.config.videoPlayerSelector) return null;
      try {
        return (
          await this.sleep(100),
          document
            .querySelector(this.config.videoPlayerSelector)
            ?.getPlayerResponse()
        );
      } catch {
        return null;
      }
    }
    async isOnlyResponse() {
      let e = await super.isOnlyResponse();
      return !e || (await this.getVideoMeta())?.videoDetails?.isLive ? !1 : e;
    }
    getCurrentTime() {
      try {
        return this.config.videoPlayerSelector
          ? document
              .querySelector(this.config.videoPlayerSelector)
              ?.getCurrentTime()
          : null;
      } catch {
        return null;
      }
    }
    getCurrentDuration() {
      try {
        return this.config.videoPlayerSelector
          ? document
              .querySelector(this.config.videoPlayerSelector)
              ?.getDuration()
          : null;
      } catch {
        return null;
      }
    }
    sleep(e) {
      return new Promise((n) => {
        setTimeout(() => {
          n(null);
        }, e);
      });
    }
  };
  var A = class extends i {
    timer = null;
    videoMeta = {};
    lastVideoMeta = null;
    constructor(e) {
      (super(e), this.hookJSON());
    }
    hookJSON() {
      let e = JSON.parse;
      JSON.parse = (n) => {
        let t = e(n);
        try {
          t &&
            t.result &&
            t.result.timedtexttracks &&
            t.result.movieId &&
            ((this.videoMeta[t.result.movieId] = t.result),
            (this.lastVideoMeta = t.result));
        } catch (a) {
          console.log(a);
        }
        return t;
      };
    }
    getVideoMeta(e) {
      return this.lastVideoMeta;
    }
  };
  var I = class extends i {
    timer = null;
    videoMeta = {};
    constructor(e) {
      (super(e), this.hookJSON());
    }
    hookJSON() {
      let e = JSON.parse;
      JSON.parse = (n) => {
        let t = e(n);
        try {
          t?.asset?.captions?.length
            ? (this.videoMeta[t.id] = t?.asset)
            : t?.previews &&
              t?.course &&
              t?.previews?.forEach((a) => {
                this.videoMeta[a.id] = a;
              });
        } catch (a) {
          console.error(a);
        }
        return t;
      };
    }
    getVideoMeta(e) {
      return this.videoMeta[e];
    }
  };
  var L = class extends i {
    timer = null;
    videoMeta = {};
    constructor(e) {
      (super(e), this.hookJSON());
    }
    hookJSON() {
      let e = JSON.parse;
      JSON.parse = (n) => {
        let t = e(n);
        try {
          if (
            t?.stream?.sources?.length &&
            t?.stream?.sources[0]?.complete?.url
          ) {
            let a = window.location.pathname.split("/");
            a.length > 2 &&
              a[a.length - 2] === "video" &&
              (this.videoMeta[a[a.length - 1]] =
                t.stream.sources[0].complete.url);
          }
        } catch (a) {
          console.error(a);
        }
        return t;
      };
    }
    getVideoMeta(e) {
      return this.videoMeta[e];
    }
  };
  var k = class extends i {
    constructor(e) {
      super(e);
    }
    async translateSubtitleWithFetch(e, n) {
      this.main(e, n);
    }
    async main(e, n) {
      let t = globalThis.__originalFetch;
      if (!t) return;
      let a = e;
      e instanceof Request && (a = e.clone());
      let s = await t(a, n);
      if (!s.ok) return;
      let g = await s.json();
      g.transcripts_urls && this.requestSubtitle(g.transcripts_urls);
    }
    async requestSubtitle(e) {
      (await d(), await this.content.requestSubtitle(e));
    }
  };
  var O = class extends i {
    constructor(e) {
      super(e);
    }
    lang = "";
    async translateSubtitleWithFetch(e, n) {
      this.main(e, n);
    }
    async main(e, n) {
      let t = globalThis.__originalFetch;
      if (!t) return;
      let a = this.getUrl(e);
      return /textstream_/.test(a)
        ? this.parseLang(a)
        : this.parseAllSubs(e, n, t);
    }
    getUrl(e) {
      return e.toString();
    }
    async parseLang(e) {
      let t = e.match(/textstream_(\w+)=/)?.[1];
      return (
        !t ||
          t == this.lang ||
          ((this.lang = t), await d(), this.content.changeLang(t)),
        null
      );
    }
    async parseAllSubs(e, n, t) {
      if (!t) return;
      let a = e;
      e instanceof Request && (a = e.clone());
      let s = await t(a, n);
      if (!s.ok) return;
      let g = await s.json();
      g.text_track_urls && this.requestSubtitle(g.text_track_urls);
    }
    async requestSubtitle(e) {
      (await d(), await this.content.requestSubtitle(e));
    }
  };
  var { Deno: J } = globalThis,
    ae = typeof J?.noColor == "boolean" ? J.noColor : !0,
    ie = !ae;
  function U(r, e) {
    return {
      open: `\x1B[${r.join(";")}m`,
      close: `\x1B[${e}m`,
      regexp: new RegExp(`\\x1b\\[${e}m`, "g"),
    };
  }
  function w(r, e) {
    return ie ? `${e.open}${r.replace(e.regexp, e.open)}${e.close}` : r;
  }
  function D(r) {
    return w(r, U([2], 22));
  }
  function B(r) {
    return w(r, U([31], 39));
  }
  function F(r) {
    return w(r, U([32], 39));
  }
  function H(r) {
    return w(r, U([33], 39));
  }
  var Ve = new RegExp(
    [
      "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
      "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))",
    ].join("|"),
    "g",
  );
  function M() {
    return typeof process > "u" && typeof Deno < "u" ? Deno.env.toObject() : c;
  }
  var $ = M();
  function S() {
    return $.PROD === "1";
  }
  function N() {
    return $.PROD_API === "1";
  }
  function Q() {
    if ($.IMMERSIVE_TRANSLATE_SAFARI === "1") return !0;
    if (
      typeof globalThis.immersiveTranslateBrowserAPI < "u" &&
      globalThis.immersiveTranslateBrowserAPI.runtime &&
      globalThis.immersiveTranslateBrowserAPI.runtime.getManifest
    ) {
      let e = globalThis.immersiveTranslateBrowserAPI.runtime.getManifest();
      return !!(e && e._isSafari);
    } else return !1;
  }
  var Ye = M().PROD === "1",
    Xe = M().PROD !== "1";
  var o = "immersiveTranslate",
    b = "Immersive Translate",
    l = "immersive-translate",
    Y = "imt",
    le = "immersivetranslate";
  var p = "immersivetranslate.com",
    ge = `https://config.${p}/`,
    rt = `https://app.${p}/`,
    u = S() || N() ? `https://${p}/` : `https://test.${p}/`,
    G = `https://dash.${p}/`,
    ot = S() || N() ? `https://api2.${p}/` : `https://test-api2.${p}/`,
    at = S() || N() ? `https://ai.${p}/` : `https://test-ai.${p}/`,
    it = `https://assets.${le}.cn/`,
    ue = u + "accounts/login?from=plugin",
    X = u + "profile/",
    m = u + "auth/pricing/",
    x = u + "pricing/";
  Q() && ((m = u + "accounts/safari-iap/"), (x = u + "accounts/safari-iap/"));
  var st = S() ? `https://onboarding.${p}/` : `https://test-onboarding.${p}/`,
    Z = `https://github.com/${l}/${l}/`,
    lt = `https://s.${p}/`;
  var gt = o + "DeeplGlobalState",
    ut = o + "BingGlobalState",
    ct = o + "YandexGlobalState",
    pt = o + "BaiduQianfanGlobalConfigStorageKey",
    mt = o + "SiliconCloudGlobalConfigStorageKey",
    dt = o + "ZhipuGlobalConfigStorageKey";
  var bt = o + "GoogleAccessToken",
    ft = o + "AuthFlow",
    Tt = l + "-config-latest.json",
    xt = o + "AuthState",
    ht = o + "IframeMessage",
    St = o + "WaitForRateLimit",
    yt = o + "DocumentMessageAsk",
    Rt = o + "DocumentMessageTellThirdParty",
    _t = o + "showError",
    Mt = o + "showModal",
    vt = o + "showToast",
    Et = o + "tokenUsageChange",
    Ct = o + "DocumentMessageThirdPartyTell",
    Pt = o + "DocumentMessageEventUpload",
    At = o + "DocumentMessageTypeStopJsSDK",
    It = o + "DocumentMessageHandler",
    Lt = o + "DocumentSetFloatBallActive",
    kt = `${o}Share`,
    Ot = `${o}ShowFloatBallGuide`,
    Ut = `${o}ShowPopupModalGuide`,
    wt = o + "DocumentMessageTempEnableSubtitleChanged",
    Dt = o + "DocumentMessageUpdateQuickButtonAiSubtitle",
    Bt = `${o}ToggleMouseHoverTranslateDirectly`,
    Ft = `${o}ReqDraft`,
    Nt = `${o}ResDraft`,
    Gt = `${o}Container`,
    qt = `${o}SpecifiedContainer`;
  var Wt = `${o}PageTranslatedStatus`,
    Ht = `${o}MangaTranslatedStatus`,
    $t = `${o}PageUrlChanged`,
    Kt = `${o}ReceiveCommand`,
    jt = o + "LastUseMouseHoverTime",
    Vt = o + "LastUseInputTime",
    zt = o + "LastUseManualTranslatePageTime",
    Jt = `${o}PopupReceiveMessage`,
    Qt = o + "DocumentMessageEventTogglePopup",
    Yt = `${ge}default_config.json`,
    Xt = `${o}Mark`,
    Zt = `${o}Root`,
    en = `${o}Walked`,
    tn = `data-${l}-walked`,
    nn = `${o}Paragraph`,
    rn = `data-${l}-paragraph`,
    on = `data-${l}-translation-element-mark`,
    an = `${o}TranslationElementMark`,
    sn = `${o}TranslatedMark`,
    ln = `${l}-input-injected-css`,
    gn = `${o}LoadingId`,
    un = `data-${l}-loading-id`,
    cn = `${o}ErrorId`,
    pn = `data-${l}-error-id`,
    mn = `${o}AtomicBlockMark`,
    dn = `${o}ExcludeMark`,
    bn = `data-${l}-exclude-mark`,
    fn = `${o}StayOriginalMark`,
    Tn = `${o}PreWhitespaceMark`,
    xn = `${o}InlineMark`,
    hn = `${o}BlockMark`,
    Sn = `${o}Left`,
    yn = `${o}Right`,
    Rn = `${o}Width`,
    _n = `${o}Height`,
    Mn = `${o}Top`,
    vn = `${o}FontSize`;
  var En = `${o}GlobalStyleMark`;
  var Cn = `${l}-target-wrapper`,
    Pn = `${l}-pdf-target-container`,
    An = `${l}-target-inner`,
    In = `${l}-source-wrapper`,
    Ln = `${l}-target-translation-block-wrapper`,
    kn = `${l}-root-translation-theme`,
    On = `${o}RootTranslationTheme`,
    Un = `${l}-target-translation-vertical-block-wrapper`,
    wn = `${l}-target-translation-pdf-block-wrapper`,
    Dn = `${l}-target-translation-pre-whitespace`,
    Bn = `${l}-target-translation-inline-wrapper`;
  var Fn = [
    "https://immersive-translate.owenyoung.com/options/",
    "https://immersive-translate.owenyoung.com/auth-done/",
    G,
    G + "auth-done/",
    "http://localhost:8000/dist/userscript/options/",
    "http://localhost:8000/auth-done/",
    "http://192.168.50.9:8000/dist/userscript/options/",
    "http://192.168.31.51:8000/dist/userscript/options/",
    "http://192.168.1.72:8000/dist/userscript/options/",
    "https://www.deepl.com/translator",
    "translate.google.com",
    "http://localhost:8000/options/",
    "http://192.168.50.9:8000/options/",
    "http://192.168.31.51:8000/options/",
    "http://192.168.1.72:8000/options/",
  ];
  var Nn = u + "docs/communities/",
    Gn = Z + "issues/1809",
    qn = Z + "issues/1179",
    Wn = { type: o + "ChildFrameToRootFrameIdentifier" };
  var Hn = S()
    ? G + "#general"
    : "http://localhost:8000/dist/userscript/options/#general";
  var ce = G + "#general",
    $n = u + "accounts/login?from=plugin&return_url=" + encodeURIComponent(ce),
    Kn =
      ue +
      "&utm_source=extension&utm_medium=extension&utm_campaign=error_modal",
    pe = u + "download/",
    me = u + "topup?type=open_ai&",
    de = u + "topup?type=deepl&",
    jn = u + "topup?type=comics&",
    Vn =
      x + "?utm_source=extension&utm_medium=extension&utm_campaign=popup_more",
    zn =
      m + "?utm_source=extension&utm_medium=extension&utm_campaign=manga_guide",
    Jn =
      pe +
      "?utm_source=extension&utm_medium=extension&utm_campaign=options_nav",
    Qn =
      x +
      "?utm_source=extension&utm_medium=extension&utm_campaign=popup_footer",
    Yn =
      x + "?utm_source=extension&utm_medium=extension&utm_campaign=error_modal",
    Xn = x + "?utm_source=extension&utm_medium=extension&utm_campaign=max_",
    Zn =
      x + "?utm_source=extension&utm_medium=extension&utm_campaign=float_ball",
    er =
      X + "?utm_source=extension&utm_medium=extension&utm_campaign=error_modal",
    tr =
      m +
      "?utm_source=extension&utm_medium=extension&utm_campaign=subtitle_download",
    nr =
      m +
      "?utm_source=extension&utm_medium=extension&utm_campaign=error_modal_ai_subtitle",
    rr =
      me + "utm_source=extension&utm_medium=extension&utm_campaign=error_modal",
    or =
      de + "utm_source=extension&utm_medium=extension&utm_campaign=error_modal",
    ar =
      u +
      "topup?utm_source=extension&utm_medium=extension&utm_campaign=error_modal",
    ir =
      x +
      "?utm_source=extension&utm_medium=extension&utm_campaign=option_sync_config",
    sr =
      X +
      "?utm_source=extension&utm_medium=extension&utm_campaign=error_modal&upgradeFromTrial=true",
    lr =
      m + "?utm_source=extension&utm_medium=extension&utm_campaign=manga_intro",
    gr =
      m + "?utm_source=extension&utm_medium=extension&utm_campaign=image_intro",
    ur =
      m +
      "?utm_source=extension&utm_medium=extension&utm_campaign=image_client",
    cr =
      m + "?utm_source=extension&utm_medium=extension&utm_campaign=yt_ai_asr",
    pr = m + "?utm_source=extension&utm_medium=extension&utm_campaign=",
    mr = u + "accounts/usage",
    dr = u + "docs/usage/",
    br = u + "docs/communities/",
    v = M().TRANSLATE_FILE_URL,
    fr =
      v + "?utm_source=extension&utm_medium=extension&utm_campaign=options_nav",
    Tr =
      v + "?utm_source=extension&utm_medium=extension&utm_campaign=float_ball",
    xr = `${v}download-subtitle/`,
    hr = `${v}pdf-pro/`,
    Sr = `${v}text/`;
  var yr = u + "docs/usage/";
  var Rr = `https://analytics.${p}/collect`,
    _r = `https://analytics.${p}/internal`,
    Mr = `${u}activities/components/image-pro`;
  var vr = 50 * 1e4,
    Er = `[${Y}-ctx-divider]`,
    Cr = `${Y}_context_preview`;
  var Pr = `${o}_selection_update_params`,
    Ar = `data-${l}-subtitle-type`,
    Ir = `data-${l}-ai-subtitle-url`,
    Lr = `data-${l}-has-subtitle`;
  var kr =
    m +
    "?utm_source=extension&utm_medium=extension&utm_campaign=freeImageError";
  var Or = l + "-large-cache";
  var y = console,
    K = class {
      #e = performance.now();
      reset() {
        this.#e = performance.now();
      }
      stop(e) {
        let n = performance.now(),
          t = Math.round(n - this.#e),
          a = F;
        (t > 1e4 ? (a = B) : t > 1e3 && (a = H),
          y.debug(D(b + " TIMING:"), e, "in", a(t + "ms")),
          (this.#e = n));
      }
    },
    j = class {
      #e = 1;
      get level() {
        return this.#e;
      }
      setLevel(e) {
        switch (e) {
          case "debug":
            this.#e = 0;
            break;
          case "info":
            this.#e = 1;
            break;
          case "warn":
            this.#e = 2;
            break;
          case "error":
            this.#e = 3;
            break;
          case "fatal":
            this.#e = 4;
            break;
        }
      }
      debug(...e) {
        this.#e <= 0 && y.log(D(b + " DEBUG:"), ...e);
      }
      v(...e) {
        this.#e <= 0 && console.log(D(b + " VERBOSE:"), ...e);
      }
      info(...e) {
        this.#e <= 1 && y.log(F(b + " INFO:"), ...e);
      }
      l(...e) {
        this.#e <= 1 && console.log(F(b + " TEMP INFO:"), ...e);
      }
      warn(...e) {
        this.#e <= 2 && y.warn(H(b + " WARN:"), ...e);
      }
      error(...e) {
        this.#e <= 3 && y.error(B(b + " ERROR:"), ...e);
      }
      fatal(...e) {
        this.#e <= 4 && y.error(B(b + " FATAL:"), ...e);
      }
      timing() {
        return this.level === 0 ? new K() : { reset: () => {}, stop: () => {} };
      }
    },
    ee = new j();
  var te = { hookRequest: () => {} };
  async function be() {
    let r = await T.sendAsyncMessages({ type: "getConfig" });
    if (!r) return;
    let n = {
      youtube: P,
      netflix: A,
      webvtt: i,
      khanacademy: i,
      udemy: I,
      general: i,
      ebutt: i,
      hulu: k,
      mubi: O,
      disneyplus: L,
      "fmp4.xml": i,
      multi_attach_vtt: i,
      twitter: i,
      subsrt: i,
      xml: i,
      text_track_dynamic: i,
      av: i,
    }[r.type || ""];
    if (!n) return;
    let t = new n(r);
    te.hookRequest(t, r);
  }
  te.hookRequest = (r, e) => {
    if (e.hookType.includes("xhr")) {
      let n = XMLHttpRequest.prototype.open,
        t = XMLHttpRequest.prototype.send,
        a = function () {
          return ((this._url = arguments[1]), n.apply(this, arguments));
        },
        s = async function () {
          let g = this._url,
            f = r.isSubtitleRequest(g);
          return !g || !f
            ? t.apply(this, arguments)
            : ((await r.isOnlyResponse())
                ? (r.startRequestSubtitle(g),
                  (this.onreadystatechange = async () => {
                    let R = XMLHttpRequest.DONE;
                    (typeof R > "u" && (R = 4),
                      this.readyState === R &&
                        this.status === 429 &&
                        r.subtitleRequestError({
                          url: g,
                          responseStatus: this.status,
                        }),
                      this.readyState === R &&
                        this.status === 200 &&
                        (await d()) &&
                        r.translateSubtitleWithResponse(g, this.responseText));
                  }))
                : (await d()) && (await r.translateSubtitle(this)),
              t.apply(this, arguments));
        };
      (Object.defineProperty(XMLHttpRequest.prototype, "open", {
        value: a,
        writable: !0,
      }),
        Object.defineProperty(XMLHttpRequest.prototype, "send", {
          value: s,
          writable: !0,
        }));
    }
    if (e.hookType.includes("fetch")) {
      let n = globalThis.fetch;
      ((globalThis.__originalFetch = n),
        (globalThis.fetch = async function (t, a) {
          let s = typeof t == "string" ? t : t.url || t.href;
          if (!r.isSubtitleRequest(s)) return n(t, a);
          if (await d()) {
            let W = await r.translateSubtitleWithFetch(t, a);
            return W ? new Response(W) : n(t, a);
          }
          return n(t, a);
        }));
    }
  };
  var q = !1;
  function d() {
    if (!q) {
      let r = T.handleMessageOnce("contentReady").then(() => ((q = !0), !0));
      return (
        C.isContentReady(),
        Promise.race([
          r,
          new Promise((e) => {
            setTimeout(() => {
              (q || ee.warn("waitPluginDone timeout"), e(!1));
            }, 5e3);
          }),
        ])
      );
    }
    return Promise.resolve(q);
  }
  d();
  be();
})();
