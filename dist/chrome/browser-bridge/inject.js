(() => {
  var p = {
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
    INSTALL_FROM: "chrome_zip",
  };
  function h() {
    return typeof process > "u" && typeof Deno < "u" ? Deno.env.toObject() : p;
  }
  var E = h();
  function ie() {
    return typeof location > "u"
      ? !1
      : location.href.includes("side-panel") &&
          location.href.includes("extension://");
  }
  function N(t, e) {
    return !e && ie()
      ? !0
      : t &&
          globalThis?.document?.querySelector(
            "meta[name=immersive-translate-options]",
          )
        ? !!globalThis.document
            ?.getElementById("immersive-translate-manifest")
            ?.value?.includes("_isUserscript")
        : E.IMMERSIVE_TRANSLATE_USERSCRIPT === "1";
  }
  function f() {
    return E.PROD === "1";
  }
  function I() {
    return E.PROD_API === "1";
  }
  function B() {
    if (E.IMMERSIVE_TRANSLATE_SAFARI === "1") return !0;
    if (
      typeof globalThis.immersiveTranslateBrowserAPI < "u" &&
      globalThis.immersiveTranslateBrowserAPI.runtime &&
      globalThis.immersiveTranslateBrowserAPI.runtime.getManifest
    ) {
      let e = globalThis.immersiveTranslateBrowserAPI.runtime.getManifest();
      return !!(e && e._isSafari);
    } else return !1;
  }
  var Ae = h().PROD === "1",
    Re = h().PROD !== "1";
  var le = "";
  function D() {
    return le || globalThis.navigator.userAgent;
  }
  function G() {
    return D().includes("ImtFxiOS");
  }
  function F() {
    let t = D();
    return t.includes("ImtFxAndroid") || t.includes("ImtFxAOS");
  }
  var M = class {
      bridge;
      waitForBridge(e = 1e4) {
        return !F() && !G()
          ? Promise.resolve(!1)
          : globalThis.WebViewJavascriptBridge
            ? ((this.bridge = globalThis.WebViewJavascriptBridge),
              Promise.resolve(!0))
            : new Promise((r) => {
                let n = Date.now(),
                  s = () => {
                    if (globalThis.WebViewJavascriptBridge)
                      return (
                        (this.bridge = globalThis.WebViewJavascriptBridge),
                        r(!0)
                      );
                    if (Date.now() - n > e) return r(!1);
                    requestAnimationFrame(s);
                  };
                s();
              });
      }
      registerHandler(e, r) {
        if (!this.bridge) {
          console.error("Bridge not initialized");
          return;
        }
        this.bridge.registerHandler(e, r);
      }
      callHandler(e, r, n) {
        if (!this.bridge) {
          console.error("Bridge not initialized");
          return;
        }
        this.bridge.doSend({ type: e, ...r }, n);
      }
    },
    c = new M();
  var o = "immersiveTranslate";
  var i = "immersive-translate",
    k = "imt",
    ce = "immersivetranslate";
  var u = "immersivetranslate.com",
    ue = `https://config.${u}/`,
    Be = `https://app.${u}/`,
    l = f() || I() ? `https://${u}/` : `https://test.${u}/`,
    b = `https://dash.${u}/`,
    De = f() || I() ? `https://api2.${u}/` : `https://test-api2.${u}/`,
    Ge = f() || I() ? `https://ai.${u}/` : `https://test-ai.${u}/`,
    Fe = `https://assets.${ce}.cn/`,
    me = l + "accounts/login?from=plugin",
    $ = l + "profile/",
    g = l + "auth/pricing/",
    _ = l + "pricing/";
  B() && ((g = l + "accounts/safari-iap/"), (_ = l + "accounts/safari-iap/"));
  var ke = f() ? `https://onboarding.${u}/` : `https://test-onboarding.${u}/`,
    H = `https://github.com/${i}/${i}/`,
    $e = `https://s.${u}/`;
  var He = o + "DeeplGlobalState",
    We = o + "BingGlobalState",
    Ke = o + "YandexGlobalState",
    Ve = o + "BaiduQianfanGlobalConfigStorageKey",
    qe = o + "SiliconCloudGlobalConfigStorageKey",
    Je = o + "ZhipuGlobalConfigStorageKey";
  var je = o + "GoogleAccessToken",
    Ye = o + "AuthFlow",
    Qe = i + "-config-latest.json",
    ze = o + "AuthState",
    Xe = o + "IframeMessage",
    Ze = o + "WaitForRateLimit",
    et = o + "DocumentMessageAsk",
    P = o + "DocumentMessageTellThirdParty",
    tt = o + "showError",
    rt = o + "showModal",
    ot = o + "showToast",
    nt = o + "tokenUsageChange",
    W = o + "DocumentMessageThirdPartyTell",
    st = o + "DocumentMessageEventUpload",
    at = o + "DocumentMessageTypeStopJsSDK",
    it = o + "DocumentMessageHandler",
    lt = o + "DocumentSetFloatBallActive",
    ct = `${o}Share`,
    ut = `${o}ShowFloatBallGuide`,
    mt = `${o}ShowPopupModalGuide`,
    pt = o + "DocumentMessageTempEnableSubtitleChanged",
    gt = o + "DocumentMessageUpdateQuickButtonAiSubtitle",
    dt = `${o}ToggleMouseHoverTranslateDirectly`,
    _t = `${o}ReqDraft`,
    ft = `${o}ResDraft`,
    xt = `${o}Container`,
    ht = `${o}SpecifiedContainer`;
  var Tt = `${o}PageTranslatedStatus`,
    St = `${o}MangaTranslatedStatus`,
    yt = `${o}PageUrlChanged`,
    Et = `${o}ReceiveCommand`,
    It = o + "LastUseMouseHoverTime",
    bt = o + "LastUseInputTime",
    At = o + "LastUseManualTranslatePageTime",
    Rt = `${o}PopupReceiveMessage`,
    Mt = o + "DocumentMessageEventTogglePopup",
    Pt = `${ue}default_config.json`,
    vt = `${o}Mark`,
    Ot = `${o}Root`,
    Ct = `${o}Walked`,
    Ut = `data-${i}-walked`,
    Lt = `${o}Paragraph`,
    wt = `data-${i}-paragraph`,
    Nt = `data-${i}-translation-element-mark`,
    Bt = `${o}TranslationElementMark`,
    Dt = `${o}TranslatedMark`,
    Gt = `${i}-input-injected-css`,
    Ft = `${o}LoadingId`,
    kt = `data-${i}-loading-id`,
    $t = `${o}ErrorId`,
    Ht = `data-${i}-error-id`,
    Wt = `${o}AtomicBlockMark`,
    Kt = `${o}ExcludeMark`,
    Vt = `data-${i}-exclude-mark`,
    qt = `${o}StayOriginalMark`,
    Jt = `${o}PreWhitespaceMark`,
    jt = `${o}InlineMark`,
    Yt = `${o}BlockMark`,
    Qt = `${o}Left`,
    zt = `${o}Right`,
    Xt = `${o}Width`,
    Zt = `${o}Height`,
    er = `${o}Top`,
    tr = `${o}FontSize`;
  var rr = `${o}GlobalStyleMark`;
  var or = `${i}-target-wrapper`,
    nr = `${i}-pdf-target-container`,
    sr = `${i}-target-inner`,
    ar = `${i}-source-wrapper`,
    ir = `${i}-target-translation-block-wrapper`,
    lr = `${i}-root-translation-theme`,
    cr = `${o}RootTranslationTheme`,
    ur = `${i}-target-translation-vertical-block-wrapper`,
    mr = `${i}-target-translation-pdf-block-wrapper`,
    pr = `${i}-target-translation-pre-whitespace`,
    gr = `${i}-target-translation-inline-wrapper`;
  var dr = [
    "https://immersive-translate.owenyoung.com/options/",
    "https://immersive-translate.owenyoung.com/auth-done/",
    b,
    b + "auth-done/",
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
  var _r = l + "docs/communities/",
    fr = H + "issues/1809",
    xr = H + "issues/1179",
    hr = { type: o + "ChildFrameToRootFrameIdentifier" };
  var Tr = f()
    ? b + "#general"
    : "http://localhost:8000/dist/userscript/options/#general";
  var pe = b + "#general",
    Sr = l + "accounts/login?from=plugin&return_url=" + encodeURIComponent(pe),
    yr =
      me +
      "&utm_source=extension&utm_medium=extension&utm_campaign=error_modal",
    ge = l + "download/",
    de = l + "topup?type=open_ai&",
    _e = l + "topup?type=deepl&",
    Er = l + "topup?type=comics&",
    Ir =
      _ + "?utm_source=extension&utm_medium=extension&utm_campaign=popup_more",
    br =
      g + "?utm_source=extension&utm_medium=extension&utm_campaign=manga_guide",
    Ar =
      ge +
      "?utm_source=extension&utm_medium=extension&utm_campaign=options_nav",
    Rr =
      _ +
      "?utm_source=extension&utm_medium=extension&utm_campaign=popup_footer",
    Mr =
      _ + "?utm_source=extension&utm_medium=extension&utm_campaign=error_modal",
    Pr = _ + "?utm_source=extension&utm_medium=extension&utm_campaign=max_",
    vr =
      _ + "?utm_source=extension&utm_medium=extension&utm_campaign=float_ball",
    Or =
      $ + "?utm_source=extension&utm_medium=extension&utm_campaign=error_modal",
    Cr =
      g +
      "?utm_source=extension&utm_medium=extension&utm_campaign=subtitle_download",
    Ur =
      g +
      "?utm_source=extension&utm_medium=extension&utm_campaign=error_modal_ai_subtitle",
    Lr =
      de + "utm_source=extension&utm_medium=extension&utm_campaign=error_modal",
    wr =
      _e + "utm_source=extension&utm_medium=extension&utm_campaign=error_modal",
    Nr =
      l +
      "topup?utm_source=extension&utm_medium=extension&utm_campaign=error_modal",
    Br =
      _ +
      "?utm_source=extension&utm_medium=extension&utm_campaign=option_sync_config",
    Dr =
      $ +
      "?utm_source=extension&utm_medium=extension&utm_campaign=error_modal&upgradeFromTrial=true",
    Gr =
      g + "?utm_source=extension&utm_medium=extension&utm_campaign=manga_intro",
    Fr =
      g + "?utm_source=extension&utm_medium=extension&utm_campaign=image_intro",
    kr =
      g +
      "?utm_source=extension&utm_medium=extension&utm_campaign=image_client",
    $r =
      g + "?utm_source=extension&utm_medium=extension&utm_campaign=yt_ai_asr",
    Hr = g + "?utm_source=extension&utm_medium=extension&utm_campaign=",
    Wr = l + "accounts/usage",
    Kr = l + "docs/usage/",
    Vr = l + "docs/communities/",
    T = h().TRANSLATE_FILE_URL,
    qr =
      T + "?utm_source=extension&utm_medium=extension&utm_campaign=options_nav",
    Jr =
      T + "?utm_source=extension&utm_medium=extension&utm_campaign=float_ball",
    jr = `${T}download-subtitle/`,
    Yr = `${T}pdf-pro/`,
    Qr = `${T}text/`;
  var zr = l + "docs/usage/";
  var Xr = `https://analytics.${u}/collect`,
    Zr = `https://analytics.${u}/internal`,
    eo = `${l}activities/components/image-pro`;
  var to = 50 * 1e4,
    ro = `[${k}-ctx-divider]`,
    oo = `${k}_context_preview`;
  var no = `${o}_selection_update_params`,
    so = `data-${i}-subtitle-type`,
    ao = `data-${i}-ai-subtitle-url`,
    io = `data-${i}-has-subtitle`;
  var lo =
    g +
    "?utm_source=extension&utm_medium=extension&utm_campaign=freeImageError";
  var co = i + "-large-cache";
  var v = class {
      constructor() {}
      getRandomId() {
        return (new Date().getTime() + Math.random()) * Math.random();
      }
      sendAsyncMessages({ type: e, data: r }) {
        return new Promise((n) => {
          let s = this.getRandomId(),
            a = this.handleMessage(e, (d) => {
              d.id === s && (a(), n(d.payload));
            });
          this.sendMessages({ type: e, id: s, data: r });
        });
      }
      sendMessages(e) {
        globalThis.document.dispatchEvent(
          new CustomEvent(W, {
            detail: JSON.stringify({
              id: e.id || this.getRandomId(),
              type: e.type,
              data: e.data,
            }),
          }),
        );
      }
      handleMessages(e) {
        let r = (n) => {
          let s = n;
          if (s.detail)
            try {
              let a = JSON.parse(s.detail);
              e(a);
            } catch (a) {
              console.error(a);
            }
        };
        return (
          globalThis.document.addEventListener(P, r),
          () => {
            globalThis.document.removeEventListener(P, r);
          }
        );
      }
      handleMessage(e, r) {
        return this.handleMessages((n) => {
          n.type === e && r(n);
        });
      }
    },
    fe = new v(),
    xe = {
      get(t, e, r) {
        return e in t
          ? (...n) => {
              let s = t[e];
              return typeof s == "function"
                ? s.apply(t, n)
                : Reflect.get(t, e, r);
            }
          : (n) => {
              if (e.startsWith("getAsync") || e.endsWith("Async"))
                return t.sendAsyncMessages({ type: e, data: n });
              t.sendMessages({ type: e, data: n });
            };
      },
    },
    m = new Proxy(fe, xe);
  function K(t, e) {
    let r =
      "right: unset; bottom: unset; left: 50%; top: 0; transform: translateX(-50%);";
    (globalThis.innerWidth > 450 &&
      (r = "left: unset; top: 0; right: 20px; bottom: unset; transform: none;"),
      m.togglePopup({
        style: t.style || r,
        isSheet: t.isSheet || !1,
        overlayStyle: t.overlayStyle || "background-color: transparent;",
      }),
      e({ result: !0 }));
  }
  function V(t, e) {
    let r =
      "right: unset; bottom: unset; left: 50%; top: 0; transform: translateX(-50%);";
    (globalThis.innerWidth > 450 &&
      (r = "left: unset; top: 0; right: 20px; bottom: unset; transform: none;"),
      m.openPopup({
        style: t.style || r,
        isSheet: t.isSheet || !1,
        overlayStyle: t.overlayStyle || "background-color: transparent;",
      }),
      e({ result: !0 }));
  }
  function q(t, e) {
    (m.closePopup(), e({ result: !0 }));
  }
  function J(t, e) {
    (m.translatePage(), e({ result: !0 }));
  }
  function j(t, e) {
    (m.restorePage(), e({ result: !0 }));
  }
  async function Y(t, e) {
    let r = await m.getPageStatusAsync();
    e({ result: !0, status: r, pageTranslated: r == "Translated" });
  }
  function Q(t, e) {
    (m.openImageTranslationFeedback(), e({ result: !0 }));
  }
  function z(t, e) {
    (m.openWebTranslationFeedback(), e({ result: !0 }));
  }
  var A = [];
  function X(t, e) {
    try {
      let { imageUrl: r } = t;
      if (!C(r))
        return e({ result: !1, errMsg: "\u56FE\u7247\u4E0D\u5B58\u5728" });
      (U({ originalUrl: r, triggerResultCallback: e }),
        m.triggerTranslateImageBySrc(r));
    } catch (r) {
      (console.error("translateImage error:", r),
        e({
          result: !1,
          errMsg: "\u7FFB\u8BD1\u8FC7\u7A0B\u53D1\u751F\u9519\u8BEF",
        }));
    }
  }
  function Z(t, e) {
    let { imageId: r, imageUrl: n } = t;
    console.log("restoreImage", JSON.stringify(t));
    let s = "";
    if (n) {
      let a = C(n);
      (a || e({ result: !1, errMsg: "\u627E\u4E0D\u5230\u539F\u56FE" }),
        (s = a?.getAttribute("bak_src") || ""));
    } else {
      let a = S({ urlHash: r });
      if (!a) {
        e({
          result: !1,
          errMsg: "\u627E\u4E0D\u5230\u7FFB\u8BD1\u540E\u7684\u56FE",
        });
        return;
      }
      if (!C(a.originalUrl)) {
        e({ result: !1, errMsg: "\u627E\u4E0D\u5230\u539F\u56FE" });
        return;
      }
      s = a.originalUrl;
    }
    (console.log("restore_image originalUrl", s),
      m.cleanTranslateImageBySrc(s));
  }
  function ee(t) {
    console.log("triggerClientTranslateImage", JSON.stringify(t));
    let { urlHash: e, imgData: r, originalUrl: n } = t,
      s = S({ originalUrl: n });
    (s || (s = { originalUrl: n, urlHash: e }),
      (s.urlHash = e),
      U(s),
      console.log("trigger urlHash", e, "base64", r),
      O(e, { state: "extension_uploading", errorMsg: "" }),
      c.callHandler(
        "imageTextRecognition",
        { imageId: e, imageUrl: n, imageData: r },
        function (a) {
          let { imageId: d, boxes: x, result: L, errMsg: w } = a;
          (L &&
            x &&
            O(d, {
              state: "saved",
              errorMsg: "",
              result: { ocrTime: 0, boxesWithText: x },
            }),
            !L && w && O(d, { state: "error", errorMsg: w }));
        },
      ));
  }
  function te(t) {
    let { urlHash: e } = t;
    console.log("queryImageTranslateState", JSON.stringify(t));
    let r = S({ urlHash: e });
    if (!r) {
      console.log("queryImageTranslateState item not found", e);
      return;
    }
    let n = r.imgState;
    return { urlHash: e, state: n };
  }
  function re(t) {
    console.log("notifyClientImageTranslatedResult", JSON.stringify(t));
    let { imgHash: e, originalUrl: r, ok: n, errMsg: s } = t,
      a = S({ originalUrl: r });
    if (!a) {
      console.log("notifyClientImageTranslatedResult item not found", e);
      return;
    }
    (U(a), a.triggerResultCallback?.({ result: n, errMsg: s }));
  }
  function U(t) {
    let e = he(t);
    if (e !== -1) {
      A[e] = t;
      return;
    }
    A.push(t);
  }
  function O(t, e) {
    let r = S({ urlHash: t });
    r && (r.imgState = e);
  }
  function he(t) {
    return A.findIndex(
      (e) => t.urlHash === e.urlHash || t.originalUrl === e.originalUrl,
    );
  }
  function S(t) {
    return A.find(
      (e) => t.urlHash === e.urlHash || t.originalUrl === e.originalUrl,
    );
  }
  function C(t) {
    console.log("findImageElementByUrl 0", t);
    let e =
      document.querySelector(`img[src="${t}"]`) ||
      document.querySelector(`img[bak_src="${t}"]`);
    if ((console.log("findImageElementByUrl 1"), e)) return e;
    console.log("findImageElementByUrl 2");
    let r =
      document.querySelector(`[srcset*="${t}"]`) ||
      document.querySelector(`[bak_srcset*="${t}"]`);
    return r instanceof HTMLSourceElement
      ? r.parentElement?.querySelector("img")
      : (console.log("findImageElementByUrl 3"),
        r instanceof HTMLImageElement
          ? r
          : (console.log("findImageElementByUrl 4"),
            r instanceof HTMLPictureElement
              ? r.querySelector("img")
              : (console.log("findImageElementByUrl 5"), null)));
  }
  var y = class {
      from;
      to;
      constructor(e) {
        ((this.from = e.from), (this.to = e.to));
      }
      sendMessages(e) {
        let r = {
          type: e.type,
          data: e.data,
          id: e.id || this.getRandomId(),
          isAsync: !1,
        };
        globalThis.document.dispatchEvent(
          new CustomEvent(this.to, { detail: JSON.stringify(r) }),
        );
      }
      getRandomId() {
        return Math.random() * 1e17 + new Date().getTime();
      }
      sendAsyncMessages({ type: e, data: r }) {
        return new Promise((n) => {
          let s = this.handleMessages((x) => {
              x.id === a && (n(x.data), s());
            }),
            a = this.getRandomId(),
            d = { type: e, data: r, id: a, isAsync: !0 };
          globalThis.document.dispatchEvent(
            new CustomEvent(this.to, { detail: JSON.stringify(d) }),
          );
        });
      }
      handleMessageOnce(e) {
        return new Promise((r) => {
          let n = this.handleMessage(e, (s) => {
            (r(s.data), n());
          });
        });
      }
      handleMessage(e, r) {
        return this.handleMessages((n) => {
          n.type === e && r(n);
        });
      }
      handleMessages(e) {
        let r = (n) => {
          let a = JSON.parse(n.detail || "{}");
          a && typeof a == "object" && e(a);
        };
        return (
          globalThis.document.addEventListener(this.from, r),
          () => {
            globalThis.document.removeEventListener(this.from, r);
          }
        );
      }
    },
    oe = {
      get(t, e, r) {
        return e in t
          ? (...n) => {
              let s = t[e];
              return typeof s == "function"
                ? s.apply(t, n)
                : Reflect.get(t, e, r);
            }
          : (n) => t.sendAsyncMessages({ type: e, data: n });
      },
    };
  var ne = "imt-browser-bridge-event-to-content-script",
    se = "imt-browser-bridge-event-to-inject",
    Te = new y({ from: ne, to: se }),
    R = new y({ from: se, to: ne }),
    Io = new Proxy(Te, oe);
  async function Se() {
    try {
      if (!(await c.waitForBridge())) return;
      (c.registerHandler("translateImage", X),
        c.registerHandler("restoreImage", Z),
        c.registerHandler("translatePage", J),
        c.registerHandler("restorePage", j),
        c.registerHandler("getPageStatus", Y),
        c.registerHandler("togglePopup", K),
        c.registerHandler("openPopup", V),
        c.registerHandler("closePopup", q),
        c.registerHandler("openImageTranslationFeedback", Q),
        c.registerHandler("openWebTranslationFeedback", z),
        ye(),
        R.sendMessages({ type: "bridgeReady" }));
    } catch (t) {
      console.error(
        "\u521D\u59CB\u5316 WebViewJavascriptBridge \u5931\u8D25:",
        t,
      );
    }
  }
  function ye() {
    R.handleMessages(async (t) => {
      try {
        let { type: e, data: r } = t,
          n = null;
        if (e === "triggerClientTranslateImage") ee(r);
        else if (e === "queryImageTranslateState") n = te(r);
        else if (e === "notifyClientImageTranslatedResult") re(r);
        else if (e === "getUserInfo") n = await Ee();
        else if (e === "getBaseInfo") n = await Ie();
        else if (e === "updatePageStatus")
          c.callHandler("updatePageStatus", r, (s) => {});
        else return;
        R.sendMessages({ type: e, id: t.id, data: n });
      } catch (e) {
        console.error("browser-bridge handleMessage error:", e);
      }
    });
  }
  function Ee() {
    return new Promise((t) => {
      c.callHandler("getUserInfo", {}, (e) => {
        e.data ? t(e.data) : t(null);
      });
    });
  }
  function Ie() {
    return new Promise((t) => {
      c.callHandler("getBaseInfo", {}, (e) => {
        e.data ? t(e.data) : t(null);
      });
    });
  }
  N() || Se();
})();
