// the perception game: players join with a name, the host (/game?host=KEY) runs it on the projector.
// Everyone polls /api/game; the server decides the phase (lobby → question → reveal → … → final).
const app = document.getElementById("app");
const bannerEl = document.getElementById("banner");
const HOST = new URLSearchParams(location.search).get("host");
const LS = "perception-game";
const COLORS = ["#e21b3c", "#1368ce", "#d89e00", "#26890c"];
const SHAPES = ["▲", "◆", "●", "■"];

let me = JSON.parse(localStorage.getItem(LS) || "null"); // { id, name }
let S = null;          // latest server snapshot
let offset = 0;        // server clock - local clock
let sig = "";
let pollTimer = 0;
let pick = null;       // optimistic answer for the current question
let pickQ = -1;
let zeroPolled = -1;
let confettiFor = "";

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const now = () => Date.now() + offset;
const joinUrl = `${location.host}/game`;

function banner(msg) {
  bannerEl.hidden = !msg;
  bannerEl.textContent = msg || "";
}

async function post(body) {
  const r = await fetch("/api/game", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const j = await r.json().catch(() => ({ error: "server error" }));
  if (!r.ok) throw new Error(j.error || r.statusText);
  return j;
}

async function poll() {
  clearTimeout(pollTimer);
  const qs = HOST ? `?key=${encodeURIComponent(HOST)}` : `?id=${encodeURIComponent(me.id)}`;
  try {
    const r = await fetch("/api/game" + qs, { cache: "no-store" });
    const s = await r.json();
    if (!r.ok) throw new Error(s.error || r.statusText);
    offset = s.now - Date.now();
    banner("");
    if (!HOST && !s.me) { // game was reset, so this player no longer exists
      me = null;
      localStorage.removeItem(LS);
      return renderJoin();
    }
    S = s;
    render();
  } catch (e) {
    banner(e.message);
  }
  pollTimer = setTimeout(poll, HOST ? 1000 : 1500);
}

// ---------- pieces ----------
const choiceTile = (c, i, extra = "") =>
  `<button class="g-choice" data-c="${i}" style="background:${COLORS[i]}" ${extra}><span class="s">${SHAPES[i]}</span><span>${esc(c)}</span></button>`;

function timer(q) {
  return `<div class="g-meta"><span>${q.double ? '<span class="g-badge">DOUBLE POINTS</span>' : q.poll ? '<span class="g-badge">POLL · NO POINTS</span>' : ""}</span>
    <span id="secs">${q.seconds}</span></div>
    <div class="g-timer" id="timer"><i id="bar"></i></div>`;
}

function bars(s) {
  const max = Math.max(1, ...s.counts);
  return `<div class="g-bars">${s.question.choices.map((c, i) => {
    const cls = s.correct === null ? "" : i === s.correct ? "ok" : "dim";
    return `<div class="g-bar ${cls}"><span class="lbl">${SHAPES[i]} ${esc(c)}</span><span>${s.counts[i]}</span>
      <div class="track"><div class="fill" style="--w:${(s.counts[i] / max) * 100}%;background:${COLORS[i]}"></div></div></div>`;
  }).join("")}</div>`;
}

const move = (m) => (m > 0 ? `<span class="up">▲${m}</span>` : m < 0 ? `<span class="down">▼${-m}</span>` : "");

function board(list, limit, myName) {
  return `<ol class="g-board">${list.slice(0, limit).map((p, i) =>
    `<li class="${p.name === myName ? "me" : ""}"><span class="r">${i + 1}</span><span>${esc(p.name)}</span><span class="mv">${move(p.move)}</span><span class="pts">${p.score}</span></li>`
  ).join("")}</ol>`;
}

function podium(list) {
  const slot = (p, n) => p ? `<div class="p${n}"><span class="place">${n}</span><span class="n">${esc(p.name)}</span><span class="p">${p.score} pts</span></div>` : `<div class="p${n}" style="opacity:.15"></div>`;
  return `<div class="g-podium">${slot(list[1], 2)}${slot(list[0], 1)}${slot(list[2], 3)}</div>`;
}

const lesson = (s) => `<div class="g-lesson"><b>the lesson</b>${esc(s.explain)}</div>`;
const fastest = (s) => s.fastest ? `<div class="g-shout">⚡ fastest correct: ${esc(s.fastest.name)}, ${s.fastest.secs}s</div>` : "";
const longChoices = (q) => q.choices.some((c) => c.length > 28);

// ---------- player ----------
function renderJoin(err = "") {
  clearTimeout(pollTimer);
  sig = "";
  app.className = "g";
  app.innerHTML = `
    <h1 class="g-title">the perception game</h1>
    <p class="g-sub">perception, self-bias and first impressions. fastest right answers win.</p>
    <form class="g-join" id="join">
      <input class="g-input" id="name" maxlength="20" placeholder="your name" autocomplete="off" autofocus />
      <button class="g-btn" type="submit">join</button>
      ${err ? `<p class="down" style="margin:0">${esc(err)}</p>` : ""}
    </form>`;
  document.getElementById("join").onsubmit = async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector("button");
    btn.disabled = true;
    try {
      me = await post({ action: "join", name: document.getElementById("name").value });
      localStorage.setItem(LS, JSON.stringify(me));
      poll();
    } catch (er) {
      renderJoin(er.message);
    }
  };
}

function playerView(s) {
  const m = s.me;
  const top = `<div class="g-top"><b>${esc(m.name)}</b><span>${s.q >= 0 && s.phase !== "final" ? `Q${s.q + 1}/${s.total}` : ""}</span><b>${m.score} pts</b></div>`;

  if (s.phase === "lobby") {
    return `${top}<div class="g-card g-center" style="display:flex;flex-direction:column;gap:.6rem;padding:2rem 1rem">
      <div class="g-big" style="font-size:2rem">you're in!</div>
      <p class="g-sub g-dots">waiting for the game to start</p></div>
      <p class="g-sub" style="text-align:center">${s.players} in the lobby</p>
      <div class="g-chips">${s.names.map((n) => `<span class="g-chip">${esc(n)}</span>`).join("")}</div>`;
  }

  if (s.phase === "question") {
    const q = s.question;
    const chosen = m.answered ?? (pickQ === s.q ? pick : null);
    if (chosen !== null) {
      return `${top}<div class="g-locked"><div class="tile" style="background:${COLORS[chosen]}">${SHAPES[chosen]}</div>
        <div class="g-big" style="font-size:2rem">locked in</div>
        <p class="g-sub">${s.answered}/${s.players} answered</p><p class="g-sub g-dots">waiting</p></div>${timer(q)}`;
    }
    return `${top}<p class="g-q">${esc(q.text)}</p>${q.visual ? `<div class="g-visual">${q.visual}</div>` : ""}${timer(q)}
      <div class="g-grid ${longChoices(q) ? "long" : ""}">${q.choices.map((c, i) => choiceTile(c, i)).join("")}</div>`;
  }

  if (s.phase === "reveal") {
    const q = s.question;
    let res;
    if (q.poll) res = `<div class="g-result poll"><div class="g-big">${m.answered === null ? "no answer" : SHAPES[m.answered] + " noted"}</div><span>this one was a poll, no points</span></div>`;
    else if (m.answered === null) res = `<div class="g-result bad"><div class="g-big">too slow</div><span>no answer, streak lost</span></div>`;
    else if (m.answered === s.correct) res = `<div class="g-result ok"><div class="g-big">+${m.points}</div><span>${m.streak > 1 ? `🔥 ${m.streak} in a row` : "correct!"}</span></div>`;
    else res = `<div class="g-result bad"><div class="g-big">wrong</div><span>it was ${SHAPES[s.correct]} ${esc(q.choices[s.correct])}</span></div>`;
    const r = m.rival;
    const rival = !r ? "" : r.lead ? `you lead ${esc(r.name)} by ${r.gap}` : `${r.gap} pts behind ${esc(r.name)} (#${r.rank})`;
    return `${top}${res}
      <div class="g-rank"><div class="g-big">#${m.rank} ${move(m.move)}</div><span class="g-rival">${rival}</span></div>
      ${lesson(s)}${bars(s)}`;
  }

  // final
  return `${top}<div class="g-rank" style="margin-top:1rem"><span class="g-sub">you finished</span><div class="g-big" style="font-size:4rem">#${m.rank}</div><span class="g-sub">of ${s.players} with ${m.score} pts</span></div>
    ${podium(s.leaderboard)}${board(s.leaderboard, 10, m.name)}`;
}

// ---------- host / projector ----------
function hostView(s) {
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=480x480&margin=0&data=${encodeURIComponent("https://" + joinUrl)}`;
  let body, controls;
  if (s.phase === "lobby") {
    body = `<div class="g-joinbig" style="margin-top:2rem"><img src="${qr}" alt="QR code to join" />
      <div><p class="g-sub" style="font-size:1.4rem">join at</p><div class="g-url">${esc(joinUrl)}</div>
      <p class="g-sub" style="font-size:1.4rem">${s.players} ${s.players === 1 ? "player" : "players"} in</p></div></div>
      <div class="g-chips">${(s.names || []).map((n) => `<span class="g-chip">${esc(n)}</span>`).join("")}</div>`;
    controls = `<button class="g-btn" data-a="next" ${s.players ? "" : "disabled"}>start game</button>`;
  } else if (s.phase === "question") {
    const q = s.question;
    body = `<div class="g-top"><span>question ${s.q + 1} of ${s.total}</span><b>${s.answered}/${s.players} locked in</b></div>
      <p class="g-q">${esc(q.text)}</p>${q.visual ? `<div class="g-visual">${q.visual}</div>` : ""}${timer(q)}
      <div class="g-grid ${longChoices(q) ? "long" : ""}">${q.choices.map((c, i) => choiceTile(c, i, "tabindex=-1")).join("")}</div>`;
    controls = `<button class="g-btn" data-a="reveal">reveal now</button>`;
  } else if (s.phase === "reveal") {
    const last = s.q + 1 >= s.total;
    body = `<div class="g-top"><span>question ${s.q + 1} of ${s.total}</span><b>${s.answered}/${s.players} answered</b></div>
      <p class="g-q" style="font-size:2rem">${esc(s.question.text)}</p>
      <div class="g-cols"><div style="display:flex;flex-direction:column;gap:1rem">${bars(s)}${lesson(s)}${fastest(s)}</div>
      <div>${board(s.leaderboard, 5)}</div></div>`;
    controls = `<button class="g-btn" data-a="next">${last ? "final results" : "next question"}</button>`;
  } else {
    body = `<h1 class="g-title" style="text-align:center">final results</h1>${podium(s.leaderboard)}${board(s.leaderboard.slice(3), 7).replace(/<span class="r">(\d+)/g, (_, n) => `<span class="r">${+n + 3}`)}`;
    controls = "";
  }
  return `${body}<div class="g-controls">${controls}<button class="reset" data-a="reset">reset game</button></div>`;
}

// ---------- render loop ----------
function render() {
  if (pickQ !== S.q) { pick = null; pickQ = S.q; }
  const key = JSON.stringify({ ...S, now: 0 }) + pick;
  if (key === sig) return;
  sig = key;
  app.className = `g ${HOST ? "host" : ""} phase-${S.phase}`;
  app.innerHTML = HOST ? hostView(S) : playerView(S);
  bind();
  tick();
  const cf = S.phase === "final" ? "final" : S.phase === "reveal" && !HOST && S.me.answered === S.correct && S.me.rank === 1 ? "lead" + S.q : "";
  if (cf && cf !== confettiFor) confetti(cf === "final" ? 260 : 80);
  confettiFor = cf;
}

function bind() {
  app.querySelectorAll(".g-choice[data-c]").forEach((b) => {
    if (HOST) return;
    b.onclick = async () => {
      if (pick !== null) return;
      pick = Number(b.dataset.c);
      pickQ = S.q;
      render();
      try { await post({ action: "answer", id: me.id, q: S.q, choice: pick }); } catch (e) { banner(e.message); }
      poll();
    };
  });
  app.querySelectorAll("[data-a]").forEach((b) => {
    b.onclick = async () => {
      if (b.dataset.a === "reset" && !confirm("reset the game? this kicks everyone and clears scores.")) return;
      b.disabled = true;
      try { await post({ action: b.dataset.a, key: HOST }); } catch (e) { banner(e.message); }
      poll();
    };
  });
}

function tick() {
  const bar = document.getElementById("bar");
  if (!bar || !S?.question || S.phase !== "question") return;
  const total = S.question.seconds * 1000;
  const rem = Math.max(0, S.question.endsAt - now());
  bar.style.width = `${(rem / total) * 100}%`;
  document.getElementById("timer").classList.toggle("low", rem < 4000);
  document.getElementById("secs").textContent = Math.ceil(rem / 1000);
  if (rem <= 0 && zeroPolled !== S.q) { zeroPolled = S.q; setTimeout(poll, 400); }
}
setInterval(tick, 100);

function confetti(n) {
  const c = document.getElementById("confetti");
  const x = c.getContext("2d");
  c.width = innerWidth; c.height = innerHeight;
  const ps = Array.from({ length: n }, () => ({
    x: Math.random() * c.width, y: -20 - Math.random() * c.height * 0.5, vx: (Math.random() - 0.5) * 3, vy: 2 + Math.random() * 4,
    r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3, w: 6 + Math.random() * 6, col: COLORS[(Math.random() * 4) | 0],
  }));
  const end = performance.now() + 4500;
  (function frame(t) {
    x.clearRect(0, 0, c.width, c.height);
    for (const p of ps) {
      p.x += p.vx; p.y += p.vy; p.r += p.vr;
      x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.fillStyle = p.col; x.fillRect(-p.w / 2, -p.w / 4, p.w, p.w / 2); x.restore();
    }
    if (t < end) requestAnimationFrame(frame); else x.clearRect(0, 0, c.width, c.height);
  })(performance.now());
}

if (HOST || me) poll(); else renderJoin();
