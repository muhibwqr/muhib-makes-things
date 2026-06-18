// ============================================================
// attention geometry - the engine behind /transformers/explore
// the words sit on a real spiderweb (hub, spokes, silk rings, a
// spider at the center). the bright threads are attention weights.
// no rotation, no idle motion: one fixed, best-viewable angle.
// the only life is yours - grab a word and pull its threads.
// pure canvas, no deps. matches the article's light/dark theme.
// ============================================================

const cv = document.getElementById("stage");
const ctx = cv.getContext("2d");

const TOKENS = ["the", "cat", "sat", "on", "the", "mat", "because", "it", "was", "tired"];
const N = TOKENS.length;

const HEADS = [
  { name: "previous",  color: [156, 213, 255], rule: (i, j) => (j === i - 1 ? 3.4 : 0) },
  { name: "coref",     color: [224, 120, 142], rule: corefRule },
  { name: "neighbour", color: [232, 185, 116], rule: (i, j) => Math.exp(-Math.abs(i - j) / 1.1) * 2.4 },
  { name: "opening",   color: [143, 179, 154], rule: (i, j) => (j === 0 ? 2.0 : 0) + (j === i ? 0.6 : 0) },
];
function corefRule(i, j) {
  let s = j === i ? 0.4 : 0;
  if ((i === 7 || i === 8 || i === 9) && j === 1) s += 3.6;
  if (i === 2 && j === 1) s += 2.4;
  if (i === 5 && j === 3) s += 1.4;
  return s;
}
function hash(str) {
  let x = 2166136261;
  for (let k = 0; k < str.length; k++) { x ^= str.charCodeAt(k); x = Math.imul(x, 16777619); }
  return ((x >>> 0) % 1000) / 1000;
}
const scores = HEADS.map((h) => {
  const M = [];
  for (let i = 0; i < N; i++) { const r = []; for (let j = 0; j < N; j++) r.push(h.rule(i, j) + 0.15 * hash(h.name + i + "_" + j)); M.push(r); }
  return M;
});
function attention(h, T) {
  const M = scores[h], out = [];
  for (let i = 0; i < N; i++) {
    const z = M[i].map((s) => s / T);
    const m = Math.max(...z);
    const e = z.map((v) => Math.exp(v - m));
    const sum = e.reduce((a, b) => a + b, 0);
    out.push(e.map((v) => v / sum));
  }
  return out;
}

// ---------- geometry: the words ride the outer ring of a tilted web ----------
const R = 230;
const nodes = TOKENS.map((t, i) => {
  const a = (i / N) * Math.PI * 2 - Math.PI / 2;
  return { label: t, i, bx: Math.cos(a) * R, by: Math.sin(a) * R * 0.42, bz: Math.sin(a) * R * 0.62, pdx: 0, pdy: 0, pvx: 0, pvy: 0 };
});

// ---------- camera: a flattering base angle with a slow 3-D sway (no full spin) ----------
const YAW = 0.5, PITCH = -0.42, FOCAL = 760;
let camYaw = YAW, camPitch = PITCH;
let zoom = 1, tgtZoom = 1, cxf = 0.5, cyf = 0.5;
let cx = 0, cyc = 0, W = 0, H = 0, DPR = 1, inited = false;

function resize() {
  DPR = Math.min(devicePixelRatio || 1, 2);
  W = innerWidth; H = innerHeight;
  cv.width = W * DPR; cv.height = H * DPR;
  cv.style.width = W + "px"; cv.style.height = H + "px";
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  if (!inited) { cx = W * cxf; cyc = H * cyf; inited = true; }
}
addEventListener("resize", resize); resize();

function project(p) {
  const cyw = Math.cos(camYaw), syw = Math.sin(camYaw), cp = Math.cos(camPitch), sp = Math.sin(camPitch);
  const x1 = p.x * cyw + p.z * syw, z1 = -p.x * syw + p.z * cyw;
  const y1 = p.y * cp - z1 * sp, z2 = p.y * sp + z1 * cp;
  const f = (FOCAL / (FOCAL + z2)) * zoom;
  return { x: cx + x1 * f, y: cyc + y1 * f, s: f, z: z2 };
}

function palette() {
  const dark = document.body.classList.contains("dark");
  return dark
    ? { dark, node: [247, 248, 240], blend: "lighter", edgeBoost: 1.0, silk: "rgba(150,165,150,0.16)", spider: "rgba(247,248,240,0.55)" }
    : { dark, node: [28, 27, 24], blend: "source-over", edgeBoost: 1.25, silk: "rgba(60,70,60,0.14)", spider: "rgba(28,27,24,0.5)" };
}

let T = 1.0, sceneTemp = 1.0, pinned = -1, hover = -1;
let grabIdx = -1, cursorX = 0, cursorY = 0, px = 0, py = 0;

function frame() {
  const t = performance.now() * 0.001;
  camYaw = YAW + 0.28 * Math.sin(t * 0.26);     // slow orbit-sway so depth is obvious
  camPitch = PITCH + 0.07 * Math.sin(t * 0.19);
  const mob = W < 760;
  cx += ((mob ? 0.5 : cxf) * W - cx) * 0.06;
  cyc += ((mob ? 0.34 : cyf) * H - cyc) * 0.06;
  zoom += (tgtZoom - zoom) * 0.06;
  T += (sceneTemp - T) * 0.08;

  const pal = palette();
  ctx.clearRect(0, 0, W, H);

  const P = nodes.map((n, i) => {
    const b = 4 * Math.sin(t * 0.9 + i * 1.7);           // each word floats a little
    return project({ x: n.bx, y: n.by + b, z: n.bz + b * 0.6 });
  });

  // string-pull: pin the grabbed word to the cursor, spring the rest back
  for (let i = 0; i < N; i++) {
    const nd = nodes[i];
    if (i === grabIdx) {
      const ox = nd.pdx, oy = nd.pdy;
      nd.pdx = cursorX - P[i].x; nd.pdy = cursorY - P[i].y;
      nd.pvx = nd.pdx - ox; nd.pvy = nd.pdy - oy;
    } else {
      nd.pvx += -nd.pdx * 0.10; nd.pvy += -nd.pdy * 0.10;
      nd.pvx *= 0.80; nd.pvy *= 0.80;
      nd.pdx += nd.pvx; nd.pdy += nd.pvy;
    }
    P[i].x += nd.pdx; P[i].y += nd.pdy;
  }

  const hub = project({ x: 0, y: 0, z: 0 });

  // ---- the silk web behind the words: spokes, then concentric rings ----
  ctx.strokeStyle = pal.silk; ctx.lineWidth = 1;
  for (let i = 0; i < N; i++) { ctx.beginPath(); ctx.moveTo(hub.x, hub.y); ctx.lineTo(P[i].x, P[i].y); ctx.stroke(); }
  for (const t of [0.4, 0.68, 1.0]) {
    ctx.beginPath();
    for (let i = 0; i <= N; i++) { const p = P[i % N]; const x = hub.x + (p.x - hub.x) * t, y = hub.y + (p.y - hub.y) * t; i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
    ctx.stroke();
  }

  // ---- the bright attention threads ----
  const heads = [...new Set(visible)];
  const mats = heads.map((h) => attention(h, T));
  const focus = hover >= 0 ? hover : pinned;
  const edges = [];
  for (let hi = 0; hi < heads.length; hi++) {
    const A = mats[hi], col = HEADS[heads[hi]].color;
    for (let i = 0; i < N; i++) {
      if (focus >= 0 && i !== focus) continue;
      for (let j = 0; j < N; j++) { if (i === j) continue; const w = A[i][j]; if (w < 0.04) continue; edges.push({ i, j, w, col }); }
    }
  }
  edges.sort((a, b) => (P[a.i].z + P[a.j].z) - (P[b.i].z + P[b.j].z));
  ctx.globalCompositeOperation = pal.blend;
  for (const e of edges) {
    const a = P[e.i], b = P[e.j];
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    const cxp = mx + (hub.x - mx) * 0.5, cyp = my + (hub.y - my) * 0.5;
    const depth = 0.45 + 0.55 * ((a.s + b.s) / 2);
    const alpha = Math.min(0.92, e.w * 1.5 * pal.edgeBoost) * depth * (0.8 + 0.2 * Math.sin(t * 1.7 + e.i * 1.3 + e.j));
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.quadraticCurveTo(cxp, cyp, b.x, b.y);
    ctx.strokeStyle = `rgba(${e.col[0]},${e.col[1]},${e.col[2]},${alpha})`;
    ctx.lineWidth = Math.max(0.5, e.w * 3.4 * depth); ctx.stroke();
  }
  ctx.globalCompositeOperation = "source-over";

  // ---- light beads flowing along the strongest threads ----
  ctx.globalCompositeOperation = pal.blend;
  for (const e of edges) {
    if (e.w < 0.28) continue;
    const a = P[e.i], b = P[e.j], mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    const cxp = mx + (hub.x - mx) * 0.5, cyp = my + (hub.y - my) * 0.5;
    const q = (t * 0.45 + (e.i + e.j) * 0.17) % 1, u = 1 - q;
    const bx = u * u * a.x + 2 * u * q * cxp + q * q * b.x, by = u * u * a.y + 2 * u * q * cyp + q * q * b.y;
    ctx.beginPath(); ctx.arc(bx, by, 2.2, 0, 6.3); ctx.fillStyle = `rgba(${e.col[0]},${e.col[1]},${e.col[2]},0.85)`; ctx.fill();
  }
  ctx.globalCompositeOperation = "source-over";

  // ---- the spider at the hub: a pulse ring rolls off, the legs breathe ----
  const rr = (t % 3) / 3;
  ctx.strokeStyle = pal.silk; ctx.lineWidth = 1; ctx.globalAlpha = (1 - rr) * 0.4;
  ctx.beginPath(); ctx.arc(hub.x, hub.y, (10 + rr * 70) * zoom, 0, 6.3); ctx.stroke(); ctx.globalAlpha = 1;
  ctx.strokeStyle = pal.spider; ctx.lineWidth = 1.6;
  for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2, L = (14 + 2.5 * Math.sin(t * 2.4 + k * 0.5)) * zoom; ctx.beginPath(); ctx.moveTo(hub.x, hub.y); ctx.lineTo(hub.x + Math.cos(a) * L, hub.y + Math.sin(a) * L * 0.75); ctx.stroke(); }
  ctx.beginPath(); ctx.arc(hub.x, hub.y, (6 + 0.5 * Math.sin(t * 2.4)) * zoom, 0, 6.3); ctx.fillStyle = pal.spider; ctx.fill();

  // ---- the words ----
  const order = nodes.map((_, i) => i).sort((a, b) => P[b].z - P[a].z);
  for (const i of order) {
    const p = P[i], lit = focus < 0 || focus === i;
    const r = (focus === i ? 5.5 : 3.4) * p.s;
    ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    if (focus === i) { ctx.fillStyle = "rgba(224,120,142,1)"; ctx.shadowColor = "rgba(224,120,142,0.9)"; ctx.shadowBlur = 16; }
    else ctx.fillStyle = `rgba(${pal.node[0]},${pal.node[1]},${pal.node[2]},${lit ? 0.9 : 0.3})`;
    ctx.fill(); ctx.shadowBlur = 0;
    ctx.font = `${Math.round(15 * p.s)}px "Newsreader", Georgia, serif`;
    ctx.textAlign = "center";
    ctx.fillStyle = `rgba(${pal.node[0]},${pal.node[1]},${pal.node[2]},${lit ? 0.55 + 0.35 * p.s : 0.2})`;
    ctx.fillText(nodes[i].label, p.x, p.y - 12 * p.s);
    nodes[i]._sx = p.x; nodes[i]._sy = p.y; nodes[i]._sr = 15 * p.s;
  }

  // several vibrations travel inward to the spider at once, cycling through the words
  ctx.globalCompositeOperation = "lighter";
  for (let k = 0; k < 3; k++) {
    const tt = t + k * 0.8, pi = (Math.floor(tt / 2.4) * 3 + k) % N, pp = (tt % 2.4) / 2.4;
    if (pp >= 0.92) continue;
    const wn = P[pi], gx = wn.x + (hub.x - wn.x) * pp, gy = wn.y + (hub.y - wn.y) * pp;
    ctx.beginPath(); ctx.arc(gx, gy, 4 - pp * 1.5, 0, 6.3); ctx.fillStyle = `rgba(224,120,142,${0.85 * (1 - pp)})`; ctx.fill();
  }
  ctx.globalCompositeOperation = "source-over";

  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// ---------- pointer: pull a word's strings (no rotation) ----------
function pick(mx, my) { let best = -1, bd = 1e9; for (let i = 0; i < N; i++) { const d = Math.hypot(mx - nodes[i]._sx, my - nodes[i]._sy); if (d < nodes[i]._sr && d < bd) { bd = d; best = i; } } return best; }
cv.addEventListener("pointerdown", (e) => {
  px = e.clientX; py = e.clientY;
  const hit = pick(e.clientX, e.clientY);
  if (hit >= 0) { grabIdx = hit; cursorX = e.clientX; cursorY = e.clientY; cv.setPointerCapture(e.pointerId); cv.style.cursor = "grabbing"; }
});
cv.addEventListener("pointermove", (e) => {
  if (grabIdx >= 0) { cursorX = e.clientX; cursorY = e.clientY; return; }
  hover = pick(e.clientX, e.clientY); cv.style.cursor = hover >= 0 ? "grab" : "default";
});
cv.addEventListener("pointerup", (e) => {
  if (grabIdx >= 0 && Math.abs(e.clientX - px) + Math.abs(e.clientY - py) < 4) { pinned = grabIdx === pinned ? -1 : grabIdx; }
  grabIdx = -1; cv.style.cursor = "grab";
});
cv.addEventListener("pointercancel", () => { grabIdx = -1; });

// ============================================================
// scenes: which words glow, how tight the focus, and the framing.
// no tumbling, no drift - just composition.
// ============================================================
let visible = new Set([0, 1, 2, 3]);
const SCENES = [
  { heads: [0, 1, 2, 3], temp: 0.9,  pin: -1, zoom: 1.0,  cxf: 0.70 },
  { heads: [0, 1, 2, 3], temp: 0.95, pin: -1, zoom: 1.05, cxf: 0.70 },
  { heads: [0, 2, 3],    temp: 0.6,  pin: -1, zoom: 1.05, cxf: 0.30 },
  { heads: [1],          temp: 0.5,  pin: 7,  zoom: 1.12, cxf: 0.70 },
  { heads: [0, 1, 2, 3], temp: 0.95, pin: -1, zoom: 1.0,  cxf: 0.30 },
  { heads: [2],          temp: 0.7,  pin: -1, zoom: 0.95, cxf: 0.70 },
  { heads: [0, 1, 2, 3], temp: 0.85, pin: -1, zoom: 0.8,  cxf: 0.28 },
  { heads: [0, 1, 2, 3], temp: 0.85, pin: -1, zoom: 0.85, cxf: 0.72 },
  { heads: [1, 2],       temp: 0.7,  pin: -1, zoom: 0.78, cxf: 0.28 },
  { heads: [0, 1, 2, 3], temp: 0.9,  pin: -1, zoom: 0.95, cxf: 0.68 },
];
function applyScene(n) {
  const s = SCENES[n]; if (!s) return;
  visible = new Set(s.heads); sceneTemp = s.temp; pinned = s.pin; tgtZoom = s.zoom; cxf = s.cxf;
}

const sections = [...document.querySelectorAll(".scene")];
const railEl = document.getElementById("rail");
const dots = sections.map((_, i) => { const b = document.createElement("button"); b.addEventListener("click", () => sections[i].scrollIntoView({ behavior: "smooth" })); railEl.appendChild(b); return b; });
let active = -1;
const so = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) { const n = +e.target.dataset.scene; if (n !== active) { active = n; applyScene(n); dots.forEach((d, i) => d.classList.toggle("on", i === n)); } }
}, { threshold: 0.55 });
sections.forEach((s) => so.observe(s));
applyScene(0);

const prog = document.getElementById("progress"), cue = document.getElementById("cue");
addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  prog.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + "%";
  if (cue) cue.style.opacity = scrollY > 80 ? "0" : "0.6";
}, { passive: true });

console.log("%c۞ attention, in motion", "font-family:serif;font-style:italic;color:#9CD5FF;font-size:18px;");
