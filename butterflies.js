// landing scene — a living version of the butterfly still.
// the photo is pre-blurred into a soft night backdrop; translucent
// glass-wing butterflies with lens glints flutter and drift over it,
// under slow light leaks, grain and a vignette.
const REDUCED_MOTION = matchMedia("(prefers-reduced-motion: reduce)").matches;

const canvas = document.querySelector("canvas.landing-butterflies");
if (canvas) {
  const ctx = canvas.getContext("2d");
  const DPR = Math.min(2, devicePixelRatio || 1);
  const TAU = Math.PI * 2;
  let W = 0, H = 0, raf = 0, onScreen = true, lastFrame = 0;

  const rand = (a, b) => a + Math.random() * (b - a);
  const cl = (v) => Math.max(0, Math.min(1, v));

  // ---------- backdrop: the photo, blurred once into an offscreen canvas ----------
  const photo = new Image();
  photo.src = canvas.dataset.src || "/butterflies.png";
  const back = document.createElement("canvas");
  let backReady = false;

  function buildBackdrop() {
    if (!photo.complete || !photo.naturalWidth || !W) return;
    back.width = W; back.height = H;
    const b = back.getContext("2d");
    const s = Math.max(W / photo.naturalWidth, H / photo.naturalHeight) * 1.08;
    const dw = photo.naturalWidth * s, dh = photo.naturalHeight * s;
    b.filter = `blur(${Math.round(W * 0.022)}px) saturate(1.25) brightness(0.92)`;
    b.drawImage(photo, (W - dw) / 2, (H - dh) / 2, dw, dh);
    b.filter = "none";
    backReady = true;
  }
  photo.onload = buildBackdrop;

  // ---------- grain tile ----------
  const grain = document.createElement("canvas");
  grain.width = grain.height = 192;
  {
    const g = grain.getContext("2d");
    const id = g.createImageData(192, 192);
    for (let i = 0; i < id.data.length; i += 4) {
      const v = 128 + (Math.random() - 0.5) * 255;
      id.data[i] = id.data[i + 1] = id.data[i + 2] = v;
      id.data[i + 3] = 255;
    }
    g.putImageData(id, 0, 0);
  }

  // ---------- butterflies ----------
  // anchors echo the still: spread across the frame, larger low-left, smaller up top
  const SEEDS = [
    { x: 0.22, y: 0.07, s: 0.055, tilt: -0.5 },
    { x: 0.06, y: 0.24, s: 0.105, tilt: 0.35 },
    { x: 0.48, y: 0.21, s: 0.095, tilt: -0.15 },
    { x: 0.86, y: 0.24, s: 0.105, tilt: 0.3 },
    { x: 0.25, y: 0.42, s: 0.07, tilt: 0.1 },
    { x: 0.83, y: 0.55, s: 0.10, tilt: -0.55 },
    { x: 0.18, y: 0.80, s: 0.15, tilt: 0.2 },
    { x: 0.53, y: 0.83, s: 0.095, tilt: -0.1 },
    { x: 0.92, y: 0.84, s: 0.09, tilt: 0.65 },
  ];
  const flies = SEEDS.map((b, i) => ({
    ...b,
    depth: 0.7 + b.s * 3,                 // bigger reads closer: brighter, sharper, faster
    phase: rand(0, TAU),
    flap: rand(4.6, 6.4),                 // wingbeats/sec — lazy, moth-like
    rest: rand(0, 1) < 0.35,              // some hold their wings open, then flutter in bursts
    restT: rand(0, 6),
    dx: rand(0, TAU), dy: rand(0, TAU),   // drift phases
    spin: rand(0, TAU),
    glint: rand(0, TAU),
    hue: i % 3 === 0 ? 178 : i % 3 === 1 ? 165 : 190,
  }));

  // wing outlines in unit space (body at origin, right wing; mirrored for left)
  function forewing(c) {
    c.moveTo(0.03, -0.05);
    c.bezierCurveTo(0.35, -0.75, 0.95, -0.92, 1.05, -0.6);
    c.bezierCurveTo(1.12, -0.32, 0.9, -0.05, 0.62, 0.02);
    c.bezierCurveTo(0.4, 0.06, 0.15, 0.06, 0.03, 0.03);
    c.closePath();
  }
  function hindwing(c) {
    c.moveTo(0.03, 0.02);
    c.bezierCurveTo(0.42, 0.02, 0.8, 0.12, 0.78, 0.45);
    c.bezierCurveTo(0.76, 0.72, 0.5, 0.92, 0.28, 0.82);
    c.bezierCurveTo(0.1, 0.72, 0.02, 0.45, 0.03, 0.02);
    c.closePath();
  }

  function drawWingPair(c, r, alpha, hue) {
    // r: fold factor 0..1 (1 = fully open). wings rotate about the body axis,
    // so on screen they foreshorten horizontally and the far edge lifts a touch.
    c.save();
    c.scale(Math.max(0.08, r), 1);
    c.translate(0, -(1 - r) * 0.12);

    for (const wing of [forewing, hindwing]) {
      const grad = c.createRadialGradient(0.15, 0.05, 0.02, 0.45, 0, 1.05);
      grad.addColorStop(0, `hsla(${hue}, 60%, 96%, ${0.95 * alpha})`);
      grad.addColorStop(0.35, `hsla(${hue}, 55%, 86%, ${0.72 * alpha})`);
      grad.addColorStop(0.8, `hsla(${hue}, 45%, 74%, ${0.42 * alpha})`);
      grad.addColorStop(1, `hsla(${hue}, 40%, 68%, ${0.12 * alpha})`);
      c.beginPath(); wing(c);
      c.fillStyle = grad;
      c.fill();
      // soft rim
      c.lineWidth = 0.018;
      c.strokeStyle = `hsla(${hue}, 45%, 98%, ${0.35 * alpha})`;
      c.stroke();
    }
    // veins — thin radiating lines from the wing root
    c.lineWidth = 0.011;
    c.strokeStyle = `hsla(${hue}, 35%, 60%, ${0.28 * alpha})`;
    c.beginPath();
    for (let k = 0; k < 6; k++) {
      const a = -1.25 + k * 0.22;
      c.moveTo(0.05, -0.02);
      c.quadraticCurveTo(0.45 * Math.cos(a) + 0.15, 0.55 * Math.sin(a) - 0.1, 1.0 * Math.cos(a) + 0.05, 0.85 * Math.sin(a) - 0.05);
    }
    for (let k = 0; k < 4; k++) {
      const a = 0.25 + k * 0.28;
      c.moveTo(0.04, 0.05);
      c.quadraticCurveTo(0.4 * Math.cos(a), 0.4 * Math.sin(a) + 0.05, 0.72 * Math.cos(a) + 0.02, 0.85 * Math.sin(a) + 0.02);
    }
    c.stroke();
    c.restore();
  }

  function drawButterfly(f, t, still) {
    const size = f.s * W;
    // drift: slow figure-eight wander, bigger ones travel a little more
    const ax = still ? 0 : Math.sin(t * 0.21 + f.dx) * 0.035 * f.depth;
    const ay = still ? 0 : Math.sin(t * 0.17 + f.dy) * 0.03 * f.depth + Math.sin(t * f.flap * 0.5 + f.phase) * 0.003;
    const x = (f.x + ax) * W, y = (f.y + ay) * H;

    // wingbeat: resting ones pause open, then burst
    let r = 1;
    if (!still) {
      let beat = Math.sin(t * f.flap * TAU * 0.5 + f.phase);
      if (f.rest) {
        const cyc = (t + f.restT) % 6;
        const burst = cyc < 2.2 ? 1 : cl(1 - (cyc - 2.2) / 0.5);
        beat = beat * burst + (1 - burst);
      }
      r = 0.28 + 0.72 * (0.5 + 0.5 * beat);
      r = Math.pow(r, 0.8);
    }
    const alpha = 0.55 + 0.45 * cl((f.depth - 0.7) / 0.6);
    const rot = f.tilt + (still ? 0 : Math.sin(t * 0.33 + f.spin) * 0.08);

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.scale(size, size);

    // glow halo behind the wings
    const halo = ctx.createRadialGradient(0, 0, 0.05, 0, 0, 1.5);
    halo.addColorStop(0, `hsla(${f.hue}, 70%, 92%, ${0.28 * alpha})`);
    halo.addColorStop(0.5, `hsla(${f.hue}, 70%, 85%, ${0.08 * alpha})`);
    halo.addColorStop(1, "hsla(180, 70%, 85%, 0)");
    ctx.fillStyle = halo;
    ctx.beginPath(); ctx.arc(0, 0, 1.5, 0, TAU); ctx.fill();

    drawWingPair(ctx, r, alpha, f.hue);            // right
    ctx.save(); ctx.scale(-1, 1); drawWingPair(ctx, r, alpha, f.hue); ctx.restore(); // left

    // body
    ctx.fillStyle = `rgba(215, 235, 232, ${0.9 * alpha})`;
    ctx.beginPath(); ctx.ellipse(0, 0.12, 0.045, 0.34, 0, 0, TAU); ctx.fill();
    ctx.lineWidth = 0.012; ctx.strokeStyle = `rgba(230,245,242,${0.7 * alpha})`;
    ctx.beginPath(); ctx.moveTo(-0.02, -0.2); ctx.quadraticCurveTo(-0.22, -0.55, -0.32, -0.62);
    ctx.moveTo(0.02, -0.2); ctx.quadraticCurveTo(0.22, -0.55, 0.32, -0.62); ctx.stroke();

    // lens glint at the body: hot core + shimmering star rays
    const gp = still ? 1 : 0.8 + 0.2 * Math.sin(t * 2.3 + f.glint) * Math.sin(t * 0.7 + f.glint * 2);
    const core = ctx.createRadialGradient(0, 0.02, 0, 0, 0.02, 0.55 * gp);
    core.addColorStop(0, `rgba(255,255,250,${0.95 * alpha})`);
    core.addColorStop(0.18, `rgba(255,250,220,${0.75 * alpha})`);
    core.addColorStop(0.5, `rgba(255,235,190,${0.18 * alpha})`);
    core.addColorStop(1, "rgba(255,230,180,0)");
    ctx.fillStyle = core;
    ctx.beginPath(); ctx.arc(0, 0.02, 0.55 * gp, 0, TAU); ctx.fill();

    ctx.globalCompositeOperation = "lighter";
    ctx.save();
    ctx.translate(0, 0.02);
    ctx.rotate(still ? 0 : t * 0.15 + f.glint);
    const rays = 6;
    for (let k = 0; k < rays; k++) {
      const len = (k % 2 ? 0.75 : 1.25) * gp * (0.85 + 0.15 * Math.sin(t * 3 + k));
      const ray = ctx.createLinearGradient(0, 0, len, 0);
      ray.addColorStop(0, `rgba(255,252,235,${0.55 * alpha})`);
      ray.addColorStop(1, "rgba(255,252,235,0)");
      ctx.fillStyle = ray;
      ctx.beginPath();
      ctx.moveTo(0, -0.02); ctx.lineTo(len, 0); ctx.lineTo(0, 0.02); ctx.closePath();
      ctx.fill();
      ctx.rotate(TAU / rays);
    }
    ctx.restore();
    ctx.restore();
  }

  // ---------- light leaks: slow diagonal washes in warm amber, magenta and cyan ----------
  function drawLeaks(t) {
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    const leaks = [
      { c: "rgba(255, 150, 80, 0.16)", w: 0.22, sp: 0.045, off: 0.0, ang: -0.35 },
      { c: "rgba(255, 90, 140, 0.11)", w: 0.15, sp: 0.03, off: 2.1, ang: -0.3 },
      { c: "rgba(80, 170, 255, 0.13)", w: 0.28, sp: 0.02, off: 4.2, ang: -0.4 },
    ];
    for (const l of leaks) {
      const cx = (0.5 + 0.55 * Math.sin(t * l.sp + l.off)) * W;
      ctx.save();
      ctx.translate(cx, H / 2);
      ctx.rotate(l.ang);
      const g = ctx.createLinearGradient(-l.w * W, 0, l.w * W, 0);
      g.addColorStop(0, "rgba(0,0,0,0)");
      g.addColorStop(0.5, l.c);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(-l.w * W, -H, 2 * l.w * W, 2 * H);
      ctx.restore();
    }
    ctx.restore();
  }

  // ---------- floating dust motes ----------
  const motes = Array.from({ length: 34 }, () => ({
    x: Math.random(), y: Math.random(), r: rand(0.6, 1.8), v: rand(0.004, 0.012), ph: rand(0, TAU),
  }));
  function drawMotes(t) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (const m of motes) {
      const x = ((m.x + Math.sin(t * 0.13 + m.ph) * 0.02) % 1) * W;
      const y = ((m.y - t * m.v + 10) % 1) * H;
      const a = 0.25 + 0.35 * (0.5 + 0.5 * Math.sin(t * 1.4 + m.ph));
      ctx.fillStyle = `rgba(235, 245, 250, ${a})`;
      ctx.beginPath(); ctx.arc(x, y, m.r * DPR, 0, TAU); ctx.fill();
    }
    ctx.restore();
  }

  function paint(t) {
    const still = REDUCED_MOTION;
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, W, H);

    if (backReady) {
      // breathing zoom + parallax sway on the blurred photo
      const z = 1.03 + (still ? 0 : 0.02 * Math.sin(t * 0.12));
      const ox = still ? 0 : Math.sin(t * 0.09) * W * 0.008;
      const oy = still ? 0 : Math.cos(t * 0.07) * H * 0.008;
      ctx.drawImage(back, (W - W * z) / 2 + ox, (H - H * z) / 2 + oy, W * z, H * z);
    } else {
      ctx.fillStyle = "#121018";
      ctx.fillRect(0, 0, W, H);
    }

    drawLeaks(still ? 0 : t);
    drawMotes(still ? 0 : t);

    // painter's order: far (small) first, near (large) last
    for (const f of [...flies].sort((a, b) => a.s - b.s)) drawButterfly(f, t, still);

    // vignette
    ctx.globalCompositeOperation = "source-over";
    const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, Math.hypot(W, H) * 0.62);
    vg.addColorStop(0, "rgba(0,0,0,0)");
    vg.addColorStop(1, "rgba(5,3,10,0.55)");
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, W, H);

    // film grain
    ctx.save();
    ctx.globalCompositeOperation = "overlay";
    ctx.globalAlpha = 0.11;
    const gx = still ? 0 : -Math.floor(Math.random() * 192), gy = still ? 0 : -Math.floor(Math.random() * 192);
    ctx.translate(gx, gy);
    ctx.fillStyle = ctx.createPattern(grain, "repeat");
    ctx.fillRect(-gx, -gy, W + 192, H + 192);
    ctx.restore();
  }

  function resize() {
    const r = canvas.getBoundingClientRect();
    if (!r.width) return;
    W = canvas.width = Math.round(r.width * DPR);
    H = canvas.height = Math.round(r.height * DPR);
    buildBackdrop();
    paint(performance.now() * 0.001);
  }

  function loop(now) {
    raf = 0;
    if (!onScreen || REDUCED_MOTION) return;
    if (now - lastFrame > 24) { lastFrame = now; paint(now * 0.001); }
    raf = requestAnimationFrame(loop);
  }

  resize();
  addEventListener("resize", resize);
  new IntersectionObserver(([e]) => {
    onScreen = e.isIntersecting;
    if (onScreen && !raf && !REDUCED_MOTION) raf = requestAnimationFrame(loop);
  }).observe(canvas);
  if (!REDUCED_MOTION) raf = requestAnimationFrame(loop);
}
