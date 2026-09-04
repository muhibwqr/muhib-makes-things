// draft shell: ∞↔m morph
const REDUCED_MOTION = matchMedia("(prefers-reduced-motion: reduce)").matches;

const morphPanel = document.querySelector(".morph-mini-stage");
const artEl = document.getElementById("morph-art");
if (morphPanel && artEl) {
  const W = 36, H = 12, RAMP = " .:-=+*ozX#%@";
  const cx = (W - 1) / 2, mid = (H - 1) / 2, L = RAMP.length - 1;
  const cl = (v) => Math.max(0, Math.min(1, v));
  const wrap = (a) => { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; };
  const smooth = (x) => { x = cl(x); return x * x * (3 - 2 * x); };
  const SX = (W / 2) / 1.12, SY = SX * 0.7, IW = 0.46, IH = 0.72, TH_INF = 0.14, TH_M = 0.09;

  const dInf = (x, y) => {
    const X = x / IW, Y = y / IH, s = X * X + Y * Y, F = s * s - (X * X - Y * Y);
    return Math.abs(F) / (Math.hypot(4 * X * s - 2 * X, 4 * Y * s + 2 * Y) + 1e-6);
  };
  const seg = (px, py, ax, ay, bx, by) => {
    const dx = bx - ax, dy = by - ay;
    const t = cl(((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy));
    return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
  };
  const arc = (px, py, c, cy, r) => {
    const d = Math.hypot(px - c, py - cy);
    return py >= cy ? Math.abs(d - r) : Math.min(Math.hypot(px - (c - r), py - cy), Math.hypot(px - (c + r), py - cy));
  };
  const dM = (x, y) => {
    const yb = -0.30, ys = 0.07, x1 = -0.46, x3 = 0.46, r = 0.23;
    let d = Math.min(seg(x, y, x1, yb, x1, ys), seg(x, y, 0, yb, 0, ys), seg(x, y, x3, yb, x3, ys));
    return Math.min(d, arc(x, y, -0.23, ys, r), arc(x, y, 0.23, ys, r));
  };
  const morphK = (ts) => {
    const P = 7.4, p = (ts % P) / P;
    if (p < 0.40) return 0;
    if (p < 0.50) return smooth((p - 0.40) / 0.10);
    if (p < 0.90) return 1;
    return 1 - smooth((p - 0.90) / 0.10);
  };

  const draw = (now) => {
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
  };

  let raf = 0, onScreen = true, lastFrame = 0;
  const loop = (now) => {
    raf = 0;
    if (!onScreen || REDUCED_MOTION) return;
    if (now - lastFrame > 33) { lastFrame = now; artEl.textContent = draw(now); }
    raf = requestAnimationFrame(loop);
  };
  artEl.textContent = draw(0);
  new IntersectionObserver(([e]) => {
    onScreen = e.isIntersecting;
    if (onScreen && !raf && !REDUCED_MOTION) raf = requestAnimationFrame(loop);
  }).observe(morphPanel);
  if (!REDUCED_MOTION) raf = requestAnimationFrame(loop);
}

if (document.querySelector(".masthead") && document.querySelector(".home-bio")) {
  const wrap = document.createElement("div");
  wrap.className = "site-webring";

  const script = document.createElement("script");
  script.src = "https://uwaterloo.network/embed.js";
  script.setAttribute("data-webring", "");
  script.setAttribute("data-user", "muhib-waqar");
  script.setAttribute("data-align", "left");

  wrap.appendChild(script);
  const signRow = document.querySelector(".sign-row");
  (signRow || document.body).appendChild(wrap);
}

const intro = document.getElementById("intro");
if (intro) {
  if (sessionStorage.getItem("intro")) {
    intro.remove();
  } else {
    const dismiss = () => {
      if (!intro.isConnected || intro.classList.contains("out")) return;
      sessionStorage.setItem("intro", "1");
      intro.classList.add("out");
      intro.addEventListener("transitionend", () => intro.remove(), { once: true });
    };
    intro.addEventListener("click", dismiss);
    addEventListener("keydown", dismiss, { once: true });
    if (!REDUCED_MOTION) setTimeout(dismiss, 4200);
  }
}

/* pixel punch — learn-more + bio-branch: down from top / up from bottom */
if (!REDUCED_MOTION) {
  const more = document.querySelector(".bio-more");
  const photo = document.querySelector(".landing-photo");
  if (more && photo) {
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const finish = (anim) => new Promise((r) => { anim.onfinish = r; });
    const tf = (x, y, sx = 1, sy = 1) =>
      `translate(${x}px, ${y}px) scale(${sx}, ${sy})`;

    const fist = document.createElement("div");
    fist.className = "pixel-fist";
    fist.setAttribute("aria-hidden", "true");
    // front-on fist: knuckles top, thumb mid, blue cuff — flip on down
    const fill = {
      K: "#000000",
      H: "#F5D9BC",
      S: "#F0C8A0",
      D: "#B08860",
      B: "#4070C8",
      N: "#1030A8",
      L: "#98B0E0",
    };
    const rows = [
      "...KK.KK.KK.KK...",
      "...KHKKHHKKHHK...",
      "..KHSSKHSSKHSK...",
      ".KHSSSKSSSKSSHK..",
      "KHSSSSKSSSKSSSHK.",
      "KSSSSSKSSSKSSSSDK",
      "KSSSKKKKKKKKKSSDK",
      "KSSSSSSSSSSSSSSDK",
      "KSSSSSSSSSSSSSDDK",
      "KSSSSDDDDDDDDSDDK",
      "KSSSSDSSSSSSSSDDK",
      "KSSSSSSSSSSSSSDDK",
      "KSSSSSDSSSSSSSSDK",
      "KSSSSSSSSSSSSSSDK",
      ".KSSSSSSSSSSSSDK.",
      ".KSSSSSDSSSSSDK..",
      "..KSSSSSSSSSSK...",
      "...KKKKKKKKKK....",
      "..KBBBBBBBBBBK...",
      "..KBBBBBBBBBNK...",
      "..KBBBBBBBBNLK...",
      "...KKKKKKKKKK....",
    ];
    let rects = "";
    rows.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        const c = fill[row[x]];
        if (c) rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="${c}"/>`;
      }
    });
    fist.innerHTML =
      `<svg viewBox="0 0 17 22" width="17" height="22" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">${rects}</svg>`;
    document.body.appendChild(fist);

    let busy = false;

    const aim = (dir, hitEl) => {
      const r = hitEl.getBoundingClientRect();
      const h = fist.offsetHeight || 93;
      const branch = hitEl !== photo;
      // branch: always kiss paragraph TOP band — never chase long p.bottom into footer/webring
      const x = branch ? r.left + Math.min(28, Math.max(r.width * 0.2, 8)) : r.left + r.width * 0.58;
      let y;
      if (dir === "down") {
        y = r.top - h + 2;
      } else if (branch) {
        const band = Math.min(40, Math.max(14, r.height * 0.12));
        y = r.top + band - h * 0.15;
      } else {
        y = r.bottom - 2;
      }
      return { x, y, fromY: dir === "down" ? -h - 24 : innerHeight + 16, retractY: dir === "down" ? -h - 48 : innerHeight + 40 };
    };

    // paragraph / drop content only — never summary / details shell
    const branchHit = (el) =>
      el.querySelector(":scope > .bio-drop > .bio-drop-inner > p") ||
      el.querySelector(":scope > .bio-drop > .bio-drop-inner") ||
      el.querySelector(":scope > .bio-drop");

    const punch = async (dir, el) => {
      const isBranch = el.classList.contains("bio-branch");
      const hitEl = isBranch ? branchHit(el) : photo;
      if (!hitEl) return;
      const { x, y, fromY, retractY } = aim(dir, hitEl);
      const over = dir === "down" ? 10 : -10;

      fist.dataset.dir = dir;
      fist.style.transform = tf(x, fromY);
      fist.classList.add("on");

      try {
        // ease in → slam into hit
        await finish(
          fist.animate(
            [
              { transform: tf(x, fromY), offset: 0 },
              { transform: tf(x, fromY + (y - fromY) * 0.35), offset: 0.35 },
              { transform: tf(x, y), offset: 1 },
            ],
            { duration: 220, easing: "cubic-bezier(0.55, 0.05, 0.9, 0.4)", fill: "forwards" }
          )
        );

        // impact: momentary photo tug for learn-more; local squash for branch
        if (!isBranch) {
          photo.classList.remove("tugged");
          if (dir === "down") {
            void photo.offsetWidth;
            photo.classList.add("tugged");
          }
        } else {
          hitEl.dataset.punchDir = dir;
          hitEl.classList.remove("punched");
          void hitEl.offsetWidth;
          hitEl.classList.add("punched");
        }

        await finish(
          fist.animate(
            [
              { transform: tf(x, y, 1, 1) },
              { transform: tf(x, y + over, 1.22, 0.68), offset: 0.35 },
              { transform: tf(x, y - over * 0.35, 0.92, 1.08), offset: 0.7 },
              { transform: tf(x, y, 1, 1) },
            ],
            { duration: 140, easing: "cubic-bezier(0.2, 0.9, 0.3, 1)", fill: "forwards" }
          )
        );

        if (isBranch) {
          hitEl.classList.remove("punched");
          delete hitEl.dataset.punchDir;
        } else {
          photo.classList.remove("tugged");
        }

        await wait(40);
        await finish(
          fist.animate(
            [
              { transform: tf(x, y), opacity: 1 },
              { transform: tf(x, retractY), opacity: 0 },
            ],
            { duration: 180, easing: "cubic-bezier(0.4, 0, 1, 1)", fill: "forwards" }
          )
        );
      } finally {
        fist.getAnimations().forEach((a) => a.cancel());
        fist.classList.remove("on");
        fist.style.transform = "";
        delete fist.dataset.dir;
        if (isBranch) {
          hitEl.classList.remove("punched");
          delete hitEl.dataset.punchDir;
        } else {
          photo.classList.remove("tugged");
        }
      }
    };

    const castOpen = (el) => {
      el.open = true;
      el.classList.remove("hook-cast");
      void el.offsetWidth;
      el.classList.add("hook-cast");
    };

    const bindPunch = (el) => {
      el.addEventListener("click", async (e) => {
        const sum = e.target.closest("summary");
        if (!sum || sum.parentElement !== el) return;
        e.preventDefault();
        if (busy) return;
        busy = true;
        try {
          if (el.open) {
            // close: punch still-visible paragraph, then collapse
            await punch("up", el);
            el.open = false;
            el.classList.remove("hook-cast");
          } else if (el.classList.contains("bio-branch")) {
            // open: expand enough to measure, punch paragraph top, then hook-cast reveal
            el.open = true;
            const drop = el.querySelector(":scope > .bio-drop");
            if (drop) {
              drop.style.transition = "none";
              void drop.offsetHeight;
              drop.style.transition = "";
            }
            // force paragraph layout before aim (opacity 0 until hook-cast is fine)
            const hit = branchHit(el);
            if (hit) void hit.offsetHeight;
            await punch("down", el);
            el.classList.remove("hook-cast");
            void el.offsetWidth;
            el.classList.add("hook-cast");
          } else {
            await punch("down", el);
            castOpen(el);
          }
        } finally {
          busy = false;
        }
      });
    };

    bindPunch(more);
    more.querySelectorAll(".bio-branch").forEach(bindPunch);
  }
} else {
  document.querySelectorAll(".bio-more, .bio-branch").forEach((el) => {
    el.addEventListener("toggle", () => {
      if (!el.open) return;
      el.classList.add("hook-cast");
    });
  });
}
