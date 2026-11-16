// renders a muted source video as shade-block ascii (devault "shade blocks" look: █▓▒░)
const canvas = document.querySelector(".home-ascii");
const video = document.querySelector(".ascii-src");

if (canvas && video) {
  const COLS = 269, ROWS = 151, CELL = 4, HIDE_SHADOWS = 0.06;
  const INK = 0xfff7f4f4, BG = 0xff100c0c; // ABGR: #F4F4F7 ink on dark
  const W = COLS * CELL, H = ROWS * CELL;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  const sample = document.createElement("canvas");
  sample.width = COLS;
  sample.height = ROWS;
  const sctx = sample.getContext("2d", { willReadFrequently: true });
  const img = ctx.createImageData(W, H);
  const px = new Uint32Array(img.data.buffer);
  const lum = new Float32Array(COLS * ROWS);
  // shade level per pixel: 0 empty, 1 ░, 2 ▒, 3 ▓, 4 █
  const lit = (level, x, y) =>
    level === 4 || (level === 3 && !(x & y & 1)) || (level === 2 && !((x + y) & 1)) || (level === 1 && !(x & 1) && !(y & 1));
  let raf = 0, visible = true;

  const draw = () => {
    if (video.readyState < 2) return;
    sctx.drawImage(video, 0, 0, COLS, ROWS);
    const src = sctx.getImageData(0, 0, COLS, ROWS).data;
    const hist = new Uint32Array(256);
    for (let i = 0; i < lum.length; i++) {
      const v = (0.2126 * src[i * 4] + 0.7152 * src[i * 4 + 1] + 0.0722 * src[i * 4 + 2]) / 255;
      lum[i] = v;
      hist[(v * 255) | 0]++;
    }
    // auto levels: stretch the 1st..99th percentile to full range
    let lo = 0, hi = 255, acc = 0;
    const cut = lum.length * 0.01;
    for (let b = 0; b < 256; b++) if ((acc += hist[b]) > cut) { lo = b / 255; break; }
    acc = 0;
    for (let b = 255; b >= 0; b--) if ((acc += hist[b]) > cut) { hi = b / 255; break; }
    const span = Math.max(hi - lo, 1e-3);
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const v = (lum[r * COLS + c] - lo) / span;
        const level = v < HIDE_SHADOWS ? 0 : Math.min(4, Math.round(v * 4));
        for (let dy = 0; dy < CELL; dy++) {
          const y = r * CELL + dy;
          let o = y * W + c * CELL;
          for (let dx = 0; dx < CELL; dx++, o++) px[o] = lit(level, c * CELL + dx, y) ? INK : BG;
        }
      }
    }
    ctx.putImageData(img, 0, 0);
  };

  const loop = () => {
    draw();
    raf = visible && !video.paused ? requestAnimationFrame(loop) : 0;
  };
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !reduced) video.play().catch(() => {});
    else video.pause();
  }).observe(canvas);
  video.addEventListener("play", () => { if (!raf) raf = requestAnimationFrame(loop); });
  video.addEventListener("loadeddata", draw);
  video.addEventListener("canplay", draw);
  if (reduced) video.pause();
  if (video.readyState >= 2) draw();
  if (!video.paused && !raf) raf = requestAnimationFrame(loop);
  else if (!reduced) video.play().catch(() => {});
}
