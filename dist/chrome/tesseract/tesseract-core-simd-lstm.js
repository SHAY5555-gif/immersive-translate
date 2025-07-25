var TesseractCore = (() => {
  var _scriptDir =
    typeof document !== "undefined" && document.currentScript
      ? document.currentScript.src
      : undefined;
  if (typeof __filename !== "undefined") _scriptDir = _scriptDir || __filename;
  return function (TesseractCore = {}) {
    var b;
    b || (b = typeof TesseractCore !== "undefined" ? TesseractCore : {});
    var aa, ba;
    b.ready = new Promise((a, c) => {
      aa = a;
      ba = c;
    });
    var ca = Object.assign({}, b),
      da = "./this.program",
      ea = (a, c) => {
        throw c;
      },
      fa = "object" == typeof window,
      ha = "function" == typeof importScripts,
      ia =
        "object" == typeof process &&
        "object" == typeof process.versions &&
        "string" == typeof process.versions.node,
      f = "",
      ja,
      ka,
      la;
    if (ia) {
      var fs = require("fs"),
        ma = require("path");
      f = ha ? ma.dirname(f) + "/" : __dirname + "/";
      ja = (a, c) => {
        a = a.startsWith("file://") ? new URL(a) : ma.normalize(a);
        return fs.readFileSync(a, c ? void 0 : "utf8");
      };
      la = (a) => {
        a = ja(a, !0);
        a.buffer || (a = new Uint8Array(a));
        return a;
      };
      ka = (a, c, d, e = !0) => {
        a = a.startsWith("file://") ? new URL(a) : ma.normalize(a);
        fs.readFile(a, e ? void 0 : "utf8", (g, h) => {
          g ? d(g) : c(e ? h.buffer : h);
        });
      };
      !b.thisProgram &&
        1 < process.argv.length &&
        (da = process.argv[1].replace(/\\/g, "/"));
      process.argv.slice(2);
      ea = (a, c) => {
        process.exitCode = a;
        throw c;
      };
      b.inspect = () => "[Emscripten Module object]";
    } else if (fa || ha)
      (ha
        ? (f = self.location.href)
        : "undefined" != typeof document &&
          document.currentScript &&
          (f = document.currentScript.src),
        _scriptDir && (f = _scriptDir),
        0 !== f.indexOf("blob:")
          ? (f = f.substr(0, f.replace(/[?#].*/, "").lastIndexOf("/") + 1))
          : (f = ""),
        (ja = (a) => {
          var c = new XMLHttpRequest();
          c.open("GET", a, !1);
          c.send(null);
          return c.responseText;
        }),
        ha &&
          (la = (a) => {
            var c = new XMLHttpRequest();
            c.open("GET", a, !1);
            c.responseType = "arraybuffer";
            c.send(null);
            return new Uint8Array(c.response);
          }),
        (ka = (a, c, d) => {
          var e = new XMLHttpRequest();
          e.open("GET", a, !0);
          e.responseType = "arraybuffer";
          e.onload = () => {
            200 == e.status || (0 == e.status && e.response)
              ? c(e.response)
              : d();
          };
          e.onerror = d;
          e.send(null);
        }));
    var na = b.print || console.log.bind(console),
      n = b.printErr || console.warn.bind(console);
    Object.assign(b, ca);
    ca = null;
    b.thisProgram && (da = b.thisProgram);
    b.quit && (ea = b.quit);
    var oa;
    b.wasmBinary && (oa = b.wasmBinary);
    var noExitRuntime = b.noExitRuntime || !0;
    "object" != typeof WebAssembly && p("no native wasm support detected");
    var pa,
      ra = !1,
      r,
      sa,
      ta,
      u,
      x,
      ua,
      va;
    function wa() {
      var a = pa.buffer;
      b.HEAP8 = r = new Int8Array(a);
      b.HEAP16 = ta = new Int16Array(a);
      b.HEAP32 = u = new Int32Array(a);
      b.HEAPU8 = sa = new Uint8Array(a);
      b.HEAPU16 = new Uint16Array(a);
      b.HEAPU32 = x = new Uint32Array(a);
      b.HEAPF32 = ua = new Float32Array(a);
      b.HEAPF64 = va = new Float64Array(a);
    }
    var xa,
      ya = [],
      za = [],
      Aa = [],
      Ba = !1;
    function Ca() {
      var a = b.preRun.shift();
      ya.unshift(a);
    }
    var Da = 0,
      Ea = null,
      Fa = null;
    function Ga() {
      Da++;
      b.monitorRunDependencies && b.monitorRunDependencies(Da);
    }
    function Ha() {
      Da--;
      b.monitorRunDependencies && b.monitorRunDependencies(Da);
      if (0 == Da && (null !== Ea && (clearInterval(Ea), (Ea = null)), Fa)) {
        var a = Fa;
        Fa = null;
        a();
      }
    }
    function p(a) {
      if (b.onAbort) b.onAbort(a);
      a = "Aborted(" + a + ")";
      n(a);
      ra = !0;
      a = new WebAssembly.RuntimeError(
        a + ". Build with -sASSERTIONS for more info.",
      );
      ba(a);
      throw a;
    }
    function Ia(a) {
      return a.startsWith("data:application/octet-stream;base64,");
    }
    var Ja;
    Ja = "tesseract-core-simd-lstm.wasm";
    if (!Ia(Ja)) {
      var Ka = Ja;
      Ja = b.locateFile ? b.locateFile(Ka, f) : f + Ka;
    }
    function La(a) {
      try {
        if (a == Ja && oa) return new Uint8Array(oa);
        if (la) return la(a);
        throw "both async and sync fetching of the wasm failed";
      } catch (c) {
        p(c);
      }
    }
    function Ma(a) {
      if (!oa && (fa || ha)) {
        if ("function" == typeof fetch && !a.startsWith("file://"))
          return fetch(a, { credentials: "same-origin" })
            .then((c) => {
              if (!c.ok) throw "failed to load wasm binary file at '" + a + "'";
              return c.arrayBuffer();
            })
            .catch(() => La(a));
        if (ka)
          return new Promise((c, d) => {
            ka(a, (e) => c(new Uint8Array(e)), d);
          });
      }
      return Promise.resolve().then(() => La(a));
    }
    function Na(a, c, d) {
      return Ma(a)
        .then((e) => WebAssembly.instantiate(e, c))
        .then((e) => e)
        .then(d, (e) => {
          n("failed to asynchronously prepare wasm: " + e);
          p(e);
        });
    }
    function Oa(a, c) {
      var d = Ja;
      return oa ||
        "function" != typeof WebAssembly.instantiateStreaming ||
        Ia(d) ||
        d.startsWith("file://") ||
        ia ||
        "function" != typeof fetch
        ? Na(d, a, c)
        : fetch(d, { credentials: "same-origin" }).then((e) =>
            WebAssembly.instantiateStreaming(e, a).then(c, function (g) {
              n("wasm streaming compile failed: " + g);
              n("falling back to ArrayBuffer instantiation");
              return Na(d, a, c);
            }),
          );
    }
    var y,
      z,
      Pa = {
        420124: (a) => {
          b.TesseractProgress && b.TesseractProgress(a);
        },
        420193: (a) => {
          b.TesseractProgress && b.TesseractProgress(a);
        },
      };
    function Qa(a) {
      this.name = "ExitStatus";
      this.message = "Program terminated with exit(" + a + ")";
      this.status = a;
    }
    function Ra(a) {
      for (; 0 < a.length; ) a.shift()(b);
    }
    function Sa(a) {
      for (var c = 0, d = 0; d < a.length; ++d) {
        var e = a.charCodeAt(d);
        127 >= e
          ? c++
          : 2047 >= e
            ? (c += 2)
            : 55296 <= e && 57343 >= e
              ? ((c += 4), ++d)
              : (c += 3);
      }
      return c;
    }
    function Ta(a, c, d, e) {
      if (!(0 < e)) return 0;
      var g = d;
      e = d + e - 1;
      for (var h = 0; h < a.length; ++h) {
        var k = a.charCodeAt(h);
        if (55296 <= k && 57343 >= k) {
          var m = a.charCodeAt(++h);
          k = (65536 + ((k & 1023) << 10)) | (m & 1023);
        }
        if (127 >= k) {
          if (d >= e) break;
          c[d++] = k;
        } else {
          if (2047 >= k) {
            if (d + 1 >= e) break;
            c[d++] = 192 | (k >> 6);
          } else {
            if (65535 >= k) {
              if (d + 2 >= e) break;
              c[d++] = 224 | (k >> 12);
            } else {
              if (d + 3 >= e) break;
              c[d++] = 240 | (k >> 18);
              c[d++] = 128 | ((k >> 12) & 63);
            }
            c[d++] = 128 | ((k >> 6) & 63);
          }
          c[d++] = 128 | (k & 63);
        }
      }
      c[d] = 0;
      return d - g;
    }
    var Ua =
      "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : void 0;
    function Va(a, c) {
      for (var d = c + NaN, e = c; a[e] && !(e >= d); ) ++e;
      if (16 < e - c && a.buffer && Ua) return Ua.decode(a.subarray(c, e));
      for (d = ""; c < e; ) {
        var g = a[c++];
        if (g & 128) {
          var h = a[c++] & 63;
          if (192 == (g & 224)) d += String.fromCharCode(((g & 31) << 6) | h);
          else {
            var k = a[c++] & 63;
            g =
              224 == (g & 240)
                ? ((g & 15) << 12) | (h << 6) | k
                : ((g & 7) << 18) | (h << 12) | (k << 6) | (a[c++] & 63);
            65536 > g
              ? (d += String.fromCharCode(g))
              : ((g -= 65536),
                (d += String.fromCharCode(
                  55296 | (g >> 10),
                  56320 | (g & 1023),
                )));
          }
        } else d += String.fromCharCode(g);
      }
      return d;
    }
    function A(a) {
      return a ? Va(sa, a) : "";
    }
    function Wa(a, c = "i8") {
      c.endsWith("*") && (c = "*");
      switch (c) {
        case "i1":
          return r[a >> 0];
        case "i8":
          return r[a >> 0];
        case "i16":
          return ta[a >> 1];
        case "i32":
          return u[a >> 2];
        case "i64":
          return u[a >> 2];
        case "float":
          return ua[a >> 2];
        case "double":
          return va[a >> 3];
        case "*":
          return x[a >> 2];
        default:
          p("invalid type for getValue: " + c);
      }
    }
    function Xa(a, c, d = "i8") {
      d.endsWith("*") && (d = "*");
      switch (d) {
        case "i1":
          r[a >> 0] = c;
          break;
        case "i8":
          r[a >> 0] = c;
          break;
        case "i16":
          ta[a >> 1] = c;
          break;
        case "i32":
          u[a >> 2] = c;
          break;
        case "i64":
          z = [
            c >>> 0,
            ((y = c),
            1 <= +Math.abs(y)
              ? 0 < y
                ? +Math.floor(y / 4294967296) >>> 0
                : ~~+Math.ceil((y - +(~~y >>> 0)) / 4294967296) >>> 0
              : 0),
          ];
          u[a >> 2] = z[0];
          u[(a + 4) >> 2] = z[1];
          break;
        case "float":
          ua[a >> 2] = c;
          break;
        case "double":
          va[a >> 3] = c;
          break;
        case "*":
          x[a >> 2] = c;
          break;
        default:
          p("invalid type for setValue: " + d);
      }
    }
    function Ya(a) {
      this.Gf = a - 24;
      this.wh = function (c) {
        x[(this.Gf + 4) >> 2] = c;
      };
      this.Gg = function (c) {
        x[(this.Gf + 8) >> 2] = c;
      };
      this.gg = function (c, d) {
        this.Tf();
        this.wh(c);
        this.Gg(d);
      };
      this.Tf = function () {
        x[(this.Gf + 16) >> 2] = 0;
      };
    }
    var Za = 0,
      $a = 0,
      ab = (a, c) => {
        for (var d = 0, e = a.length - 1; 0 <= e; e--) {
          var g = a[e];
          "." === g
            ? a.splice(e, 1)
            : ".." === g
              ? (a.splice(e, 1), d++)
              : d && (a.splice(e, 1), d--);
        }
        if (c) for (; d; d--) a.unshift("..");
        return a;
      },
      bb = (a) => {
        var c = "/" === a.charAt(0),
          d = "/" === a.substr(-1);
        (a = ab(
          a.split("/").filter((e) => !!e),
          !c,
        ).join("/")) ||
          c ||
          (a = ".");
        a && d && (a += "/");
        return (c ? "/" : "") + a;
      },
      cb = (a) => {
        var c = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/
          .exec(a)
          .slice(1);
        a = c[0];
        c = c[1];
        if (!a && !c) return ".";
        c && (c = c.substr(0, c.length - 1));
        return a + c;
      },
      db = (a) => {
        if ("/" === a) return "/";
        a = bb(a);
        a = a.replace(/\/$/, "");
        var c = a.lastIndexOf("/");
        return -1 === c ? a : a.substr(c + 1);
      },
      eb = (a, c) => bb(a + "/" + c);
    function fb() {
      if (
        "object" == typeof crypto &&
        "function" == typeof crypto.getRandomValues
      )
        return (d) => crypto.getRandomValues(d);
      if (ia)
        try {
          var a = require("crypto");
          if (a.randomFillSync) return (d) => a.randomFillSync(d);
          var c = a.randomBytes;
          return (d) => (d.set(c(d.byteLength)), d);
        } catch (d) {}
      p("initRandomDevice");
    }
    function gb(a) {
      return (gb = fb())(a);
    }
    function hb() {
      for (var a = "", c = !1, d = arguments.length - 1; -1 <= d && !c; d--) {
        c = 0 <= d ? arguments[d] : B.cwd();
        if ("string" != typeof c)
          throw new TypeError("Arguments to path.resolve must be strings");
        if (!c) return "";
        a = c + "/" + a;
        c = "/" === c.charAt(0);
      }
      a = ab(
        a.split("/").filter((e) => !!e),
        !c,
      ).join("/");
      return (c ? "/" : "") + a || ".";
    }
    var ib = (a, c) => {
      function d(k) {
        for (var m = 0; m < k.length && "" === k[m]; m++);
        for (var v = k.length - 1; 0 <= v && "" === k[v]; v--);
        return m > v ? [] : k.slice(m, v - m + 1);
      }
      a = hb(a).substr(1);
      c = hb(c).substr(1);
      a = d(a.split("/"));
      c = d(c.split("/"));
      for (var e = Math.min(a.length, c.length), g = e, h = 0; h < e; h++)
        if (a[h] !== c[h]) {
          g = h;
          break;
        }
      e = [];
      for (h = g; h < a.length; h++) e.push("..");
      e = e.concat(c.slice(g));
      return e.join("/");
    };
    function jb(a, c) {
      var d = Array(Sa(a) + 1);
      a = Ta(a, d, 0, d.length);
      c && (d.length = a);
      return d;
    }
    var kb = [];
    function lb(a, c) {
      kb[a] = { input: [], output: [], qg: c };
      B.ah(a, mb);
    }
    var mb = {
        open: function (a) {
          var c = kb[a.node.rdev];
          if (!c) throw new B.Hf(43);
          a.tty = c;
          a.seekable = !1;
        },
        close: function (a) {
          a.tty.qg.fsync(a.tty);
        },
        fsync: function (a) {
          a.tty.qg.fsync(a.tty);
        },
        read: function (a, c, d, e) {
          if (!a.tty || !a.tty.qg.oh) throw new B.Hf(60);
          for (var g = 0, h = 0; h < e; h++) {
            try {
              var k = a.tty.qg.oh(a.tty);
            } catch (m) {
              throw new B.Hf(29);
            }
            if (void 0 === k && 0 === g) throw new B.Hf(6);
            if (null === k || void 0 === k) break;
            g++;
            c[d + h] = k;
          }
          g && (a.node.timestamp = Date.now());
          return g;
        },
        write: function (a, c, d, e) {
          if (!a.tty || !a.tty.qg.Yg) throw new B.Hf(60);
          try {
            for (var g = 0; g < e; g++) a.tty.qg.Yg(a.tty, c[d + g]);
          } catch (h) {
            throw new B.Hf(29);
          }
          e && (a.node.timestamp = Date.now());
          return g;
        },
      },
      nb = {
        oh: function (a) {
          if (!a.input.length) {
            var c = null;
            if (ia) {
              var d = Buffer.alloc(256),
                e = 0;
              try {
                e = fs.readSync(process.stdin.fd, d, 0, 256, -1);
              } catch (g) {
                if (g.toString().includes("EOF")) e = 0;
                else throw g;
              }
              0 < e ? (c = d.slice(0, e).toString("utf-8")) : (c = null);
            } else
              "undefined" != typeof window && "function" == typeof window.prompt
                ? ((c = window.prompt("Input: ")), null !== c && (c += "\n"))
                : "function" == typeof readline &&
                  ((c = readline()), null !== c && (c += "\n"));
            if (!c) return null;
            a.input = jb(c, !0);
          }
          return a.input.shift();
        },
        Yg: function (a, c) {
          null === c || 10 === c
            ? (na(Va(a.output, 0)), (a.output = []))
            : 0 != c && a.output.push(c);
        },
        fsync: function (a) {
          a.output &&
            0 < a.output.length &&
            (na(Va(a.output, 0)), (a.output = []));
        },
      },
      ob = {
        Yg: function (a, c) {
          null === c || 10 === c
            ? (n(Va(a.output, 0)), (a.output = []))
            : 0 != c && a.output.push(c);
        },
        fsync: function (a) {
          a.output &&
            0 < a.output.length &&
            (n(Va(a.output, 0)), (a.output = []));
        },
      },
      C = {
        Zf: null,
        Qf: function () {
          return C.createNode(null, "/", 16895, 0);
        },
        createNode: function (a, c, d, e) {
          if (B.ii(d) || B.isFIFO(d)) throw new B.Hf(63);
          C.Zf ||
            (C.Zf = {
              dir: {
                node: {
                  Wf: C.If.Wf,
                  Sf: C.If.Sf,
                  lookup: C.If.lookup,
                  cg: C.If.cg,
                  rename: C.If.rename,
                  unlink: C.If.unlink,
                  rmdir: C.If.rmdir,
                  readdir: C.If.readdir,
                  symlink: C.If.symlink,
                },
                stream: { Xf: C.Kf.Xf },
              },
              file: {
                node: { Wf: C.If.Wf, Sf: C.If.Sf },
                stream: {
                  Xf: C.Kf.Xf,
                  read: C.Kf.read,
                  write: C.Kf.write,
                  rg: C.Kf.rg,
                  jg: C.Kf.jg,
                  pg: C.Kf.pg,
                },
              },
              link: {
                node: { Wf: C.If.Wf, Sf: C.If.Sf, readlink: C.If.readlink },
                stream: {},
              },
              eh: { node: { Wf: C.If.Wf, Sf: C.If.Sf }, stream: B.Eh },
            });
          d = B.createNode(a, c, d, e);
          B.Rf(d.mode)
            ? ((d.If = C.Zf.dir.node), (d.Kf = C.Zf.dir.stream), (d.Jf = {}))
            : B.isFile(d.mode)
              ? ((d.If = C.Zf.file.node),
                (d.Kf = C.Zf.file.stream),
                (d.Of = 0),
                (d.Jf = null))
              : B.ug(d.mode)
                ? ((d.If = C.Zf.link.node), (d.Kf = C.Zf.link.stream))
                : B.zg(d.mode) &&
                  ((d.If = C.Zf.eh.node), (d.Kf = C.Zf.eh.stream));
          d.timestamp = Date.now();
          a && ((a.Jf[c] = d), (a.timestamp = d.timestamp));
          return d;
        },
        Ci: function (a) {
          return a.Jf
            ? a.Jf.subarray
              ? a.Jf.subarray(0, a.Of)
              : new Uint8Array(a.Jf)
            : new Uint8Array(0);
        },
        lh: function (a, c) {
          var d = a.Jf ? a.Jf.length : 0;
          d >= c ||
            ((c = Math.max(c, (d * (1048576 > d ? 2 : 1.125)) >>> 0)),
            0 != d && (c = Math.max(c, 256)),
            (d = a.Jf),
            (a.Jf = new Uint8Array(c)),
            0 < a.Of && a.Jf.set(d.subarray(0, a.Of), 0));
        },
        si: function (a, c) {
          if (a.Of != c)
            if (0 == c) ((a.Jf = null), (a.Of = 0));
            else {
              var d = a.Jf;
              a.Jf = new Uint8Array(c);
              d && a.Jf.set(d.subarray(0, Math.min(c, a.Of)));
              a.Of = c;
            }
        },
        If: {
          Wf: function (a) {
            var c = {};
            c.dev = B.zg(a.mode) ? a.id : 1;
            c.ino = a.id;
            c.mode = a.mode;
            c.nlink = 1;
            c.uid = 0;
            c.gid = 0;
            c.rdev = a.rdev;
            B.Rf(a.mode)
              ? (c.size = 4096)
              : B.isFile(a.mode)
                ? (c.size = a.Of)
                : B.ug(a.mode)
                  ? (c.size = a.link.length)
                  : (c.size = 0);
            c.atime = new Date(a.timestamp);
            c.mtime = new Date(a.timestamp);
            c.ctime = new Date(a.timestamp);
            c.Ch = 4096;
            c.blocks = Math.ceil(c.size / c.Ch);
            return c;
          },
          Sf: function (a, c) {
            void 0 !== c.mode && (a.mode = c.mode);
            void 0 !== c.timestamp && (a.timestamp = c.timestamp);
            void 0 !== c.size && C.si(a, c.size);
          },
          lookup: function () {
            throw B.Lg[44];
          },
          cg: function (a, c, d, e) {
            return C.createNode(a, c, d, e);
          },
          rename: function (a, c, d) {
            if (B.Rf(a.mode)) {
              try {
                var e = B.bg(c, d);
              } catch (h) {}
              if (e) for (var g in e.Jf) throw new B.Hf(55);
            }
            delete a.parent.Jf[a.name];
            a.parent.timestamp = Date.now();
            a.name = d;
            c.Jf[d] = a;
            c.timestamp = a.parent.timestamp;
            a.parent = c;
          },
          unlink: function (a, c) {
            delete a.Jf[c];
            a.timestamp = Date.now();
          },
          rmdir: function (a, c) {
            var d = B.bg(a, c),
              e;
            for (e in d.Jf) throw new B.Hf(55);
            delete a.Jf[c];
            a.timestamp = Date.now();
          },
          readdir: function (a) {
            var c = [".", ".."],
              d;
            for (d in a.Jf) a.Jf.hasOwnProperty(d) && c.push(d);
            return c;
          },
          symlink: function (a, c, d) {
            a = C.createNode(a, c, 41471, 0);
            a.link = d;
            return a;
          },
          readlink: function (a) {
            if (!B.ug(a.mode)) throw new B.Hf(28);
            return a.link;
          },
        },
        Kf: {
          read: function (a, c, d, e, g) {
            var h = a.node.Jf;
            if (g >= a.node.Of) return 0;
            a = Math.min(a.node.Of - g, e);
            if (8 < a && h.subarray) c.set(h.subarray(g, g + a), d);
            else for (e = 0; e < a; e++) c[d + e] = h[g + e];
            return a;
          },
          write: function (a, c, d, e, g, h) {
            c.buffer === r.buffer && (h = !1);
            if (!e) return 0;
            a = a.node;
            a.timestamp = Date.now();
            if (c.subarray && (!a.Jf || a.Jf.subarray)) {
              if (h) return ((a.Jf = c.subarray(d, d + e)), (a.Of = e));
              if (0 === a.Of && 0 === g)
                return ((a.Jf = c.slice(d, d + e)), (a.Of = e));
              if (g + e <= a.Of) return (a.Jf.set(c.subarray(d, d + e), g), e);
            }
            C.lh(a, g + e);
            if (a.Jf.subarray && c.subarray) a.Jf.set(c.subarray(d, d + e), g);
            else for (h = 0; h < e; h++) a.Jf[g + h] = c[d + h];
            a.Of = Math.max(a.Of, g + e);
            return e;
          },
          Xf: function (a, c, d) {
            1 === d
              ? (c += a.position)
              : 2 === d && B.isFile(a.node.mode) && (c += a.node.Of);
            if (0 > c) throw new B.Hf(28);
            return c;
          },
          rg: function (a, c, d) {
            C.lh(a.node, c + d);
            a.node.Of = Math.max(a.node.Of, c + d);
          },
          jg: function (a, c, d, e, g) {
            if (!B.isFile(a.node.mode)) throw new B.Hf(43);
            a = a.node.Jf;
            if (g & 2 || a.buffer !== r.buffer) {
              if (0 < d || d + c < a.length)
                a.subarray
                  ? (a = a.subarray(d, d + c))
                  : (a = Array.prototype.slice.call(a, d, d + c));
              d = !0;
              p();
              c = void 0;
              if (!c) throw new B.Hf(48);
              r.set(a, c);
            } else ((d = !1), (c = a.byteOffset));
            return { Gf: c, Ah: d };
          },
          pg: function (a, c, d, e) {
            C.Kf.write(a, c, 0, e, d, !1);
            return 0;
          },
        },
      };
    function pb(a, c, d) {
      var e = "al " + a;
      ka(
        a,
        (g) => {
          g || p(`Loading data file "${a}" failed (no arrayBuffer).`);
          c(new Uint8Array(g));
          e && Ha(e);
        },
        () => {
          if (d) d();
          else throw `Loading data file "${a}" failed.`;
        },
      );
      e && Ga(e);
    }
    var qb = b.preloadPlugins || [];
    function rb(a, c, d, e) {
      "undefined" != typeof Browser && Browser.gg();
      var g = !1;
      qb.forEach(function (h) {
        !g && h.canHandle(c) && (h.handle(a, c, d, e), (g = !0));
      });
      return g;
    }
    function sb(a, c) {
      var d = 0;
      a && (d |= 365);
      c && (d |= 146);
      return d;
    }
    var B = {
      root: null,
      wg: [],
      jh: {},
      streams: [],
      mi: 1,
      Yf: null,
      ih: "/",
      Sg: !1,
      sh: !0,
      Hf: null,
      Lg: {},
      Mh: null,
      Dg: 0,
      Nf: (a, c = {}) => {
        a = hb(a);
        if (!a) return { path: "", node: null };
        c = Object.assign({ Jg: !0, $g: 0 }, c);
        if (8 < c.$g) throw new B.Hf(32);
        a = a.split("/").filter((k) => !!k);
        for (var d = B.root, e = "/", g = 0; g < a.length; g++) {
          var h = g === a.length - 1;
          if (h && c.parent) break;
          d = B.bg(d, a[g]);
          e = bb(e + "/" + a[g]);
          B.hg(d) && (!h || (h && c.Jg)) && (d = d.vg.root);
          if (!h || c.Vf)
            for (h = 0; B.ug(d.mode); )
              if (
                ((d = B.readlink(e)),
                (e = hb(cb(e), d)),
                (d = B.Nf(e, { $g: c.$g + 1 }).node),
                40 < h++)
              )
                throw new B.Hf(32);
        }
        return { path: e, node: d };
      },
      dg: (a) => {
        for (var c; ; ) {
          if (B.Ag(a))
            return (
              (a = a.Qf.th),
              c ? ("/" !== a[a.length - 1] ? a + "/" + c : a + c) : a
            );
          c = c ? a.name + "/" + c : a.name;
          a = a.parent;
        }
      },
      Rg: (a, c) => {
        for (var d = 0, e = 0; e < c.length; e++)
          d = ((d << 5) - d + c.charCodeAt(e)) | 0;
        return ((a + d) >>> 0) % B.Yf.length;
      },
      qh: (a) => {
        var c = B.Rg(a.parent.id, a.name);
        a.kg = B.Yf[c];
        B.Yf[c] = a;
      },
      rh: (a) => {
        var c = B.Rg(a.parent.id, a.name);
        if (B.Yf[c] === a) B.Yf[c] = a.kg;
        else
          for (c = B.Yf[c]; c; ) {
            if (c.kg === a) {
              c.kg = a.kg;
              break;
            }
            c = c.kg;
          }
      },
      bg: (a, c) => {
        var d = B.ki(a);
        if (d) throw new B.Hf(d, a);
        for (d = B.Yf[B.Rg(a.id, c)]; d; d = d.kg) {
          var e = d.name;
          if (d.parent.id === a.id && e === c) return d;
        }
        return B.lookup(a, c);
      },
      createNode: (a, c, d, e) => {
        a = new B.vh(a, c, d, e);
        B.qh(a);
        return a;
      },
      Ig: (a) => {
        B.rh(a);
      },
      Ag: (a) => a === a.parent,
      hg: (a) => !!a.vg,
      isFile: (a) => 32768 === (a & 61440),
      Rf: (a) => 16384 === (a & 61440),
      ug: (a) => 40960 === (a & 61440),
      zg: (a) => 8192 === (a & 61440),
      ii: (a) => 24576 === (a & 61440),
      isFIFO: (a) => 4096 === (a & 61440),
      isSocket: (a) => 49152 === (a & 49152),
      mh: (a) => {
        var c = ["r", "w", "rw"][a & 3];
        a & 512 && (c += "w");
        return c;
      },
      lg: (a, c) => {
        if (B.sh) return 0;
        if (!c.includes("r") || a.mode & 292) {
          if (
            (c.includes("w") && !(a.mode & 146)) ||
            (c.includes("x") && !(a.mode & 73))
          )
            return 2;
        } else return 2;
        return 0;
      },
      ki: (a) => {
        var c = B.lg(a, "x");
        return c ? c : a.If.lookup ? 0 : 2;
      },
      Xg: (a, c) => {
        try {
          return (B.bg(a, c), 20);
        } catch (d) {}
        return B.lg(a, "wx");
      },
      Bg: (a, c, d) => {
        try {
          var e = B.bg(a, c);
        } catch (g) {
          return g.Pf;
        }
        if ((a = B.lg(a, "wx"))) return a;
        if (d) {
          if (!B.Rf(e.mode)) return 54;
          if (B.Ag(e) || B.dg(e) === B.cwd()) return 10;
        } else if (B.Rf(e.mode)) return 31;
        return 0;
      },
      li: (a, c) =>
        a
          ? B.ug(a.mode)
            ? 32
            : B.Rf(a.mode) && ("r" !== B.mh(c) || c & 512)
              ? 31
              : B.lg(a, B.mh(c))
          : 44,
      xh: 4096,
      ni: (a = 0, c = B.xh) => {
        for (; a <= c; a++) if (!B.streams[a]) return a;
        throw new B.Hf(33);
      },
      sg: (a) => B.streams[a],
      hh: (a, c, d) => {
        B.xg ||
          ((B.xg = function () {
            this.Tf = {};
          }),
          (B.xg.prototype = {}),
          Object.defineProperties(B.xg.prototype, {
            object: {
              get: function () {
                return this.node;
              },
              set: function (e) {
                this.node = e;
              },
            },
            flags: {
              get: function () {
                return this.Tf.flags;
              },
              set: function (e) {
                this.Tf.flags = e;
              },
            },
            position: {
              get: function () {
                return this.Tf.position;
              },
              set: function (e) {
                this.Tf.position = e;
              },
            },
          }));
        a = Object.assign(new B.xg(), a);
        c = B.ni(c, d);
        a.fd = c;
        return (B.streams[c] = a);
      },
      Fh: (a) => {
        B.streams[a] = null;
      },
      Eh: {
        open: (a) => {
          a.Kf = B.Nh(a.node.rdev).Kf;
          a.Kf.open && a.Kf.open(a);
        },
        Xf: () => {
          throw new B.Hf(70);
        },
      },
      Wg: (a) => a >> 8,
      Di: (a) => a & 255,
      ig: (a, c) => (a << 8) | c,
      ah: (a, c) => {
        B.jh[a] = { Kf: c };
      },
      Nh: (a) => B.jh[a],
      nh: (a) => {
        var c = [];
        for (a = [a]; a.length; ) {
          var d = a.pop();
          c.push(d);
          a.push.apply(a, d.wg);
        }
        return c;
      },
      uh: (a, c) => {
        function d(k) {
          B.Dg--;
          return c(k);
        }
        function e(k) {
          if (k) {
            if (!e.Lh) return ((e.Lh = !0), d(k));
          } else ++h >= g.length && d(null);
        }
        "function" == typeof a && ((c = a), (a = !1));
        B.Dg++;
        1 < B.Dg &&
          n(
            "warning: " +
              B.Dg +
              " FS.syncfs operations in flight at once, probably just doing extra work",
          );
        var g = B.nh(B.root.Qf),
          h = 0;
        g.forEach((k) => {
          if (!k.type.uh) return e(null);
          k.type.uh(k, a, e);
        });
      },
      Qf: (a, c, d) => {
        var e = "/" === d,
          g = !d;
        if (e && B.root) throw new B.Hf(10);
        if (!e && !g) {
          var h = B.Nf(d, { Jg: !1 });
          d = h.path;
          h = h.node;
          if (B.hg(h)) throw new B.Hf(10);
          if (!B.Rf(h.mode)) throw new B.Hf(54);
        }
        c = { type: a, Gi: c, th: d, wg: [] };
        a = a.Qf(c);
        a.Qf = c;
        c.root = a;
        e ? (B.root = a) : h && ((h.vg = c), h.Qf && h.Qf.wg.push(c));
        return a;
      },
      Ji: (a) => {
        a = B.Nf(a, { Jg: !1 });
        if (!B.hg(a.node)) throw new B.Hf(28);
        a = a.node;
        var c = a.vg,
          d = B.nh(c);
        Object.keys(B.Yf).forEach((e) => {
          for (e = B.Yf[e]; e; ) {
            var g = e.kg;
            d.includes(e.Qf) && B.Ig(e);
            e = g;
          }
        });
        a.vg = null;
        a.Qf.wg.splice(a.Qf.wg.indexOf(c), 1);
      },
      lookup: (a, c) => a.If.lookup(a, c),
      cg: (a, c, d) => {
        var e = B.Nf(a, { parent: !0 }).node;
        a = db(a);
        if (!a || "." === a || ".." === a) throw new B.Hf(28);
        var g = B.Xg(e, a);
        if (g) throw new B.Hf(g);
        if (!e.If.cg) throw new B.Hf(63);
        return e.If.cg(e, a, c, d);
      },
      create: (a, c) => B.cg(a, ((void 0 !== c ? c : 438) & 4095) | 32768, 0),
      mkdir: (a, c) => B.cg(a, ((void 0 !== c ? c : 511) & 1023) | 16384, 0),
      Ei: (a, c) => {
        a = a.split("/");
        for (var d = "", e = 0; e < a.length; ++e)
          if (a[e]) {
            d += "/" + a[e];
            try {
              B.mkdir(d, c);
            } catch (g) {
              if (20 != g.Pf) throw g;
            }
          }
      },
      Cg: (a, c, d) => {
        "undefined" == typeof d && ((d = c), (c = 438));
        return B.cg(a, c | 8192, d);
      },
      symlink: (a, c) => {
        if (!hb(a)) throw new B.Hf(44);
        var d = B.Nf(c, { parent: !0 }).node;
        if (!d) throw new B.Hf(44);
        c = db(c);
        var e = B.Xg(d, c);
        if (e) throw new B.Hf(e);
        if (!d.If.symlink) throw new B.Hf(63);
        return d.If.symlink(d, c, a);
      },
      rename: (a, c) => {
        var d = cb(a),
          e = cb(c),
          g = db(a),
          h = db(c);
        var k = B.Nf(a, { parent: !0 });
        var m = k.node;
        k = B.Nf(c, { parent: !0 });
        k = k.node;
        if (!m || !k) throw new B.Hf(44);
        if (m.Qf !== k.Qf) throw new B.Hf(75);
        var v = B.bg(m, g);
        a = ib(a, e);
        if ("." !== a.charAt(0)) throw new B.Hf(28);
        a = ib(c, d);
        if ("." !== a.charAt(0)) throw new B.Hf(55);
        try {
          var q = B.bg(k, h);
        } catch (t) {}
        if (v !== q) {
          c = B.Rf(v.mode);
          if ((g = B.Bg(m, g, c))) throw new B.Hf(g);
          if ((g = q ? B.Bg(k, h, c) : B.Xg(k, h))) throw new B.Hf(g);
          if (!m.If.rename) throw new B.Hf(63);
          if (B.hg(v) || (q && B.hg(q))) throw new B.Hf(10);
          if (k !== m && (g = B.lg(m, "w"))) throw new B.Hf(g);
          B.rh(v);
          try {
            m.If.rename(v, k, h);
          } catch (t) {
            throw t;
          } finally {
            B.qh(v);
          }
        }
      },
      rmdir: (a) => {
        var c = B.Nf(a, { parent: !0 }).node;
        a = db(a);
        var d = B.bg(c, a),
          e = B.Bg(c, a, !0);
        if (e) throw new B.Hf(e);
        if (!c.If.rmdir) throw new B.Hf(63);
        if (B.hg(d)) throw new B.Hf(10);
        c.If.rmdir(c, a);
        B.Ig(d);
      },
      readdir: (a) => {
        a = B.Nf(a, { Vf: !0 }).node;
        if (!a.If.readdir) throw new B.Hf(54);
        return a.If.readdir(a);
      },
      unlink: (a) => {
        var c = B.Nf(a, { parent: !0 }).node;
        if (!c) throw new B.Hf(44);
        a = db(a);
        var d = B.bg(c, a),
          e = B.Bg(c, a, !1);
        if (e) throw new B.Hf(e);
        if (!c.If.unlink) throw new B.Hf(63);
        if (B.hg(d)) throw new B.Hf(10);
        c.If.unlink(c, a);
        B.Ig(d);
      },
      readlink: (a) => {
        a = B.Nf(a).node;
        if (!a) throw new B.Hf(44);
        if (!a.If.readlink) throw new B.Hf(28);
        return hb(B.dg(a.parent), a.If.readlink(a));
      },
      stat: (a, c) => {
        a = B.Nf(a, { Vf: !c }).node;
        if (!a) throw new B.Hf(44);
        if (!a.If.Wf) throw new B.Hf(63);
        return a.If.Wf(a);
      },
      lstat: (a) => B.stat(a, !0),
      chmod: (a, c, d) => {
        a = "string" == typeof a ? B.Nf(a, { Vf: !d }).node : a;
        if (!a.If.Sf) throw new B.Hf(63);
        a.If.Sf(a, {
          mode: (c & 4095) | (a.mode & -4096),
          timestamp: Date.now(),
        });
      },
      lchmod: (a, c) => {
        B.chmod(a, c, !0);
      },
      fchmod: (a, c) => {
        a = B.sg(a);
        if (!a) throw new B.Hf(8);
        B.chmod(a.node, c);
      },
      chown: (a, c, d, e) => {
        a = "string" == typeof a ? B.Nf(a, { Vf: !e }).node : a;
        if (!a.If.Sf) throw new B.Hf(63);
        a.If.Sf(a, { timestamp: Date.now() });
      },
      lchown: (a, c, d) => {
        B.chown(a, c, d, !0);
      },
      fchown: (a, c, d) => {
        a = B.sg(a);
        if (!a) throw new B.Hf(8);
        B.chown(a.node, c, d);
      },
      truncate: (a, c) => {
        if (0 > c) throw new B.Hf(28);
        a = "string" == typeof a ? B.Nf(a, { Vf: !0 }).node : a;
        if (!a.If.Sf) throw new B.Hf(63);
        if (B.Rf(a.mode)) throw new B.Hf(31);
        if (!B.isFile(a.mode)) throw new B.Hf(28);
        var d = B.lg(a, "w");
        if (d) throw new B.Hf(d);
        a.If.Sf(a, { size: c, timestamp: Date.now() });
      },
      Bi: (a, c) => {
        a = B.sg(a);
        if (!a) throw new B.Hf(8);
        if (0 === (a.flags & 2097155)) throw new B.Hf(28);
        B.truncate(a.node, c);
      },
      Ki: (a, c, d) => {
        a = B.Nf(a, { Vf: !0 }).node;
        a.If.Sf(a, { timestamp: Math.max(c, d) });
      },
      open: (a, c, d) => {
        if ("" === a) throw new B.Hf(44);
        if ("string" == typeof c) {
          var e = { r: 0, "r+": 2, w: 577, "w+": 578, a: 1089, "a+": 1090 }[c];
          if ("undefined" == typeof e)
            throw Error("Unknown file open mode: " + c);
          c = e;
        }
        d = c & 64 ? (("undefined" == typeof d ? 438 : d) & 4095) | 32768 : 0;
        if ("object" == typeof a) var g = a;
        else {
          a = bb(a);
          try {
            g = B.Nf(a, { Vf: !(c & 131072) }).node;
          } catch (h) {}
        }
        e = !1;
        if (c & 64)
          if (g) {
            if (c & 128) throw new B.Hf(20);
          } else ((g = B.cg(a, d, 0)), (e = !0));
        if (!g) throw new B.Hf(44);
        B.zg(g.mode) && (c &= -513);
        if (c & 65536 && !B.Rf(g.mode)) throw new B.Hf(54);
        if (!e && (d = B.li(g, c))) throw new B.Hf(d);
        c & 512 && !e && B.truncate(g, 0);
        c &= -131713;
        g = B.hh({
          node: g,
          path: B.dg(g),
          flags: c,
          seekable: !0,
          position: 0,
          Kf: g.Kf,
          zi: [],
          error: !1,
        });
        g.Kf.open && g.Kf.open(g);
        !b.logReadFiles ||
          c & 1 ||
          (B.Zg || (B.Zg = {}), a in B.Zg || (B.Zg[a] = 1));
        return g;
      },
      close: (a) => {
        if (B.tg(a)) throw new B.Hf(8);
        a.Qg && (a.Qg = null);
        try {
          a.Kf.close && a.Kf.close(a);
        } catch (c) {
          throw c;
        } finally {
          B.Fh(a.fd);
        }
        a.fd = null;
      },
      tg: (a) => null === a.fd,
      Xf: (a, c, d) => {
        if (B.tg(a)) throw new B.Hf(8);
        if (!a.seekable || !a.Kf.Xf) throw new B.Hf(70);
        if (0 != d && 1 != d && 2 != d) throw new B.Hf(28);
        a.position = a.Kf.Xf(a, c, d);
        a.zi = [];
        return a.position;
      },
      read: (a, c, d, e, g) => {
        if (0 > e || 0 > g) throw new B.Hf(28);
        if (B.tg(a)) throw new B.Hf(8);
        if (1 === (a.flags & 2097155)) throw new B.Hf(8);
        if (B.Rf(a.node.mode)) throw new B.Hf(31);
        if (!a.Kf.read) throw new B.Hf(28);
        var h = "undefined" != typeof g;
        if (!h) g = a.position;
        else if (!a.seekable) throw new B.Hf(70);
        c = a.Kf.read(a, c, d, e, g);
        h || (a.position += c);
        return c;
      },
      write: (a, c, d, e, g, h) => {
        if (0 > e || 0 > g) throw new B.Hf(28);
        if (B.tg(a)) throw new B.Hf(8);
        if (0 === (a.flags & 2097155)) throw new B.Hf(8);
        if (B.Rf(a.node.mode)) throw new B.Hf(31);
        if (!a.Kf.write) throw new B.Hf(28);
        a.seekable && a.flags & 1024 && B.Xf(a, 0, 2);
        var k = "undefined" != typeof g;
        if (!k) g = a.position;
        else if (!a.seekable) throw new B.Hf(70);
        c = a.Kf.write(a, c, d, e, g, h);
        k || (a.position += c);
        return c;
      },
      rg: (a, c, d) => {
        if (B.tg(a)) throw new B.Hf(8);
        if (0 > c || 0 >= d) throw new B.Hf(28);
        if (0 === (a.flags & 2097155)) throw new B.Hf(8);
        if (!B.isFile(a.node.mode) && !B.Rf(a.node.mode)) throw new B.Hf(43);
        if (!a.Kf.rg) throw new B.Hf(138);
        a.Kf.rg(a, c, d);
      },
      jg: (a, c, d, e, g) => {
        if (0 !== (e & 2) && 0 === (g & 2) && 2 !== (a.flags & 2097155))
          throw new B.Hf(2);
        if (1 === (a.flags & 2097155)) throw new B.Hf(2);
        if (!a.Kf.jg) throw new B.Hf(43);
        return a.Kf.jg(a, c, d, e, g);
      },
      pg: (a, c, d, e, g) => (a.Kf.pg ? a.Kf.pg(a, c, d, e, g) : 0),
      Fi: () => 0,
      Tg: (a, c, d) => {
        if (!a.Kf.Tg) throw new B.Hf(59);
        return a.Kf.Tg(a, c, d);
      },
      readFile: (a, c = {}) => {
        c.flags = c.flags || 0;
        c.encoding = c.encoding || "binary";
        if ("utf8" !== c.encoding && "binary" !== c.encoding)
          throw Error('Invalid encoding type "' + c.encoding + '"');
        var d,
          e = B.open(a, c.flags);
        a = B.stat(a).size;
        var g = new Uint8Array(a);
        B.read(e, g, 0, a, 0);
        "utf8" === c.encoding
          ? (d = Va(g, 0))
          : "binary" === c.encoding && (d = g);
        B.close(e);
        return d;
      },
      writeFile: (a, c, d = {}) => {
        d.flags = d.flags || 577;
        a = B.open(a, d.flags, d.mode);
        if ("string" == typeof c) {
          var e = new Uint8Array(Sa(c) + 1);
          c = Ta(c, e, 0, e.length);
          B.write(a, e, 0, c, void 0, d.Dh);
        } else if (ArrayBuffer.isView(c))
          B.write(a, c, 0, c.byteLength, void 0, d.Dh);
        else throw Error("Unsupported data type");
        B.close(a);
      },
      cwd: () => B.ih,
      chdir: (a) => {
        a = B.Nf(a, { Vf: !0 });
        if (null === a.node) throw new B.Hf(44);
        if (!B.Rf(a.node.mode)) throw new B.Hf(54);
        var c = B.lg(a.node, "x");
        if (c) throw new B.Hf(c);
        B.ih = a.path;
      },
      Hh: () => {
        B.mkdir("/tmp");
        B.mkdir("/home");
        B.mkdir("/home/web_user");
      },
      Gh: () => {
        B.mkdir("/dev");
        B.ah(B.ig(1, 3), { read: () => 0, write: (e, g, h, k) => k });
        B.Cg("/dev/null", B.ig(1, 3));
        lb(B.ig(5, 0), nb);
        lb(B.ig(6, 0), ob);
        B.Cg("/dev/tty", B.ig(5, 0));
        B.Cg("/dev/tty1", B.ig(6, 0));
        var a = new Uint8Array(1024),
          c = 0,
          d = () => {
            0 === c && (c = gb(a).byteLength);
            return a[--c];
          };
        B.Uf("/dev", "random", d);
        B.Uf("/dev", "urandom", d);
        B.mkdir("/dev/shm");
        B.mkdir("/dev/shm/tmp");
      },
      Jh: () => {
        B.mkdir("/proc");
        var a = B.mkdir("/proc/self");
        B.mkdir("/proc/self/fd");
        B.Qf(
          {
            Qf: () => {
              var c = B.createNode(a, "fd", 16895, 73);
              c.If = {
                lookup: (d, e) => {
                  var g = B.sg(+e);
                  if (!g) throw new B.Hf(8);
                  d = {
                    parent: null,
                    Qf: { th: "fake" },
                    If: { readlink: () => g.path },
                  };
                  return (d.parent = d);
                },
              };
              return c;
            },
          },
          {},
          "/proc/self/fd",
        );
      },
      Kh: () => {
        b.stdin
          ? B.Uf("/dev", "stdin", b.stdin)
          : B.symlink("/dev/tty", "/dev/stdin");
        b.stdout
          ? B.Uf("/dev", "stdout", null, b.stdout)
          : B.symlink("/dev/tty", "/dev/stdout");
        b.stderr
          ? B.Uf("/dev", "stderr", null, b.stderr)
          : B.symlink("/dev/tty1", "/dev/stderr");
        B.open("/dev/stdin", 0);
        B.open("/dev/stdout", 1);
        B.open("/dev/stderr", 1);
      },
      kh: () => {
        B.Hf ||
          ((B.Hf = function (a, c) {
            this.name = "ErrnoError";
            this.node = c;
            this.ti = function (d) {
              this.Pf = d;
            };
            this.ti(a);
            this.message = "FS error";
          }),
          (B.Hf.prototype = Error()),
          (B.Hf.prototype.constructor = B.Hf),
          [44].forEach((a) => {
            B.Lg[a] = new B.Hf(a);
            B.Lg[a].stack = "<generic error, no stack>";
          }));
      },
      ui: () => {
        B.kh();
        B.Yf = Array(4096);
        B.Qf(C, {}, "/");
        B.Hh();
        B.Gh();
        B.Jh();
        B.Mh = { MEMFS: C };
      },
      gg: (a, c, d) => {
        B.gg.Sg = !0;
        B.kh();
        b.stdin = a || b.stdin;
        b.stdout = c || b.stdout;
        b.stderr = d || b.stderr;
        B.Kh();
      },
      Hi: () => {
        B.gg.Sg = !1;
        for (var a = 0; a < B.streams.length; a++) {
          var c = B.streams[a];
          c && B.close(c);
        }
      },
      Ai: (a, c) => {
        a = B.Bh(a, c);
        return a.exists ? a.object : null;
      },
      Bh: (a, c) => {
        try {
          var d = B.Nf(a, { Vf: !c });
          a = d.path;
        } catch (g) {}
        var e = {
          Ag: !1,
          exists: !1,
          error: 0,
          name: null,
          path: null,
          object: null,
          oi: !1,
          ri: null,
          pi: null,
        };
        try {
          ((d = B.Nf(a, { parent: !0 })),
            (e.oi = !0),
            (e.ri = d.path),
            (e.pi = d.node),
            (e.name = db(a)),
            (d = B.Nf(a, { Vf: !c })),
            (e.exists = !0),
            (e.path = d.path),
            (e.object = d.node),
            (e.name = d.node.name),
            (e.Ag = "/" === d.path));
        } catch (g) {
          e.error = g.Pf;
        }
        return e;
      },
      Hg: (a, c) => {
        a = "string" == typeof a ? a : B.dg(a);
        for (c = c.split("/").reverse(); c.length; ) {
          var d = c.pop();
          if (d) {
            var e = bb(a + "/" + d);
            try {
              B.mkdir(e);
            } catch (g) {}
            a = e;
          }
        }
        return e;
      },
      Ih: (a, c, d, e, g) => {
        a = "string" == typeof a ? a : B.dg(a);
        c = bb(a + "/" + c);
        return B.create(c, sb(e, g));
      },
      yg: (a, c, d, e, g, h) => {
        var k = c;
        a &&
          ((a = "string" == typeof a ? a : B.dg(a)),
          (k = c ? bb(a + "/" + c) : a));
        a = sb(e, g);
        k = B.create(k, a);
        if (d) {
          if ("string" == typeof d) {
            c = Array(d.length);
            e = 0;
            for (g = d.length; e < g; ++e) c[e] = d.charCodeAt(e);
            d = c;
          }
          B.chmod(k, a | 146);
          c = B.open(k, 577);
          B.write(c, d, 0, d.length, 0, h);
          B.close(c);
          B.chmod(k, a);
        }
        return k;
      },
      Uf: (a, c, d, e) => {
        a = eb("string" == typeof a ? a : B.dg(a), c);
        c = sb(!!d, !!e);
        B.Uf.Wg || (B.Uf.Wg = 64);
        var g = B.ig(B.Uf.Wg++, 0);
        B.ah(g, {
          open: (h) => {
            h.seekable = !1;
          },
          close: () => {
            e && e.buffer && e.buffer.length && e(10);
          },
          read: (h, k, m, v) => {
            for (var q = 0, t = 0; t < v; t++) {
              try {
                var F = d();
              } catch (U) {
                throw new B.Hf(29);
              }
              if (void 0 === F && 0 === q) throw new B.Hf(6);
              if (null === F || void 0 === F) break;
              q++;
              k[m + t] = F;
            }
            q && (h.node.timestamp = Date.now());
            return q;
          },
          write: (h, k, m, v) => {
            for (var q = 0; q < v; q++)
              try {
                e(k[m + q]);
              } catch (t) {
                throw new B.Hf(29);
              }
            v && (h.node.timestamp = Date.now());
            return q;
          },
        });
        return B.Cg(a, c, g);
      },
      Kg: (a) => {
        if (a.Ug || a.ji || a.link || a.Jf) return !0;
        if ("undefined" != typeof XMLHttpRequest)
          throw Error(
            "Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.",
          );
        if (ja)
          try {
            ((a.Jf = jb(ja(a.url), !0)), (a.Of = a.Jf.length));
          } catch (c) {
            throw new B.Hf(29);
          }
        else throw Error("Cannot load without read() or XMLHttpRequest.");
      },
      fh: (a, c, d, e, g) => {
        function h() {
          this.Vg = !1;
          this.Tf = [];
        }
        h.prototype.get = function (q) {
          if (!(q > this.length - 1 || 0 > q)) {
            var t = q % this.chunkSize;
            return this.ph((q / this.chunkSize) | 0)[t];
          }
        };
        h.prototype.Gg = function (q) {
          this.ph = q;
        };
        h.prototype.dh = function () {
          var q = new XMLHttpRequest();
          q.open("HEAD", d, !1);
          q.send(null);
          if (!((200 <= q.status && 300 > q.status) || 304 === q.status))
            throw Error("Couldn't load " + d + ". Status: " + q.status);
          var t = Number(q.getResponseHeader("Content-length")),
            F,
            U = (F = q.getResponseHeader("Accept-Ranges")) && "bytes" === F;
          q = (F = q.getResponseHeader("Content-Encoding")) && "gzip" === F;
          var l = 1048576;
          U || (l = t);
          var w = this;
          w.Gg((E) => {
            var W = E * l,
              qa = (E + 1) * l - 1;
            qa = Math.min(qa, t - 1);
            if ("undefined" == typeof w.Tf[E]) {
              var Th = w.Tf;
              if (W > qa)
                throw Error(
                  "invalid range (" +
                    W +
                    ", " +
                    qa +
                    ") or no bytes requested!",
                );
              if (qa > t - 1)
                throw Error(
                  "only " + t + " bytes available! programmer error!",
                );
              var X = new XMLHttpRequest();
              X.open("GET", d, !1);
              t !== l && X.setRequestHeader("Range", "bytes=" + W + "-" + qa);
              X.responseType = "arraybuffer";
              X.overrideMimeType &&
                X.overrideMimeType("text/plain; charset=x-user-defined");
              X.send(null);
              if (!((200 <= X.status && 300 > X.status) || 304 === X.status))
                throw Error("Couldn't load " + d + ". Status: " + X.status);
              W =
                void 0 !== X.response
                  ? new Uint8Array(X.response || [])
                  : jb(X.responseText || "", !0);
              Th[E] = W;
            }
            if ("undefined" == typeof w.Tf[E]) throw Error("doXHR failed!");
            return w.Tf[E];
          });
          if (q || !t)
            ((l = t = 1),
              (l = t = this.ph(0).length),
              na(
                "LazyFiles on gzip forces download of the whole file when length is accessed",
              ));
          this.zh = t;
          this.yh = l;
          this.Vg = !0;
        };
        if ("undefined" != typeof XMLHttpRequest) {
          if (!ha)
            throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
          var k = new h();
          Object.defineProperties(k, {
            length: {
              get: function () {
                this.Vg || this.dh();
                return this.zh;
              },
            },
            chunkSize: {
              get: function () {
                this.Vg || this.dh();
                return this.yh;
              },
            },
          });
          k = { Ug: !1, Jf: k };
        } else k = { Ug: !1, url: d };
        var m = B.Ih(a, c, k, e, g);
        k.Jf ? (m.Jf = k.Jf) : k.url && ((m.Jf = null), (m.url = k.url));
        Object.defineProperties(m, {
          Of: {
            get: function () {
              return this.Jf.length;
            },
          },
        });
        var v = {};
        Object.keys(m.Kf).forEach((q) => {
          var t = m.Kf[q];
          v[q] = function () {
            B.Kg(m);
            return t.apply(null, arguments);
          };
        });
        v.read = (q, t, F, U, l) => {
          B.Kg(m);
          q = q.node.Jf;
          if (l >= q.length) t = 0;
          else {
            U = Math.min(q.length - l, U);
            if (q.slice) for (var w = 0; w < U; w++) t[F + w] = q[l + w];
            else for (w = 0; w < U; w++) t[F + w] = q.get(l + w);
            t = U;
          }
          return t;
        };
        v.jg = () => {
          B.Kg(m);
          p();
          throw new B.Hf(48);
        };
        m.Kf = v;
        return m;
      },
    };
    function tb(a, c, d) {
      if ("/" === c.charAt(0)) return c;
      a = -100 === a ? B.cwd() : ub(a).path;
      if (0 == c.length) {
        if (!d) throw new B.Hf(44);
        return a;
      }
      return bb(a + "/" + c);
    }
    function vb(a, c, d) {
      try {
        var e = a(c);
      } catch (h) {
        if (h && h.node && bb(c) !== bb(B.dg(h.node))) return -54;
        throw h;
      }
      u[d >> 2] = e.dev;
      u[(d + 8) >> 2] = e.ino;
      u[(d + 12) >> 2] = e.mode;
      x[(d + 16) >> 2] = e.nlink;
      u[(d + 20) >> 2] = e.uid;
      u[(d + 24) >> 2] = e.gid;
      u[(d + 28) >> 2] = e.rdev;
      z = [
        e.size >>> 0,
        ((y = e.size),
        1 <= +Math.abs(y)
          ? 0 < y
            ? +Math.floor(y / 4294967296) >>> 0
            : ~~+Math.ceil((y - +(~~y >>> 0)) / 4294967296) >>> 0
          : 0),
      ];
      u[(d + 40) >> 2] = z[0];
      u[(d + 44) >> 2] = z[1];
      u[(d + 48) >> 2] = 4096;
      u[(d + 52) >> 2] = e.blocks;
      a = e.atime.getTime();
      c = e.mtime.getTime();
      var g = e.ctime.getTime();
      z = [
        Math.floor(a / 1e3) >>> 0,
        ((y = Math.floor(a / 1e3)),
        1 <= +Math.abs(y)
          ? 0 < y
            ? +Math.floor(y / 4294967296) >>> 0
            : ~~+Math.ceil((y - +(~~y >>> 0)) / 4294967296) >>> 0
          : 0),
      ];
      u[(d + 56) >> 2] = z[0];
      u[(d + 60) >> 2] = z[1];
      x[(d + 64) >> 2] = (a % 1e3) * 1e3;
      z = [
        Math.floor(c / 1e3) >>> 0,
        ((y = Math.floor(c / 1e3)),
        1 <= +Math.abs(y)
          ? 0 < y
            ? +Math.floor(y / 4294967296) >>> 0
            : ~~+Math.ceil((y - +(~~y >>> 0)) / 4294967296) >>> 0
          : 0),
      ];
      u[(d + 72) >> 2] = z[0];
      u[(d + 76) >> 2] = z[1];
      x[(d + 80) >> 2] = (c % 1e3) * 1e3;
      z = [
        Math.floor(g / 1e3) >>> 0,
        ((y = Math.floor(g / 1e3)),
        1 <= +Math.abs(y)
          ? 0 < y
            ? +Math.floor(y / 4294967296) >>> 0
            : ~~+Math.ceil((y - +(~~y >>> 0)) / 4294967296) >>> 0
          : 0),
      ];
      u[(d + 88) >> 2] = z[0];
      u[(d + 92) >> 2] = z[1];
      x[(d + 96) >> 2] = (g % 1e3) * 1e3;
      z = [
        e.ino >>> 0,
        ((y = e.ino),
        1 <= +Math.abs(y)
          ? 0 < y
            ? +Math.floor(y / 4294967296) >>> 0
            : ~~+Math.ceil((y - +(~~y >>> 0)) / 4294967296) >>> 0
          : 0),
      ];
      u[(d + 104) >> 2] = z[0];
      u[(d + 108) >> 2] = z[1];
      return 0;
    }
    var wb = void 0;
    function xb() {
      wb += 4;
      return u[(wb - 4) >> 2];
    }
    function ub(a) {
      a = B.sg(a);
      if (!a) throw new B.Hf(8);
      return a;
    }
    function yb() {
      n("missing function: setThrew");
      p(-1);
    }
    function zb(a) {
      return 0 === a % 4 && (0 !== a % 100 || 0 === a % 400);
    }
    var Ab = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335],
      Bb = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    function Cb(a) {
      return (zb(a.getFullYear()) ? Ab : Bb)[a.getMonth()] + a.getDate() - 1;
    }
    function Db(a) {
      var c = Sa(a) + 1,
        d = Eb(c);
      d && Ta(a, sa, d, c);
      return d;
    }
    var Fb = [],
      Gb;
    Gb = ia
      ? () => {
          var a = process.hrtime();
          return 1e3 * a[0] + a[1] / 1e6;
        }
      : () => performance.now();
    var Hb = {};
    function Ib() {
      if (!Jb) {
        var a = {
            USER: "web_user",
            LOGNAME: "web_user",
            PATH: "/",
            PWD: "/",
            HOME: "/home/web_user",
            LANG:
              (
                ("object" == typeof navigator &&
                  navigator.languages &&
                  navigator.languages[0]) ||
                "C"
              ).replace("-", "_") + ".UTF-8",
            _: da || "./this.program",
          },
          c;
        for (c in Hb) void 0 === Hb[c] ? delete a[c] : (a[c] = Hb[c]);
        var d = [];
        for (c in a) d.push(c + "=" + a[c]);
        Jb = d;
      }
      return Jb;
    }
    var Jb,
      Kb = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      Lb = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    function Mb(a, c, d, e) {
      function g(l, w, E) {
        for (l = "number" == typeof l ? l.toString() : l || ""; l.length < w; )
          l = E[0] + l;
        return l;
      }
      function h(l, w) {
        return g(l, w, "0");
      }
      function k(l, w) {
        function E(qa) {
          return 0 > qa ? -1 : 0 < qa ? 1 : 0;
        }
        var W;
        0 === (W = E(l.getFullYear() - w.getFullYear())) &&
          0 === (W = E(l.getMonth() - w.getMonth())) &&
          (W = E(l.getDate() - w.getDate()));
        return W;
      }
      function m(l) {
        switch (l.getDay()) {
          case 0:
            return new Date(l.getFullYear() - 1, 11, 29);
          case 1:
            return l;
          case 2:
            return new Date(l.getFullYear(), 0, 3);
          case 3:
            return new Date(l.getFullYear(), 0, 2);
          case 4:
            return new Date(l.getFullYear(), 0, 1);
          case 5:
            return new Date(l.getFullYear() - 1, 11, 31);
          case 6:
            return new Date(l.getFullYear() - 1, 11, 30);
        }
      }
      function v(l) {
        var w = l.ng;
        for (l = new Date(new Date(l.og + 1900, 0, 1).getTime()); 0 < w; ) {
          var E = l.getMonth(),
            W = (zb(l.getFullYear()) ? Kb : Lb)[E];
          if (w > W - l.getDate())
            ((w -= W - l.getDate() + 1),
              l.setDate(1),
              11 > E
                ? l.setMonth(E + 1)
                : (l.setMonth(0), l.setFullYear(l.getFullYear() + 1)));
          else {
            l.setDate(l.getDate() + w);
            break;
          }
        }
        E = new Date(l.getFullYear() + 1, 0, 4);
        w = m(new Date(l.getFullYear(), 0, 4));
        E = m(E);
        return 0 >= k(w, l)
          ? 0 >= k(E, l)
            ? l.getFullYear() + 1
            : l.getFullYear()
          : l.getFullYear() - 1;
      }
      var q = u[(e + 40) >> 2];
      e = {
        xi: u[e >> 2],
        wi: u[(e + 4) >> 2],
        Eg: u[(e + 8) >> 2],
        bh: u[(e + 12) >> 2],
        Fg: u[(e + 16) >> 2],
        og: u[(e + 20) >> 2],
        $f: u[(e + 24) >> 2],
        ng: u[(e + 28) >> 2],
        Ii: u[(e + 32) >> 2],
        vi: u[(e + 36) >> 2],
        yi: q ? A(q) : "",
      };
      d = A(d);
      q = {
        "%c": "%a %b %d %H:%M:%S %Y",
        "%D": "%m/%d/%y",
        "%F": "%Y-%m-%d",
        "%h": "%b",
        "%r": "%I:%M:%S %p",
        "%R": "%H:%M",
        "%T": "%H:%M:%S",
        "%x": "%m/%d/%y",
        "%X": "%H:%M:%S",
        "%Ec": "%c",
        "%EC": "%C",
        "%Ex": "%m/%d/%y",
        "%EX": "%H:%M:%S",
        "%Ey": "%y",
        "%EY": "%Y",
        "%Od": "%d",
        "%Oe": "%e",
        "%OH": "%H",
        "%OI": "%I",
        "%Om": "%m",
        "%OM": "%M",
        "%OS": "%S",
        "%Ou": "%u",
        "%OU": "%U",
        "%OV": "%V",
        "%Ow": "%w",
        "%OW": "%W",
        "%Oy": "%y",
      };
      for (var t in q) d = d.replace(new RegExp(t, "g"), q[t]);
      var F = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(
          " ",
        ),
        U =
          "January February March April May June July August September October November December".split(
            " ",
          );
      q = {
        "%a": function (l) {
          return F[l.$f].substring(0, 3);
        },
        "%A": function (l) {
          return F[l.$f];
        },
        "%b": function (l) {
          return U[l.Fg].substring(0, 3);
        },
        "%B": function (l) {
          return U[l.Fg];
        },
        "%C": function (l) {
          return h(((l.og + 1900) / 100) | 0, 2);
        },
        "%d": function (l) {
          return h(l.bh, 2);
        },
        "%e": function (l) {
          return g(l.bh, 2, " ");
        },
        "%g": function (l) {
          return v(l).toString().substring(2);
        },
        "%G": function (l) {
          return v(l);
        },
        "%H": function (l) {
          return h(l.Eg, 2);
        },
        "%I": function (l) {
          l = l.Eg;
          0 == l ? (l = 12) : 12 < l && (l -= 12);
          return h(l, 2);
        },
        "%j": function (l) {
          for (
            var w = 0, E = 0;
            E <= l.Fg - 1;
            w += (zb(l.og + 1900) ? Kb : Lb)[E++]
          );
          return h(l.bh + w, 3);
        },
        "%m": function (l) {
          return h(l.Fg + 1, 2);
        },
        "%M": function (l) {
          return h(l.wi, 2);
        },
        "%n": function () {
          return "\n";
        },
        "%p": function (l) {
          return 0 <= l.Eg && 12 > l.Eg ? "AM" : "PM";
        },
        "%S": function (l) {
          return h(l.xi, 2);
        },
        "%t": function () {
          return "\t";
        },
        "%u": function (l) {
          return l.$f || 7;
        },
        "%U": function (l) {
          return h(Math.floor((l.ng + 7 - l.$f) / 7), 2);
        },
        "%V": function (l) {
          var w = Math.floor((l.ng + 7 - ((l.$f + 6) % 7)) / 7);
          2 >= (l.$f + 371 - l.ng - 2) % 7 && w++;
          if (w)
            53 == w &&
              ((E = (l.$f + 371 - l.ng) % 7),
              4 == E || (3 == E && zb(l.og)) || (w = 1));
          else {
            w = 52;
            var E = (l.$f + 7 - l.ng - 1) % 7;
            (4 == E || (5 == E && zb((l.og % 400) - 1))) && w++;
          }
          return h(w, 2);
        },
        "%w": function (l) {
          return l.$f;
        },
        "%W": function (l) {
          return h(Math.floor((l.ng + 7 - ((l.$f + 6) % 7)) / 7), 2);
        },
        "%y": function (l) {
          return (l.og + 1900).toString().substring(2);
        },
        "%Y": function (l) {
          return l.og + 1900;
        },
        "%z": function (l) {
          l = l.vi;
          var w = 0 <= l;
          l = Math.abs(l) / 60;
          return (
            (w ? "+" : "-") +
            String("0000" + ((l / 60) * 100 + (l % 60))).slice(-4)
          );
        },
        "%Z": function (l) {
          return l.yi;
        },
        "%%": function () {
          return "%";
        },
      };
      d = d.replace(/%%/g, "\x00\x00");
      for (t in q)
        d.includes(t) && (d = d.replace(new RegExp(t, "g"), q[t](e)));
      d = d.replace(/\0\0/g, "%");
      t = jb(d, !1);
      if (t.length > c) return 0;
      r.set(t, a);
      return t.length - 1;
    }
    var Nb = [];
    function Ob(a) {
      var c = Nb[a];
      c || (a >= Nb.length && (Nb.length = a + 1), (Nb[a] = c = xa.get(a)));
      return c;
    }
    function Pb(a, c, d, e) {
      a || (a = this);
      this.parent = a;
      this.Qf = a.Qf;
      this.vg = null;
      this.id = B.mi++;
      this.name = c;
      this.mode = d;
      this.If = {};
      this.Kf = {};
      this.rdev = e;
    }
    Object.defineProperties(Pb.prototype, {
      read: {
        get: function () {
          return 365 === (this.mode & 365);
        },
        set: function (a) {
          a ? (this.mode |= 365) : (this.mode &= -366);
        },
      },
      write: {
        get: function () {
          return 146 === (this.mode & 146);
        },
        set: function (a) {
          a ? (this.mode |= 146) : (this.mode &= -147);
        },
      },
      ji: {
        get: function () {
          return B.Rf(this.mode);
        },
      },
      Ug: {
        get: function () {
          return B.zg(this.mode);
        },
      },
    });
    B.vh = Pb;
    B.gh = function (a, c, d, e, g, h, k, m, v, q) {
      function t(l) {
        function w(E) {
          q && q();
          m || B.yg(a, c, E, e, g, v);
          h && h();
          Ha(U);
        }
        rb(l, F, w, () => {
          k && k();
          Ha(U);
        }) || w(l);
      }
      var F = c ? hb(bb(a + "/" + c)) : a,
        U = "cp " + F;
      Ga(U);
      "string" == typeof d ? pb(d, (l) => t(l), k) : t(d);
    };
    B.ui();
    b.FS_createPath = B.Hg;
    b.FS_createDataFile = B.yg;
    b.FS_createPreloadedFile = B.gh;
    b.FS_unlink = B.unlink;
    b.FS_createLazyFile = B.fh;
    b.FS_createDevice = B.Uf;
    var bc = {
      U: function () {
        n("missing function: _ZN9tesseract11TessBaseAPI10GetOsdTextEi");
        p(-1);
      },
      X: function () {
        n(
          "missing function: _ZN9tesseract11TessBaseAPI23ClearAdaptiveClassifierEv",
        );
        p(-1);
      },
      P: function () {
        n(
          "missing function: _ZN9tesseract11TessBaseAPI8DetectOSEPNS_9OSResultsE",
        );
        p(-1);
      },
      F: function () {
        n("missing function: _ZNK9tesseract9OSResults12print_scoresEv");
        p(-1);
      },
      a: function (a, c, d, e) {
        p(
          `Assertion failed: ${A(a)}, at: ` +
            [c ? A(c) : "unknown filename", d, e ? A(e) : "unknown function"],
        );
      },
      l: function (a, c, d) {
        new Ya(a).gg(c, d);
        Za = a;
        $a++;
        throw Za;
      },
      r: function (a, c, d) {
        wb = d;
        try {
          var e = ub(a);
          switch (c) {
            case 0:
              var g = xb();
              return 0 > g ? -28 : B.hh(e, g).fd;
            case 1:
            case 2:
              return 0;
            case 3:
              return e.flags;
            case 4:
              return ((g = xb()), (e.flags |= g), 0);
            case 5:
              return ((g = xb()), (ta[(g + 0) >> 1] = 2), 0);
            case 6:
            case 7:
              return 0;
            case 16:
            case 8:
              return -28;
            case 9:
              return ((u[Qb() >> 2] = 28), -1);
            default:
              return -28;
          }
        } catch (h) {
          if ("undefined" == typeof B || "ErrnoError" !== h.name) throw h;
          return -h.Pf;
        }
      },
      N: function (a, c) {
        try {
          var d = ub(a);
          return vb(B.stat, d.path, c);
        } catch (e) {
          if ("undefined" == typeof B || "ErrnoError" !== e.name) throw e;
          return -e.Pf;
        }
      },
      K: function (a, c) {
        try {
          if (0 === c) return -28;
          var d = B.cwd(),
            e = Sa(d) + 1;
          if (c < e) return -68;
          Ta(d, sa, a, c);
          return e;
        } catch (g) {
          if ("undefined" == typeof B || "ErrnoError" !== g.name) throw g;
          return -g.Pf;
        }
      },
      S: function (a, c, d) {
        wb = d;
        try {
          var e = ub(a);
          switch (c) {
            case 21509:
            case 21505:
              return e.tty ? 0 : -59;
            case 21510:
            case 21511:
            case 21512:
            case 21506:
            case 21507:
            case 21508:
              return e.tty ? 0 : -59;
            case 21519:
              if (!e.tty) return -59;
              var g = xb();
              return (u[g >> 2] = 0);
            case 21520:
              return e.tty ? -28 : -59;
            case 21531:
              return ((g = xb()), B.Tg(e, c, g));
            case 21523:
              return e.tty ? 0 : -59;
            case 21524:
              return e.tty ? 0 : -59;
            default:
              return -28;
          }
        } catch (h) {
          if ("undefined" == typeof B || "ErrnoError" !== h.name) throw h;
          return -h.Pf;
        }
      },
      L: function (a, c, d, e) {
        try {
          c = A(c);
          var g = e & 256;
          c = tb(a, c, e & 4096);
          return vb(g ? B.lstat : B.stat, c, d);
        } catch (h) {
          if ("undefined" == typeof B || "ErrnoError" !== h.name) throw h;
          return -h.Pf;
        }
      },
      p: function (a, c, d, e) {
        wb = e;
        try {
          c = A(c);
          c = tb(a, c);
          var g = e ? xb() : 0;
          return B.open(c, d, g).fd;
        } catch (h) {
          if ("undefined" == typeof B || "ErrnoError" !== h.name) throw h;
          return -h.Pf;
        }
      },
      A: function (a) {
        try {
          return ((a = A(a)), B.rmdir(a), 0);
        } catch (c) {
          if ("undefined" == typeof B || "ErrnoError" !== c.name) throw c;
          return -c.Pf;
        }
      },
      M: function (a, c) {
        try {
          return ((a = A(a)), vb(B.stat, a, c));
        } catch (d) {
          if ("undefined" == typeof B || "ErrnoError" !== d.name) throw d;
          return -d.Pf;
        }
      },
      B: function (a, c, d) {
        try {
          return (
            (c = A(c)),
            (c = tb(a, c)),
            0 === d
              ? B.unlink(c)
              : 512 === d
                ? B.rmdir(c)
                : p("Invalid flags passed to unlinkat"),
            0
          );
        } catch (e) {
          if ("undefined" == typeof B || "ErrnoError" !== e.name) throw e;
          return -e.Pf;
        }
      },
      T: function (a) {
        do {
          var c = x[a >> 2];
          a += 4;
          var d = x[a >> 2];
          a += 4;
          var e = x[a >> 2];
          a += 4;
          c = A(c);
          B.Hg("/", cb(c), !0, !0);
          B.yg(c, null, r.subarray(e, e + d), !0, !0, !0);
        } while (x[a >> 2]);
      },
      Q: function () {
        return !0;
      },
      x: function () {
        throw Infinity;
      },
      E: function (a, c) {
        a = new Date(1e3 * (x[a >> 2] + 4294967296 * u[(a + 4) >> 2]));
        u[c >> 2] = a.getUTCSeconds();
        u[(c + 4) >> 2] = a.getUTCMinutes();
        u[(c + 8) >> 2] = a.getUTCHours();
        u[(c + 12) >> 2] = a.getUTCDate();
        u[(c + 16) >> 2] = a.getUTCMonth();
        u[(c + 20) >> 2] = a.getUTCFullYear() - 1900;
        u[(c + 24) >> 2] = a.getUTCDay();
        u[(c + 28) >> 2] =
          ((a.getTime() - Date.UTC(a.getUTCFullYear(), 0, 1, 0, 0, 0, 0)) /
            864e5) |
          0;
      },
      G: function (a, c) {
        a = new Date(1e3 * (x[a >> 2] + 4294967296 * u[(a + 4) >> 2]));
        u[c >> 2] = a.getSeconds();
        u[(c + 4) >> 2] = a.getMinutes();
        u[(c + 8) >> 2] = a.getHours();
        u[(c + 12) >> 2] = a.getDate();
        u[(c + 16) >> 2] = a.getMonth();
        u[(c + 20) >> 2] = a.getFullYear() - 1900;
        u[(c + 24) >> 2] = a.getDay();
        u[(c + 28) >> 2] = Cb(a) | 0;
        u[(c + 36) >> 2] = -(60 * a.getTimezoneOffset());
        var d = new Date(a.getFullYear(), 6, 1).getTimezoneOffset(),
          e = new Date(a.getFullYear(), 0, 1).getTimezoneOffset();
        u[(c + 32) >> 2] =
          (d != e && a.getTimezoneOffset() == Math.min(e, d)) | 0;
      },
      H: function (a) {
        var c = new Date(
            u[(a + 20) >> 2] + 1900,
            u[(a + 16) >> 2],
            u[(a + 12) >> 2],
            u[(a + 8) >> 2],
            u[(a + 4) >> 2],
            u[a >> 2],
            0,
          ),
          d = u[(a + 32) >> 2],
          e = c.getTimezoneOffset(),
          g = new Date(c.getFullYear(), 6, 1).getTimezoneOffset(),
          h = new Date(c.getFullYear(), 0, 1).getTimezoneOffset(),
          k = Math.min(h, g);
        0 > d
          ? (u[(a + 32) >> 2] = Number(g != h && k == e))
          : 0 < d != (k == e) &&
            ((g = Math.max(h, g)),
            c.setTime(c.getTime() + 6e4 * ((0 < d ? k : g) - e)));
        u[(a + 24) >> 2] = c.getDay();
        u[(a + 28) >> 2] = Cb(c) | 0;
        u[a >> 2] = c.getSeconds();
        u[(a + 4) >> 2] = c.getMinutes();
        u[(a + 8) >> 2] = c.getHours();
        u[(a + 12) >> 2] = c.getDate();
        u[(a + 16) >> 2] = c.getMonth();
        u[(a + 20) >> 2] = c.getYear();
        return (c.getTime() / 1e3) | 0;
      },
      C: function (a, c, d, e, g, h, k) {
        try {
          var m = ub(e),
            v = B.jg(m, a, g, c, d),
            q = v.Gf;
          u[h >> 2] = v.Ah;
          x[k >> 2] = q;
          return 0;
        } catch (t) {
          if ("undefined" == typeof B || "ErrnoError" !== t.name) throw t;
          return -t.Pf;
        }
      },
      D: function (a, c, d, e, g, h) {
        try {
          var k = ub(g);
          if (d & 2) {
            if (!B.isFile(k.node.mode)) throw new B.Hf(43);
            if (!(e & 2)) {
              var m = sa.slice(a, a + c);
              B.pg(k, m, h, c, e);
            }
          }
        } catch (v) {
          if ("undefined" == typeof B || "ErrnoError" !== v.name) throw v;
          return -v.Pf;
        }
      },
      z: function (a, c, d) {
        function e(v) {
          return (v = v.toTimeString().match(/\(([A-Za-z ]+)\)$/))
            ? v[1]
            : "GMT";
        }
        var g = new Date().getFullYear(),
          h = new Date(g, 0, 1),
          k = new Date(g, 6, 1);
        g = h.getTimezoneOffset();
        var m = k.getTimezoneOffset();
        x[a >> 2] = 60 * Math.max(g, m);
        u[c >> 2] = Number(g != m);
        a = e(h);
        c = e(k);
        a = Db(a);
        c = Db(c);
        m < g
          ? ((x[d >> 2] = a), (x[(d + 4) >> 2] = c))
          : ((x[d >> 2] = c), (x[(d + 4) >> 2] = a));
      },
      k: function () {
        p("");
      },
      u: function (a, c, d) {
        Fb.length = 0;
        var e;
        for (d >>= 2; (e = sa[c++]); )
          ((d += (105 != e) & d), Fb.push(105 == e ? u[d] : va[d++ >> 1]), ++d);
        return Pa[a].apply(null, Fb);
      },
      m: function () {
        return Date.now();
      },
      O: Gb,
      R: function (a, c, d) {
        sa.copyWithin(a, c, c + d);
      },
      y: function (a) {
        var c = sa.length;
        a >>>= 0;
        if (2147483648 < a) return !1;
        for (var d = 1; 4 >= d; d *= 2) {
          var e = c * (1 + 0.2 / d);
          e = Math.min(e, a + 100663296);
          var g = Math,
            h = g.min;
          e = Math.max(a, e);
          e += (65536 - (e % 65536)) % 65536;
          a: {
            var k = pa.buffer;
            try {
              pa.grow((h.call(g, 2147483648, e) - k.byteLength + 65535) >>> 16);
              wa();
              var m = 1;
              break a;
            } catch (v) {}
            m = void 0;
          }
          if (m) return !0;
        }
        return !1;
      },
      I: function (a, c) {
        var d = 0;
        Ib().forEach(function (e, g) {
          var h = c + d;
          g = x[(a + 4 * g) >> 2] = h;
          for (h = 0; h < e.length; ++h) r[g++ >> 0] = e.charCodeAt(h);
          r[g >> 0] = 0;
          d += e.length + 1;
        });
        return 0;
      },
      J: function (a, c) {
        var d = Ib();
        x[a >> 2] = d.length;
        var e = 0;
        d.forEach(function (g) {
          e += g.length + 1;
        });
        x[c >> 2] = e;
        return 0;
      },
      V: function (a) {
        if (!noExitRuntime) {
          if (b.onExit) b.onExit(a);
          ra = !0;
        }
        ea(a, new Qa(a));
      },
      o: function (a) {
        try {
          var c = ub(a);
          B.close(c);
          return 0;
        } catch (d) {
          if ("undefined" == typeof B || "ErrnoError" !== d.name) throw d;
          return d.Pf;
        }
      },
      q: function (a, c, d, e) {
        try {
          a: {
            var g = ub(a);
            a = c;
            for (var h, k = (c = 0); k < d; k++) {
              var m = x[a >> 2],
                v = x[(a + 4) >> 2];
              a += 8;
              var q = B.read(g, r, m, v, h);
              if (0 > q) {
                var t = -1;
                break a;
              }
              c += q;
              if (q < v) break;
              "undefined" !== typeof h && (h += q);
            }
            t = c;
          }
          x[e >> 2] = t;
          return 0;
        } catch (F) {
          if ("undefined" == typeof B || "ErrnoError" !== F.name) throw F;
          return F.Pf;
        }
      },
      v: function (a, c, d, e, g) {
        try {
          c =
            (d + 2097152) >>> 0 < 4194305 - !!c
              ? (c >>> 0) + 4294967296 * d
              : NaN;
          if (isNaN(c)) return 61;
          var h = ub(a);
          B.Xf(h, c, e);
          z = [
            h.position >>> 0,
            ((y = h.position),
            1 <= +Math.abs(y)
              ? 0 < y
                ? +Math.floor(y / 4294967296) >>> 0
                : ~~+Math.ceil((y - +(~~y >>> 0)) / 4294967296) >>> 0
              : 0),
          ];
          u[g >> 2] = z[0];
          u[(g + 4) >> 2] = z[1];
          h.Qg && 0 === c && 0 === e && (h.Qg = null);
          return 0;
        } catch (k) {
          if ("undefined" == typeof B || "ErrnoError" !== k.name) throw k;
          return k.Pf;
        }
      },
      n: function (a, c, d, e) {
        try {
          a: {
            var g = ub(a);
            a = c;
            for (var h, k = (c = 0); k < d; k++) {
              var m = x[a >> 2],
                v = x[(a + 4) >> 2];
              a += 8;
              var q = B.write(g, r, m, v, h);
              if (0 > q) {
                var t = -1;
                break a;
              }
              c += q;
              "undefined" !== typeof h && (h += q);
            }
            t = c;
          }
          x[e >> 2] = t;
          return 0;
        } catch (F) {
          if ("undefined" == typeof B || "ErrnoError" !== F.name) throw F;
          return F.Pf;
        }
      },
      c: Rb,
      f: Sb,
      b: Tb,
      h: Ub,
      i: Vb,
      e: Wb,
      d: Xb,
      g: Yb,
      j: Zb,
      s: $b,
      t: ac,
      W: Mb,
      w: function (a, c, d, e) {
        return Mb(a, c, d, e);
      },
    };
    (function () {
      function a(d) {
        d = d.exports;
        b.asm = d;
        pa = b.asm.Y;
        wa();
        xa = b.asm.uf;
        za.unshift(b.asm.Z);
        Ha("wasm-instantiate");
        return d;
      }
      var c = { a: bc };
      Ga("wasm-instantiate");
      if (b.instantiateWasm)
        try {
          return b.instantiateWasm(c, a);
        } catch (d) {
          (n("Module.instantiateWasm callback failed with error: " + d), ba(d));
        }
      Oa(c, function (d) {
        a(d.instance);
      }).catch(ba);
      return {};
    })();
    var cc = (b._emscripten_bind_ParagraphJustification___destroy___0 =
        function () {
          return (cc = b._emscripten_bind_ParagraphJustification___destroy___0 =
            b.asm._).apply(null, arguments);
        }),
      dc = (b._emscripten_bind_BoolPtr___destroy___0 = function () {
        return (dc = b._emscripten_bind_BoolPtr___destroy___0 = b.asm.$).apply(
          null,
          arguments,
        );
      }),
      ec = (b._emscripten_bind_TessResultRenderer_BeginDocument_1 =
        function () {
          return (ec = b._emscripten_bind_TessResultRenderer_BeginDocument_1 =
            b.asm.aa).apply(null, arguments);
        }),
      fc = (b._emscripten_bind_TessResultRenderer_AddImage_1 = function () {
        return (fc = b._emscripten_bind_TessResultRenderer_AddImage_1 =
          b.asm.ba).apply(null, arguments);
      }),
      gc = (b._emscripten_bind_TessResultRenderer_EndDocument_0 = function () {
        return (gc = b._emscripten_bind_TessResultRenderer_EndDocument_0 =
          b.asm.ca).apply(null, arguments);
      }),
      hc = (b._emscripten_bind_TessResultRenderer_happy_0 = function () {
        return (hc = b._emscripten_bind_TessResultRenderer_happy_0 =
          b.asm.da).apply(null, arguments);
      }),
      ic = (b._emscripten_bind_TessResultRenderer_file_extension_0 =
        function () {
          return (ic = b._emscripten_bind_TessResultRenderer_file_extension_0 =
            b.asm.ea).apply(null, arguments);
        }),
      jc = (b._emscripten_bind_TessResultRenderer_title_0 = function () {
        return (jc = b._emscripten_bind_TessResultRenderer_title_0 =
          b.asm.fa).apply(null, arguments);
      }),
      kc = (b._emscripten_bind_TessResultRenderer_imagenum_0 = function () {
        return (kc = b._emscripten_bind_TessResultRenderer_imagenum_0 =
          b.asm.ga).apply(null, arguments);
      }),
      lc = (b._emscripten_bind_TessResultRenderer___destroy___0 = function () {
        return (lc = b._emscripten_bind_TessResultRenderer___destroy___0 =
          b.asm.ha).apply(null, arguments);
      }),
      mc = (b._emscripten_bind_LongStarPtr___destroy___0 = function () {
        return (mc = b._emscripten_bind_LongStarPtr___destroy___0 =
          b.asm.ia).apply(null, arguments);
      }),
      nc = (b._emscripten_bind_VoidPtr___destroy___0 = function () {
        return (nc = b._emscripten_bind_VoidPtr___destroy___0 = b.asm.ja).apply(
          null,
          arguments,
        );
      }),
      oc = (b._emscripten_bind_ResultIterator_ResultIterator_1 = function () {
        return (oc = b._emscripten_bind_ResultIterator_ResultIterator_1 =
          b.asm.ka).apply(null, arguments);
      }),
      pc = (b._emscripten_bind_ResultIterator_Begin_0 = function () {
        return (pc = b._emscripten_bind_ResultIterator_Begin_0 =
          b.asm.la).apply(null, arguments);
      }),
      qc = (b._emscripten_bind_ResultIterator_RestartParagraph_0 = function () {
        return (qc = b._emscripten_bind_ResultIterator_RestartParagraph_0 =
          b.asm.ma).apply(null, arguments);
      }),
      rc =
        (b._emscripten_bind_ResultIterator_IsWithinFirstTextlineOfParagraph_0 =
          function () {
            return (rc =
              b._emscripten_bind_ResultIterator_IsWithinFirstTextlineOfParagraph_0 =
                b.asm.na).apply(null, arguments);
          }),
      sc = (b._emscripten_bind_ResultIterator_RestartRow_0 = function () {
        return (sc = b._emscripten_bind_ResultIterator_RestartRow_0 =
          b.asm.oa).apply(null, arguments);
      }),
      tc = (b._emscripten_bind_ResultIterator_Next_1 = function () {
        return (tc = b._emscripten_bind_ResultIterator_Next_1 = b.asm.pa).apply(
          null,
          arguments,
        );
      }),
      uc = (b._emscripten_bind_ResultIterator_IsAtBeginningOf_1 = function () {
        return (uc = b._emscripten_bind_ResultIterator_IsAtBeginningOf_1 =
          b.asm.qa).apply(null, arguments);
      }),
      vc = (b._emscripten_bind_ResultIterator_IsAtFinalElement_2 = function () {
        return (vc = b._emscripten_bind_ResultIterator_IsAtFinalElement_2 =
          b.asm.ra).apply(null, arguments);
      }),
      wc = (b._emscripten_bind_ResultIterator_Cmp_1 = function () {
        return (wc = b._emscripten_bind_ResultIterator_Cmp_1 = b.asm.sa).apply(
          null,
          arguments,
        );
      }),
      xc = (b._emscripten_bind_ResultIterator_SetBoundingBoxComponents_2 =
        function () {
          return (xc =
            b._emscripten_bind_ResultIterator_SetBoundingBoxComponents_2 =
              b.asm.ta).apply(null, arguments);
        }),
      yc = (b._emscripten_bind_ResultIterator_BoundingBox_5 = function () {
        return (yc = b._emscripten_bind_ResultIterator_BoundingBox_5 =
          b.asm.ua).apply(null, arguments);
      }),
      zc = (b._emscripten_bind_ResultIterator_BoundingBox_6 = function () {
        return (zc = b._emscripten_bind_ResultIterator_BoundingBox_6 =
          b.asm.va).apply(null, arguments);
      }),
      Ac = (b._emscripten_bind_ResultIterator_BoundingBoxInternal_5 =
        function () {
          return (Ac = b._emscripten_bind_ResultIterator_BoundingBoxInternal_5 =
            b.asm.wa).apply(null, arguments);
        }),
      Bc = (b._emscripten_bind_ResultIterator_Empty_1 = function () {
        return (Bc = b._emscripten_bind_ResultIterator_Empty_1 =
          b.asm.xa).apply(null, arguments);
      }),
      Cc = (b._emscripten_bind_ResultIterator_BlockType_0 = function () {
        return (Cc = b._emscripten_bind_ResultIterator_BlockType_0 =
          b.asm.ya).apply(null, arguments);
      }),
      Dc = (b._emscripten_bind_ResultIterator_BlockPolygon_0 = function () {
        return (Dc = b._emscripten_bind_ResultIterator_BlockPolygon_0 =
          b.asm.za).apply(null, arguments);
      }),
      Ec = (b._emscripten_bind_ResultIterator_GetBinaryImage_1 = function () {
        return (Ec = b._emscripten_bind_ResultIterator_GetBinaryImage_1 =
          b.asm.Aa).apply(null, arguments);
      }),
      Fc = (b._emscripten_bind_ResultIterator_GetImage_5 = function () {
        return (Fc = b._emscripten_bind_ResultIterator_GetImage_5 =
          b.asm.Ba).apply(null, arguments);
      }),
      Gc = (b._emscripten_bind_ResultIterator_Baseline_5 = function () {
        return (Gc = b._emscripten_bind_ResultIterator_Baseline_5 =
          b.asm.Ca).apply(null, arguments);
      }),
      Hc = (b._emscripten_bind_ResultIterator_RowAttributes_3 = function () {
        return (Hc = b._emscripten_bind_ResultIterator_RowAttributes_3 =
          b.asm.Da).apply(null, arguments);
      }),
      Ic = (b._emscripten_bind_ResultIterator_Orientation_4 = function () {
        return (Ic = b._emscripten_bind_ResultIterator_Orientation_4 =
          b.asm.Ea).apply(null, arguments);
      }),
      Jc = (b._emscripten_bind_ResultIterator_ParagraphInfo_4 = function () {
        return (Jc = b._emscripten_bind_ResultIterator_ParagraphInfo_4 =
          b.asm.Fa).apply(null, arguments);
      }),
      Kc = (b._emscripten_bind_ResultIterator_ParagraphIsLtr_0 = function () {
        return (Kc = b._emscripten_bind_ResultIterator_ParagraphIsLtr_0 =
          b.asm.Ga).apply(null, arguments);
      }),
      Lc = (b._emscripten_bind_ResultIterator_GetUTF8Text_1 = function () {
        return (Lc = b._emscripten_bind_ResultIterator_GetUTF8Text_1 =
          b.asm.Ha).apply(null, arguments);
      }),
      Mc = (b._emscripten_bind_ResultIterator_SetLineSeparator_1 = function () {
        return (Mc = b._emscripten_bind_ResultIterator_SetLineSeparator_1 =
          b.asm.Ia).apply(null, arguments);
      }),
      Nc = (b._emscripten_bind_ResultIterator_SetParagraphSeparator_1 =
        function () {
          return (Nc =
            b._emscripten_bind_ResultIterator_SetParagraphSeparator_1 =
              b.asm.Ja).apply(null, arguments);
        }),
      Oc = (b._emscripten_bind_ResultIterator_Confidence_1 = function () {
        return (Oc = b._emscripten_bind_ResultIterator_Confidence_1 =
          b.asm.Ka).apply(null, arguments);
      }),
      Pc = (b._emscripten_bind_ResultIterator_WordFontAttributes_8 =
        function () {
          return (Pc = b._emscripten_bind_ResultIterator_WordFontAttributes_8 =
            b.asm.La).apply(null, arguments);
        }),
      Qc = (b._emscripten_bind_ResultIterator_WordRecognitionLanguage_0 =
        function () {
          return (Qc =
            b._emscripten_bind_ResultIterator_WordRecognitionLanguage_0 =
              b.asm.Ma).apply(null, arguments);
        }),
      Rc = (b._emscripten_bind_ResultIterator_WordDirection_0 = function () {
        return (Rc = b._emscripten_bind_ResultIterator_WordDirection_0 =
          b.asm.Na).apply(null, arguments);
      }),
      Sc = (b._emscripten_bind_ResultIterator_WordIsFromDictionary_0 =
        function () {
          return (Sc =
            b._emscripten_bind_ResultIterator_WordIsFromDictionary_0 =
              b.asm.Oa).apply(null, arguments);
        }),
      Tc = (b._emscripten_bind_ResultIterator_WordIsNumeric_0 = function () {
        return (Tc = b._emscripten_bind_ResultIterator_WordIsNumeric_0 =
          b.asm.Pa).apply(null, arguments);
      }),
      Uc = (b._emscripten_bind_ResultIterator_HasBlamerInfo_0 = function () {
        return (Uc = b._emscripten_bind_ResultIterator_HasBlamerInfo_0 =
          b.asm.Qa).apply(null, arguments);
      }),
      Vc = (b._emscripten_bind_ResultIterator_HasTruthString_0 = function () {
        return (Vc = b._emscripten_bind_ResultIterator_HasTruthString_0 =
          b.asm.Ra).apply(null, arguments);
      }),
      Wc = (b._emscripten_bind_ResultIterator_EquivalentToTruth_1 =
        function () {
          return (Wc = b._emscripten_bind_ResultIterator_EquivalentToTruth_1 =
            b.asm.Sa).apply(null, arguments);
        }),
      Xc = (b._emscripten_bind_ResultIterator_WordTruthUTF8Text_0 =
        function () {
          return (Xc = b._emscripten_bind_ResultIterator_WordTruthUTF8Text_0 =
            b.asm.Ta).apply(null, arguments);
        }),
      Yc = (b._emscripten_bind_ResultIterator_WordNormedUTF8Text_0 =
        function () {
          return (Yc = b._emscripten_bind_ResultIterator_WordNormedUTF8Text_0 =
            b.asm.Ua).apply(null, arguments);
        }),
      Zc = (b._emscripten_bind_ResultIterator_WordLattice_1 = function () {
        return (Zc = b._emscripten_bind_ResultIterator_WordLattice_1 =
          b.asm.Va).apply(null, arguments);
      }),
      $c = (b._emscripten_bind_ResultIterator_SymbolIsSuperscript_0 =
        function () {
          return ($c = b._emscripten_bind_ResultIterator_SymbolIsSuperscript_0 =
            b.asm.Wa).apply(null, arguments);
        }),
      ad = (b._emscripten_bind_ResultIterator_SymbolIsSubscript_0 =
        function () {
          return (ad = b._emscripten_bind_ResultIterator_SymbolIsSubscript_0 =
            b.asm.Xa).apply(null, arguments);
        }),
      bd = (b._emscripten_bind_ResultIterator_SymbolIsDropcap_0 = function () {
        return (bd = b._emscripten_bind_ResultIterator_SymbolIsDropcap_0 =
          b.asm.Ya).apply(null, arguments);
      }),
      cd = (b._emscripten_bind_ResultIterator___destroy___0 = function () {
        return (cd = b._emscripten_bind_ResultIterator___destroy___0 =
          b.asm.Za).apply(null, arguments);
      }),
      dd = (b._emscripten_bind_TextlineOrder___destroy___0 = function () {
        return (dd = b._emscripten_bind_TextlineOrder___destroy___0 =
          b.asm._a).apply(null, arguments);
      }),
      ed = (b._emscripten_bind_ETEXT_DESC___destroy___0 = function () {
        return (ed = b._emscripten_bind_ETEXT_DESC___destroy___0 =
          b.asm.$a).apply(null, arguments);
      }),
      fd = (b._emscripten_bind_PageIterator_Begin_0 = function () {
        return (fd = b._emscripten_bind_PageIterator_Begin_0 = b.asm.ab).apply(
          null,
          arguments,
        );
      }),
      gd = (b._emscripten_bind_PageIterator_RestartParagraph_0 = function () {
        return (gd = b._emscripten_bind_PageIterator_RestartParagraph_0 =
          b.asm.bb).apply(null, arguments);
      }),
      hd = (b._emscripten_bind_PageIterator_IsWithinFirstTextlineOfParagraph_0 =
        function () {
          return (hd =
            b._emscripten_bind_PageIterator_IsWithinFirstTextlineOfParagraph_0 =
              b.asm.cb).apply(null, arguments);
        }),
      jd = (b._emscripten_bind_PageIterator_RestartRow_0 = function () {
        return (jd = b._emscripten_bind_PageIterator_RestartRow_0 =
          b.asm.db).apply(null, arguments);
      }),
      kd = (b._emscripten_bind_PageIterator_Next_1 = function () {
        return (kd = b._emscripten_bind_PageIterator_Next_1 = b.asm.eb).apply(
          null,
          arguments,
        );
      }),
      ld = (b._emscripten_bind_PageIterator_IsAtBeginningOf_1 = function () {
        return (ld = b._emscripten_bind_PageIterator_IsAtBeginningOf_1 =
          b.asm.fb).apply(null, arguments);
      }),
      md = (b._emscripten_bind_PageIterator_IsAtFinalElement_2 = function () {
        return (md = b._emscripten_bind_PageIterator_IsAtFinalElement_2 =
          b.asm.gb).apply(null, arguments);
      }),
      nd = (b._emscripten_bind_PageIterator_Cmp_1 = function () {
        return (nd = b._emscripten_bind_PageIterator_Cmp_1 = b.asm.hb).apply(
          null,
          arguments,
        );
      }),
      od = (b._emscripten_bind_PageIterator_SetBoundingBoxComponents_2 =
        function () {
          return (od =
            b._emscripten_bind_PageIterator_SetBoundingBoxComponents_2 =
              b.asm.ib).apply(null, arguments);
        }),
      pd = (b._emscripten_bind_PageIterator_BoundingBox_5 = function () {
        return (pd = b._emscripten_bind_PageIterator_BoundingBox_5 =
          b.asm.jb).apply(null, arguments);
      }),
      qd = (b._emscripten_bind_PageIterator_BoundingBox_6 = function () {
        return (qd = b._emscripten_bind_PageIterator_BoundingBox_6 =
          b.asm.kb).apply(null, arguments);
      }),
      rd = (b._emscripten_bind_PageIterator_BoundingBoxInternal_5 =
        function () {
          return (rd = b._emscripten_bind_PageIterator_BoundingBoxInternal_5 =
            b.asm.lb).apply(null, arguments);
        }),
      sd = (b._emscripten_bind_PageIterator_Empty_1 = function () {
        return (sd = b._emscripten_bind_PageIterator_Empty_1 = b.asm.mb).apply(
          null,
          arguments,
        );
      }),
      td = (b._emscripten_bind_PageIterator_BlockType_0 = function () {
        return (td = b._emscripten_bind_PageIterator_BlockType_0 =
          b.asm.nb).apply(null, arguments);
      }),
      ud = (b._emscripten_bind_PageIterator_BlockPolygon_0 = function () {
        return (ud = b._emscripten_bind_PageIterator_BlockPolygon_0 =
          b.asm.ob).apply(null, arguments);
      }),
      vd = (b._emscripten_bind_PageIterator_GetBinaryImage_1 = function () {
        return (vd = b._emscripten_bind_PageIterator_GetBinaryImage_1 =
          b.asm.pb).apply(null, arguments);
      }),
      wd = (b._emscripten_bind_PageIterator_GetImage_5 = function () {
        return (wd = b._emscripten_bind_PageIterator_GetImage_5 =
          b.asm.qb).apply(null, arguments);
      }),
      xd = (b._emscripten_bind_PageIterator_Baseline_5 = function () {
        return (xd = b._emscripten_bind_PageIterator_Baseline_5 =
          b.asm.rb).apply(null, arguments);
      }),
      yd = (b._emscripten_bind_PageIterator_Orientation_4 = function () {
        return (yd = b._emscripten_bind_PageIterator_Orientation_4 =
          b.asm.sb).apply(null, arguments);
      }),
      zd = (b._emscripten_bind_PageIterator_ParagraphInfo_4 = function () {
        return (zd = b._emscripten_bind_PageIterator_ParagraphInfo_4 =
          b.asm.tb).apply(null, arguments);
      }),
      Ad = (b._emscripten_bind_PageIterator___destroy___0 = function () {
        return (Ad = b._emscripten_bind_PageIterator___destroy___0 =
          b.asm.ub).apply(null, arguments);
      }),
      Bd = (b._emscripten_bind_WritingDirection___destroy___0 = function () {
        return (Bd = b._emscripten_bind_WritingDirection___destroy___0 =
          b.asm.vb).apply(null, arguments);
      }),
      Cd = (b._emscripten_bind_WordChoiceIterator_WordChoiceIterator_1 =
        function () {
          return (Cd =
            b._emscripten_bind_WordChoiceIterator_WordChoiceIterator_1 =
              b.asm.wb).apply(null, arguments);
        }),
      Dd = (b._emscripten_bind_WordChoiceIterator_Next_0 = function () {
        return (Dd = b._emscripten_bind_WordChoiceIterator_Next_0 =
          b.asm.xb).apply(null, arguments);
      }),
      Ed = (b._emscripten_bind_WordChoiceIterator_GetUTF8Text_0 = function () {
        return (Ed = b._emscripten_bind_WordChoiceIterator_GetUTF8Text_0 =
          b.asm.yb).apply(null, arguments);
      }),
      Fd = (b._emscripten_bind_WordChoiceIterator_Confidence_0 = function () {
        return (Fd = b._emscripten_bind_WordChoiceIterator_Confidence_0 =
          b.asm.zb).apply(null, arguments);
      }),
      Gd = (b._emscripten_bind_WordChoiceIterator___destroy___0 = function () {
        return (Gd = b._emscripten_bind_WordChoiceIterator___destroy___0 =
          b.asm.Ab).apply(null, arguments);
      }),
      Hd = (b._emscripten_bind_Box_get_x_0 = function () {
        return (Hd = b._emscripten_bind_Box_get_x_0 = b.asm.Bb).apply(
          null,
          arguments,
        );
      }),
      Id = (b._emscripten_bind_Box_get_y_0 = function () {
        return (Id = b._emscripten_bind_Box_get_y_0 = b.asm.Cb).apply(
          null,
          arguments,
        );
      }),
      Jd = (b._emscripten_bind_Box_get_w_0 = function () {
        return (Jd = b._emscripten_bind_Box_get_w_0 = b.asm.Db).apply(
          null,
          arguments,
        );
      }),
      Kd = (b._emscripten_bind_Box_get_h_0 = function () {
        return (Kd = b._emscripten_bind_Box_get_h_0 = b.asm.Eb).apply(
          null,
          arguments,
        );
      }),
      Ld = (b._emscripten_bind_Box_get_refcount_0 = function () {
        return (Ld = b._emscripten_bind_Box_get_refcount_0 = b.asm.Fb).apply(
          null,
          arguments,
        );
      }),
      Md = (b._emscripten_bind_Box___destroy___0 = function () {
        return (Md = b._emscripten_bind_Box___destroy___0 = b.asm.Gb).apply(
          null,
          arguments,
        );
      }),
      Nd = (b._emscripten_bind_TessPDFRenderer_TessPDFRenderer_3 = function () {
        return (Nd = b._emscripten_bind_TessPDFRenderer_TessPDFRenderer_3 =
          b.asm.Hb).apply(null, arguments);
      }),
      Od = (b._emscripten_bind_TessPDFRenderer_BeginDocument_1 = function () {
        return (Od = b._emscripten_bind_TessPDFRenderer_BeginDocument_1 =
          b.asm.Ib).apply(null, arguments);
      }),
      Pd = (b._emscripten_bind_TessPDFRenderer_AddImage_1 = function () {
        return (Pd = b._emscripten_bind_TessPDFRenderer_AddImage_1 =
          b.asm.Jb).apply(null, arguments);
      }),
      Qd = (b._emscripten_bind_TessPDFRenderer_EndDocument_0 = function () {
        return (Qd = b._emscripten_bind_TessPDFRenderer_EndDocument_0 =
          b.asm.Kb).apply(null, arguments);
      }),
      Rd = (b._emscripten_bind_TessPDFRenderer_happy_0 = function () {
        return (Rd = b._emscripten_bind_TessPDFRenderer_happy_0 =
          b.asm.Lb).apply(null, arguments);
      }),
      Sd = (b._emscripten_bind_TessPDFRenderer_file_extension_0 = function () {
        return (Sd = b._emscripten_bind_TessPDFRenderer_file_extension_0 =
          b.asm.Mb).apply(null, arguments);
      }),
      Td = (b._emscripten_bind_TessPDFRenderer_title_0 = function () {
        return (Td = b._emscripten_bind_TessPDFRenderer_title_0 =
          b.asm.Nb).apply(null, arguments);
      }),
      Ud = (b._emscripten_bind_TessPDFRenderer_imagenum_0 = function () {
        return (Ud = b._emscripten_bind_TessPDFRenderer_imagenum_0 =
          b.asm.Ob).apply(null, arguments);
      }),
      Vd = (b._emscripten_bind_TessPDFRenderer___destroy___0 = function () {
        return (Vd = b._emscripten_bind_TessPDFRenderer___destroy___0 =
          b.asm.Pb).apply(null, arguments);
      }),
      Wd = (b._emscripten_bind_PixaPtr___destroy___0 = function () {
        return (Wd = b._emscripten_bind_PixaPtr___destroy___0 = b.asm.Qb).apply(
          null,
          arguments,
        );
      }),
      Xd = (b._emscripten_bind_FloatPtr___destroy___0 = function () {
        return (Xd = b._emscripten_bind_FloatPtr___destroy___0 =
          b.asm.Rb).apply(null, arguments);
      }),
      Yd = (b._emscripten_bind_ChoiceIterator_ChoiceIterator_1 = function () {
        return (Yd = b._emscripten_bind_ChoiceIterator_ChoiceIterator_1 =
          b.asm.Sb).apply(null, arguments);
      }),
      Zd = (b._emscripten_bind_ChoiceIterator_Next_0 = function () {
        return (Zd = b._emscripten_bind_ChoiceIterator_Next_0 = b.asm.Tb).apply(
          null,
          arguments,
        );
      }),
      $d = (b._emscripten_bind_ChoiceIterator_GetUTF8Text_0 = function () {
        return ($d = b._emscripten_bind_ChoiceIterator_GetUTF8Text_0 =
          b.asm.Ub).apply(null, arguments);
      }),
      ae = (b._emscripten_bind_ChoiceIterator_Confidence_0 = function () {
        return (ae = b._emscripten_bind_ChoiceIterator_Confidence_0 =
          b.asm.Vb).apply(null, arguments);
      }),
      be = (b._emscripten_bind_ChoiceIterator___destroy___0 = function () {
        return (be = b._emscripten_bind_ChoiceIterator___destroy___0 =
          b.asm.Wb).apply(null, arguments);
      }),
      ce = (b._emscripten_bind_PixPtr___destroy___0 = function () {
        return (ce = b._emscripten_bind_PixPtr___destroy___0 = b.asm.Xb).apply(
          null,
          arguments,
        );
      }),
      de = (b._emscripten_bind_UNICHARSET_get_script_from_script_id_1 =
        function () {
          return (de =
            b._emscripten_bind_UNICHARSET_get_script_from_script_id_1 =
              b.asm.Yb).apply(null, arguments);
        }),
      ee = (b._emscripten_bind_UNICHARSET_get_script_id_from_name_1 =
        function () {
          return (ee = b._emscripten_bind_UNICHARSET_get_script_id_from_name_1 =
            b.asm.Zb).apply(null, arguments);
        }),
      fe = (b._emscripten_bind_UNICHARSET_get_script_table_size_0 =
        function () {
          return (fe = b._emscripten_bind_UNICHARSET_get_script_table_size_0 =
            b.asm._b).apply(null, arguments);
        }),
      ge = (b._emscripten_bind_UNICHARSET___destroy___0 = function () {
        return (ge = b._emscripten_bind_UNICHARSET___destroy___0 =
          b.asm.$b).apply(null, arguments);
      }),
      he = (b._emscripten_bind_IntPtr___destroy___0 = function () {
        return (he = b._emscripten_bind_IntPtr___destroy___0 = b.asm.ac).apply(
          null,
          arguments,
        );
      }),
      ie = (b._emscripten_bind_Orientation___destroy___0 = function () {
        return (ie = b._emscripten_bind_Orientation___destroy___0 =
          b.asm.bc).apply(null, arguments);
      }),
      je = (b._emscripten_bind_OSBestResult_get_orientation_id_0 = function () {
        return (je = b._emscripten_bind_OSBestResult_get_orientation_id_0 =
          b.asm.cc).apply(null, arguments);
      }),
      ke = (b._emscripten_bind_OSBestResult_get_script_id_0 = function () {
        return (ke = b._emscripten_bind_OSBestResult_get_script_id_0 =
          b.asm.dc).apply(null, arguments);
      }),
      le = (b._emscripten_bind_OSBestResult_get_sconfidence_0 = function () {
        return (le = b._emscripten_bind_OSBestResult_get_sconfidence_0 =
          b.asm.ec).apply(null, arguments);
      }),
      me = (b._emscripten_bind_OSBestResult_get_oconfidence_0 = function () {
        return (me = b._emscripten_bind_OSBestResult_get_oconfidence_0 =
          b.asm.fc).apply(null, arguments);
      }),
      ne = (b._emscripten_bind_OSBestResult___destroy___0 = function () {
        return (ne = b._emscripten_bind_OSBestResult___destroy___0 =
          b.asm.gc).apply(null, arguments);
      }),
      oe = (b._emscripten_bind_Boxa_get_n_0 = function () {
        return (oe = b._emscripten_bind_Boxa_get_n_0 = b.asm.hc).apply(
          null,
          arguments,
        );
      }),
      pe = (b._emscripten_bind_Boxa_get_nalloc_0 = function () {
        return (pe = b._emscripten_bind_Boxa_get_nalloc_0 = b.asm.ic).apply(
          null,
          arguments,
        );
      }),
      qe = (b._emscripten_bind_Boxa_get_refcount_0 = function () {
        return (qe = b._emscripten_bind_Boxa_get_refcount_0 = b.asm.jc).apply(
          null,
          arguments,
        );
      }),
      re = (b._emscripten_bind_Boxa_get_box_0 = function () {
        return (re = b._emscripten_bind_Boxa_get_box_0 = b.asm.kc).apply(
          null,
          arguments,
        );
      }),
      se = (b._emscripten_bind_Boxa___destroy___0 = function () {
        return (se = b._emscripten_bind_Boxa___destroy___0 = b.asm.lc).apply(
          null,
          arguments,
        );
      }),
      te = (b._emscripten_bind_PixColormap_get_array_0 = function () {
        return (te = b._emscripten_bind_PixColormap_get_array_0 =
          b.asm.mc).apply(null, arguments);
      }),
      ue = (b._emscripten_bind_PixColormap_get_depth_0 = function () {
        return (ue = b._emscripten_bind_PixColormap_get_depth_0 =
          b.asm.nc).apply(null, arguments);
      }),
      ve = (b._emscripten_bind_PixColormap_get_nalloc_0 = function () {
        return (ve = b._emscripten_bind_PixColormap_get_nalloc_0 =
          b.asm.oc).apply(null, arguments);
      }),
      we = (b._emscripten_bind_PixColormap_get_n_0 = function () {
        return (we = b._emscripten_bind_PixColormap_get_n_0 = b.asm.pc).apply(
          null,
          arguments,
        );
      }),
      xe = (b._emscripten_bind_PixColormap___destroy___0 = function () {
        return (xe = b._emscripten_bind_PixColormap___destroy___0 =
          b.asm.qc).apply(null, arguments);
      }),
      ye = (b._emscripten_bind_Pta_get_n_0 = function () {
        return (ye = b._emscripten_bind_Pta_get_n_0 = b.asm.rc).apply(
          null,
          arguments,
        );
      }),
      ze = (b._emscripten_bind_Pta_get_nalloc_0 = function () {
        return (ze = b._emscripten_bind_Pta_get_nalloc_0 = b.asm.sc).apply(
          null,
          arguments,
        );
      }),
      Ae = (b._emscripten_bind_Pta_get_refcount_0 = function () {
        return (Ae = b._emscripten_bind_Pta_get_refcount_0 = b.asm.tc).apply(
          null,
          arguments,
        );
      }),
      Be = (b._emscripten_bind_Pta_get_x_0 = function () {
        return (Be = b._emscripten_bind_Pta_get_x_0 = b.asm.uc).apply(
          null,
          arguments,
        );
      }),
      Ce = (b._emscripten_bind_Pta_get_y_0 = function () {
        return (Ce = b._emscripten_bind_Pta_get_y_0 = b.asm.vc).apply(
          null,
          arguments,
        );
      }),
      De = (b._emscripten_bind_Pta___destroy___0 = function () {
        return (De = b._emscripten_bind_Pta___destroy___0 = b.asm.wc).apply(
          null,
          arguments,
        );
      }),
      Ee = (b._emscripten_bind_Pix_get_w_0 = function () {
        return (Ee = b._emscripten_bind_Pix_get_w_0 = b.asm.xc).apply(
          null,
          arguments,
        );
      }),
      Fe = (b._emscripten_bind_Pix_get_h_0 = function () {
        return (Fe = b._emscripten_bind_Pix_get_h_0 = b.asm.yc).apply(
          null,
          arguments,
        );
      }),
      Ge = (b._emscripten_bind_Pix_get_d_0 = function () {
        return (Ge = b._emscripten_bind_Pix_get_d_0 = b.asm.zc).apply(
          null,
          arguments,
        );
      }),
      He = (b._emscripten_bind_Pix_get_spp_0 = function () {
        return (He = b._emscripten_bind_Pix_get_spp_0 = b.asm.Ac).apply(
          null,
          arguments,
        );
      }),
      Ie = (b._emscripten_bind_Pix_get_wpl_0 = function () {
        return (Ie = b._emscripten_bind_Pix_get_wpl_0 = b.asm.Bc).apply(
          null,
          arguments,
        );
      }),
      Je = (b._emscripten_bind_Pix_get_refcount_0 = function () {
        return (Je = b._emscripten_bind_Pix_get_refcount_0 = b.asm.Cc).apply(
          null,
          arguments,
        );
      }),
      Ke = (b._emscripten_bind_Pix_get_xres_0 = function () {
        return (Ke = b._emscripten_bind_Pix_get_xres_0 = b.asm.Dc).apply(
          null,
          arguments,
        );
      }),
      Le = (b._emscripten_bind_Pix_get_yres_0 = function () {
        return (Le = b._emscripten_bind_Pix_get_yres_0 = b.asm.Ec).apply(
          null,
          arguments,
        );
      }),
      Me = (b._emscripten_bind_Pix_get_informat_0 = function () {
        return (Me = b._emscripten_bind_Pix_get_informat_0 = b.asm.Fc).apply(
          null,
          arguments,
        );
      }),
      Ne = (b._emscripten_bind_Pix_get_special_0 = function () {
        return (Ne = b._emscripten_bind_Pix_get_special_0 = b.asm.Gc).apply(
          null,
          arguments,
        );
      }),
      Oe = (b._emscripten_bind_Pix_get_text_0 = function () {
        return (Oe = b._emscripten_bind_Pix_get_text_0 = b.asm.Hc).apply(
          null,
          arguments,
        );
      }),
      Pe = (b._emscripten_bind_Pix_get_colormap_0 = function () {
        return (Pe = b._emscripten_bind_Pix_get_colormap_0 = b.asm.Ic).apply(
          null,
          arguments,
        );
      }),
      Qe = (b._emscripten_bind_Pix_get_data_0 = function () {
        return (Qe = b._emscripten_bind_Pix_get_data_0 = b.asm.Jc).apply(
          null,
          arguments,
        );
      }),
      Re = (b._emscripten_bind_Pix___destroy___0 = function () {
        return (Re = b._emscripten_bind_Pix___destroy___0 = b.asm.Kc).apply(
          null,
          arguments,
        );
      }),
      Se = (b._emscripten_bind_DoublePtr___destroy___0 = function () {
        return (Se = b._emscripten_bind_DoublePtr___destroy___0 =
          b.asm.Lc).apply(null, arguments);
      }),
      Te = (b._emscripten_bind_Dawg___destroy___0 = function () {
        return (Te = b._emscripten_bind_Dawg___destroy___0 = b.asm.Mc).apply(
          null,
          arguments,
        );
      }),
      Ue = (b._emscripten_bind_BoxPtr___destroy___0 = function () {
        return (Ue = b._emscripten_bind_BoxPtr___destroy___0 = b.asm.Nc).apply(
          null,
          arguments,
        );
      }),
      Ve = (b._emscripten_bind_TessBaseAPI_TessBaseAPI_0 = function () {
        return (Ve = b._emscripten_bind_TessBaseAPI_TessBaseAPI_0 =
          b.asm.Oc).apply(null, arguments);
      }),
      We = (b._emscripten_bind_TessBaseAPI_Version_0 = function () {
        return (We = b._emscripten_bind_TessBaseAPI_Version_0 = b.asm.Pc).apply(
          null,
          arguments,
        );
      }),
      Xe = (b._emscripten_bind_TessBaseAPI_SetInputName_1 = function () {
        return (Xe = b._emscripten_bind_TessBaseAPI_SetInputName_1 =
          b.asm.Qc).apply(null, arguments);
      }),
      Ye = (b._emscripten_bind_TessBaseAPI_GetInputName_0 = function () {
        return (Ye = b._emscripten_bind_TessBaseAPI_GetInputName_0 =
          b.asm.Rc).apply(null, arguments);
      }),
      Ze = (b._emscripten_bind_TessBaseAPI_SetInputImage_1 = function () {
        return (Ze = b._emscripten_bind_TessBaseAPI_SetInputImage_1 =
          b.asm.Sc).apply(null, arguments);
      }),
      $e = (b._emscripten_bind_TessBaseAPI_GetInputImage_0 = function () {
        return ($e = b._emscripten_bind_TessBaseAPI_GetInputImage_0 =
          b.asm.Tc).apply(null, arguments);
      }),
      af = (b._emscripten_bind_TessBaseAPI_GetSourceYResolution_0 =
        function () {
          return (af = b._emscripten_bind_TessBaseAPI_GetSourceYResolution_0 =
            b.asm.Uc).apply(null, arguments);
        }),
      bf = (b._emscripten_bind_TessBaseAPI_GetDatapath_0 = function () {
        return (bf = b._emscripten_bind_TessBaseAPI_GetDatapath_0 =
          b.asm.Vc).apply(null, arguments);
      }),
      cf = (b._emscripten_bind_TessBaseAPI_SetOutputName_1 = function () {
        return (cf = b._emscripten_bind_TessBaseAPI_SetOutputName_1 =
          b.asm.Wc).apply(null, arguments);
      }),
      df = (b._emscripten_bind_TessBaseAPI_SetVariable_2 = function () {
        return (df = b._emscripten_bind_TessBaseAPI_SetVariable_2 =
          b.asm.Xc).apply(null, arguments);
      }),
      ef = (b._emscripten_bind_TessBaseAPI_SetDebugVariable_2 = function () {
        return (ef = b._emscripten_bind_TessBaseAPI_SetDebugVariable_2 =
          b.asm.Yc).apply(null, arguments);
      }),
      ff = (b._emscripten_bind_TessBaseAPI_GetIntVariable_2 = function () {
        return (ff = b._emscripten_bind_TessBaseAPI_GetIntVariable_2 =
          b.asm.Zc).apply(null, arguments);
      }),
      gf = (b._emscripten_bind_TessBaseAPI_GetBoolVariable_2 = function () {
        return (gf = b._emscripten_bind_TessBaseAPI_GetBoolVariable_2 =
          b.asm._c).apply(null, arguments);
      }),
      hf = (b._emscripten_bind_TessBaseAPI_GetDoubleVariable_2 = function () {
        return (hf = b._emscripten_bind_TessBaseAPI_GetDoubleVariable_2 =
          b.asm.$c).apply(null, arguments);
      }),
      jf = (b._emscripten_bind_TessBaseAPI_GetStringVariable_1 = function () {
        return (jf = b._emscripten_bind_TessBaseAPI_GetStringVariable_1 =
          b.asm.ad).apply(null, arguments);
      }),
      kf = (b._emscripten_bind_TessBaseAPI_SaveParameters_1 = function () {
        return (kf = b._emscripten_bind_TessBaseAPI_SaveParameters_1 =
          b.asm.bd).apply(null, arguments);
      }),
      lf = (b._emscripten_bind_TessBaseAPI_RestoreParameters_1 = function () {
        return (lf = b._emscripten_bind_TessBaseAPI_RestoreParameters_1 =
          b.asm.cd).apply(null, arguments);
      }),
      mf = (b._emscripten_bind_TessBaseAPI_Init_2 = function () {
        return (mf = b._emscripten_bind_TessBaseAPI_Init_2 = b.asm.dd).apply(
          null,
          arguments,
        );
      }),
      nf = (b._emscripten_bind_TessBaseAPI_Init_3 = function () {
        return (nf = b._emscripten_bind_TessBaseAPI_Init_3 = b.asm.ed).apply(
          null,
          arguments,
        );
      }),
      of = (b._emscripten_bind_TessBaseAPI_Init_4 = function () {
        return (of = b._emscripten_bind_TessBaseAPI_Init_4 = b.asm.fd).apply(
          null,
          arguments,
        );
      }),
      pf = (b._emscripten_bind_TessBaseAPI_GetInitLanguagesAsString_0 =
        function () {
          return (pf =
            b._emscripten_bind_TessBaseAPI_GetInitLanguagesAsString_0 =
              b.asm.gd).apply(null, arguments);
        }),
      qf = (b._emscripten_bind_TessBaseAPI_InitForAnalysePage_0 = function () {
        return (qf = b._emscripten_bind_TessBaseAPI_InitForAnalysePage_0 =
          b.asm.hd).apply(null, arguments);
      }),
      rf = (b._emscripten_bind_TessBaseAPI_ReadConfigFile_1 = function () {
        return (rf = b._emscripten_bind_TessBaseAPI_ReadConfigFile_1 =
          b.asm.id).apply(null, arguments);
      }),
      sf = (b._emscripten_bind_TessBaseAPI_ReadDebugConfigFile_1 = function () {
        return (sf = b._emscripten_bind_TessBaseAPI_ReadDebugConfigFile_1 =
          b.asm.jd).apply(null, arguments);
      }),
      tf = (b._emscripten_bind_TessBaseAPI_SetPageSegMode_1 = function () {
        return (tf = b._emscripten_bind_TessBaseAPI_SetPageSegMode_1 =
          b.asm.kd).apply(null, arguments);
      }),
      uf = (b._emscripten_bind_TessBaseAPI_GetPageSegMode_0 = function () {
        return (uf = b._emscripten_bind_TessBaseAPI_GetPageSegMode_0 =
          b.asm.ld).apply(null, arguments);
      }),
      vf = (b._emscripten_bind_TessBaseAPI_TesseractRect_7 = function () {
        return (vf = b._emscripten_bind_TessBaseAPI_TesseractRect_7 =
          b.asm.md).apply(null, arguments);
      }),
      wf = (b._emscripten_bind_TessBaseAPI_ClearAdaptiveClassifier_0 =
        function () {
          return (wf =
            b._emscripten_bind_TessBaseAPI_ClearAdaptiveClassifier_0 =
              b.asm.nd).apply(null, arguments);
        }),
      xf = (b._emscripten_bind_TessBaseAPI_SetImage_1 = function () {
        return (xf = b._emscripten_bind_TessBaseAPI_SetImage_1 =
          b.asm.od).apply(null, arguments);
      }),
      yf = (b._emscripten_bind_TessBaseAPI_SetImage_5 = function () {
        return (yf = b._emscripten_bind_TessBaseAPI_SetImage_5 =
          b.asm.pd).apply(null, arguments);
      }),
      zf = (b._emscripten_bind_TessBaseAPI_SetImageFile_1 = function () {
        return (zf = b._emscripten_bind_TessBaseAPI_SetImageFile_1 =
          b.asm.qd).apply(null, arguments);
      }),
      Af = (b._emscripten_bind_TessBaseAPI_SetSourceResolution_1 = function () {
        return (Af = b._emscripten_bind_TessBaseAPI_SetSourceResolution_1 =
          b.asm.rd).apply(null, arguments);
      }),
      Bf = (b._emscripten_bind_TessBaseAPI_SetRectangle_4 = function () {
        return (Bf = b._emscripten_bind_TessBaseAPI_SetRectangle_4 =
          b.asm.sd).apply(null, arguments);
      }),
      Cf = (b._emscripten_bind_TessBaseAPI_GetThresholdedImage_0 = function () {
        return (Cf = b._emscripten_bind_TessBaseAPI_GetThresholdedImage_0 =
          b.asm.td).apply(null, arguments);
      }),
      Df = (b._emscripten_bind_TessBaseAPI_WriteImage_0 = function () {
        return (Df = b._emscripten_bind_TessBaseAPI_WriteImage_0 =
          b.asm.ud).apply(null, arguments);
      }),
      Ef = (b._emscripten_bind_TessBaseAPI_FindLines_0 = function () {
        return (Ef = b._emscripten_bind_TessBaseAPI_FindLines_0 =
          b.asm.vd).apply(null, arguments);
      }),
      Ff = (b._emscripten_bind_TessBaseAPI_GetGradient_0 = function () {
        return (Ff = b._emscripten_bind_TessBaseAPI_GetGradient_0 =
          b.asm.wd).apply(null, arguments);
      }),
      Gf = (b._emscripten_bind_TessBaseAPI_GetRegions_1 = function () {
        return (Gf = b._emscripten_bind_TessBaseAPI_GetRegions_1 =
          b.asm.xd).apply(null, arguments);
      }),
      Hf = (b._emscripten_bind_TessBaseAPI_GetTextlines_2 = function () {
        return (Hf = b._emscripten_bind_TessBaseAPI_GetTextlines_2 =
          b.asm.yd).apply(null, arguments);
      }),
      If = (b._emscripten_bind_TessBaseAPI_GetTextlines_5 = function () {
        return (If = b._emscripten_bind_TessBaseAPI_GetTextlines_5 =
          b.asm.zd).apply(null, arguments);
      }),
      Jf = (b._emscripten_bind_TessBaseAPI_GetStrips_2 = function () {
        return (Jf = b._emscripten_bind_TessBaseAPI_GetStrips_2 =
          b.asm.Ad).apply(null, arguments);
      }),
      Kf = (b._emscripten_bind_TessBaseAPI_GetWords_1 = function () {
        return (Kf = b._emscripten_bind_TessBaseAPI_GetWords_1 =
          b.asm.Bd).apply(null, arguments);
      }),
      Lf = (b._emscripten_bind_TessBaseAPI_GetConnectedComponents_1 =
        function () {
          return (Lf = b._emscripten_bind_TessBaseAPI_GetConnectedComponents_1 =
            b.asm.Cd).apply(null, arguments);
        }),
      Mf = (b._emscripten_bind_TessBaseAPI_GetComponentImages_4 = function () {
        return (Mf = b._emscripten_bind_TessBaseAPI_GetComponentImages_4 =
          b.asm.Dd).apply(null, arguments);
      }),
      Nf = (b._emscripten_bind_TessBaseAPI_GetComponentImages_7 = function () {
        return (Nf = b._emscripten_bind_TessBaseAPI_GetComponentImages_7 =
          b.asm.Ed).apply(null, arguments);
      }),
      Of = (b._emscripten_bind_TessBaseAPI_GetThresholdedImageScaleFactor_0 =
        function () {
          return (Of =
            b._emscripten_bind_TessBaseAPI_GetThresholdedImageScaleFactor_0 =
              b.asm.Fd).apply(null, arguments);
        }),
      Pf = (b._emscripten_bind_TessBaseAPI_AnalyseLayout_0 = function () {
        return (Pf = b._emscripten_bind_TessBaseAPI_AnalyseLayout_0 =
          b.asm.Gd).apply(null, arguments);
      }),
      Qf = (b._emscripten_bind_TessBaseAPI_AnalyseLayout_1 = function () {
        return (Qf = b._emscripten_bind_TessBaseAPI_AnalyseLayout_1 =
          b.asm.Hd).apply(null, arguments);
      }),
      Rf = (b._emscripten_bind_TessBaseAPI_Recognize_1 = function () {
        return (Rf = b._emscripten_bind_TessBaseAPI_Recognize_1 =
          b.asm.Id).apply(null, arguments);
      }),
      Sf = (b._emscripten_bind_TessBaseAPI_ProcessPages_4 = function () {
        return (Sf = b._emscripten_bind_TessBaseAPI_ProcessPages_4 =
          b.asm.Jd).apply(null, arguments);
      }),
      Tf = (b._emscripten_bind_TessBaseAPI_ProcessPage_6 = function () {
        return (Tf = b._emscripten_bind_TessBaseAPI_ProcessPage_6 =
          b.asm.Kd).apply(null, arguments);
      }),
      Uf = (b._emscripten_bind_TessBaseAPI_GetIterator_0 = function () {
        return (Uf = b._emscripten_bind_TessBaseAPI_GetIterator_0 =
          b.asm.Ld).apply(null, arguments);
      }),
      Vf = (b._emscripten_bind_TessBaseAPI_GetUTF8Text_0 = function () {
        return (Vf = b._emscripten_bind_TessBaseAPI_GetUTF8Text_0 =
          b.asm.Md).apply(null, arguments);
      }),
      Wf = (b._emscripten_bind_TessBaseAPI_GetHOCRText_1 = function () {
        return (Wf = b._emscripten_bind_TessBaseAPI_GetHOCRText_1 =
          b.asm.Nd).apply(null, arguments);
      }),
      Xf = (b._emscripten_bind_TessBaseAPI_GetTSVText_1 = function () {
        return (Xf = b._emscripten_bind_TessBaseAPI_GetTSVText_1 =
          b.asm.Od).apply(null, arguments);
      }),
      Yf = (b._emscripten_bind_TessBaseAPI_GetBoxText_1 = function () {
        return (Yf = b._emscripten_bind_TessBaseAPI_GetBoxText_1 =
          b.asm.Pd).apply(null, arguments);
      }),
      Zf = (b._emscripten_bind_TessBaseAPI_GetUNLVText_0 = function () {
        return (Zf = b._emscripten_bind_TessBaseAPI_GetUNLVText_0 =
          b.asm.Qd).apply(null, arguments);
      }),
      $f = (b._emscripten_bind_TessBaseAPI_GetOsdText_1 = function () {
        return ($f = b._emscripten_bind_TessBaseAPI_GetOsdText_1 =
          b.asm.Rd).apply(null, arguments);
      }),
      ag = (b._emscripten_bind_TessBaseAPI_MeanTextConf_0 = function () {
        return (ag = b._emscripten_bind_TessBaseAPI_MeanTextConf_0 =
          b.asm.Sd).apply(null, arguments);
      }),
      bg = (b._emscripten_bind_TessBaseAPI_AllWordConfidences_0 = function () {
        return (bg = b._emscripten_bind_TessBaseAPI_AllWordConfidences_0 =
          b.asm.Td).apply(null, arguments);
      }),
      cg = (b._emscripten_bind_TessBaseAPI_Clear_0 = function () {
        return (cg = b._emscripten_bind_TessBaseAPI_Clear_0 = b.asm.Ud).apply(
          null,
          arguments,
        );
      }),
      dg = (b._emscripten_bind_TessBaseAPI_End_0 = function () {
        return (dg = b._emscripten_bind_TessBaseAPI_End_0 = b.asm.Vd).apply(
          null,
          arguments,
        );
      }),
      eg = (b._emscripten_bind_TessBaseAPI_ClearPersistentCache_0 =
        function () {
          return (eg = b._emscripten_bind_TessBaseAPI_ClearPersistentCache_0 =
            b.asm.Wd).apply(null, arguments);
        }),
      fg = (b._emscripten_bind_TessBaseAPI_IsValidWord_1 = function () {
        return (fg = b._emscripten_bind_TessBaseAPI_IsValidWord_1 =
          b.asm.Xd).apply(null, arguments);
      }),
      gg = (b._emscripten_bind_TessBaseAPI_IsValidCharacter_1 = function () {
        return (gg = b._emscripten_bind_TessBaseAPI_IsValidCharacter_1 =
          b.asm.Yd).apply(null, arguments);
      }),
      hg = (b._emscripten_bind_TessBaseAPI_DetectOS_1 = function () {
        return (hg = b._emscripten_bind_TessBaseAPI_DetectOS_1 =
          b.asm.Zd).apply(null, arguments);
      }),
      ig = (b._emscripten_bind_TessBaseAPI_GetUnichar_1 = function () {
        return (ig = b._emscripten_bind_TessBaseAPI_GetUnichar_1 =
          b.asm._d).apply(null, arguments);
      }),
      jg = (b._emscripten_bind_TessBaseAPI_GetDawg_1 = function () {
        return (jg = b._emscripten_bind_TessBaseAPI_GetDawg_1 = b.asm.$d).apply(
          null,
          arguments,
        );
      }),
      kg = (b._emscripten_bind_TessBaseAPI_NumDawgs_0 = function () {
        return (kg = b._emscripten_bind_TessBaseAPI_NumDawgs_0 =
          b.asm.ae).apply(null, arguments);
      }),
      lg = (b._emscripten_bind_TessBaseAPI_oem_0 = function () {
        return (lg = b._emscripten_bind_TessBaseAPI_oem_0 = b.asm.be).apply(
          null,
          arguments,
        );
      }),
      mg = (b._emscripten_bind_TessBaseAPI___destroy___0 = function () {
        return (mg = b._emscripten_bind_TessBaseAPI___destroy___0 =
          b.asm.ce).apply(null, arguments);
      }),
      ng = (b._emscripten_bind_OSResults_OSResults_0 = function () {
        return (ng = b._emscripten_bind_OSResults_OSResults_0 = b.asm.de).apply(
          null,
          arguments,
        );
      }),
      og = (b._emscripten_bind_OSResults_print_scores_0 = function () {
        return (og = b._emscripten_bind_OSResults_print_scores_0 =
          b.asm.ee).apply(null, arguments);
      }),
      pg = (b._emscripten_bind_OSResults_get_best_result_0 = function () {
        return (pg = b._emscripten_bind_OSResults_get_best_result_0 =
          b.asm.fe).apply(null, arguments);
      }),
      qg = (b._emscripten_bind_OSResults_get_unicharset_0 = function () {
        return (qg = b._emscripten_bind_OSResults_get_unicharset_0 =
          b.asm.ge).apply(null, arguments);
      }),
      rg = (b._emscripten_bind_OSResults___destroy___0 = function () {
        return (rg = b._emscripten_bind_OSResults___destroy___0 =
          b.asm.he).apply(null, arguments);
      }),
      sg = (b._emscripten_bind_Pixa_get_n_0 = function () {
        return (sg = b._emscripten_bind_Pixa_get_n_0 = b.asm.ie).apply(
          null,
          arguments,
        );
      }),
      tg = (b._emscripten_bind_Pixa_get_nalloc_0 = function () {
        return (tg = b._emscripten_bind_Pixa_get_nalloc_0 = b.asm.je).apply(
          null,
          arguments,
        );
      }),
      ug = (b._emscripten_bind_Pixa_get_refcount_0 = function () {
        return (ug = b._emscripten_bind_Pixa_get_refcount_0 = b.asm.ke).apply(
          null,
          arguments,
        );
      }),
      vg = (b._emscripten_bind_Pixa_get_pix_0 = function () {
        return (vg = b._emscripten_bind_Pixa_get_pix_0 = b.asm.le).apply(
          null,
          arguments,
        );
      }),
      wg = (b._emscripten_bind_Pixa_get_boxa_0 = function () {
        return (wg = b._emscripten_bind_Pixa_get_boxa_0 = b.asm.me).apply(
          null,
          arguments,
        );
      }),
      xg = (b._emscripten_bind_Pixa___destroy___0 = function () {
        return (xg = b._emscripten_bind_Pixa___destroy___0 = b.asm.ne).apply(
          null,
          arguments,
        );
      }),
      yg = (b._emscripten_enum_PageIteratorLevel_RIL_BLOCK = function () {
        return (yg = b._emscripten_enum_PageIteratorLevel_RIL_BLOCK =
          b.asm.oe).apply(null, arguments);
      }),
      zg = (b._emscripten_enum_PageIteratorLevel_RIL_PARA = function () {
        return (zg = b._emscripten_enum_PageIteratorLevel_RIL_PARA =
          b.asm.pe).apply(null, arguments);
      }),
      Ag = (b._emscripten_enum_PageIteratorLevel_RIL_TEXTLINE = function () {
        return (Ag = b._emscripten_enum_PageIteratorLevel_RIL_TEXTLINE =
          b.asm.qe).apply(null, arguments);
      }),
      Bg = (b._emscripten_enum_PageIteratorLevel_RIL_WORD = function () {
        return (Bg = b._emscripten_enum_PageIteratorLevel_RIL_WORD =
          b.asm.re).apply(null, arguments);
      }),
      Cg = (b._emscripten_enum_PageIteratorLevel_RIL_SYMBOL = function () {
        return (Cg = b._emscripten_enum_PageIteratorLevel_RIL_SYMBOL =
          b.asm.se).apply(null, arguments);
      }),
      Dg = (b._emscripten_enum_OcrEngineMode_OEM_TESSERACT_ONLY = function () {
        return (Dg = b._emscripten_enum_OcrEngineMode_OEM_TESSERACT_ONLY =
          b.asm.te).apply(null, arguments);
      }),
      Eg = (b._emscripten_enum_OcrEngineMode_OEM_LSTM_ONLY = function () {
        return (Eg = b._emscripten_enum_OcrEngineMode_OEM_LSTM_ONLY =
          b.asm.ue).apply(null, arguments);
      }),
      Fg = (b._emscripten_enum_OcrEngineMode_OEM_TESSERACT_LSTM_COMBINED =
        function () {
          return (Fg =
            b._emscripten_enum_OcrEngineMode_OEM_TESSERACT_LSTM_COMBINED =
              b.asm.ve).apply(null, arguments);
        }),
      Gg = (b._emscripten_enum_OcrEngineMode_OEM_DEFAULT = function () {
        return (Gg = b._emscripten_enum_OcrEngineMode_OEM_DEFAULT =
          b.asm.we).apply(null, arguments);
      }),
      Hg = (b._emscripten_enum_OcrEngineMode_OEM_COUNT = function () {
        return (Hg = b._emscripten_enum_OcrEngineMode_OEM_COUNT =
          b.asm.xe).apply(null, arguments);
      }),
      Ig =
        (b._emscripten_enum_WritingDirection__WRITING_DIRECTION_LEFT_TO_RIGHT =
          function () {
            return (Ig =
              b._emscripten_enum_WritingDirection__WRITING_DIRECTION_LEFT_TO_RIGHT =
                b.asm.ye).apply(null, arguments);
          }),
      Jg =
        (b._emscripten_enum_WritingDirection__WRITING_DIRECTION_RIGHT_TO_LEFT =
          function () {
            return (Jg =
              b._emscripten_enum_WritingDirection__WRITING_DIRECTION_RIGHT_TO_LEFT =
                b.asm.ze).apply(null, arguments);
          }),
      Kg =
        (b._emscripten_enum_WritingDirection__WRITING_DIRECTION_TOP_TO_BOTTOM =
          function () {
            return (Kg =
              b._emscripten_enum_WritingDirection__WRITING_DIRECTION_TOP_TO_BOTTOM =
                b.asm.Ae).apply(null, arguments);
          }),
      Lg = (b._emscripten_enum_PolyBlockType_PT_UNKNOWN = function () {
        return (Lg = b._emscripten_enum_PolyBlockType_PT_UNKNOWN =
          b.asm.Be).apply(null, arguments);
      }),
      Mg = (b._emscripten_enum_PolyBlockType_PT_FLOWING_TEXT = function () {
        return (Mg = b._emscripten_enum_PolyBlockType_PT_FLOWING_TEXT =
          b.asm.Ce).apply(null, arguments);
      }),
      Ng = (b._emscripten_enum_PolyBlockType_PT_HEADING_TEXT = function () {
        return (Ng = b._emscripten_enum_PolyBlockType_PT_HEADING_TEXT =
          b.asm.De).apply(null, arguments);
      }),
      Og = (b._emscripten_enum_PolyBlockType_PT_PULLOUT_TEXT = function () {
        return (Og = b._emscripten_enum_PolyBlockType_PT_PULLOUT_TEXT =
          b.asm.Ee).apply(null, arguments);
      }),
      Pg = (b._emscripten_enum_PolyBlockType_PT_EQUATION = function () {
        return (Pg = b._emscripten_enum_PolyBlockType_PT_EQUATION =
          b.asm.Fe).apply(null, arguments);
      }),
      Qg = (b._emscripten_enum_PolyBlockType_PT_INLINE_EQUATION = function () {
        return (Qg = b._emscripten_enum_PolyBlockType_PT_INLINE_EQUATION =
          b.asm.Ge).apply(null, arguments);
      }),
      Rg = (b._emscripten_enum_PolyBlockType_PT_TABLE = function () {
        return (Rg = b._emscripten_enum_PolyBlockType_PT_TABLE =
          b.asm.He).apply(null, arguments);
      }),
      Sg = (b._emscripten_enum_PolyBlockType_PT_VERTICAL_TEXT = function () {
        return (Sg = b._emscripten_enum_PolyBlockType_PT_VERTICAL_TEXT =
          b.asm.Ie).apply(null, arguments);
      }),
      Tg = (b._emscripten_enum_PolyBlockType_PT_CAPTION_TEXT = function () {
        return (Tg = b._emscripten_enum_PolyBlockType_PT_CAPTION_TEXT =
          b.asm.Je).apply(null, arguments);
      }),
      Ug = (b._emscripten_enum_PolyBlockType_PT_FLOWING_IMAGE = function () {
        return (Ug = b._emscripten_enum_PolyBlockType_PT_FLOWING_IMAGE =
          b.asm.Ke).apply(null, arguments);
      }),
      Vg = (b._emscripten_enum_PolyBlockType_PT_HEADING_IMAGE = function () {
        return (Vg = b._emscripten_enum_PolyBlockType_PT_HEADING_IMAGE =
          b.asm.Le).apply(null, arguments);
      }),
      Wg = (b._emscripten_enum_PolyBlockType_PT_PULLOUT_IMAGE = function () {
        return (Wg = b._emscripten_enum_PolyBlockType_PT_PULLOUT_IMAGE =
          b.asm.Me).apply(null, arguments);
      }),
      Xg = (b._emscripten_enum_PolyBlockType_PT_HORZ_LINE = function () {
        return (Xg = b._emscripten_enum_PolyBlockType_PT_HORZ_LINE =
          b.asm.Ne).apply(null, arguments);
      }),
      Yg = (b._emscripten_enum_PolyBlockType_PT_VERT_LINE = function () {
        return (Yg = b._emscripten_enum_PolyBlockType_PT_VERT_LINE =
          b.asm.Oe).apply(null, arguments);
      }),
      Zg = (b._emscripten_enum_PolyBlockType_PT_NOISE = function () {
        return (Zg = b._emscripten_enum_PolyBlockType_PT_NOISE =
          b.asm.Pe).apply(null, arguments);
      }),
      $g = (b._emscripten_enum_PolyBlockType_PT_COUNT = function () {
        return ($g = b._emscripten_enum_PolyBlockType_PT_COUNT =
          b.asm.Qe).apply(null, arguments);
      }),
      ah = (b._emscripten_enum_StrongScriptDirection_DIR_NEUTRAL = function () {
        return (ah = b._emscripten_enum_StrongScriptDirection_DIR_NEUTRAL =
          b.asm.Re).apply(null, arguments);
      }),
      bh = (b._emscripten_enum_StrongScriptDirection_DIR_LEFT_TO_RIGHT =
        function () {
          return (bh =
            b._emscripten_enum_StrongScriptDirection_DIR_LEFT_TO_RIGHT =
              b.asm.Se).apply(null, arguments);
        }),
      ch = (b._emscripten_enum_StrongScriptDirection_DIR_RIGHT_TO_LEFT =
        function () {
          return (ch =
            b._emscripten_enum_StrongScriptDirection_DIR_RIGHT_TO_LEFT =
              b.asm.Te).apply(null, arguments);
        }),
      dh = (b._emscripten_enum_StrongScriptDirection_DIR_MIX = function () {
        return (dh = b._emscripten_enum_StrongScriptDirection_DIR_MIX =
          b.asm.Ue).apply(null, arguments);
      }),
      eh = (b._emscripten_enum_ParagraphJustification__JUSTIFICATION_UNKNOWN =
        function () {
          return (eh =
            b._emscripten_enum_ParagraphJustification__JUSTIFICATION_UNKNOWN =
              b.asm.Ve).apply(null, arguments);
        }),
      fh = (b._emscripten_enum_ParagraphJustification__JUSTIFICATION_LEFT =
        function () {
          return (fh =
            b._emscripten_enum_ParagraphJustification__JUSTIFICATION_LEFT =
              b.asm.We).apply(null, arguments);
        }),
      gh = (b._emscripten_enum_ParagraphJustification__JUSTIFICATION_CENTER =
        function () {
          return (gh =
            b._emscripten_enum_ParagraphJustification__JUSTIFICATION_CENTER =
              b.asm.Xe).apply(null, arguments);
        }),
      hh = (b._emscripten_enum_ParagraphJustification__JUSTIFICATION_RIGHT =
        function () {
          return (hh =
            b._emscripten_enum_ParagraphJustification__JUSTIFICATION_RIGHT =
              b.asm.Ye).apply(null, arguments);
        }),
      ih = (b._emscripten_enum_TextlineOrder__TEXTLINE_ORDER_LEFT_TO_RIGHT =
        function () {
          return (ih =
            b._emscripten_enum_TextlineOrder__TEXTLINE_ORDER_LEFT_TO_RIGHT =
              b.asm.Ze).apply(null, arguments);
        }),
      jh = (b._emscripten_enum_TextlineOrder__TEXTLINE_ORDER_RIGHT_TO_LEFT =
        function () {
          return (jh =
            b._emscripten_enum_TextlineOrder__TEXTLINE_ORDER_RIGHT_TO_LEFT =
              b.asm._e).apply(null, arguments);
        }),
      kh = (b._emscripten_enum_TextlineOrder__TEXTLINE_ORDER_TOP_TO_BOTTOM =
        function () {
          return (kh =
            b._emscripten_enum_TextlineOrder__TEXTLINE_ORDER_TOP_TO_BOTTOM =
              b.asm.$e).apply(null, arguments);
        }),
      lh = (b._emscripten_enum_Orientation__ORIENTATION_PAGE_UP = function () {
        return (lh = b._emscripten_enum_Orientation__ORIENTATION_PAGE_UP =
          b.asm.af).apply(null, arguments);
      }),
      mh = (b._emscripten_enum_Orientation__ORIENTATION_PAGE_RIGHT =
        function () {
          return (mh = b._emscripten_enum_Orientation__ORIENTATION_PAGE_RIGHT =
            b.asm.bf).apply(null, arguments);
        }),
      nh = (b._emscripten_enum_Orientation__ORIENTATION_PAGE_DOWN =
        function () {
          return (nh = b._emscripten_enum_Orientation__ORIENTATION_PAGE_DOWN =
            b.asm.cf).apply(null, arguments);
        }),
      oh = (b._emscripten_enum_Orientation__ORIENTATION_PAGE_LEFT =
        function () {
          return (oh = b._emscripten_enum_Orientation__ORIENTATION_PAGE_LEFT =
            b.asm.df).apply(null, arguments);
        }),
      ph = (b._emscripten_enum_PageSegMode_PSM_OSD_ONLY = function () {
        return (ph = b._emscripten_enum_PageSegMode_PSM_OSD_ONLY =
          b.asm.ef).apply(null, arguments);
      }),
      qh = (b._emscripten_enum_PageSegMode_PSM_AUTO_OSD = function () {
        return (qh = b._emscripten_enum_PageSegMode_PSM_AUTO_OSD =
          b.asm.ff).apply(null, arguments);
      }),
      rh = (b._emscripten_enum_PageSegMode_PSM_AUTO_ONLY = function () {
        return (rh = b._emscripten_enum_PageSegMode_PSM_AUTO_ONLY =
          b.asm.gf).apply(null, arguments);
      }),
      sh = (b._emscripten_enum_PageSegMode_PSM_AUTO = function () {
        return (sh = b._emscripten_enum_PageSegMode_PSM_AUTO = b.asm.hf).apply(
          null,
          arguments,
        );
      }),
      th = (b._emscripten_enum_PageSegMode_PSM_SINGLE_COLUMN = function () {
        return (th = b._emscripten_enum_PageSegMode_PSM_SINGLE_COLUMN =
          b.asm.jf).apply(null, arguments);
      }),
      uh = (b._emscripten_enum_PageSegMode_PSM_SINGLE_BLOCK_VERT_TEXT =
        function () {
          return (uh =
            b._emscripten_enum_PageSegMode_PSM_SINGLE_BLOCK_VERT_TEXT =
              b.asm.kf).apply(null, arguments);
        }),
      vh = (b._emscripten_enum_PageSegMode_PSM_SINGLE_BLOCK = function () {
        return (vh = b._emscripten_enum_PageSegMode_PSM_SINGLE_BLOCK =
          b.asm.lf).apply(null, arguments);
      }),
      wh = (b._emscripten_enum_PageSegMode_PSM_SINGLE_LINE = function () {
        return (wh = b._emscripten_enum_PageSegMode_PSM_SINGLE_LINE =
          b.asm.mf).apply(null, arguments);
      }),
      xh = (b._emscripten_enum_PageSegMode_PSM_SINGLE_WORD = function () {
        return (xh = b._emscripten_enum_PageSegMode_PSM_SINGLE_WORD =
          b.asm.nf).apply(null, arguments);
      }),
      yh = (b._emscripten_enum_PageSegMode_PSM_CIRCLE_WORD = function () {
        return (yh = b._emscripten_enum_PageSegMode_PSM_CIRCLE_WORD =
          b.asm.of).apply(null, arguments);
      }),
      zh = (b._emscripten_enum_PageSegMode_PSM_SINGLE_CHAR = function () {
        return (zh = b._emscripten_enum_PageSegMode_PSM_SINGLE_CHAR =
          b.asm.pf).apply(null, arguments);
      }),
      Ah = (b._emscripten_enum_PageSegMode_PSM_SPARSE_TEXT = function () {
        return (Ah = b._emscripten_enum_PageSegMode_PSM_SPARSE_TEXT =
          b.asm.qf).apply(null, arguments);
      }),
      Bh = (b._emscripten_enum_PageSegMode_PSM_SPARSE_TEXT_OSD = function () {
        return (Bh = b._emscripten_enum_PageSegMode_PSM_SPARSE_TEXT_OSD =
          b.asm.rf).apply(null, arguments);
      }),
      Ch = (b._emscripten_enum_PageSegMode_PSM_RAW_LINE = function () {
        return (Ch = b._emscripten_enum_PageSegMode_PSM_RAW_LINE =
          b.asm.sf).apply(null, arguments);
      }),
      Dh = (b._emscripten_enum_PageSegMode_PSM_COUNT = function () {
        return (Dh = b._emscripten_enum_PageSegMode_PSM_COUNT = b.asm.tf).apply(
          null,
          arguments,
        );
      });
    b._pixDestroy = function () {
      return (b._pixDestroy = b.asm.vf).apply(null, arguments);
    };
    b._ptaDestroy = function () {
      return (b._ptaDestroy = b.asm.wf).apply(null, arguments);
    };
    b._boxaDestroy = function () {
      return (b._boxaDestroy = b.asm.xf).apply(null, arguments);
    };
    b._pixaDestroy = function () {
      return (b._pixaDestroy = b.asm.yf).apply(null, arguments);
    };
    b._pixReadMem = function () {
      return (b._pixReadMem = b.asm.zf).apply(null, arguments);
    };
    function Qb() {
      return (Qb = b.asm.Af).apply(null, arguments);
    }
    var Eh = (b._free = function () {
        return (Eh = b._free = b.asm.Bf).apply(null, arguments);
      }),
      Eb = (b._malloc = function () {
        return (Eb = b._malloc = b.asm.Cf).apply(null, arguments);
      });
    b._pixReadHeaderMem = function () {
      return (b._pixReadHeaderMem = b.asm.Df).apply(null, arguments);
    };
    function D() {
      return (D = b.asm.Ef).apply(null, arguments);
    }
    function Fh() {
      return (Fh = b.asm.Ff).apply(null, arguments);
    }
    b.___emscripten_embedded_file_data = 392368;
    function Tb(a, c, d, e) {
      var g = D();
      try {
        return Ob(a)(c, d, e);
      } catch (h) {
        Fh(g);
        if (h !== h + 0) throw h;
        yb();
      }
    }
    function Wb(a, c) {
      var d = D();
      try {
        Ob(a)(c);
      } catch (e) {
        Fh(d);
        if (e !== e + 0) throw e;
        yb();
      }
    }
    function Rb(a, c) {
      var d = D();
      try {
        return Ob(a)(c);
      } catch (e) {
        Fh(d);
        if (e !== e + 0) throw e;
        yb();
      }
    }
    function Yb(a, c, d, e) {
      var g = D();
      try {
        Ob(a)(c, d, e);
      } catch (h) {
        Fh(g);
        if (h !== h + 0) throw h;
        yb();
      }
    }
    function Xb(a, c, d) {
      var e = D();
      try {
        Ob(a)(c, d);
      } catch (g) {
        Fh(e);
        if (g !== g + 0) throw g;
        yb();
      }
    }
    function Sb(a, c, d) {
      var e = D();
      try {
        return Ob(a)(c, d);
      } catch (g) {
        Fh(e);
        if (g !== g + 0) throw g;
        yb();
      }
    }
    function Ub(a, c, d, e, g) {
      var h = D();
      try {
        return Ob(a)(c, d, e, g);
      } catch (k) {
        Fh(h);
        if (k !== k + 0) throw k;
        yb();
      }
    }
    function Zb(a, c, d, e, g) {
      var h = D();
      try {
        Ob(a)(c, d, e, g);
      } catch (k) {
        Fh(h);
        if (k !== k + 0) throw k;
        yb();
      }
    }
    function Vb(a, c, d, e, g, h) {
      var k = D();
      try {
        return Ob(a)(c, d, e, g, h);
      } catch (m) {
        Fh(k);
        if (m !== m + 0) throw m;
        yb();
      }
    }
    function ac(a, c, d, e, g, h, k, m, v, q) {
      var t = D();
      try {
        Ob(a)(c, d, e, g, h, k, m, v, q);
      } catch (F) {
        Fh(t);
        if (F !== F + 0) throw F;
        yb();
      }
    }
    function $b(a, c, d, e, g, h) {
      var k = D();
      try {
        Ob(a)(c, d, e, g, h);
      } catch (m) {
        Fh(k);
        if (m !== m + 0) throw m;
        yb();
      }
    }
    b.addRunDependency = Ga;
    b.removeRunDependency = Ha;
    b.FS_createPath = B.Hg;
    b.FS_createDataFile = B.yg;
    b.FS_createLazyFile = B.fh;
    b.FS_createDevice = B.Uf;
    b.FS_unlink = B.unlink;
    b.setValue = Xa;
    b.getValue = Wa;
    b.FS_createPreloadedFile = B.gh;
    b.FS = B;
    var Gh;
    Fa = function Hh() {
      Gh || Ih();
      Gh || (Fa = Hh);
    };
    function Ih() {
      function a() {
        if (!Gh && ((Gh = !0), (b.calledRun = !0), !ra)) {
          Ba = !0;
          b.noFSInit || B.gg.Sg || B.gg();
          B.sh = !1;
          Ra(za);
          aa(b);
          if (b.onRuntimeInitialized) b.onRuntimeInitialized();
          if (b.postRun)
            for (
              "function" == typeof b.postRun && (b.postRun = [b.postRun]);
              b.postRun.length;

            ) {
              var c = b.postRun.shift();
              Aa.unshift(c);
            }
          Ra(Aa);
        }
      }
      if (!(0 < Da)) {
        if (b.preRun)
          for (
            "function" == typeof b.preRun && (b.preRun = [b.preRun]);
            b.preRun.length;

          )
            Ca();
        Ra(ya);
        0 < Da ||
          (b.setStatus
            ? (b.setStatus("Running..."),
              setTimeout(function () {
                setTimeout(function () {
                  b.setStatus("");
                }, 1);
                a();
              }, 1))
            : a());
      }
    }
    if (b.preInit)
      for (
        "function" == typeof b.preInit && (b.preInit = [b.preInit]);
        0 < b.preInit.length;

      )
        b.preInit.pop()();
    Ih();
    function G() {}
    G.prototype = Object.create(G.prototype);
    G.prototype.constructor = G;
    G.prototype.Lf = G;
    G.Mf = {};
    b.WrapperObject = G;
    function Jh(a) {
      return (a || G).Mf;
    }
    b.getCache = Jh;
    function H(a, c) {
      var d = Jh(c),
        e = d[a];
      if (e) return e;
      e = Object.create((c || G).prototype);
      e.Gf = a;
      return (d[a] = e);
    }
    b.wrapPointer = H;
    b.castObject = function (a, c) {
      return H(a.Gf, c);
    };
    b.NULL = H(0);
    b.destroy = function (a) {
      if (!a.__destroy__)
        throw "Error: Cannot destroy object. (Did you create it yourself?)";
      a.__destroy__();
      delete Jh(a.Lf)[a.Gf];
    };
    b.compare = function (a, c) {
      return a.Gf === c.Gf;
    };
    b.getPointer = function (a) {
      return a.Gf;
    };
    b.getClass = function (a) {
      return a.Lf;
    };
    var Kh = 0,
      Lh = 0,
      Mh = 0,
      Nh = [],
      Oh = 0;
    function I() {
      if (Oh) {
        for (var a = 0; a < Nh.length; a++) b._free(Nh[a]);
        Nh.length = 0;
        b._free(Kh);
        Kh = 0;
        Lh += Oh;
        Oh = 0;
      }
      Kh || ((Lh += 128), (Kh = b._malloc(Lh)) || p());
      Mh = 0;
    }
    function J(a) {
      if ("string" === typeof a) {
        a = jb(a);
        var c = r;
        Kh || p();
        c = a.length * c.BYTES_PER_ELEMENT;
        c = (c + 7) & -8;
        if (Mh + c >= Lh) {
          0 < c || p();
          Oh += c;
          var d = b._malloc(c);
          Nh.push(d);
        } else ((d = Kh + Mh), (Mh += c));
        c = d;
        d = r;
        var e = c;
        switch (d.BYTES_PER_ELEMENT) {
          case 2:
            e >>= 1;
            break;
          case 4:
            e >>= 2;
            break;
          case 8:
            e >>= 3;
        }
        for (var g = 0; g < a.length; g++) d[e + g] = a[g];
        return c;
      }
      return a;
    }
    function Ph() {
      throw "cannot construct a ParagraphJustification, no constructor in IDL";
    }
    Ph.prototype = Object.create(G.prototype);
    Ph.prototype.constructor = Ph;
    Ph.prototype.Lf = Ph;
    Ph.Mf = {};
    b.ParagraphJustification = Ph;
    Ph.prototype.__destroy__ = function () {
      cc(this.Gf);
    };
    function Qh() {
      throw "cannot construct a BoolPtr, no constructor in IDL";
    }
    Qh.prototype = Object.create(G.prototype);
    Qh.prototype.constructor = Qh;
    Qh.prototype.Lf = Qh;
    Qh.Mf = {};
    b.BoolPtr = Qh;
    Qh.prototype.__destroy__ = function () {
      dc(this.Gf);
    };
    function K() {
      throw "cannot construct a TessResultRenderer, no constructor in IDL";
    }
    K.prototype = Object.create(G.prototype);
    K.prototype.constructor = K;
    K.prototype.Lf = K;
    K.Mf = {};
    b.TessResultRenderer = K;
    K.prototype.BeginDocument = function (a) {
      var c = this.Gf;
      I();
      a = a && "object" === typeof a ? a.Gf : J(a);
      return !!ec(c, a);
    };
    K.prototype.AddImage = function (a) {
      var c = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      return !!fc(c, a);
    };
    K.prototype.EndDocument = function () {
      return !!gc(this.Gf);
    };
    K.prototype.happy = function () {
      return !!hc(this.Gf);
    };
    K.prototype.file_extension = function () {
      return A(ic(this.Gf));
    };
    K.prototype.title = K.prototype.title = function () {
      return A(jc(this.Gf));
    };
    K.prototype.imagenum = function () {
      return kc(this.Gf);
    };
    K.prototype.__destroy__ = function () {
      lc(this.Gf);
    };
    function Rh() {
      throw "cannot construct a LongStarPtr, no constructor in IDL";
    }
    Rh.prototype = Object.create(G.prototype);
    Rh.prototype.constructor = Rh;
    Rh.prototype.Lf = Rh;
    Rh.Mf = {};
    b.LongStarPtr = Rh;
    Rh.prototype.__destroy__ = function () {
      mc(this.Gf);
    };
    function Sh() {
      throw "cannot construct a VoidPtr, no constructor in IDL";
    }
    Sh.prototype = Object.create(G.prototype);
    Sh.prototype.constructor = Sh;
    Sh.prototype.Lf = Sh;
    Sh.Mf = {};
    b.VoidPtr = Sh;
    Sh.prototype.__destroy__ = function () {
      nc(this.Gf);
    };
    function L(a) {
      a && "object" === typeof a && (a = a.Gf);
      this.Gf = oc(a);
      Jh(L)[this.Gf] = this;
    }
    L.prototype = Object.create(G.prototype);
    L.prototype.constructor = L;
    L.prototype.Lf = L;
    L.Mf = {};
    b.ResultIterator = L;
    L.prototype.Begin = function () {
      pc(this.Gf);
    };
    L.prototype.RestartParagraph = function () {
      qc(this.Gf);
    };
    L.prototype.IsWithinFirstTextlineOfParagraph = function () {
      return !!rc(this.Gf);
    };
    L.prototype.RestartRow = function () {
      sc(this.Gf);
    };
    L.prototype.Next = function (a) {
      var c = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      return !!tc(c, a);
    };
    L.prototype.IsAtBeginningOf = function (a) {
      var c = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      return !!uc(c, a);
    };
    L.prototype.IsAtFinalElement = function (a, c) {
      var d = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      c && "object" === typeof c && (c = c.Gf);
      return !!vc(d, a, c);
    };
    L.prototype.Cmp = function (a) {
      var c = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      return wc(c, a);
    };
    L.prototype.SetBoundingBoxComponents = function (a, c) {
      var d = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      c && "object" === typeof c && (c = c.Gf);
      xc(d, a, c);
    };
    L.prototype.BoundingBox = function (a, c, d, e, g, h) {
      var k = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      c && "object" === typeof c && (c = c.Gf);
      d && "object" === typeof d && (d = d.Gf);
      e && "object" === typeof e && (e = e.Gf);
      g && "object" === typeof g && (g = g.Gf);
      h && "object" === typeof h && (h = h.Gf);
      return void 0 === h ? !!yc(k, a, c, d, e, g) : !!zc(k, a, c, d, e, g, h);
    };
    L.prototype.BoundingBoxInternal = function (a, c, d, e, g) {
      var h = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      c && "object" === typeof c && (c = c.Gf);
      d && "object" === typeof d && (d = d.Gf);
      e && "object" === typeof e && (e = e.Gf);
      g && "object" === typeof g && (g = g.Gf);
      return !!Ac(h, a, c, d, e, g);
    };
    L.prototype.Empty = function (a) {
      var c = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      return !!Bc(c, a);
    };
    L.prototype.BlockType = function () {
      return Cc(this.Gf);
    };
    L.prototype.BlockPolygon = function () {
      return H(Dc(this.Gf), M);
    };
    L.prototype.GetBinaryImage = function (a) {
      var c = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      return H(Ec(c, a), N);
    };
    L.prototype.GetImage = function (a, c, d, e, g) {
      var h = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      c && "object" === typeof c && (c = c.Gf);
      d && "object" === typeof d && (d = d.Gf);
      e && "object" === typeof e && (e = e.Gf);
      g && "object" === typeof g && (g = g.Gf);
      return H(Fc(h, a, c, d, e, g), N);
    };
    L.prototype.Baseline = function (a, c, d, e, g) {
      var h = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      c && "object" === typeof c && (c = c.Gf);
      d && "object" === typeof d && (d = d.Gf);
      e && "object" === typeof e && (e = e.Gf);
      g && "object" === typeof g && (g = g.Gf);
      return !!Gc(h, a, c, d, e, g);
    };
    L.prototype.RowAttributes = function (a, c, d) {
      var e = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      c && "object" === typeof c && (c = c.Gf);
      d && "object" === typeof d && (d = d.Gf);
      return !!Hc(e, a, c, d);
    };
    L.prototype.Orientation = function (a, c, d, e) {
      var g = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      c && "object" === typeof c && (c = c.Gf);
      d && "object" === typeof d && (d = d.Gf);
      e && "object" === typeof e && (e = e.Gf);
      Ic(g, a, c, d, e);
    };
    L.prototype.ParagraphInfo = function (a, c, d, e) {
      var g = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      c && "object" === typeof c && (c = c.Gf);
      d && "object" === typeof d && (d = d.Gf);
      e && "object" === typeof e && (e = e.Gf);
      Jc(g, a, c, d, e);
    };
    L.prototype.ParagraphIsLtr = function () {
      return !!Kc(this.Gf);
    };
    L.prototype.GetUTF8Text = function (a) {
      var c = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      return A(Lc(c, a));
    };
    L.prototype.SetLineSeparator = function (a) {
      var c = this.Gf;
      I();
      a = a && "object" === typeof a ? a.Gf : J(a);
      Mc(c, a);
    };
    L.prototype.SetParagraphSeparator = function (a) {
      var c = this.Gf;
      I();
      a = a && "object" === typeof a ? a.Gf : J(a);
      Nc(c, a);
    };
    L.prototype.Confidence = function (a) {
      var c = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      return Oc(c, a);
    };
    L.prototype.WordFontAttributes = function (a, c, d, e, g, h, k, m) {
      var v = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      c && "object" === typeof c && (c = c.Gf);
      d && "object" === typeof d && (d = d.Gf);
      e && "object" === typeof e && (e = e.Gf);
      g && "object" === typeof g && (g = g.Gf);
      h && "object" === typeof h && (h = h.Gf);
      k && "object" === typeof k && (k = k.Gf);
      m && "object" === typeof m && (m = m.Gf);
      return A(Pc(v, a, c, d, e, g, h, k, m));
    };
    L.prototype.WordRecognitionLanguage = function () {
      return A(Qc(this.Gf));
    };
    L.prototype.WordDirection = function () {
      return Rc(this.Gf);
    };
    L.prototype.WordIsFromDictionary = function () {
      return !!Sc(this.Gf);
    };
    L.prototype.WordIsNumeric = function () {
      return !!Tc(this.Gf);
    };
    L.prototype.HasBlamerInfo = function () {
      return !!Uc(this.Gf);
    };
    L.prototype.HasTruthString = function () {
      return !!Vc(this.Gf);
    };
    L.prototype.EquivalentToTruth = function (a) {
      var c = this.Gf;
      I();
      a = a && "object" === typeof a ? a.Gf : J(a);
      return !!Wc(c, a);
    };
    L.prototype.WordTruthUTF8Text = function () {
      return A(Xc(this.Gf));
    };
    L.prototype.WordNormedUTF8Text = function () {
      return A(Yc(this.Gf));
    };
    L.prototype.WordLattice = function (a) {
      var c = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      return A(Zc(c, a));
    };
    L.prototype.SymbolIsSuperscript = function () {
      return !!$c(this.Gf);
    };
    L.prototype.SymbolIsSubscript = function () {
      return !!ad(this.Gf);
    };
    L.prototype.SymbolIsDropcap = function () {
      return !!bd(this.Gf);
    };
    L.prototype.__destroy__ = function () {
      cd(this.Gf);
    };
    function Uh() {
      throw "cannot construct a TextlineOrder, no constructor in IDL";
    }
    Uh.prototype = Object.create(G.prototype);
    Uh.prototype.constructor = Uh;
    Uh.prototype.Lf = Uh;
    Uh.Mf = {};
    b.TextlineOrder = Uh;
    Uh.prototype.__destroy__ = function () {
      dd(this.Gf);
    };
    function Vh() {
      throw "cannot construct a ETEXT_DESC, no constructor in IDL";
    }
    Vh.prototype = Object.create(G.prototype);
    Vh.prototype.constructor = Vh;
    Vh.prototype.Lf = Vh;
    Vh.Mf = {};
    b.ETEXT_DESC = Vh;
    Vh.prototype.__destroy__ = function () {
      ed(this.Gf);
    };
    function O() {
      throw "cannot construct a PageIterator, no constructor in IDL";
    }
    O.prototype = Object.create(G.prototype);
    O.prototype.constructor = O;
    O.prototype.Lf = O;
    O.Mf = {};
    b.PageIterator = O;
    O.prototype.Begin = function () {
      fd(this.Gf);
    };
    O.prototype.RestartParagraph = function () {
      gd(this.Gf);
    };
    O.prototype.IsWithinFirstTextlineOfParagraph = function () {
      return !!hd(this.Gf);
    };
    O.prototype.RestartRow = function () {
      jd(this.Gf);
    };
    O.prototype.Next = function (a) {
      var c = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      return !!kd(c, a);
    };
    O.prototype.IsAtBeginningOf = function (a) {
      var c = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      return !!ld(c, a);
    };
    O.prototype.IsAtFinalElement = function (a, c) {
      var d = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      c && "object" === typeof c && (c = c.Gf);
      return !!md(d, a, c);
    };
    O.prototype.Cmp = function (a) {
      var c = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      return nd(c, a);
    };
    O.prototype.SetBoundingBoxComponents = function (a, c) {
      var d = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      c && "object" === typeof c && (c = c.Gf);
      od(d, a, c);
    };
    O.prototype.BoundingBox = function (a, c, d, e, g, h) {
      var k = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      c && "object" === typeof c && (c = c.Gf);
      d && "object" === typeof d && (d = d.Gf);
      e && "object" === typeof e && (e = e.Gf);
      g && "object" === typeof g && (g = g.Gf);
      h && "object" === typeof h && (h = h.Gf);
      return void 0 === h ? !!pd(k, a, c, d, e, g) : !!qd(k, a, c, d, e, g, h);
    };
    O.prototype.BoundingBoxInternal = function (a, c, d, e, g) {
      var h = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      c && "object" === typeof c && (c = c.Gf);
      d && "object" === typeof d && (d = d.Gf);
      e && "object" === typeof e && (e = e.Gf);
      g && "object" === typeof g && (g = g.Gf);
      return !!rd(h, a, c, d, e, g);
    };
    O.prototype.Empty = function (a) {
      var c = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      return !!sd(c, a);
    };
    O.prototype.BlockType = function () {
      return td(this.Gf);
    };
    O.prototype.BlockPolygon = function () {
      return H(ud(this.Gf), M);
    };
    O.prototype.GetBinaryImage = function (a) {
      var c = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      return H(vd(c, a), N);
    };
    O.prototype.GetImage = function (a, c, d, e, g) {
      var h = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      c && "object" === typeof c && (c = c.Gf);
      d && "object" === typeof d && (d = d.Gf);
      e && "object" === typeof e && (e = e.Gf);
      g && "object" === typeof g && (g = g.Gf);
      return H(wd(h, a, c, d, e, g), N);
    };
    O.prototype.Baseline = function (a, c, d, e, g) {
      var h = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      c && "object" === typeof c && (c = c.Gf);
      d && "object" === typeof d && (d = d.Gf);
      e && "object" === typeof e && (e = e.Gf);
      g && "object" === typeof g && (g = g.Gf);
      return !!xd(h, a, c, d, e, g);
    };
    O.prototype.Orientation = function (a, c, d, e) {
      var g = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      c && "object" === typeof c && (c = c.Gf);
      d && "object" === typeof d && (d = d.Gf);
      e && "object" === typeof e && (e = e.Gf);
      yd(g, a, c, d, e);
    };
    O.prototype.ParagraphInfo = function (a, c, d, e) {
      var g = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      c && "object" === typeof c && (c = c.Gf);
      d && "object" === typeof d && (d = d.Gf);
      e && "object" === typeof e && (e = e.Gf);
      zd(g, a, c, d, e);
    };
    O.prototype.__destroy__ = function () {
      Ad(this.Gf);
    };
    function Wh() {
      throw "cannot construct a WritingDirection, no constructor in IDL";
    }
    Wh.prototype = Object.create(G.prototype);
    Wh.prototype.constructor = Wh;
    Wh.prototype.Lf = Wh;
    Wh.Mf = {};
    b.WritingDirection = Wh;
    Wh.prototype.__destroy__ = function () {
      Bd(this.Gf);
    };
    function Xh(a) {
      a && "object" === typeof a && (a = a.Gf);
      this.Gf = Cd(a);
      Jh(Xh)[this.Gf] = this;
    }
    Xh.prototype = Object.create(G.prototype);
    Xh.prototype.constructor = Xh;
    Xh.prototype.Lf = Xh;
    Xh.Mf = {};
    b.WordChoiceIterator = Xh;
    Xh.prototype.Next = function () {
      return !!Dd(this.Gf);
    };
    Xh.prototype.GetUTF8Text = function () {
      return A(Ed(this.Gf));
    };
    Xh.prototype.Confidence = function () {
      return Fd(this.Gf);
    };
    Xh.prototype.__destroy__ = function () {
      Gd(this.Gf);
    };
    function P() {
      throw "cannot construct a Box, no constructor in IDL";
    }
    P.prototype = Object.create(G.prototype);
    P.prototype.constructor = P;
    P.prototype.Lf = P;
    P.Mf = {};
    b.Box = P;
    P.prototype.get_x = P.prototype.Og = function () {
      return Hd(this.Gf);
    };
    Object.defineProperty(P.prototype, "x", { get: P.prototype.Og });
    P.prototype.get_y = P.prototype.Pg = function () {
      return Id(this.Gf);
    };
    Object.defineProperty(P.prototype, "y", { get: P.prototype.Pg });
    P.prototype.get_w = P.prototype.Ng = function () {
      return Jd(this.Gf);
    };
    Object.defineProperty(P.prototype, "w", { get: P.prototype.Ng });
    P.prototype.get_h = P.prototype.Mg = function () {
      return Kd(this.Gf);
    };
    Object.defineProperty(P.prototype, "h", { get: P.prototype.Mg });
    P.prototype.get_refcount = P.prototype.ag = function () {
      return Ld(this.Gf);
    };
    Object.defineProperty(P.prototype, "refcount", { get: P.prototype.ag });
    P.prototype.__destroy__ = function () {
      Md(this.Gf);
    };
    function Q(a, c, d) {
      I();
      a = a && "object" === typeof a ? a.Gf : J(a);
      c = c && "object" === typeof c ? c.Gf : J(c);
      d && "object" === typeof d && (d = d.Gf);
      this.Gf = Nd(a, c, d);
      Jh(Q)[this.Gf] = this;
    }
    Q.prototype = Object.create(G.prototype);
    Q.prototype.constructor = Q;
    Q.prototype.Lf = Q;
    Q.Mf = {};
    b.TessPDFRenderer = Q;
    Q.prototype.BeginDocument = function (a) {
      var c = this.Gf;
      I();
      a = a && "object" === typeof a ? a.Gf : J(a);
      return !!Od(c, a);
    };
    Q.prototype.AddImage = function (a) {
      var c = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      return !!Pd(c, a);
    };
    Q.prototype.EndDocument = function () {
      return !!Qd(this.Gf);
    };
    Q.prototype.happy = function () {
      return !!Rd(this.Gf);
    };
    Q.prototype.file_extension = function () {
      return A(Sd(this.Gf));
    };
    Q.prototype.title = Q.prototype.title = function () {
      return A(Td(this.Gf));
    };
    Q.prototype.imagenum = function () {
      return Ud(this.Gf);
    };
    Q.prototype.__destroy__ = function () {
      Vd(this.Gf);
    };
    function Yh() {
      throw "cannot construct a PixaPtr, no constructor in IDL";
    }
    Yh.prototype = Object.create(G.prototype);
    Yh.prototype.constructor = Yh;
    Yh.prototype.Lf = Yh;
    Yh.Mf = {};
    b.PixaPtr = Yh;
    Yh.prototype.__destroy__ = function () {
      Wd(this.Gf);
    };
    function Zh() {
      throw "cannot construct a FloatPtr, no constructor in IDL";
    }
    Zh.prototype = Object.create(G.prototype);
    Zh.prototype.constructor = Zh;
    Zh.prototype.Lf = Zh;
    Zh.Mf = {};
    b.FloatPtr = Zh;
    Zh.prototype.__destroy__ = function () {
      Xd(this.Gf);
    };
    function $h(a) {
      a && "object" === typeof a && (a = a.Gf);
      this.Gf = Yd(a);
      Jh($h)[this.Gf] = this;
    }
    $h.prototype = Object.create(G.prototype);
    $h.prototype.constructor = $h;
    $h.prototype.Lf = $h;
    $h.Mf = {};
    b.ChoiceIterator = $h;
    $h.prototype.Next = function () {
      return !!Zd(this.Gf);
    };
    $h.prototype.GetUTF8Text = function () {
      return A($d(this.Gf));
    };
    $h.prototype.Confidence = function () {
      return ae(this.Gf);
    };
    $h.prototype.__destroy__ = function () {
      be(this.Gf);
    };
    function ai() {
      throw "cannot construct a PixPtr, no constructor in IDL";
    }
    ai.prototype = Object.create(G.prototype);
    ai.prototype.constructor = ai;
    ai.prototype.Lf = ai;
    ai.Mf = {};
    b.PixPtr = ai;
    ai.prototype.__destroy__ = function () {
      ce(this.Gf);
    };
    function bi() {
      throw "cannot construct a UNICHARSET, no constructor in IDL";
    }
    bi.prototype = Object.create(G.prototype);
    bi.prototype.constructor = bi;
    bi.prototype.Lf = bi;
    bi.Mf = {};
    b.UNICHARSET = bi;
    bi.prototype.get_script_from_script_id = function (a) {
      var c = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      return A(de(c, a));
    };
    bi.prototype.get_script_id_from_name = function (a) {
      var c = this.Gf;
      I();
      a = a && "object" === typeof a ? a.Gf : J(a);
      return ee(c, a);
    };
    bi.prototype.get_script_table_size = function () {
      return fe(this.Gf);
    };
    bi.prototype.__destroy__ = function () {
      ge(this.Gf);
    };
    function ci() {
      throw "cannot construct a IntPtr, no constructor in IDL";
    }
    ci.prototype = Object.create(G.prototype);
    ci.prototype.constructor = ci;
    ci.prototype.Lf = ci;
    ci.Mf = {};
    b.IntPtr = ci;
    ci.prototype.__destroy__ = function () {
      he(this.Gf);
    };
    function di() {
      throw "cannot construct a Orientation, no constructor in IDL";
    }
    di.prototype = Object.create(G.prototype);
    di.prototype.constructor = di;
    di.prototype.Lf = di;
    di.Mf = {};
    b.Orientation = di;
    di.prototype.__destroy__ = function () {
      ie(this.Gf);
    };
    function R() {
      throw "cannot construct a OSBestResult, no constructor in IDL";
    }
    R.prototype = Object.create(G.prototype);
    R.prototype.constructor = R;
    R.prototype.Lf = R;
    R.Mf = {};
    b.OSBestResult = R;
    R.prototype.get_orientation_id = R.prototype.Yh = function () {
      return je(this.Gf);
    };
    Object.defineProperty(R.prototype, "orientation_id", {
      get: R.prototype.Yh,
    });
    R.prototype.get_script_id = R.prototype.ai = function () {
      return ke(this.Gf);
    };
    Object.defineProperty(R.prototype, "script_id", { get: R.prototype.ai });
    R.prototype.get_sconfidence = R.prototype.$h = function () {
      return le(this.Gf);
    };
    Object.defineProperty(R.prototype, "sconfidence", { get: R.prototype.$h });
    R.prototype.get_oconfidence = R.prototype.Xh = function () {
      return me(this.Gf);
    };
    Object.defineProperty(R.prototype, "oconfidence", { get: R.prototype.Xh });
    R.prototype.__destroy__ = function () {
      ne(this.Gf);
    };
    function S() {
      throw "cannot construct a Boxa, no constructor in IDL";
    }
    S.prototype = Object.create(G.prototype);
    S.prototype.constructor = S;
    S.prototype.Lf = S;
    S.Mf = {};
    b.Boxa = S;
    S.prototype.get_n = S.prototype.eg = function () {
      return oe(this.Gf);
    };
    Object.defineProperty(S.prototype, "n", { get: S.prototype.eg });
    S.prototype.get_nalloc = S.prototype.fg = function () {
      return pe(this.Gf);
    };
    Object.defineProperty(S.prototype, "nalloc", { get: S.prototype.fg });
    S.prototype.get_refcount = S.prototype.ag = function () {
      return qe(this.Gf);
    };
    Object.defineProperty(S.prototype, "refcount", { get: S.prototype.ag });
    S.prototype.get_box = S.prototype.Qh = function () {
      return H(re(this.Gf), ei);
    };
    Object.defineProperty(S.prototype, "box", { get: S.prototype.Qh });
    S.prototype.__destroy__ = function () {
      se(this.Gf);
    };
    function T() {
      throw "cannot construct a PixColormap, no constructor in IDL";
    }
    T.prototype = Object.create(G.prototype);
    T.prototype.constructor = T;
    T.prototype.Lf = T;
    T.Mf = {};
    b.PixColormap = T;
    T.prototype.get_array = T.prototype.Oh = function () {
      return te(this.Gf);
    };
    Object.defineProperty(T.prototype, "array", { get: T.prototype.Oh });
    T.prototype.get_depth = T.prototype.Vh = function () {
      return ue(this.Gf);
    };
    Object.defineProperty(T.prototype, "depth", { get: T.prototype.Vh });
    T.prototype.get_nalloc = T.prototype.fg = function () {
      return ve(this.Gf);
    };
    Object.defineProperty(T.prototype, "nalloc", { get: T.prototype.fg });
    T.prototype.get_n = T.prototype.eg = function () {
      return we(this.Gf);
    };
    Object.defineProperty(T.prototype, "n", { get: T.prototype.eg });
    T.prototype.__destroy__ = function () {
      xe(this.Gf);
    };
    function M() {
      throw "cannot construct a Pta, no constructor in IDL";
    }
    M.prototype = Object.create(G.prototype);
    M.prototype.constructor = M;
    M.prototype.Lf = M;
    M.Mf = {};
    b.Pta = M;
    M.prototype.get_n = M.prototype.eg = function () {
      return ye(this.Gf);
    };
    Object.defineProperty(M.prototype, "n", { get: M.prototype.eg });
    M.prototype.get_nalloc = M.prototype.fg = function () {
      return ze(this.Gf);
    };
    Object.defineProperty(M.prototype, "nalloc", { get: M.prototype.fg });
    M.prototype.get_refcount = M.prototype.ag = function () {
      return Ae(this.Gf);
    };
    Object.defineProperty(M.prototype, "refcount", { get: M.prototype.ag });
    M.prototype.get_x = M.prototype.Og = function () {
      return H(Be(this.Gf), Zh);
    };
    Object.defineProperty(M.prototype, "x", { get: M.prototype.Og });
    M.prototype.get_y = M.prototype.Pg = function () {
      return H(Ce(this.Gf), Zh);
    };
    Object.defineProperty(M.prototype, "y", { get: M.prototype.Pg });
    M.prototype.__destroy__ = function () {
      De(this.Gf);
    };
    function N() {
      throw "cannot construct a Pix, no constructor in IDL";
    }
    N.prototype = Object.create(G.prototype);
    N.prototype.constructor = N;
    N.prototype.Lf = N;
    N.Mf = {};
    b.Pix = N;
    N.prototype.get_w = N.prototype.Ng = function () {
      return Ee(this.Gf);
    };
    Object.defineProperty(N.prototype, "w", { get: N.prototype.Ng });
    N.prototype.get_h = N.prototype.Mg = function () {
      return Fe(this.Gf);
    };
    Object.defineProperty(N.prototype, "h", { get: N.prototype.Mg });
    N.prototype.get_d = N.prototype.Th = function () {
      return Ge(this.Gf);
    };
    Object.defineProperty(N.prototype, "d", { get: N.prototype.Th });
    N.prototype.get_spp = N.prototype.ci = function () {
      return He(this.Gf);
    };
    Object.defineProperty(N.prototype, "spp", { get: N.prototype.ci });
    N.prototype.get_wpl = N.prototype.fi = function () {
      return Ie(this.Gf);
    };
    Object.defineProperty(N.prototype, "wpl", { get: N.prototype.fi });
    N.prototype.get_refcount = N.prototype.ag = function () {
      return Je(this.Gf);
    };
    Object.defineProperty(N.prototype, "refcount", { get: N.prototype.ag });
    N.prototype.get_xres = N.prototype.gi = function () {
      return Ke(this.Gf);
    };
    Object.defineProperty(N.prototype, "xres", { get: N.prototype.gi });
    N.prototype.get_yres = N.prototype.hi = function () {
      return Le(this.Gf);
    };
    Object.defineProperty(N.prototype, "yres", { get: N.prototype.hi });
    N.prototype.get_informat = N.prototype.Wh = function () {
      return Me(this.Gf);
    };
    Object.defineProperty(N.prototype, "informat", { get: N.prototype.Wh });
    N.prototype.get_special = N.prototype.bi = function () {
      return Ne(this.Gf);
    };
    Object.defineProperty(N.prototype, "special", { get: N.prototype.bi });
    N.prototype.get_text = N.prototype.di = function () {
      return A(Oe(this.Gf));
    };
    Object.defineProperty(N.prototype, "text", { get: N.prototype.di });
    N.prototype.get_colormap = N.prototype.Sh = function () {
      return H(Pe(this.Gf), T);
    };
    Object.defineProperty(N.prototype, "colormap", { get: N.prototype.Sh });
    N.prototype.get_data = N.prototype.Uh = function () {
      return Qe(this.Gf);
    };
    Object.defineProperty(N.prototype, "data", { get: N.prototype.Uh });
    N.prototype.__destroy__ = function () {
      Re(this.Gf);
    };
    function fi() {
      throw "cannot construct a DoublePtr, no constructor in IDL";
    }
    fi.prototype = Object.create(G.prototype);
    fi.prototype.constructor = fi;
    fi.prototype.Lf = fi;
    fi.Mf = {};
    b.DoublePtr = fi;
    fi.prototype.__destroy__ = function () {
      Se(this.Gf);
    };
    function gi() {
      throw "cannot construct a Dawg, no constructor in IDL";
    }
    gi.prototype = Object.create(G.prototype);
    gi.prototype.constructor = gi;
    gi.prototype.Lf = gi;
    gi.Mf = {};
    b.Dawg = gi;
    gi.prototype.__destroy__ = function () {
      Te(this.Gf);
    };
    function ei() {
      throw "cannot construct a BoxPtr, no constructor in IDL";
    }
    ei.prototype = Object.create(G.prototype);
    ei.prototype.constructor = ei;
    ei.prototype.Lf = ei;
    ei.Mf = {};
    b.BoxPtr = ei;
    ei.prototype.__destroy__ = function () {
      Ue(this.Gf);
    };
    function V() {
      this.Gf = Ve();
      Jh(V)[this.Gf] = this;
    }
    V.prototype = Object.create(G.prototype);
    V.prototype.constructor = V;
    V.prototype.Lf = V;
    V.Mf = {};
    b.TessBaseAPI = V;
    V.prototype.Version = function () {
      return A(We(this.Gf));
    };
    V.prototype.SetInputName = function (a) {
      var c = this.Gf;
      I();
      a = a && "object" === typeof a ? a.Gf : J(a);
      Xe(c, a);
    };
    V.prototype.GetInputName = function () {
      return A(Ye(this.Gf));
    };
    V.prototype.SetInputImage = function (a) {
      var c = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      Ze(c, a);
    };
    V.prototype.GetInputImage = function () {
      return H($e(this.Gf), N);
    };
    V.prototype.GetSourceYResolution = function () {
      return af(this.Gf);
    };
    V.prototype.GetDatapath = function () {
      return A(bf(this.Gf));
    };
    V.prototype.SetOutputName = function (a) {
      var c = this.Gf;
      I();
      a = a && "object" === typeof a ? a.Gf : J(a);
      cf(c, a);
    };
    V.prototype.SetVariable = V.prototype.SetVariable = function (a, c) {
      var d = this.Gf;
      I();
      a = a && "object" === typeof a ? a.Gf : J(a);
      c = c && "object" === typeof c ? c.Gf : J(c);
      return !!df(d, a, c);
    };
    V.prototype.SetDebugVariable = function (a, c) {
      var d = this.Gf;
      I();
      a = a && "object" === typeof a ? a.Gf : J(a);
      c = c && "object" === typeof c ? c.Gf : J(c);
      return !!ef(d, a, c);
    };
    V.prototype.GetIntVariable = function (a, c) {
      var d = this.Gf;
      I();
      a = a && "object" === typeof a ? a.Gf : J(a);
      c && "object" === typeof c && (c = c.Gf);
      return !!ff(d, a, c);
    };
    V.prototype.GetBoolVariable = function (a, c) {
      var d = this.Gf;
      I();
      a = a && "object" === typeof a ? a.Gf : J(a);
      c && "object" === typeof c && (c = c.Gf);
      return !!gf(d, a, c);
    };
    V.prototype.GetDoubleVariable = function (a, c) {
      var d = this.Gf;
      I();
      a = a && "object" === typeof a ? a.Gf : J(a);
      c && "object" === typeof c && (c = c.Gf);
      return !!hf(d, a, c);
    };
    V.prototype.GetStringVariable = function (a) {
      var c = this.Gf;
      I();
      a = a && "object" === typeof a ? a.Gf : J(a);
      return A(jf(c, a));
    };
    V.prototype.Init = function (a, c, d, e) {
      void 0 === d && void 0 !== e && (d = 3);
      var g = this.Gf;
      I();
      a = a && "object" === typeof a ? a.Gf : J(a);
      c = c && "object" === typeof c ? c.Gf : J(c);
      e = e && "object" === typeof e ? e.Gf : J(e);
      d && "object" === typeof d && (d = d.Gf);
      return void 0 === d && void 0 !== e
        ? of(g, a, c, 3, e)
        : void 0 === d
          ? mf(g, a, c)
          : void 0 === e
            ? nf(g, a, c, d)
            : of(g, a, c, d, e);
    };
    V.prototype.GetInitLanguagesAsString = function () {
      return A(pf(this.Gf));
    };
    V.prototype.InitForAnalysePage = function () {
      qf(this.Gf);
    };
    V.prototype.SaveParameters = function () {
      kf(this.Gf);
    };
    V.prototype.RestoreParameters = function () {
      lf(this.Gf);
    };
    V.prototype.ReadConfigFile = function (a) {
      var c = this.Gf;
      I();
      a = a && "object" === typeof a ? a.Gf : J(a);
      rf(c, a);
    };
    V.prototype.ReadDebugConfigFile = function (a) {
      var c = this.Gf;
      I();
      a = a && "object" === typeof a ? a.Gf : J(a);
      sf(c, a);
    };
    V.prototype.SetPageSegMode = function (a) {
      var c = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      tf(c, a);
    };
    V.prototype.GetPageSegMode = function () {
      return uf(this.Gf);
    };
    V.prototype.TesseractRect = function (a, c, d, e, g, h, k) {
      var m = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      c && "object" === typeof c && (c = c.Gf);
      d && "object" === typeof d && (d = d.Gf);
      e && "object" === typeof e && (e = e.Gf);
      g && "object" === typeof g && (g = g.Gf);
      h && "object" === typeof h && (h = h.Gf);
      k && "object" === typeof k && (k = k.Gf);
      return A(vf(m, a, c, d, e, g, h, k));
    };
    V.prototype.ClearAdaptiveClassifier = function () {
      wf(this.Gf);
    };
    V.prototype.SetImage = function (a, c, d, e, g, h = 1, k = 0) {
      var m = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      c && "object" === typeof c && (c = c.Gf);
      d && "object" === typeof d && (d = d.Gf);
      e && "object" === typeof e && (e = e.Gf);
      g && "object" === typeof g && (g = g.Gf);
      void 0 === c || null === c ? xf(m, a, h, k) : yf(m, a, c, d, e, g, h, k);
    };
    V.prototype.SetImageFile = function (a = 1, c = 0) {
      return zf(this.Gf, a, c);
    };
    V.prototype.SetSourceResolution = function (a) {
      var c = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      Af(c, a);
    };
    V.prototype.SetRectangle = function (a, c, d, e) {
      var g = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      c && "object" === typeof c && (c = c.Gf);
      d && "object" === typeof d && (d = d.Gf);
      e && "object" === typeof e && (e = e.Gf);
      Bf(g, a, c, d, e);
    };
    V.prototype.GetThresholdedImage = function () {
      return H(Cf(this.Gf), N);
    };
    V.prototype.WriteImage = function (a) {
      Df(this.Gf, a);
    };
    V.prototype.GetRegions = function (a) {
      var c = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      return H(Gf(c, a), S);
    };
    V.prototype.GetTextlines = function (a, c, d, e, g) {
      var h = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      c && "object" === typeof c && (c = c.Gf);
      d && "object" === typeof d && (d = d.Gf);
      e && "object" === typeof e && (e = e.Gf);
      g && "object" === typeof g && (g = g.Gf);
      return void 0 === d
        ? H(Hf(h, a, c), S)
        : void 0 === e
          ? H(_emscripten_bind_TessBaseAPI_GetTextlines_3(h, a, c, d), S)
          : void 0 === g
            ? H(_emscripten_bind_TessBaseAPI_GetTextlines_4(h, a, c, d, e), S)
            : H(If(h, a, c, d, e, g), S);
    };
    V.prototype.GetStrips = function (a, c) {
      var d = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      c && "object" === typeof c && (c = c.Gf);
      return H(Jf(d, a, c), S);
    };
    V.prototype.GetWords = function (a) {
      var c = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      return H(Kf(c, a), S);
    };
    V.prototype.GetConnectedComponents = function (a) {
      var c = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      return H(Lf(c, a), S);
    };
    V.prototype.GetComponentImages = function (a, c, d, e, g, h, k) {
      var m = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      c && "object" === typeof c && (c = c.Gf);
      d && "object" === typeof d && (d = d.Gf);
      e && "object" === typeof e && (e = e.Gf);
      g && "object" === typeof g && (g = g.Gf);
      h && "object" === typeof h && (h = h.Gf);
      k && "object" === typeof k && (k = k.Gf);
      return void 0 === g
        ? H(Mf(m, a, c, d, e), S)
        : void 0 === h
          ? H(
              _emscripten_bind_TessBaseAPI_GetComponentImages_5(
                m,
                a,
                c,
                d,
                e,
                g,
              ),
              S,
            )
          : void 0 === k
            ? H(
                _emscripten_bind_TessBaseAPI_GetComponentImages_6(
                  m,
                  a,
                  c,
                  d,
                  e,
                  g,
                  h,
                ),
                S,
              )
            : H(Nf(m, a, c, d, e, g, h, k), S);
    };
    V.prototype.GetThresholdedImageScaleFactor = function () {
      return Of(this.Gf);
    };
    V.prototype.AnalyseLayout = function (a) {
      var c = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      return void 0 === a ? H(Pf(c), O) : H(Qf(c, a), O);
    };
    V.prototype.Recognize = function (a) {
      var c = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      return Rf(c, a);
    };
    V.prototype.FindLines = function () {
      return Ef(this.Gf);
    };
    V.prototype.GetGradient = function () {
      return Ff(this.Gf);
    };
    V.prototype.ProcessPages = function (a, c, d, e) {
      var g = this.Gf;
      I();
      a = a && "object" === typeof a ? a.Gf : J(a);
      c = c && "object" === typeof c ? c.Gf : J(c);
      d && "object" === typeof d && (d = d.Gf);
      e && "object" === typeof e && (e = e.Gf);
      return !!Sf(g, a, c, d, e);
    };
    V.prototype.ProcessPage = function (a, c, d, e, g, h) {
      var k = this.Gf;
      I();
      a && "object" === typeof a && (a = a.Gf);
      c && "object" === typeof c && (c = c.Gf);
      d = d && "object" === typeof d ? d.Gf : J(d);
      e = e && "object" === typeof e ? e.Gf : J(e);
      g && "object" === typeof g && (g = g.Gf);
      h && "object" === typeof h && (h = h.Gf);
      return !!Tf(k, a, c, d, e, g, h);
    };
    V.prototype.GetIterator = function () {
      return H(Uf(this.Gf), L);
    };
    V.prototype.GetUTF8Text = function () {
      return A(Vf(this.Gf));
    };
    V.prototype.GetHOCRText = function (a) {
      var c = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      return A(Wf(c, a));
    };
    V.prototype.GetTSVText = function (a) {
      var c = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      return A(Xf(c, a));
    };
    V.prototype.GetBoxText = function (a) {
      var c = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      return A(Yf(c, a));
    };
    V.prototype.GetUNLVText = function () {
      return A(Zf(this.Gf));
    };
    V.prototype.GetOsdText = function (a) {
      var c = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      return A($f(c, a));
    };
    V.prototype.MeanTextConf = function () {
      return ag(this.Gf);
    };
    V.prototype.AllWordConfidences = function () {
      return H(bg(this.Gf), ci);
    };
    V.prototype.AdaptToWordStr = function (a, c) {
      var d = this.Gf;
      I();
      a && "object" === typeof a && (a = a.Gf);
      c = c && "object" === typeof c ? c.Gf : J(c);
      return !!_emscripten_bind_TessBaseAPI_AdaptToWordStr_2(d, a, c);
    };
    V.prototype.Clear = function () {
      cg(this.Gf);
    };
    V.prototype.End = function () {
      dg(this.Gf);
    };
    V.prototype.ClearPersistentCache = function () {
      eg(this.Gf);
    };
    V.prototype.IsValidWord = function (a) {
      var c = this.Gf;
      I();
      a = a && "object" === typeof a ? a.Gf : J(a);
      return fg(c, a);
    };
    V.prototype.IsValidCharacter = function (a) {
      var c = this.Gf;
      I();
      a = a && "object" === typeof a ? a.Gf : J(a);
      return !!gg(c, a);
    };
    V.prototype.DetectOS = function (a) {
      var c = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      return !!hg(c, a);
    };
    V.prototype.GetUnichar = function (a) {
      var c = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      return A(ig(c, a));
    };
    V.prototype.GetDawg = function (a) {
      var c = this.Gf;
      a && "object" === typeof a && (a = a.Gf);
      return H(jg(c, a), gi);
    };
    V.prototype.NumDawgs = function () {
      return kg(this.Gf);
    };
    V.prototype.oem = function () {
      return lg(this.Gf);
    };
    V.prototype.__destroy__ = function () {
      mg(this.Gf);
    };
    function Y() {
      this.Gf = ng();
      Jh(Y)[this.Gf] = this;
    }
    Y.prototype = Object.create(G.prototype);
    Y.prototype.constructor = Y;
    Y.prototype.Lf = Y;
    Y.Mf = {};
    b.OSResults = Y;
    Y.prototype.print_scores = function () {
      og(this.Gf);
    };
    Y.prototype.get_best_result = Y.prototype.Ph = function () {
      return H(pg(this.Gf), R);
    };
    Object.defineProperty(Y.prototype, "best_result", { get: Y.prototype.Ph });
    Y.prototype.get_unicharset = Y.prototype.ei = function () {
      return H(qg(this.Gf), bi);
    };
    Object.defineProperty(Y.prototype, "unicharset", { get: Y.prototype.ei });
    Y.prototype.__destroy__ = function () {
      rg(this.Gf);
    };
    function Z() {
      throw "cannot construct a Pixa, no constructor in IDL";
    }
    Z.prototype = Object.create(G.prototype);
    Z.prototype.constructor = Z;
    Z.prototype.Lf = Z;
    Z.Mf = {};
    b.Pixa = Z;
    Z.prototype.get_n = Z.prototype.eg = function () {
      return sg(this.Gf);
    };
    Object.defineProperty(Z.prototype, "n", { get: Z.prototype.eg });
    Z.prototype.get_nalloc = Z.prototype.fg = function () {
      return tg(this.Gf);
    };
    Object.defineProperty(Z.prototype, "nalloc", { get: Z.prototype.fg });
    Z.prototype.get_refcount = Z.prototype.ag = function () {
      return ug(this.Gf);
    };
    Object.defineProperty(Z.prototype, "refcount", { get: Z.prototype.ag });
    Z.prototype.get_pix = Z.prototype.Zh = function () {
      return H(vg(this.Gf), ai);
    };
    Object.defineProperty(Z.prototype, "pix", { get: Z.prototype.Zh });
    Z.prototype.get_boxa = Z.prototype.Rh = function () {
      return H(wg(this.Gf), S);
    };
    Object.defineProperty(Z.prototype, "boxa", { get: Z.prototype.Rh });
    Z.prototype.__destroy__ = function () {
      xg(this.Gf);
    };
    (function () {
      function a() {
        b.RIL_BLOCK = yg();
        b.RIL_PARA = zg();
        b.RIL_TEXTLINE = Ag();
        b.RIL_WORD = Bg();
        b.RIL_SYMBOL = Cg();
        b.OEM_TESSERACT_ONLY = Dg();
        b.OEM_LSTM_ONLY = Eg();
        b.OEM_TESSERACT_LSTM_COMBINED = Fg();
        b.OEM_DEFAULT = Gg();
        b.OEM_COUNT = Hg();
        b.WRITING_DIRECTION_LEFT_TO_RIGHT = Ig();
        b.WRITING_DIRECTION_RIGHT_TO_LEFT = Jg();
        b.WRITING_DIRECTION_TOP_TO_BOTTOM = Kg();
        b.PT_UNKNOWN = Lg();
        b.PT_FLOWING_TEXT = Mg();
        b.PT_HEADING_TEXT = Ng();
        b.PT_PULLOUT_TEXT = Og();
        b.PT_EQUATION = Pg();
        b.PT_INLINE_EQUATION = Qg();
        b.PT_TABLE = Rg();
        b.PT_VERTICAL_TEXT = Sg();
        b.PT_CAPTION_TEXT = Tg();
        b.PT_FLOWING_IMAGE = Ug();
        b.PT_HEADING_IMAGE = Vg();
        b.PT_PULLOUT_IMAGE = Wg();
        b.PT_HORZ_LINE = Xg();
        b.PT_VERT_LINE = Yg();
        b.PT_NOISE = Zg();
        b.PT_COUNT = $g();
        b.DIR_NEUTRAL = ah();
        b.DIR_LEFT_TO_RIGHT = bh();
        b.DIR_RIGHT_TO_LEFT = ch();
        b.DIR_MIX = dh();
        b.JUSTIFICATION_UNKNOWN = eh();
        b.JUSTIFICATION_LEFT = fh();
        b.JUSTIFICATION_CENTER = gh();
        b.JUSTIFICATION_RIGHT = hh();
        b.TEXTLINE_ORDER_LEFT_TO_RIGHT = ih();
        b.TEXTLINE_ORDER_RIGHT_TO_LEFT = jh();
        b.TEXTLINE_ORDER_TOP_TO_BOTTOM = kh();
        b.ORIENTATION_PAGE_UP = lh();
        b.ORIENTATION_PAGE_RIGHT = mh();
        b.ORIENTATION_PAGE_DOWN = nh();
        b.ORIENTATION_PAGE_LEFT = oh();
        b.PSM_OSD_ONLY = ph();
        b.PSM_AUTO_OSD = qh();
        b.PSM_AUTO_ONLY = rh();
        b.PSM_AUTO = sh();
        b.PSM_SINGLE_COLUMN = th();
        b.PSM_SINGLE_BLOCK_VERT_TEXT = uh();
        b.PSM_SINGLE_BLOCK = vh();
        b.PSM_SINGLE_LINE = wh();
        b.PSM_SINGLE_WORD = xh();
        b.PSM_CIRCLE_WORD = yh();
        b.PSM_SINGLE_CHAR = zh();
        b.PSM_SPARSE_TEXT = Ah();
        b.PSM_SPARSE_TEXT_OSD = Bh();
        b.PSM_RAW_LINE = Ch();
        b.PSM_COUNT = Dh();
      }
      Ba ? a() : za.unshift(a);
    })();
    Qh.prototype.getValue = function (a) {
      return !!Wa(this.Gf + (a || 0), "i8");
    };
    ci.prototype.getValue = function (a) {
      return Wa(this.Gf + 4 * (a || 0), "i32");
    };
    Zh.prototype.getValue = function (a) {
      return Wa(this.Gf + 4 * (a || 0), "float");
    };
    fi.prototype.getValue = function (a) {
      return Wa(this.Gf + 8 * (a || 0), "double");
    };
    ei.prototype.get =
      Yh.prototype.get =
      ai.prototype.get =
        function (a) {
          return Wa(this.Gf + 4 * (a || 0), "*");
        };
    function hi() {
      this.mg = {};
    }
    hi.prototype.wrap = function (a, c) {
      var d = Eb(4);
      Xa(d, 0, "i32");
      return (this.mg[a] = H(d, c));
    };
    hi.prototype.bool = function (a) {
      return this.wrap(a, Qh);
    };
    hi.prototype.i32 = function (a) {
      return this.wrap(a, ci);
    };
    hi.prototype.f32 = function (a) {
      return this.wrap(a, Zh);
    };
    hi.prototype.f64 = function (a) {
      return (this.mg[a] = H(Eb(8), fi));
    };
    hi.prototype.peek = function () {
      var a = {},
        c;
      for (c in this.mg) a[c] = this.mg[c].getValue();
      return a;
    };
    hi.prototype.get = function () {
      var a = {},
        c;
      for (c in this.mg) ((a[c] = this.mg[c].getValue()), Eh(this.mg[c].Gf));
      return a;
    };
    L.prototype.getBoundingBox = function (a) {
      var c = new hi();
      this.BoundingBox(a, c.i32("x0"), c.i32("y0"), c.i32("x1"), c.i32("y1"));
      return c.get();
    };
    L.prototype.getBaseline = function (a) {
      var c = new hi();
      a = !!this.Baseline(
        a,
        c.i32("x0"),
        c.i32("y0"),
        c.i32("x1"),
        c.i32("y1"),
      );
      c = c.get();
      c.has_baseline = a;
      return c;
    };
    L.prototype.getRowAttributes = function () {
      var a = new hi();
      this.RowAttributes(
        a.f32("row_height"),
        a.f32("descenders"),
        a.f32("ascenders"),
      );
      return a.get();
    };
    L.prototype.getWordFontAttributes = function () {
      var a = new hi(),
        c = this.WordFontAttributes(
          a.bool("is_bold"),
          a.bool("is_italic"),
          a.bool("is_underlined"),
          a.bool("is_monospace"),
          a.bool("is_serif"),
          a.bool("is_smallcaps"),
          a.i32("pointsize"),
          a.i32("font_id"),
        );
      a = a.get();
      a.font_name = c;
      return a;
    };
    b.pointerHelper = hi;

    return TesseractCore.ready;
  };
})();
if (typeof exports === "object" && typeof module === "object")
  module.exports = TesseractCore;
else if (typeof define === "function" && define["amd"])
  define([], function () {
    return TesseractCore;
  });
else if (typeof exports === "object") exports["TesseractCore"] = TesseractCore;
