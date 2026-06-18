// ============================================================
// muhib waqar — shared site script (every page loads this)
// palette: #080705 black · #39A0ED blue bell · #304C89 dusk blue
//          #F0F7F4 mint cream · #96705B faded copper
// ============================================================

const REDUCED_MOTION = matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- lights (light mode) — remembered across visits ----------
function setLights(on) {
  document.documentElement.classList.toggle("maker", on);
  document.body.classList.toggle("maker", on);
  try { localStorage.setItem("theme", on ? "light" : "dark"); } catch {}
}
function toggleLights() {
  setLights(!document.body.classList.contains("maker"));
}
{
  // dark by default — lights stay on only if you chose them
  let stored = null;
  try { stored = localStorage.getItem("theme"); } catch {}
  if (location.hash === "#lights" || stored === "light") setLights(true);
}

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
  { threshold: 0.15 }
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

// ---------- lights: the sun in the nav (and the l key) ----------
const lightsBtn = document.getElementById("lights-toggle");
function syncLights() { if (lightsBtn) lightsBtn.textContent = document.body.classList.contains("maker") ? "☾" : "☀"; }
syncLights();
if (lightsBtn) lightsBtn.addEventListener("click", () => { toggleLights(); syncLights(); });

addEventListener("keydown", (e) => {
  const tag = document.activeElement?.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.key === "l") { toggleLights(); syncLights(); }
});

// ---------- console signature ----------
console.log("%c﷽", "font-size:22px; color:#7AAACE;");
console.log("%c۞ muhib waqar", "font-size:20px; color:#9CD5FF; font-family:serif; font-style:italic;");
