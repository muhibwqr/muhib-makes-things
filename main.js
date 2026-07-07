// ============================================================
// muhib waqar — shared site script (every page loads this)
// palette: #080705 black · #39A0ED blue bell · #304C89 dusk blue
//          #F0F7F4 mint cream · #96705B faded copper
// ============================================================

const REDUCED_MOTION = matchMedia("(prefers-reduced-motion: reduce)").matches;

// light only — .maker holds every light-mode override in style.css
document.documentElement.classList.add("maker");
document.body.classList.add("maker");

// ---------- scroll reveals, staggered within each batch ----------
const io = new IntersectionObserver(
  (entries) => {
    let i = 0;
    for (const e of entries) {
      if (e.isIntersecting) {
        const el = e.target;
        el.style.transitionDelay = `${Math.min(i++ * 70, 420)}ms`;
        el.classList.add("visible");
        el.addEventListener("transitionend", () => (el.style.transitionDelay = ""), { once: true });
        io.unobserve(el);
      }
    }
  },
  { threshold: 0, rootMargin: "0px 0px -8% 0px" }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// ============================================================
// the infinity — one ascii drawing, rasterised live from the
// lemniscate of Bernoulli. a uniform-thickness ribbon with a
// glint of light that flows endlessly around the eight.
// ============================================================
const morphPanel = document.getElementById("morph-panel");
if (morphPanel) {
  const W = 84, H = 26, RAMP = " .:-=+*ozX#%@";
  const cx = (W - 1) / 2, mid = (H - 1) / 2, L = RAMP.length - 1;
  const cl = (v) => Math.max(0, Math.min(1, v));
  const wrap = (a) => { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; };
  const smooth = (x) => { x = cl(x); return x * x * (3 - 2 * x); };

  const SX = (W / 2) / 1.12, SY = SX * 0.66;
  const IW = 0.46, IH = 0.72;            // infinity squeezed to the m's width, a touch shorter
  const TH_INF = 0.12, TH_M = 0.075;     // per-shape ribbon thickness

  // distance field of the infinity (lemniscate of Bernoulli), width-matched to the m
  function dInf(x, y) {
    const X = x / IW, Y = y / IH, s = X * X + Y * Y, F = s * s - (X * X - Y * Y);
    return Math.abs(F) / (Math.hypot(4 * X * s - 2 * X, 4 * Y * s + 2 * Y) + 1e-6);
  }
  // distance field of a lowercase m (three stems + two arches)
  const seg = (px, py, ax, ay, bx, by) => { const dx = bx - ax, dy = by - ay; const t = cl(((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)); return Math.hypot(px - (ax + t * dx), py - (ay + t * dy)); };
  const arc = (px, py, c, cy, r) => { const d = Math.hypot(px - c, py - cy); return py >= cy ? Math.abs(d - r) : Math.min(Math.hypot(px - (c - r), py - cy), Math.hypot(px - (c + r), py - cy)); };
  function dM(x, y) {
    const yb = -0.30, ys = 0.07, x1 = -0.46, x3 = 0.46, r = 0.23;   // centered, short
    let d = Math.min(seg(x, y, x1, yb, x1, ys), seg(x, y, 0, yb, 0, ys), seg(x, y, x3, yb, x3, ys));
    d = Math.min(d, arc(x, y, -0.23, ys, r), arc(x, y, 0.23, ys, r));
    return d;
  }
  // hold infinity ~3s, morph ~0.7s, hold m ~3s, morph back — k: 0 = ∞, 1 = m
  function morphK(ts) {
    const P = 7.4, p = (ts % P) / P;
    if (p < 0.40) return 0;
    if (p < 0.50) return smooth((p - 0.40) / 0.10);
    if (p < 0.90) return 1;
    return 1 - smooth((p - 0.90) / 0.10);
  }
  // one frame: morph the field, and let the same highlight keep orbiting
  function draw(now) {
    const ts = now * 0.001, tg = ts * 2.2, k = morphK(ts);
    const rows = [];
    for (let j = 0; j < H; j++) {
      let r = "";
      for (let i = 0; i < W; i++) {
        const x = (i - cx) / SX, y = (mid - j) / SY;
        // morph the normalised fields so each form keeps its own ribbon thickness
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
    // left-align: strip the common left margin so the glyph's left edge meets the text;
    // keep all H rows so it stays vertically centred
    let lead = W;
    for (const ln of rows) { const k2 = ln.search(/[^ ]/); if (k2 >= 0) lead = Math.min(lead, k2); }
    if (lead === W) lead = 0;
    const out = rows.map((ln) => ln.slice(lead).replace(/\s+$/, ""));
    while (out.length && out[0] === "") out.shift();          // drop blank top rows
    while (out.length && out[out.length - 1] === "") out.pop();// and blank bottom rows
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

  artEl.textContent = draw(0); // first paint (still infinity for reduced-motion)

  new IntersectionObserver(([e]) => {
    onScreen = e.isIntersecting;
    if (onScreen && !raf && !REDUCED_MOTION) raf = requestAnimationFrame(loop);
  }).observe(morphPanel);
  if (!REDUCED_MOTION) raf = requestAnimationFrame(loop);
}

// ---------- nav (articles): a single underline glides between the links ----------
const navLinks = document.querySelector(".nav-links");
if (navLinks) {
  const glide = document.createElement("span");
  glide.className = "nav-glide";
  navLinks.appendChild(glide);

  navLinks.querySelectorAll(":scope > a").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      glide.style.opacity = "1";
      glide.style.left = el.offsetLeft + "px";
      glide.style.width = el.offsetWidth + "px";
    });
    // magnetic micro-pull toward the cursor
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${((e.clientX - r.left) / r.width - 0.5) * 4}px, ${((e.clientY - r.top) / r.height - 0.5) * 3}px)`;
    });
    el.addEventListener("pointerleave", () => { el.style.transform = ""; });
  });
  navLinks.addEventListener("mouseleave", () => { glide.style.opacity = "0"; });
}

// ---------- contact dropdown: click email to copy it ----------
const copyEmail = document.getElementById("copy-email");
if (copyEmail) {
  const EMAIL = "notesfrommuhib@gmail.com";
  const label = copyEmail.querySelector(".cd-label");
  copyEmail.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = EMAIL; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch {}
      ta.remove();
    }
    const prev = label.textContent;
    label.textContent = "copied!";
    setTimeout(() => { label.textContent = prev; }, 1600);
  });
}

// ---------- scene: the painting, sampled pixel-by-pixel into a living mosaic ----------
const sceneCanvas = document.querySelector(".scene-canvas");
if (sceneCanvas) {
  const ctx = sceneCanvas.getContext("2d");
  const DPR = Math.min(2, devicePixelRatio || 1);
  const COLS = 360;                       // sample columns; rows follow the image aspect (finer = more detail)
  // ponytail: O(cells) fillRects per frame (~25k after the white cull). drop COLS if it ever janks.
  let cells = [], W = 0, H = 0, mx = -9999, my = -9999;
  const RAMP = " ·˳˷~≈";                    // ascii ripple glyphs, calm → choppy

  const img = new Image();
  img.src = "/scene.jpg";

  function resize() {
    W = sceneCanvas.width = Math.round(innerWidth * DPR);
    H = sceneCanvas.height = Math.round(innerHeight * DPR);
  }

  function sample() {
    const rows = Math.round(COLS * (img.height / img.width));
    const off = document.createElement("canvas");
    off.width = COLS; off.height = rows;
    const octx = off.getContext("2d", { willReadFrequently: true });
    octx.drawImage(img, 0, 0, COLS, rows);
    const d = octx.getImageData(0, 0, COLS, rows).data;
    cells = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < COLS; x++) {
        const i = (y * COLS + x) * 4;
        const r = d[i], g = d[i + 1], b = d[i + 2];
        const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        const skyW = Math.max(0, 1 - (y / rows) / 0.5);   // 1 at the top sky, fades to 0 by mid
        let a = Math.pow(1 - lum, 1.4) * 0.97;       // dark paint stays, bright mist fades — but keep a whisper
        a = Math.min(0.97, a * (1 + skyW * 0.85));   // deepen the sky's presence
        if (a < 0.03) continue;                      // keep faint sky shade, cull only the whitest
        // pop the color off grey + add contrast — deep everywhere, deeper in the sky
        const mean = (r + g + b) / 3, sat = 2.1 + skyW * 1.1, con = 1.2 + skyW * 0.3;
        const ch = (v) => { let o = mean + (v - mean) * sat; o = 128 + (o - 128) * con; return Math.max(0, Math.min(255, o)) | 0; };
        const rr = ch(r), gg = ch(g), bb = ch(b);
        cells.push({ gx: (x + 0.5) / COLS, gy: (y + 0.5) / rows, r: rr, g: gg, b: bb, a, ph: ((x * 13 + y * 7) % 628) / 100 });
      }
    }
  }

  function paint(t) {
    ctx.clearRect(0, 0, W, H);
    const cw = W / COLS;
    const still = REDUCED_MOTION;
    const sz = cw * 1.16;                  // crisper blocks — more detail, still no gaps under the zoom
    const OVER = 1.05, cx = W / 2, cy = H / 2;   // overscan so motion never bares white edges
    for (const c of cells) {
      let x = cx + (c.gx * W - cx) * OVER;
      let y = cy + (c.gy * H - cy) * OVER;
      if (!still && c.gy > 0.72) {                     // only open water moves; shoreline/reflections hold still
        const water = (c.gy - 0.72) / 0.28;            // 0 below the shoreline → 1 at the bottom
        x += Math.sin(t * 0.8 + c.ph) * cw * 0.3 * water;
        y += Math.cos(t * 0.6 + c.ph) * cw * 0.24 * water;
        y += Math.sin(x * 0.010 - t * 1.5 + c.gy * 7) * cw * 1.0 * water;  // coherent swell
      }
      ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${c.a})`;
      ctx.fillRect(x - sz / 2, y - sz / 2, sz, sz);
    }
    if (!still) drawWater(t);
  }

  // ascii ripple characters shimmering + drifting over the water; they sharpen near the cursor
  function drawWater(t) {
    const ch = 15 * DPR;
    ctx.font = `${ch}px "IBM Plex Mono", ui-monospace, monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const colStep = ch * 2, rowStep = ch * 1.7, top = H * 0.6, R = 150 * DPR;
    for (let yy = top; yy < H - ch; yy += rowStep) {
      for (let xx = colStep * 0.5; xx < W; xx += colStep) {
        let v = Math.sin(xx * 0.012 - t * 1.8 + yy * 0.02) * 0.5 + 0.5;
        const dx = xx - mx, dy = yy - my, d2 = dx * dx + dy * dy;
        if (d2 < R * R) v += (1 - Math.sqrt(d2) / R) * 0.55;   // cursor stirs the water
        const g = RAMP[Math.max(0, Math.min(RAMP.length - 1, Math.floor(v * RAMP.length)))];
        if (g === " ") continue;
        const fade = Math.min(1, (yy - top) / (H - top));
        ctx.fillStyle = `rgba(74, 94, 82, ${0.16 + 0.26 * fade})`;
        ctx.fillText(g, xx, yy);
      }
    }
  }

  let raf = 0;
  function loop(now) { paint(now * 0.001); raf = requestAnimationFrame(loop); }

  img.onload = () => {
    resize();
    sample();
    if (REDUCED_MOTION) { paint(0); }
    else { cancelAnimationFrame(raf); raf = requestAnimationFrame(loop); }
  };
  addEventListener("resize", () => { if (cells.length) resize(); });

  if (!REDUCED_MOTION) {
    addEventListener("pointermove", (e) => { mx = e.clientX * DPR; my = e.clientY * DPR; });
  }
}

// ---------- console signature ----------
console.log("%c﷽", "font-size:22px; color:#7AAACE;");
console.log("%c۞ muhib waqar", "font-size:20px; color:#9CD5FF; font-family:serif; font-style:italic;");
