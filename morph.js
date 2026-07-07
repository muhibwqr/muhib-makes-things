// standalone ∞↔m morph — the animated home mark for article pages (no side effects)
const REDUCED_MOTION = matchMedia("(prefers-reduced-motion: reduce)").matches;
const morphPanel = document.getElementById("morph-panel");
if (morphPanel) {
  const W = 84, H = 26, RAMP = " .:-=+*ozX#%@";
  const cx = (W - 1) / 2, mid = (H - 1) / 2, L = RAMP.length - 1;
  const cl = (v) => Math.max(0, Math.min(1, v));
  const wrap = (a) => { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; };
  const smooth = (x) => { x = cl(x); return x * x * (3 - 2 * x); };

  const SX = (W / 2) / 1.12, SY = SX * 0.66;
  const IW = 0.46, IH = 0.72;
  const TH_INF = 0.12, TH_M = 0.075;

  function dInf(x, y) {
    const X = x / IW, Y = y / IH, s = X * X + Y * Y, F = s * s - (X * X - Y * Y);
    return Math.abs(F) / (Math.hypot(4 * X * s - 2 * X, 4 * Y * s + 2 * Y) + 1e-6);
  }
  const seg = (px, py, ax, ay, bx, by) => { const dx = bx - ax, dy = by - ay; const t = cl(((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)); return Math.hypot(px - (ax + t * dx), py - (ay + t * dy)); };
  const arc = (px, py, c, cy, r) => { const d = Math.hypot(px - c, py - cy); return py >= cy ? Math.abs(d - r) : Math.min(Math.hypot(px - (c - r), py - cy), Math.hypot(px - (c + r), py - cy)); };
  function dM(x, y) {
    const yb = -0.30, ys = 0.07, x1 = -0.46, x3 = 0.46, r = 0.23;
    let d = Math.min(seg(x, y, x1, yb, x1, ys), seg(x, y, 0, yb, 0, ys), seg(x, y, x3, yb, x3, ys));
    d = Math.min(d, arc(x, y, -0.23, ys, r), arc(x, y, 0.23, ys, r));
    return d;
  }
  function morphK(ts) {
    const P = 7.4, p = (ts % P) / P;
    if (p < 0.40) return 0;
    if (p < 0.50) return smooth((p - 0.40) / 0.10);
    if (p < 0.90) return 1;
    return 1 - smooth((p - 0.90) / 0.10);
  }
  function draw(now) {
    const ts = now * 0.001, tg = ts * 2.2, k = morphK(ts);
    const rows = [];
    for (let j = 0; j < H; j++) {
      let r = "";
      for (let i = 0; i < W; i++) {
        const x = (i - cx) / SX, y = (mid - j) / SY;
        const n = (dInf(x, y) / TH_INF) * (1 - k) + (dM(x, y) / TH_M) * k;
        const e = cl(1 - n);
        let v = 0;
        if (e > 0) {
          const ph = Math.atan2(y, x);
          const g1 = Math.exp(-((wrap(ph - tg) / 0.55) ** 2));
          const g2 = 0.6 * Math.exp(-((wrap(ph - tg + Math.PI) / 0.65) ** 2));
          v = Math.pow(e, 0.8) * cl(0.42 + 0.9 * (g1 + g2));
        }
        r += RAMP[Math.round(v * L)];
      }
      rows.push(r);
    }
    let lead = W;
    for (const ln of rows) { const k2 = ln.search(/[^ ]/); if (k2 >= 0) lead = Math.min(lead, k2); }
    if (lead === W) lead = 0;
    const out = rows.map((ln) => ln.slice(lead).replace(/\s+$/, ""));
    while (out.length && out[0] === "") out.shift();
    while (out.length && out[out.length - 1] === "") out.pop();
    return out.join("\n");
  }

  const artEl = document.getElementById("morph-art");
  let raf = 0, onScreen = true, lastFrame = 0;
  function loop(now) {
    raf = 0;
    if (!onScreen || REDUCED_MOTION) return;
    if (now - lastFrame > 33) { lastFrame = now; artEl.textContent = draw(now); }
    raf = requestAnimationFrame(loop);
  }
  artEl.textContent = draw(0);
  new IntersectionObserver(([e]) => {
    onScreen = e.isIntersecting;
    if (onScreen && !raf && !REDUCED_MOTION) raf = requestAnimationFrame(loop);
  }).observe(morphPanel);
  if (!REDUCED_MOTION) raf = requestAnimationFrame(loop);
}
