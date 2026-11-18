// animated diagrams for the long horizon harnesses article and its slide deck
// inline diagrams: one clean, animated canvas drawing per case
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const MONO = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const GOLD = "#f3cf74", RED = "rgba(255,128,110,0.95)";
const ink = (a) => `rgba(240,240,236,${a})`;
const rand = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const ease = (p) => p * p * (3 - 2 * p);
const text = (ctx, s, x, y, { a = 0.55, size = 10.5, align = "left", color } = {}) => {
  ctx.font = `${size}px ${MONO}`; ctx.textAlign = align; ctx.textBaseline = "middle";
  ctx.fillStyle = color || ink(a); ctx.fillText(s, x, y);
};
const dot = (ctx, x, y, r, fill) => { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill(); };

const FISH_PX = ["#.....####......", "##..#########...", "###.###########.", "##############o#", "################", "###.###########.", "##..#########...", "#.....####......"];
const pixelFish = (ctx, x, y, c, t, alpha = 1, ang = 0) => {
  const fw = 16 * c, fh = 8 * c, wag = Math.round(Math.sin(t * 9));
  ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x, y); ctx.rotate(ang); if (Math.abs(ang) > Math.PI / 2) ctx.scale(1, -1); x = 0; y = 0;
  FISH_PX.forEach((row, r) => [...row].forEach((ch, k) => {
    if (ch === ".") return;
    const yy = y - fh / 2 + (r + (k < 3 ? wag * (r < 4 ? -0.5 : 0.5) : 0)) * c;
    ctx.fillStyle = ch === "o" ? "#1c1c1f" : `rgb(255,${(165 + 55 * (1 - r / 8)) | 0},${(60 + 50 * (1 - r / 8)) | 0})`;
    ctx.fillRect(x - fw / 2 + k * c, yy, c - 0.3, c - 0.3);
  }));
  ctx.restore();
};

const ARCH_EX = {
  cyber: {
    prompt: "Keep this company's accounts and keys safe for the next 12 months. Wake on more than 20 failed logins in 5 minutes, on any new admin account, and 90 days after the last key rotation. You may lock an account and rotate keys. Never delete data. Any new admin goes to the security team.",
    lanes: [["failed logins · on event", 5.0, 0.0, ["nothing", "act", "nothing"]], ["new admin · on event", 7.0, 2.0, ["nothing", "escalate"]], ["key rotation · 90 days", 6.5, 3.9, ["nothing", "nothing", "act"]]],
  },
  basic: {
    prompt: "Keep this goal true for the next 12 months. Check each task on its own schedule. You may take small actions that can be undone. Log every decision, including doing nothing. Anything else goes to a human.",
    lanes: [["task 1 · daily", 6.0, 0.0, ["nothing", "act", "nothing"]], ["task 2 · on event", 7.0, 2.2, ["nothing", "escalate", "act"]], ["task 3 · monthly", 5.5, 4.1, ["nothing", "nothing", "act"]]],
  },
  health: {
    prompt: "Keep this patient's type 2 diabetes care on track for the next 12 months: refills never lapse, A1c stays under 7%, and every abnormal lab is seen by their doctor within 48 hours. You may send reminders and book open slots. Never change a dose. Anything clinical goes to the care team.",
    lanes: [["refills · daily", 6.0, 0.0, ["nothing", "act", "nothing"]], ["lab result · on event", 7.0, 2.2, ["nothing", "escalate", "nothing"]], ["a1c · quarterly", 5.5, 4.1, ["nothing", "act", "nothing"]]],
  },
  fraud: {
    prompt: "Watch every company card for the next 12 months: flag spend that breaks policy, freeze a card within 5 minutes of likely fraud, and match every receipt within 7 days. You may freeze cards and message cardholders. Never move money. Any freeze over $5,000 goes to finance.",
    lanes: [["card swipe · on event", 5.0, 0.0, ["nothing", "nothing", "act", "escalate"]], ["receipts · weekly", 6.5, 2.0, ["act", "nothing"]], ["policy limits · monthly", 7.0, 3.9, ["nothing", "nothing", "escalate"]]],
  },
};
document.querySelectorAll("#arch-fig").forEach((fig) => {
  const cv = fig.querySelector("canvas"), out = fig.querySelector(".dg-prompt-text"), btns = fig.querySelectorAll(".dg-tabs button");
  const pick = (ex) => { cv.dataset.ex = ex; out.textContent = ARCH_EX[ex].prompt; btns.forEach((b) => b.setAttribute("aria-selected", b.dataset.ex === ex)); };
  btns.forEach((b) => b.addEventListener("click", () => pick(b.dataset.ex)));
  pick("basic");
});

{
  const box = document.createElement("div"); box.className = "lh-tip-box"; box.setAttribute("role", "tooltip"); document.body.appendChild(box);
  const show = (e) => { const t = e.currentTarget, r = t.getBoundingClientRect(); box.textContent = t.dataset.tip; box.classList.add("on");
    const bw = box.offsetWidth, bh = box.offsetHeight; box.style.left = Math.max(8, Math.min(innerWidth - bw - 8, r.left)) + "px"; box.style.top = (r.top - bh - 8 < 8 ? r.bottom + 8 : r.top - bh - 8) + "px"; };
  const hide = () => box.classList.remove("on");
  document.querySelectorAll(".lh-tip").forEach((t) => { t.addEventListener("mouseenter", show); t.addEventListener("focus", show); t.addEventListener("mouseleave", hide); t.addEventListener("blur", hide); });
  addEventListener("scroll", hide, { passive: true });
}

const node2 = (ctx, x, y, label) => { ctx.fillStyle = "rgba(255,255,255,0.06)"; ctx.strokeStyle = ink(0.3); ctx.lineWidth = 1; ctx.beginPath(); ctx.roundRect(x - 26, y - 14, 52, 28, 7); ctx.fill(); ctx.stroke(); text(ctx, label, x, y, { align: "center", a: 0.8, size: 9.5 }); };
const diagrams = {
  c3_features(ctx, w, h, t) {
    const feats = ["user can start a new chat", "user sees an AI reply", "chat history persists", "user can rename a chat", "user can delete a chat", "settings page saves"];
    const P = 1.6, n = feats.length, s = Math.floor(t / P) % (n + 2), fr = (t % P) / P;
    text(ctx, "feature_list.json", 0, 12, { a: 0.5, size: 10 });
    const sx = Math.min(w * 0.72, w - 120);
    text(ctx, "session", sx, 12, { a: 0.4, size: 9.5 });
    feats.forEach((f, i) => {
      const y = 34 + i * 20, pass = i < s || (i === s && fr > 0.6);
      text(ctx, f, 0, y, { a: i === s ? 0.9 : 0.55, size: 10 });
      text(ctx, pass ? "passes: true" : "passes: false", sx - 16, y, { align: "right", size: 10, color: pass ? GOLD : undefined, a: pass ? 1 : 0.35 });
    });
    if (s < n) { const y = 34 + s * 20; pixelFish(ctx, sx + 30 + fr * 30, y, 1.2, t); text(ctx, `#${s + 1}`, sx, y, { a: 0.6, size: 9.5 }); }
    text(ctx, "each fresh session flips one feature, then leaves a note for the next", 0, h - 8, { a: 0.35, size: 9 });
  },
  c3_swarm(ctx, w, h, t) {
    const P = 6, fr = (t % P) / P, mid = h / 2 - 6, xP = 40, xJ = w - 50, k = 6;
    node2(ctx, xP, mid, "planner"); node2(ctx, xJ, mid, "judge");
    for (let i = 0; i < k; i++) {
      const y = 24 + i * ((h - 60) / (k - 1)), x1 = xP + 30, x2 = xJ - 30;
      ctx.strokeStyle = ink(0.12); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x1, mid); ctx.bezierCurveTo((x1 + x2) / 2, mid, x1 + 40, y, (x1 + x2) / 2, y); ctx.bezierCurveTo(x2 - 40, y, (x1 + x2) / 2, mid, x2, mid); ctx.stroke();
      const xm = (x1 + x2) / 2, bz = (u, p0, p1, p2, p3) => { const v = 1 - u; return v * v * v * p0 + 3 * v * v * u * p1 + 3 * v * u * u * p2 + u * u * u * p3; };
      const q = fr * 1.5 - i * 0.09;
      if (q > 0 && q < 1) { const u = q < 0.5 ? q * 2 : (q - 0.5) * 2; const [px, py] = q < 0.5 ? [bz(u, x1, xm, x1 + 40, xm), bz(u, mid, mid, y, y)] : [bz(u, xm, x2 - 40, xm, x2), bz(u, y, y, mid, mid)]; pixelFish(ctx, px, py, 1, t + i, 1); }
    }
    const done = fr > 0.85;
    text(ctx, done ? "continue → next cycle starts fresh" : "workers: one task each, no coordinating", w / 2, h - 8, { align: "center", size: 9.5, color: done ? GOLD : undefined, a: done ? 1 : 0.4 });
  },
  c3_mission(ctx, w, h, t) {
    const P = 9, fr = Math.min(1, (t % P) / (P * 0.8)), L = 0, R = w;
    const crit = ["define success", "build", "judge checks criteria"];
    text(ctx, "budget", L, 12, { a: 0.45, size: 9.5 });
    ctx.fillStyle = ink(0.08); ctx.fillRect(L, 20, R - L, 8); ctx.fillStyle = GOLD; ctx.globalAlpha = 0.7; ctx.fillRect(L, 20, (R - L) * (1 - fr * 0.7), 8); ctx.globalAlpha = 1;
    crit.forEach((c, i) => { const on = fr > (i + 1) / 3.2; const x = L + (R - L) * (i / 3) ; dot(ctx, x + 6, 56, 4, on ? GOLD : ink(0.2)); text(ctx, c, x + 16, 56, { size: 10, a: on ? 0.9 : 0.4 }); });
    const y = h - 40, xEnd = L + (R - L) * 0.62;
    ctx.strokeStyle = ink(0.6); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(L + (xEnd - L) * fr, y); ctx.stroke();
    if (fr >= 1) {
      text(ctx, "complete: work stops", xEnd - 4, y - 12, { align: "right", color: GOLD, size: 10 });
      ctx.setLineDash([3, 5]); ctx.strokeStyle = ink(0.25); ctx.beginPath(); ctx.moveTo(xEnd, y); ctx.lineTo(R, y); ctx.stroke(); ctx.setLineDash([]);
      for (let x = xEnd + 20; x < R; x += 26) dot(ctx, x, y, 1.8, ink(0.35));
      text(ctx, "a long horizon harness keeps checking", R, y + 18, { align: "right", a: 0.4, size: 9 });
    } else pixelFish(ctx, L + (xEnd - L) * fr, y, 1.2, t);
  },
  c3_cron(ctx, w, h, t) {
    const L = 110, R = w - 6, n = 10, P = 8, fr = (t % P) / P, rows = [["scheduled run", 24], ["long horizon", 74]];
    rows.forEach(([lab, y]) => { text(ctx, lab, 0, y, { a: 0.55, size: 10 }); ctx.strokeStyle = ink(0.12); ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(R, y); ctx.stroke(); });
    for (let i = 0; i < n; i++) {
      const x = L + ((R - L) * (i + 0.5)) / n; if (fr * n < i) break;
      dot(ctx, x, 24, 3, ink(0.7)); text(ctx, "task", x, 10, { align: "center", a: 0.35, size: 8.5 });
      const act = i === 3 || i === 8; dot(ctx, x, 74, act ? 3.5 : 2, act ? GOLD : ink(0.35));
      text(ctx, act ? "fix" : "nothing", x, 92, { align: "center", size: 8.5, color: act ? GOLD : undefined, a: act ? 1 : 0.35 });
    }
    text(ctx, "claim: error budget held · every wake logged", L, h - 6, { a: 0.4, size: 9 });
  },
  cyber(ctx, w, h, t) {
    const narrow = w < 460, L = narrow ? 110 : 190, R = w - 10, P = 12, tc = (t % P) / P, sweep = L + (R - L) * tc;
    const tracks = [
      ["> 20 failed logins in 5 min", "lock account, alert", [0.18, 0.62], GOLD],
      ["new admin account created", "escalate to security", [0.41], RED],
      ["90 days since last key rotation", "rotate keys", [0.9], "rgba(110,214,200,1)"],
    ];
    text(ctx, "trigger, set by experts", 0, 10, { a: 0.4, size: 9 });
    text(ctx, "day 0", L, h - 8, { a: 0.35, size: 9 }); text(ctx, "day 90", R, h - 8, { a: 0.35, size: 9, align: "right" });
    tracks.forEach(([name, act, fires, col], i) => {
      const y = 40 + i * 46;
      text(ctx, name, 0, y, { a: 0.75, size: narrow ? 8.5 : 10 });
      ctx.strokeStyle = ink(0.15); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(R, y); ctx.stroke();
      for (let k = 0; k < 40; k++) { const x = L + (R - L) * (k / 40) + 3; if (x < sweep) dot(ctx, x, y, 1.2, ink(0.25)); }
      fires.forEach((f) => {
        const x = L + (R - L) * f, hit = sweep >= x, age = (sweep - x) / (R - L);
        ctx.beginPath(); ctx.arc(x, y, hit ? 5 : 4, 0, 7); ctx.strokeStyle = hit ? col : ink(0.3); ctx.lineWidth = 1.4; ctx.stroke();
        if (hit) { dot(ctx, x, y, 2.5, col); if (age < 0.25) text(ctx, act, x, y - 14, { size: 9, align: x > R - 80 ? "right" : "center", color: col }); }
      });
    });
    ctx.strokeStyle = ink(0.35); ctx.setLineDash([2, 3]); ctx.beginPath(); ctx.moveTo(sweep, 24); ctx.lineTo(sweep, h - 20); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, "nothing fires in between", (L + R) / 2, h - 8, { a: 0.3, size: 9, align: "center" });
  },
  L_intent(ctx, w, h, t) {
    const y = h * 0.62, x0 = 14, x1 = w - 26, p = (t % 9) / 9, fx = x0 + (x1 - x0) * ease(p);
    text(ctx, '"keep this goal true for the next 12 months"', x0, 16, { a: 0.75, size: 10 });
    ctx.setLineDash([2, 4]); ctx.strokeStyle = ink(0.25); ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle = "rgba(243,207,116,0.5)"; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(fx, y); ctx.stroke();
    [["now", 0], ["6 mo", 0.5], ["12 mo", 1]].forEach(([s, f]) => { const x = x0 + (x1 - x0) * f; ctx.fillStyle = ink(0.35); ctx.fillRect(x, y - 3, 1, 6); text(ctx, s, x, y + 18, { a: 0.4, size: 9, align: f === 1 ? "right" : f ? "center" : "left" }); });
    ctx.strokeStyle = ink(0.6); ctx.beginPath(); ctx.moveTo(x1 + 8, y); ctx.lineTo(x1 + 8, y - 22); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x1 + 8, y - 22); ctx.lineTo(x1 + 18, y - 18); ctx.lineTo(x1 + 8, y - 14); ctx.fillStyle = GOLD; ctx.fill();
    text(ctx, "stop", x1 + 4, y - 30, { a: 0.45, size: 9, align: "right" });
    pixelFish(ctx, fx, y - 1, 1.4, t, p > 0.92 ? (1 - p) / 0.08 : 1);
  },
  L_contract(ctx, w, h, t) {
    const narrow = w < 460, c = t % 7;
    const rows = [["the target number is met", "every day"], ["nothing is more than 5 days overdue", "every week"], ["every problem is seen by a human", "within 48h"]];
    rows.forEach(([claim, when], i) => {
      const y = 22 + i * 32, on = c > 1 + i * 1.3, k = Math.min(1, (c - 1 - i * 1.3) * 4);
      ctx.strokeStyle = on ? GOLD : ink(0.35); ctx.lineWidth = 1.2; ctx.strokeRect(12, y - 7, 14, 14);
      if (on) { ctx.beginPath(); ctx.moveTo(15, y); ctx.lineTo(15 + 3 * k, y + 3 * k); ctx.lineTo(15 + 3 * k + 5 * k, y + 3 * k - 8 * k); ctx.strokeStyle = GOLD; ctx.stroke(); }
      text(ctx, claim, 36, y, { a: on ? 0.85 : 0.5, size: narrow ? 9 : 10 });
      if (!narrow) text(ctx, when, w - 10, y, { a: 0.38, size: 9, align: "right" });
    });
  },
  L_ledger(ctx, w, h, t) {
    const xa = 14, xb = w * 0.56, xm = w * 0.5, c = t % 8, n = Math.min(4, Math.floor(c / 1.1));
    text(ctx, "ledger", xa, 12, { a: 0.4, size: 9 }); text(ctx, "source of truth", xb, 12, { a: 0.4, size: 9 });
    const rows = [["action taken", "action taken"], ["reminder sent", "reminder sent"], ["value: 6.8", "value: 6.8"], ["task done", "not done"]];
    rows.slice(0, n).forEach(([a, b], i) => {
      const age = c - (i + 1) * 1.1, bump = age < 0.25 ? (1 - age / 0.25) * 6 : 0, y = 34 + i * 21 + bump, bad = a !== b;
      text(ctx, a, xa, y, { a: 0.8, size: 9.5, color: bad ? RED : undefined });
      text(ctx, b, xb, y, { a: 0.8, size: 9.5 });
      text(ctx, bad ? "≠" : "=", xm, y, { a: 0.6, size: 11, align: "center", color: bad ? RED : GOLD });
      if (bad && w > 420) text(ctx, "flagged, fixed", w - 10, y, { size: 9, align: "right", color: RED });
    });
  },
  L_heartbeat(ctx, w, h, t) {
    const y = h * 0.4, gap = w < 460 ? 40 : 56, sweep = (t * 55) % (w + 40);
    const out = (i) => (i % 7 === 3 ? "act" : i % 11 === 8 ? "escalate" : "nothing");
    ctx.beginPath(); ctx.moveTo(0, y);
    for (let x = 0; x < w; x += gap) { const bx = x + gap / 2; ctx.lineTo(bx - 6, y); ctx.lineTo(bx - 3, y - 14); ctx.lineTo(bx + 1, y + 10); ctx.lineTo(bx + 4, y); }
    ctx.lineTo(w, y); ctx.strokeStyle = ink(0.28); ctx.lineWidth = 1.2; ctx.stroke();
    for (let i = 0, x = 0; x < w; x += gap, i++) {
      const bx = x + gap / 2, o = out(i), seen = sweep > bx && sweep - bx < 160;
      text(ctx, o, bx, h * 0.8, { a: seen ? 0.85 : 0.28, size: 8.5, align: "center", color: seen && o !== "nothing" ? (o === "act" ? GOLD : RED) : undefined });
    }
    dot(ctx, sweep, y, 3, GOLD);
  },
  L_senses(ctx, w, h, t) {
    const cx = w * 0.5, cy = h * 0.5, L = ["system of record", "new events", "calendar"], R = ["how a person feels", "offline changes", "new priorities"];
    L.forEach((s, i) => {
      const y = 20 + i * 38, x = w * 0.08;
      ctx.strokeStyle = ink(0.3); ctx.beginPath(); ctx.moveTo(x + 76, y); ctx.lineTo(cx - 20, cy); ctx.stroke();
      const p = (t * 0.5 + i / 3) % 1; dot(ctx, x + 76 + (cx - 20 - x - 76) * p, y + (cy - y) * p, 2, GOLD);
      text(ctx, s, x, y, { a: 0.75, size: 9.5 });
    });
    R.forEach((s, i) => {
      const y = 20 + i * 38, x = w * 0.92;
      ctx.setLineDash([2, 4]); ctx.strokeStyle = ink(0.22); ctx.beginPath(); ctx.moveTo(cx + 20, cy); ctx.lineTo(x - 90, y); ctx.stroke(); ctx.setLineDash([]);
      text(ctx, s + " ?", x, y, { a: 0.45, size: 9.5, align: "right" });
    });
    text(ctx, "can see", w * 0.08, h - 6, { a: 0.35, size: 8.5 }); text(ctx, "can't see: asks a human", w * 0.92, h - 6, { a: 0.35, size: 8.5, align: "right" });
    pixelFish(ctx, cx, cy, 1.4, t);
  },
  L_hands(ctx, w, h, t) {
    const bw = w * 0.56, bx = 10, by = 14, bh = h - 28, inside = ["send a reminder", "schedule a task", "pause something"], outside = ["irreversible change", "move money"];
    ctx.setLineDash([3, 4]); ctx.strokeStyle = ink(0.3); ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 8); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, "limits", bx + bw - 8, by + 10, { a: 0.35, size: 8.5, align: "right" });
    const k = Math.floor(t / 1.4) % inside.length;
    inside.forEach((s, i) => text(ctx, s, bx + 16, by + 22 + i * 24, { a: i === k ? 0.95 : 0.45, size: 9.5, color: i === k ? GOLD : undefined }));
    const fy = by + 22 + k * 24, fx = bx + bw - 50 + Math.sin(t * 2) * 8; pixelFish(ctx, fx, fy, 1.2, t, 1, Math.PI);
    const hx = w - 12, hy = h * 0.5;
    outside.forEach((s, i) => {
      const y = by + 26 + i * 40, x = bx + bw + 16, on = Math.floor(t / 2) % 2 === i;
      text(ctx, s, x, y, { a: on ? 0.8 : 0.4, size: 9.5 });
      ctx.strokeStyle = on ? RED : ink(0.2); ctx.beginPath(); ctx.moveTo(x, y + 9); ctx.lineTo(hx - 30, hy); ctx.stroke();
    });
    text(ctx, "human", hx, hy, { a: 0.8, size: 9.5, align: "right" });
  },
  L_judgment(ctx, w, h, t) {
    const sx = 16, sy = h * 0.5, rx = w * 0.42, bins = { act: 22, wait: h * 0.5, escalate: h - 22 }, bx = w - 70, cyc = 20, tc = t % cyc;
    const kind = (i) => { const r = rand(i + 3); return r < 0.8 ? "wait" : r < 0.94 ? "act" : "escalate"; };
    const cnt = { act: 0, wait: 0, escalate: 0 };
    ctx.strokeStyle = ink(0.2); ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(rx, sy); Object.values(bins).forEach((y) => { ctx.moveTo(rx, sy); ctx.lineTo(bx - 8, y); }); ctx.stroke();
    for (let i = 0; i < cyc / 0.5; i++) {
      const age = tc - i * 0.5; if (age < 0) break;
      const k = kind(i), col = k === "act" ? GOLD : k === "escalate" ? RED : ink(0.6);
      if (age > 2) { cnt[k]++; continue; }
      const p = age / 2, x = p < 0.5 ? sx + (rx - sx) * p * 2 : rx + (bx - 8 - rx) * (p - 0.5) * 2, y = p < 0.5 ? sy : sy + (bins[k] - sy) * (p - 0.5) * 2;
      dot(ctx, x, y, 2.4, col);
    }
    Object.entries(bins).forEach(([k, y]) => text(ctx, `${k} ${cnt[k]}`, bx, y, { a: 0.85, size: 9.5, color: k === "act" ? GOLD : k === "escalate" ? RED : undefined }));
    text(ctx, "beats", sx, sy - 12, { a: 0.35, size: 8.5 });
  },
  L_handoff(ctx, w, h, t) {
    const c = t % 7, nx = w * 0.5, ny = h * 0.5, nw = Math.min(150, w * 0.36), nh = 62;
    ctx.strokeStyle = ink(0.35); ctx.fillStyle = "#26262b"; ctx.beginPath(); ctx.roundRect(nx - nw / 2, ny - nh / 2, nw, nh, 6); ctx.fill(); ctx.stroke();
    const lines = ["saw: task due friday", "did: sent reminder", "next: confirm done"];
    lines.forEach((s, i) => text(ctx, s, nx - nw / 2 + 10, ny - 18 + i * 18, { a: c > 1.6 + i * 0.4 ? 0.85 : 0.2, size: w < 460 ? 8 : 9 }));
    if (c < 2.4) pixelFish(ctx, 20 + (nx - nw / 2 - 40) * ease(Math.min(1, c / 2)), ny, 1.4, t, c > 2 ? (2.4 - c) / 0.4 : 1);
    if (c > 3.4) pixelFish(ctx, nx + nw / 2 + 20 + (w - nx - nw / 2 - 50) * ease(Math.min(1, (c - 3.4) / 2.6)), ny, 1.4, t, c < 3.8 ? (c - 3.4) / 0.4 : c > 6.6 ? (7 - c) / 0.4 : 1);
    text(ctx, "session 1", 20, h - 8, { a: 0.35, size: 8.5 }); text(ctx, "session 2: new model, cold start", w - 10, h - 8, { a: 0.35, size: 8.5, align: "right" });
  },
  L_evals(ctx, w, h, t) {
    const narrow = w < 460, x0 = narrow ? 70 : 92, c = t % 9;
    text(ctx, "standing", 10, 28, { a: 0.75, size: 9.5 }); text(ctx, "posture", 10, 84, { a: 0.75, size: 9.5 });
    text(ctx, "fixed · human owns", 10, 42, { a: 0.3, size: 8 }); text(ctx, "harness proposes", 10, 98, { a: 0.3, size: 8 });
    const chip = (s, x, y, solid, col) => { ctx.font = `${narrow ? 8.5 : 9.5}px ${MONO}`; const tw = ctx.measureText(s).width + 16; ctx.setLineDash(solid ? [] : [3, 3]); ctx.strokeStyle = col || ink(0.35); ctx.beginPath(); ctx.roundRect(x, y - 10, tw, 20, 10); ctx.stroke(); ctx.setLineDash([]); text(ctx, s, x + 8, y, { a: 0.8, size: narrow ? 8.5 : 9.5, color: col }); return x + tw + 8; };
    let x = x0; ["goal held ✓", "nothing overdue ✓"].forEach((s) => (x = chip(s, x, 32, true, GOLD)));
    x = chip("alerts < 3/wk", x0, 88, true);
    if (c > 2) { const ok = c > 5; x = chip(ok ? "skip duplicate alerts ✓" : "+ skip duplicate alerts", x, 88, ok, ok ? GOLD : undefined); if (!ok && c > 3 && !narrow) text(ctx, "awaiting human", x, 88, { a: 0.35, size: 8.5 }); }
  },
  arch(ctx, w, h, t) {
    const narrow = w < 520, s = narrow ? 26 : 34, fs = narrow ? 8 : 9.5, R = 7;
    const X = (f) => Math.round(w * f);
    const yMid = h * 0.5, lanesY = [0.24, 0.5, 0.76].map((f) => Math.round(h * f - 10));
    const N = {
      human: [X(0.06), yMid, "human", "human", 1],
      cls: [X(0.44), yMid, "classifier", "filter", 0],
      agent: [X(0.6), Math.round(h * 0.3), "agent", "spark", 1],
      ledger: [X(0.6), Math.round(h * 0.7), "shared ledger", "doc", 0],
      hands: [X(0.72), Math.round(h * 0.3), "hands", "out", 0],
      evals: [X(0.84), Math.round(h * 0.3), "evals", "check", 1],
      world: [X(0.95), yMid, "world", "globe", 0],
      dream: [X(0.6), Math.round(h * 0.88), "dreaming", "moon", 0],
    };
    const lanes = ARCH_EX[ctx.canvas.dataset.ex || "basic"].lanes;
    lanes.forEach(([name], i) => (N["hb" + i] = [X(0.24), lanesY[i], name, "pulse", 0]));
    const L = (k) => [N[k][0] - s / 2, N[k][1]], Rt = (k) => [N[k][0] + s / 2, N[k][1]], T = (k) => [N[k][0], N[k][1] - s / 2], B = (k) => [N[k][0], N[k][1] + s / 2];
    const xFan = X(0.15), xMerge = X(0.34), xSplit = X(0.53), yTop = 10, yBot = h - 10;
    const E = {
      fan: (i) => [Rt("human"), [xFan, yMid], [xFan, lanesY[i]], L("hb" + i)],
      merge: (i) => [Rt("hb" + i), [xMerge, lanesY[i]], [xMerge, yMid], L("cls")],
      act: () => [Rt("cls"), [xSplit, yMid], [xSplit, N.agent[1]], L("agent")],
      nothing: () => [Rt("cls"), [xSplit, yMid], [xSplit, N.ledger[1]], L("ledger")],
      escalate: () => [T("cls"), [N.cls[0], yTop], [N.human[0], yTop], T("human")],
      rw: () => [B("agent"), T("ledger")],
      doit: () => [Rt("agent"), L("hands")],
      gate: () => [Rt("hands"), L("evals")],
      out: () => [Rt("evals"), [N.world[0], N.evals[1]], T("world")],
      reconcile: () => [B("world"), [N.world[0], N.ledger[1]], Rt("ledger")],
      outcomes: () => [L("world"), [N.evals[0], yMid], B("evals")],
      approve: () => [T("evals"), [N.evals[0], yTop], [N.human[0], yTop], T("human")],
      consolidate: () => [B("ledger"), T("dream")],
      proposals: () => [L("dream"), [N.human[0], N.dream[1]], B("human")],
    };
    const trace = (pts) => {
      ctx.beginPath(); ctx.moveTo(...pts[0]);
      for (let i = 1; i < pts.length - 1; i++) ctx.arcTo(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], R);
      ctx.lineTo(...pts[pts.length - 1]);
    };
    const LANE = [[255, 200, 90], [110, 214, 200], [180, 160, 250]], lc = (i, a = 1) => `rgba(${LANE[i].join(",")},${a})`;
    const arrow = (pts, a = 0.32, col) => {
      trace(pts); ctx.strokeStyle = col || ink(a); ctx.lineWidth = 1.1; ctx.stroke();
      const [x2, y2] = pts[pts.length - 1], [x1, y1] = pts[pts.length - 2], an = Math.atan2(y2 - y1, x2 - x1);
      ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - 6 * Math.cos(an - 0.45), y2 - 6 * Math.sin(an - 0.45)); ctx.lineTo(x2 - 6 * Math.cos(an + 0.45), y2 - 6 * Math.sin(an + 0.45)); ctx.closePath(); ctx.fillStyle = col || ink(a + 0.2); ctx.fill();
    };
    const along = (pts, p) => {
      const seg = []; let tot = 0;
      for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); tot += d; }
      let d = p * tot;
      for (let i = 0; i < seg.length; i++) {
        if (d <= seg[i] || i === seg.length - 1) { const q = Math.min(1, d / seg[i]), [ax, ay] = pts[i], [bx, by] = pts[i + 1]; return [ax + (bx - ax) * q, ay + (by - ay) * q, Math.atan2(by - ay, bx - ax)]; }
        d -= seg[i];
      }
    };
    const glyph = (kind, x, y, c) => {
      const u = s / 34; ctx.strokeStyle = c; ctx.fillStyle = c; ctx.lineWidth = 1.4; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath();
      if (kind === "human") { ctx.arc(x, y - 4 * u, 3.5 * u, 0, 7); ctx.moveTo(x - 7 * u, y + 8 * u); ctx.quadraticCurveTo(x, y - 2 * u, x + 7 * u, y + 8 * u); }
      if (kind === "pulse") { ctx.moveTo(x - 9 * u, y); ctx.lineTo(x - 4 * u, y); ctx.lineTo(x - 2 * u, y - 6 * u); ctx.lineTo(x + 1 * u, y + 6 * u); ctx.lineTo(x + 3 * u, y); ctx.lineTo(x + 9 * u, y); }
      if (kind === "filter") { ctx.moveTo(x - 8 * u, y - 6 * u); ctx.lineTo(x + 8 * u, y - 6 * u); ctx.lineTo(x + 2 * u, y + 1 * u); ctx.lineTo(x + 2 * u, y + 7 * u); ctx.lineTo(x - 2 * u, y + 5 * u); ctx.lineTo(x - 2 * u, y + 1 * u); ctx.closePath(); }
      if (kind === "spark") { ctx.moveTo(x, y - 8 * u); ctx.quadraticCurveTo(x + 1.5 * u, y - 1.5 * u, x + 8 * u, y); ctx.quadraticCurveTo(x + 1.5 * u, y + 1.5 * u, x, y + 8 * u); ctx.quadraticCurveTo(x - 1.5 * u, y + 1.5 * u, x - 8 * u, y); ctx.quadraticCurveTo(x - 1.5 * u, y - 1.5 * u, x, y - 8 * u); }
      if (kind === "doc") { ctx.rect(x - 6 * u, y - 8 * u, 12 * u, 16 * u); ctx.moveTo(x - 3 * u, y - 3 * u); ctx.lineTo(x + 3 * u, y - 3 * u); ctx.moveTo(x - 3 * u, y + 1 * u); ctx.lineTo(x + 3 * u, y + 1 * u); ctx.moveTo(x - 3 * u, y + 5 * u); ctx.lineTo(x + 1 * u, y + 5 * u); }
      if (kind === "out") { ctx.moveTo(x - 2 * u, y - 7 * u); ctx.lineTo(x - 7 * u, y - 7 * u); ctx.lineTo(x - 7 * u, y + 7 * u); ctx.lineTo(x + 7 * u, y + 7 * u); ctx.lineTo(x + 7 * u, y + 2 * u); ctx.moveTo(x - 1 * u, y + 1 * u); ctx.lineTo(x + 7 * u, y - 7 * u); ctx.moveTo(x + 2 * u, y - 7 * u); ctx.lineTo(x + 7 * u, y - 7 * u); ctx.lineTo(x + 7 * u, y - 2 * u); }
      if (kind === "moon") { ctx.arc(x, y, 7 * u, Math.PI * 0.35, Math.PI * 1.65); ctx.arc(x + 4 * u, y - 1.5 * u, 5.5 * u, Math.PI * 1.45, Math.PI * 0.55, true); ctx.closePath(); }
      if (kind === "check") { ctx.moveTo(x - 7 * u, y); ctx.lineTo(x - 2 * u, y + 5 * u); ctx.lineTo(x + 7 * u, y - 6 * u); }
      if (kind === "globe") { ctx.arc(x, y, 8 * u, 0, 7); ctx.moveTo(x - 8 * u, y); ctx.lineTo(x + 8 * u, y); ctx.moveTo(x, y - 8 * u); ctx.bezierCurveTo(x + 6 * u, y - 4 * u, x + 6 * u, y + 4 * u, x, y + 8 * u); ctx.bezierCurveTo(x - 6 * u, y + 4 * u, x - 6 * u, y - 4 * u, x, y - 8 * u); }
      ctx.stroke(); ctx.lineCap = "butt";
    };
    const box = (k, hot) => {
      const [x, y, label, kind, light] = N[k];
      ctx.beginPath(); ctx.roundRect(x - s / 2, y - s / 2, s, s, 7);
      ctx.fillStyle = light ? ink(0.92) : "#2b2b30"; ctx.fill();
      const li = k.startsWith("hb") ? +k.slice(2) : -1;
      ctx.strokeStyle = li >= 0 ? lc(li, hot ? 1 : 0.6) : hot ? GOLD : light ? ink(0.92) : ink(0.28); ctx.lineWidth = hot ? 1.6 : 1; ctx.stroke();
      glyph(kind, x, y, li >= 0 ? lc(li, 0.95) : light ? "#1c1c1f" : ink(0.85));
      if (!k.startsWith("hb")) text(ctx, label, x, y + s / 2 + 11, { a: 0.6, size: fs, align: "center" });
    };
    const FISH = FISH_PX;
    const fish = (x, y, ang, alpha, li) => {
      const c = narrow ? 1.2 : 1.5, fw = 16 * c, fh = 8 * c, wag = Math.round(Math.sin(t * 9 + x * 0.1));
      ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x, y); ctx.rotate(ang); if (Math.abs(ang) > Math.PI / 2 + 0.01) ctx.scale(1, -1);
      FISH.forEach((row, r) => [...row].forEach((ch, k) => {
        if (ch === ".") return;
        const yy = -fh / 2 + (r + (k < 3 ? wag * (r < 4 ? -0.5 : 0.5) : 0)) * c;
        const [R0, G0, B0] = LANE[li], g = 0.8 + 0.2 * (1 - r / 8);
        ctx.fillStyle = ch === "o" ? "#1c1c1f" : `rgb(${(R0 * g) | 0},${(G0 * g) | 0},${(B0 * g) | 0})`;
        ctx.fillRect(-fw / 2 + k * c, yy, c - 0.3, c - 0.3);
      }));
      ctx.restore();
    };

    lanes.forEach((_, i) => { arrow(E.fan(i), 0.2, lc(i, 0.35)); arrow(E.merge(i), 0, lc(i, 0.55)); });
    ["act", "nothing", "rw", "doit", "gate", "out", "reconcile", "outcomes"].forEach((k) => arrow(E[k]()));
    ctx.setLineDash([3, 4]); arrow(E.escalate(), 0.3); arrow(E.approve(), 0.22); ["consolidate", "proposals"].forEach((k) => arrow(E[k](), 0.26, "rgba(160,170,255,0.5)")); ctx.setLineDash([]);
    text(ctx, "proposals", (N.human[0] + N.dream[0]) / 2, N.dream[1] - 8, { a: 0.42, size: fs - 0.5, align: "center" });
    const ph = t % 12, nf = ph < 8.5 ? 0 : Math.max(0, Math.min(1, (ph - 8.5) / 0.6, (12 - ph) / 0.6));
    text(ctx, "escalate", (N.cls[0] + N.human[0]) / 2, yTop + 9, { a: 0.42, size: fs - 0.5, align: "center" });
    text(ctx, "approve evals", (N.evals[0] + N.cls[0]) / 2, yTop + 9, { a: 0.42, size: fs - 0.5, align: "center" });
    if (!narrow) { text(ctx, "reconcile", (N.ledger[0] + N.world[0]) / 2 + 10, N.ledger[1] + 10, { a: 0.42, size: fs - 0.5, align: "center" }); text(ctx, "outcomes", N.evals[0] - 6, (yMid + N.evals[1]) / 2 + 8, { a: 0.42, size: fs - 0.5, align: "right" }); }
    text(ctx, "fires events", w - 2, N.world[1] + s / 2 + 22, { a: 0.32, size: fs - 1.5, align: "right" });
    if (!narrow) { text(ctx, "act", xSplit + 6, (yMid + N.agent[1]) / 2, { a: 0.42, size: fs - 0.5 }); text(ctx, "nothing", xSplit + 6, (yMid + N.ledger[1]) / 2, { a: 0.42, size: fs - 0.5 }); }

    const hot = new Set(), swims = [];
    lanes.forEach(([name, per, off, seq], i) => {
      const tt = t + off, cyc = Math.floor(tt / per), p = (tt % per) / per, out = seq[cyc % seq.length];
      const route = [...E.merge(i), ...E[out]().slice(1)];
      const travel = Math.min(1, p / 0.8), [fx, fy, an] = along(route, ease(travel));
      const alpha = p < 0.05 ? p / 0.05 : p > 0.85 ? Math.max(0, 1 - (p - 0.85) / 0.1) : 1;
      swims.push([fx, fy, an, alpha, i]);
      Object.keys(N).forEach((k) => { if (Math.hypot(N[k][0] - fx, N[k][1] - fy) < s * 0.6 && alpha > 0.3) hot.add(k); });
      const status = travel < 0.45 ? "checking" : out === "act" ? (travel < 1 ? "acting" : "acted") : out === "escalate" ? "escalated" : "holding";
      const sc = status === "escalated" ? RED : status === "acting" || status === "acted" ? GOLD : undefined;
      const lx = N["hb" + i][0], ly = N["hb" + i][1];
      text(ctx, name, lx, ly + s / 2 + 10, { size: fs, align: "center", color: lc(i, 0.9) });
      text(ctx, status, lx, ly + s / 2 + 21, { a: 0.4, size: fs - 1, align: "center", color: sc });
    });
    Object.keys(N).forEach((k) => box(k, hot.has(k)));
    swims.forEach(([x, y, an, a, li]) => fish(x, y, an, a, li));
    if (nf > 0) {
      const NIGHT = "rgba(160,170,255,", q = (ph - 8.5) / 3.5;
      ctx.fillStyle = `rgba(10,10,16,${0.68 * nf})`; ctx.fillRect(0, 0, w, h);
      ctx.save(); ctx.globalAlpha = nf;
      ctx.setLineDash([3, 4]); ["consolidate", "proposals"].forEach((k) => arrow(E[k](), 0.5, NIGHT + "0.85)")); ctx.setLineDash([]);
      ["ledger", "human", "dream"].forEach((k) => box(k, k === "dream"));
      const [lx, ly] = N.ledger, pad = 6, sy = ly - s / 2 + ((q * 2.5) % 1) * s;
      const g = ctx.createLinearGradient(0, sy - 12, 0, sy); g.addColorStop(0, NIGHT + "0)"); g.addColorStop(1, NIGHT + "0.35)");
      ctx.fillStyle = g; ctx.fillRect(lx - s / 2 - pad, sy - 12, s + pad * 2, 12);
      ctx.strokeStyle = NIGHT + "0.95)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(lx - s / 2 - pad, sy); ctx.lineTo(lx + s / 2 + pad, sy); ctx.stroke();
      ["consolidate", "proposals"].forEach((k, i) => { const [x, y] = along(E[k](), (q * 1.4 + i * 0.5) % 1); dot(ctx, x, y, 2.4, NIGHT + "1)"); });
      text(ctx, "night · dreaming", 6, h - 12, { size: fs, color: NIGHT + "0.9)" });
      ctx.restore();
    }
  },
  anatomy(ctx, w, h, t) {
    const narrow = w < 480, cx = w * (narrow ? 0.5 : 0.5), cy = h / 2 - 6, R = 24, G = R + 16;
    const ins = [["contract", "what to keep"], ["ledger", "what happened"], ["heartbeat", "what changed"]];
    const outs = [["small action", "inside the bounds", GOLD], ["human", "anything outside", ink(0.9)]];
    const iy = [h * 0.16, cy, h * 0.84 - 12], oy = [h * 0.3, h * 0.7 - 6], lx = narrow ? 0 : 6, rx = w - (narrow ? 0 : 6);
    const inEnd = narrow ? 70 : 118, outStart = w - (narrow ? 84 : 128);
    const qp = (p, x0, y0, x1, y1) => { const mx = (x0 + x1) / 2; const u = 1 - p; return [u * u * x0 + 2 * u * p * mx + p * p * x1, u * u * y0 + 2 * u * p * y1 + p * p * y1]; };
    const curve = (x0, y0, x1, y1, a) => { ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo((x0 + x1) / 2, y1, x1, y1); ctx.strokeStyle = ink(a); ctx.lineWidth = 1.2; ctx.stroke(); };
    const cyc = t % 3, p = cyc / 3, n = Math.floor(t / 3), toHuman = n % 3 === 2;
    ins.forEach(([name, d], i) => {
      text(ctx, name, lx, iy[i] - (narrow ? 0 : 7), { a: 0.9 });
      if (!narrow) text(ctx, d, lx, iy[i] + 8, { a: 0.4, size: 9.5 });
      curve(inEnd, iy[i], cx - G, cy, 0.22);
      if (p < 0.45 && i < 2) { const [x, y] = qp(p / 0.45, inEnd, iy[i], cx - G, cy); dot(ctx, x, y, 2.4, ink(0.9)); }
    });
    outs.forEach(([name, d, col], i) => {
      const live = p > 0.55 && (i === 1) === toHuman;
      curve(outStart, oy[i], cx + G, cy, live ? 0.45 : 0.22);
      text(ctx, name, rx, oy[i] - (narrow ? 0 : 7), { align: "right", color: live ? col : ink(0.75) });
      if (!narrow) text(ctx, d, rx, oy[i] + 8, { a: 0.4, size: 9.5, align: "right" });
    });
    ctx.setLineDash([3, 5]); ctx.strokeStyle = ink(0.3); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, G, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, "guardrails", cx, cy + G + 14, { a: 0.4, align: "center", size: 9.5 });
    const forget = (t % 6) > 5.4 ? 0.25 : 1, think = p > 0.45 && p < 0.55 ? 1 : 0;
    dot(ctx, cx, cy, R, `rgba(240,240,236,${0.03 + 0.05 * think})`);
    text(ctx, "model", cx, cy + 14, { a: 0.5, align: "center", size: 9 });
    // the goldfish swims in on the heartbeat, through the model, and out to an action or a human
    const o = toHuman ? 1 : 0, at = (q, k) => k === 0 ? qp(q, inEnd, iy[2], cx - G, cy) : qp(1 - q, outStart, oy[o], cx + G, cy);
    let fx, fy, fang;
    if (p < 0.45) { const q = p / 0.45; [fx, fy] = at(q, 0); const [nx, ny] = at(Math.min(1, q + 0.02), 0); fang = Math.atan2(ny - fy, nx - fx); }
    else if (p < 0.55) { const q = (p - 0.45) / 0.1; fx = cx - G + q * 2 * G; fy = cy; fang = 0; }
    else { const q = Math.min(1, (p - 0.55) / 0.4); [fx, fy] = at(q, 1); const [nx, ny] = at(Math.min(1, q + 0.02), 1); fang = Math.atan2(ny - fy, nx - fx); }
    const fade = p > 0.92 ? (1 - p) / 0.08 : p < 0.04 ? p / 0.04 : 1;
    pixelFish(ctx, fx, fy, narrow ? 1.4 : 1.8, t, fade * forget, fang);
  },

  glucose(ctx, w, h, t) {
    const narrow = w < 460, L = 34, R = w - 8, T = 26, B = h - 76, nowX = L + (R - L) * (narrow ? 0.62 : 0.72);
    const y = (v) => B - ((v - 40) / 220) * (B - T);
    text(ctx, "blood sugar (mg/dL)", L, 8, { a: 0.55, size: 10 });
    ctx.fillStyle = ink(0.05); ctx.fillRect(L, y(180), R - L, y(70) - y(180));
    ctx.setLineDash([3, 4]); ctx.strokeStyle = ink(0.25); ctx.lineWidth = 1;
    for (const v of [70, 180]) { ctx.beginPath(); ctx.moveTo(L, y(v)); ctx.lineTo(R, y(v)); ctx.stroke(); text(ctx, String(v), L - 6, y(v), { align: "right", a: 0.4 }); }
    ctx.setLineDash([]);
    text(ctx, "healthy range", R - 6, y(180) + 10, { align: "right", a: 0.35, size: 9.5 });
    const v = (x) => { const s = x + t * 38; return 128 + 38 * Math.sin(s * 0.03) + 16 * Math.sin(s * 0.093 + 1); };
    ctx.beginPath();
    for (let x = L; x <= nowX; x += 2) x === L ? ctx.moveTo(x, y(v(x))) : ctx.lineTo(x, y(v(x)));
    ctx.strokeStyle = ink(0.92); ctx.lineWidth = 1.8; ctx.stroke();
    const base = h - 30, step = 14, off = (t * 38) % step;
    for (let x = L + step - off; x <= nowX; x += step) {
      const d = Math.max(0, v(x) - 118) / 60;
      ctx.fillStyle = GOLD; ctx.globalAlpha = 0.35 + 0.65 * Math.min(1, d);
      const bh = 2 + 14 * Math.min(1, d); ctx.fillRect(x - 2, base - bh, 4, bh); ctx.globalAlpha = 1;
    }
    text(ctx, "insulin the pump gives, every 5 min", L, base - 26, { color: GOLD, size: 10 });
    ctx.setLineDash([2, 3]); ctx.strokeStyle = ink(0.3); ctx.beginPath(); ctx.moveTo(nowX, T - 6); ctx.lineTo(nowX, base); ctx.stroke(); ctx.setLineDash([]);
    const cur = v(nowX), rising = v(nowX) - v(nowX - 4) > 0;
    dot(ctx, nowX, y(cur), 4, GOLD);
    const tx = nowX + 10;
    text(ctx, `now: ${Math.round(cur)}`, tx, y(cur) - 10, { a: 0.9, size: 10 });
    text(ctx, rising ? "rising → more insulin" : "falling → holds back", tx, y(cur) + 6, { color: rising ? GOLD : undefined, a: 0.6, size: 9.5 });
    text(ctx, "past few hours", L, h - 8, { a: 0.35, size: 9 });
    text(ctx, "now", nowX, h - 8, { a: 0.5, size: 9, align: "center" });
  },
  registry(ctx, w, h, t) {
    const n = 12, L = 50, R = w - 120, T = 34, B = h - 10, gap = (B - T) / (n - 1);
    const cyc = t % 10, p = cyc < 4 ? 0 : cyc < 5 ? ease(cyc - 4) : cyc < 9 ? 1 : 1 - ease(cyc - 9);
    const rate = 0.74 - 0.64 * p, lost = Math.round(n * rate);
    const order = [...Array(n).keys()].sort((a, b) => rand(a + 40) - rand(b + 40));
    text(ctx, "visit", L, T - 20, { a: 0.4 }); text(ctx, "follow-up", R, T - 20, { a: 0.4, align: "right" });
    text(ctx, `${Math.round(rate * 100)}% lost`, w, T - 20, { align: "right", color: p > 0.5 ? GOLD : ink(0.8) });
    text(ctx, p > 0.5 ? "with registry" : "no registry", w, T - 6, { align: "right", a: 0.4, size: 9.5 });
    for (let i = 0; i < n; i++) {
      const yy = T + i * gap, isLost = order.indexOf(i) < lost;
      const brk = L + (0.25 + 0.5 * rand(i + 7)) * (R - L);
      dot(ctx, L, yy, 2.5, ink(0.7));
      ctx.lineWidth = 1.4; ctx.strokeStyle = ink(0.7); ctx.beginPath(); ctx.moveTo(L, yy); ctx.lineTo(isLost ? brk : R, yy); ctx.stroke();
      if (isLost) {
        ctx.setLineDash([1, 5]); ctx.strokeStyle = ink(0.15); ctx.beginPath(); ctx.moveTo(brk + 6, yy); ctx.lineTo(R, yy); ctx.stroke(); ctx.setLineDash([]);
        dot(ctx, R, yy, 2.5, ink(0.12));
      } else dot(ctx, R, yy, 3.2, GOLD);
    }
  },

  pipeline(ctx, w, h, t) {
    const labels = ["rx", "auth", "benefits", "pharmacy", "1st dose", "refill", "renewal", "jan reset"];
    const L = 18, R = w - 26, yy = h * 0.5, n = labels.length, xs = labels.map((_, i) => L + (i * (R - L)) / (n - 1));
    const close = xs[4], size = w < 440 ? 8.5 : 10;
    text(ctx, "today's case", (xs[0] + close) / 2, yy - 34, { a: 0.45, align: "center" });
    text(ctx, "long horizon", (close + xs[n - 1]) / 2, yy - 34, { color: GOLD, align: "center" });
    ctx.strokeStyle = ink(0.2); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(close, yy - 24); ctx.lineTo(close, yy + 9); ctx.stroke();
    ctx.lineWidth = 1.6; ctx.strokeStyle = ink(0.8); ctx.beginPath(); ctx.moveTo(xs[0], yy); ctx.lineTo(close, yy); ctx.stroke();
    ctx.setLineDash([4, 4]); ctx.strokeStyle = GOLD; ctx.globalAlpha = 0.7; ctx.beginPath(); ctx.moveTo(close, yy); ctx.lineTo(xs[n - 1], yy); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1;
    const per = 7, cyc = Math.floor(t / per), q = (t % per) / per, harness = cyc % 2 === 1;
    const pos = harness ? L + q * (R - L) : Math.min(close, L + q * 1.35 * (close - L));
    const alpha = !harness && q * 1.35 > 1 ? Math.max(0, 1 - (q * 1.35 - 1) * 3) : harness && q > 0.94 ? (1 - q) / 0.06 : 1;
    xs.forEach((x, i) => {
      const passed = pos >= x - 1 && (i <= 4 || harness), late = i > 4;
      dot(ctx, x, yy, 4.5, passed ? (late ? GOLD : ink(0.95)) : "#1c1c1f");
      ctx.lineWidth = 1.2; ctx.strokeStyle = late ? GOLD : ink(0.8); ctx.beginPath(); ctx.arc(x, yy, 4.5, 0, Math.PI * 2); ctx.stroke();
      text(ctx, labels[i], x, yy + (w < 440 && i % 2 ? 36 : 22), { align: "center", size, a: late ? 0.75 : 0.55, color: late ? GOLD : undefined });
    });
    pixelFish(ctx, pos, yy - 16, w < 440 ? 1.3 : 1.7, t, alpha);
    text(ctx, harness ? "with a harness: it keeps swimming" : "today: the case closes, the goldfish forgets", w / 2, h - 8, { align: "center", size: w < 440 ? 8.5 : 9.5, color: harness ? GOLD : ink(0.45) });
  },

  pulse(ctx, w, h, t) {
    const N = 40, P = 16, L = 8, R = w - 8, T = 46, B = h - 40, mid = (T + B) / 2, sc = (B - T) / 2 / 3;
    const dr = [], acts = []; let d = 0.2;
    for (let k = 0; k < N; k++) { dr.push(d); if (Math.abs(d) > 2) { acts.push(k); d = -0.15 * Math.sign(d); } else d += 0.42 * Math.sin(k * 0.5 + 0.6) + 0.35 * Math.sin(k * 1.9) + 0.12; }
    const X = (k) => L + ((R - L) * k) / (N - 1), Y = (v) => mid - v * sc;
    const fk = ((t % P) / P) * (N - 1), kk = Math.floor(fk), fr = fk - kk;
    ctx.fillStyle = ink(0.05); ctx.fillRect(L, Y(2), R - L, Y(-2) - Y(2));
    ctx.setLineDash([3, 4]); ctx.strokeStyle = ink(0.22); ctx.lineWidth = 1;
    for (const v of [2, -2]) { ctx.beginPath(); ctx.moveTo(L, Y(v)); ctx.lineTo(R, Y(v)); ctx.stroke(); }
    ctx.setLineDash([]); ctx.strokeStyle = ink(0.12); ctx.beginPath(); ctx.moveTo(L, mid); ctx.lineTo(R, mid); ctx.stroke();
    text(ctx, w < 460 ? "tolerance band" : "tolerance band: small drift is left alone", R, Y(-2) + 12, { align: "right", a: 0.35, size: 9.5 });
    text(ctx, "target mix", R, mid + 10, { align: "right", a: 0.3, size: 9 });
    const nextV = (k) => (acts.includes(k) ? -0.15 * Math.sign(dr[k]) : dr[k + 1] ?? dr[k]);
    ctx.strokeStyle = ink(0.8); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(X(0), Y(dr[0]));
    for (let k = 1; k <= kk; k++) ctx.lineTo(X(k), Y(dr[k]));
    const fy = Y(dr[kk] + (nextV(kk) - dr[kk]) * (acts.includes(kk) ? 0 : fr)), fx = X(Math.min(N - 1, fk));
    ctx.lineTo(fx, fy); ctx.stroke();
    for (let k = 0; k <= kk; k++) {
      const acted = acts.includes(k);
      dot(ctx, X(k), B + 16, acted ? 3 : 1.6, acted ? GOLD : ink(0.3));
      if (acted) {
        ctx.strokeStyle = GOLD; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(X(k), Y(dr[k])); ctx.lineTo(X(k), Y(nextV(k))); ctx.stroke();
        ctx.beginPath(); ctx.arc(X(k), Y(dr[k]), 5, 0, 7); ctx.stroke();
        text(ctx, "drift left the band → rebalanced", Math.min(X(k) + 8, R - 170), Y(dr[k]) - 10, { color: GOLD, size: 9.5 });
      }
    }
    const ang = Math.atan2(Y(dr[Math.min(N - 1, kk + 1)]) - Y(dr[kk]), X(1) - X(0)) * 0.5;
    pixelFish(ctx, fx, fy, 1.4, t, 1, ang);
    const acted = acts.filter((k) => k <= kk).length;
    text(ctx, `market days checked: ${kk + 1}`, L, 12, { a: 0.6, size: 10 });
    text(ctx, `times it acted: ${acted}`, L + 150, 12, { color: GOLD, size: 10 });
    text(ctx, "one dot = one daily check", L, h - 8, { a: 0.35, size: 9 });
    text(ctx, "most days end in “do nothing”", R, h - 8, { align: "right", a: 0.45, size: 9 });
  },

  register(ctx, w, h, t) {
    const descs = ["deposit", "card spend", "transfer in", "payroll", "deposit", "interest", "card spend", "transfer out", "deposit", "fee"];
    const cols = [0, w * 0.2, w * 0.58, w * 0.86], rowH = 20, top = 30, rows = Math.floor((h - top - 34) / rowH);
    const per = 1.1, age = t % per, step = Math.floor(t / per) + rows, bump = 1 - ease(Math.min(1, age / 0.28));
    text(ctx, "#", cols[0], 12, { a: 0.4 }); text(ctx, "entry", cols[1], 12, { a: 0.4 });
    text(ctx, "records say", cols[2], 12, { a: 0.4, align: "right" }); text(ctx, "bank holds", cols[3], 12, { a: 0.4, align: "right" });
    ctx.fillStyle = ink(0.18); ctx.fillRect(0, 22, w, 1);
    const fmt = (n) => "$" + n.toLocaleString("en-US");
    const row = (k) => {
      const amt = 200 + Math.floor(rand(k) * 4800), miss = rand(k + 500) < 0.28 && k > 0;
      return { amt, miss, bank: miss ? Math.floor(amt * (0.35 + 0.4 * rand(k + 9))) : amt };
    };
    let recT = 0, gapT = 0;
    for (let k = 0; k <= step; k++) { const r = row(k); recT += r.amt; gapT += r.amt - r.bank; }
    ctx.save(); ctx.beginPath(); ctx.rect(0, top - 4, w, rows * rowH + 4); ctx.clip();
    for (let i = 0; i <= rows; i++) {
      const k = step - (rows - 1) + i;
      if (k < 0) continue;
      const r = row(k), yy = top + i * rowH + rowH / 2 + bump * rowH, fresh = k === step;
      ctx.save(); ctx.globalAlpha = fresh ? 1 - bump : 1;
      if (fresh && age < 0.7) { ctx.fillStyle = (r.miss ? "rgba(255,128,110," : "rgba(240,240,236,") + (0.09 * (1 - age / 0.7)) + ")"; ctx.fillRect(0, yy - rowH / 2, w, rowH); }
      text(ctx, String(1040 + k), cols[0], yy, { a: 0.35 });
      text(ctx, descs[k % descs.length], cols[1], yy, { a: 0.7 });
      text(ctx, fmt(r.amt), cols[2], yy, { a: 0.85, align: "right" });
      text(ctx, fmt(r.bank), cols[3], yy, { align: "right", color: r.miss ? RED : ink(0.85) });
      if (r.miss) text(ctx, "\u2260", (cols[2] + cols[3]) / 2 + 10, yy, { color: RED, align: "center" });
      ctx.fillStyle = ink(0.05); ctx.fillRect(0, yy + rowH / 2, w, 1);
      ctx.restore();
    }
    ctx.restore();
    const yb = h - 14; ctx.fillStyle = ink(0.3); ctx.fillRect(0, yb - 14, w, 1);
    text(ctx, "gap", cols[1], yb, { color: RED });
    text(ctx, fmt(recT), cols[2], yb, { a: 0.85, align: "right" });
    text(ctx, "\u2212" + fmt(gapT), cols[3], yb, { color: RED, align: "right" });
  },

  ring(ctx, w, h, t) {
    const R = Math.min(h / 2 - 22, 74), cx = w < 2 * R + 230 ? w / 2 : R + 24, cy = h / 2, ang = (m) => -Math.PI / 2 + (m / 12) * Math.PI * 2;
    ctx.strokeStyle = ink(0.2); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
    "JFMAMJJASOND".split("").forEach((m, i) => {
      const a = ang(i + 0.5); text(ctx, m, cx + Math.cos(a) * (R + 13), cy + Math.sin(a) * (R + 13), { a: 0.35, align: "center", size: 9 });
    });
    ctx.strokeStyle = ink(0.9); ctx.lineWidth = 4; ctx.lineCap = "round";
    ctx.beginPath(); ctx.arc(cx, cy, R, ang(9.45), ang(11.2)); ctx.stroke(); ctx.lineCap = "butt";
    const now = (t % 12) / 12 * 12, events = [[2.3, "new prescription"], [5.6, "doctor leaves network"], [8.4, "plan ending"]];
    events.forEach(([m]) => {
      const a = ang(m), near = Math.max(0, 1 - Math.abs(now - m) * 1.5);
      if (near > 0) dot(ctx, cx + Math.cos(a) * R, cy + Math.sin(a) * R, 4 + 7 * near, `rgba(243,207,116,${0.25 * near})`);
      dot(ctx, cx + Math.cos(a) * R, cy + Math.sin(a) * R, 3.5, GOLD);
    });
    const a = ang(now); dot(ctx, cx + Math.cos(a) * R, cy + Math.sin(a) * R, 3, "#fff");
    const lx = cx + R + 40, inOE = now > 9.45 && now < 11.2;
    if (lx + 150 < w) {
      ctx.fillStyle = ink(0.9); ctx.fillRect(lx, cy - 34, 14, 4);
      text(ctx, "open enrollment", lx + 22, cy - 32, { a: inOE ? 0.95 : 0.6 });
      text(ctx, "when most people get one call", lx + 22, cy - 18, { a: 0.35, size: 9.5 });
      dot(ctx, lx + 7, cy + 14, 3.5, GOLD);
      text(ctx, "what a standing intent wakes on", lx + 22, cy + 14, { color: GOLD });
      events.forEach(([m, s], i) => {
        const on = Math.abs(now - m) < 0.7;
        text(ctx, s, lx + 22, cy + 30 + i * 14, { a: on ? 0.95 : 0.4, size: 9.5 });
      });
    }
  },
};

export { diagrams, ARCH_EX };
// zoom draws a narrower logical canvas scaled up, for the slide deck; observe=false lets the caller start/stop
export const mountDiagram = (cv, { zoom = 1, observe = true } = {}) => {
  const fn = diagrams[cv.dataset.diagram], H = +cv.dataset.h || 180;
  const ctx = cv.getContext("2d");
  let w = 0, raf = 0, on = false;
  const size = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2) * (zoom > 1 ? 1.5 : 1); w = (cv.clientWidth || 520 * zoom) / zoom;
    cv.width = w * zoom * dpr; cv.height = H * zoom * dpr; cv.style.height = H * zoom + "px"; ctx.setTransform(dpr * zoom, 0, 0, dpr * zoom, 0, 0);
  };
  const draw = (tt) => { ctx.clearRect(0, 0, w, H); fn(ctx, w, H, tt); };
  const loop = (ms) => { draw(ms / 1000); raf = on ? requestAnimationFrame(loop) : 0; };
  const set = (v) => { on = v && !reduced; if (on && !raf) raf = requestAnimationFrame(loop); };
  new ResizeObserver(() => { size(); draw(reduced ? 6 : performance.now() / 1000); }).observe(cv);
  if (observe) new IntersectionObserver(([e]) => set(e.isIntersecting)).observe(cv);
  return { start: () => set(true), stop: () => set(false), redraw: () => draw(performance.now() / 1000) };
};
document.querySelectorAll(".dg canvas").forEach((cv) => mountDiagram(cv));
