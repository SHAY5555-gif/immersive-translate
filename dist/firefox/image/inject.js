(() => {
  URL.revokeObjectURL = function (t) {
    return !0;
  };
  var c = CanvasRenderingContext2D.prototype.drawImage,
    r = {};
  CanvasRenderingContext2D.prototype.drawImage = function (...t) {
    if (t[1] + t[2] + t[3] + t[4] == 0) return null;
    let n = this.canvas;
    if (t[0] instanceof HTMLCanvasElement) {
      let e = t[0].url,
        i = t[0].args;
      ((n.args = i), (n.url = e));
      let a = t[0].width,
        s = t[0].height;
      e &&
        i &&
        setTimeout(() => {
          let o = { url: e, args: i, width: a, height: s };
          n.setAttribute("data", btoa(JSON.stringify(o)));
        }, 1e3);
    } else if (t[0] instanceof HTMLImageElement) {
      let e = t[0].src;
      if (this.canvas.url == e) {
        let i = [...this.canvas.args, t.slice(1)];
        this.canvas.args = i;
      } else ((this.canvas.url = e), (this.canvas.args = [t.slice(1)]));
      (clearTimeout(r[e]),
        (r[e] = setTimeout(() => {
          let i = n.args,
            a = n.url;
          if (i.length < 2) return null;
          let s = { url: a, args: i, width: n.width, height: n.height };
          n.setAttribute("data", btoa(JSON.stringify(s)));
        }, 1e3)));
    }
    return c.apply(this, t);
  };
})();
