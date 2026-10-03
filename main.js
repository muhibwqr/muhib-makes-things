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

// ---------- contact: upgrade every plain "contact" nav link into the dropdown ----------
document.querySelectorAll('.nav-links a[href="/#contact"], .nav-links a[href="#contact"]').forEach((link) => {
  const menu = document.createElement("div");
  menu.className = "contact-menu";
  menu.innerHTML = `
    <a class="contact-trigger" href="mailto:notesfrommuhib@gmail.com">contact</a>
    <div class="contact-drop-wrap">
      <div class="contact-drop">
        <button type="button" class="cd-item" id="copy-email">
          <svg class="cd-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          <span class="cd-label">email</span>
        </button>
        <a class="cd-item" href="https://linkedin.com/in/muhibwaqar" target="_blank" rel="noopener">
          <svg class="cd-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
          <span>linkedin</span>
        </a>
        <a class="cd-item" href="https://github.com/muhibwqr" target="_blank" rel="noopener">
          <svg class="cd-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
          <span>github</span>
        </a>
        <a class="cd-item" href="https://x.com/muhibwqr" target="_blank" rel="noopener">
          <svg class="cd-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
          <span>twitter</span>
        </a>
      </div>
    </div>`;
  link.replaceWith(menu);
  // click the trigger to pop the dropdown (not just hover); click outside to close
  const trigger = menu.querySelector(".contact-trigger");
  trigger.addEventListener("click", (e) => { e.preventDefault(); menu.classList.toggle("open"); });
  addEventListener("click", (e) => { if (!menu.contains(e.target)) menu.classList.remove("open"); });
});

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
  const COLS = innerWidth < 640 ? 190 : 360;   // fewer samples on phones for smooth frames
  // ponytail: O(cells) fillRects per frame (~25k after the white cull). drop COLS if it ever janks.
  let cells = [], W = 0, H = 0;

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
      if (!still && c.gy > 0.72) {                     // open water: ripple + swell
        const water = (c.gy - 0.72) / 0.28;            // 0 below the shoreline → 1 at the bottom
        x += Math.sin(t * 0.85 + c.ph) * cw * 0.5 * water;
        y += Math.cos(t * 0.6 + c.ph) * cw * 0.4 * water;
        y += Math.sin(x * 0.010 - t * 1.6 + c.gy * 7) * cw * 1.7 * water;  // coherent swell
      } else if (!still && c.g > c.r + 6 && c.g > c.b) {   // greenery on the hills sways in the wind
        const s = Math.sin(t * 1.2 + c.ph);
        x += s * cw * 0.45;
        y += Math.abs(s) * cw * 0.12;
      }
      ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${c.a})`;
      ctx.fillRect(x - sz / 2, y - sz / 2, sz, sz);
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
}

// ---------- console signature ----------
console.log("%c﷽", "font-size:22px; color:#7AAACE;");
console.log("%c۞ muhib waqar", "font-size:20px; color:#9CD5FF; font-family:serif; font-style:italic;");
