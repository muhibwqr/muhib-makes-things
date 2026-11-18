// Live classroom game for muhibwaqar.com/game (perception, self-bias, first impressions).
// State lives in Upstash Redis: connect it in Vercel → Storage, which sets KV_REST_API_URL / KV_REST_API_TOKEN.
// The host runs the game from /game?host=<GAME_HOST_KEY>.

type Question = {
  text: string;
  choices: string[];
  answer?: number;          // index of the right choice; leave out for a poll (no points)
  seconds?: number;
  visual?: string;          // trusted inline HTML/SVG shown above the choices
  explain: string;          // "the lesson", shown on the reveal screen
  anchors?: number[];       // split test: each player sees one of these in place of {anchor}
  double?: boolean;         // double points
};

// ---- the questions, in order ----
const QUESTIONS: Question[] = [
  {
    text: "What COLOUR is the ink?",
    visual: `<div class="g-stroop" style="color:#e21b3c">BLUE</div>`,
    choices: ["Blue", "Red", "Green", "Yellow"],
    answer: 1,
    seconds: 6,
    explain: "Red. Reading is automatic, so the word fights the colour (Stroop effect). Your first reaction isn't always the right one.",
  },
  {
    text: "Compared to the rest of this class, how good of a listener are you?",
    choices: ["Below average", "About average", "Above average", "Top 10%"],
    seconds: 15,
    explain: "Look at the bars. Most of us rate ourselves above average, which can't be true for most of a room (better-than-average effect).",
  },
  {
    text: "How long does it take to form a first impression of someone's face?",
    choices: ["0.1 seconds", "1 second", "10 seconds", "1 minute"],
    answer: 0,
    explain: "About a tenth of a second. Judgments of trustworthiness after 100ms barely change with more time (Willis & Todorov, 2006).",
  },
  {
    text: "Your friend left your text on read all day. Which is the best perception check?",
    choices: [
      "\"Why are you ignoring me?\"",
      "\"I saw you read my text but didn't reply. Are you upset, or just busy? What's up?\"",
      "\"You're obviously mad at me.\"",
      "\"Whatever, I don't care.\"",
    ],
    answer: 1,
    seconds: 25,
    explain: "A perception check has 3 parts: describe what you saw, give two possible interpretations, then ask. It checks your first impression before you act on it.",
  },
  {
    text: "Students wore an embarrassing t-shirt into class and guessed half the room noticed. How many actually did?",
    choices: ["About 10%", "About 25%", "About 50%", "About 75%"],
    answer: 1,
    double: true,
    explain: "Only about a quarter. We think everyone is watching us far more than they are (spotlight effect, Gilovich, 2000).",
  },
];
const DEFAULT_SECONDS = 20;
const secs = (Q: Question) => Q.seconds ?? DEFAULT_SECONDS;
const isPoll = (Q: Question) => Q.answer === undefined;

const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const ON_VERCEL = !!process.env.VERCEL;
const HOST_KEY = process.env.GAME_HOST_KEY || (ON_VERCEL ? "" : "dev");

type Cmd = (string | number)[];

// in-memory stand-in for local dev only (Vercel instances don't share memory)
const mem = new Map<string, any>();
function memExec([op, key, ...a]: Cmd): any {
  const k = String(key);
  const h = (): Map<string, string> => { if (!mem.has(k)) mem.set(k, new Map()); return mem.get(k); };
  switch (op) {
    case "GET": return mem.get(k) ?? null;
    case "SET": mem.set(k, String(a[0])); return "OK";
    case "INCR": { const v = Number(mem.get(k) ?? 0) + 1; mem.set(k, String(v)); return v; }
    case "DEL": [k, ...a].forEach((x) => mem.delete(String(x))); return 1;
    case "HGET": return mem.get(k)?.get(String(a[0])) ?? null;
    case "HSET": h().set(String(a[0]), String(a[1])); return 1;
    case "HSETNX": if (h().has(String(a[0]))) return 0; h().set(String(a[0]), String(a[1])); return 1;
    case "HGETALL": return [...(mem.get(k) ?? new Map()).entries()].flat();
    case "HINCRBY": { const v = Number(h().get(String(a[0])) ?? 0) + Number(a[1]); h().set(String(a[0]), String(v)); return v; }
  }
  throw new Error("unsupported " + op);
}

async function redis(cmds: Cmd[]): Promise<any[]> {
  if (!KV_URL) return cmds.map(memExec);
  const r = await fetch(`${KV_URL}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${KV_TOKEN}` },
    body: JSON.stringify(cmds),
  });
  const out = await r.json();
  if (!Array.isArray(out)) throw new Error(out?.error || "redis error");
  return out.map((x: any) => { if (x.error) throw new Error(x.error); return x.result; });
}

const K = {
  state: "game:state", joins: "game:joins", names: "game:names", players: "game:players",
  scores: "game:scores", groups: "game:groups", streaks: "game:streaks", ans: (q: number) => `game:ans:${q}`,
};

type State = { phase: "lobby" | "question" | "reveal" | "final"; q: number; startedAt: number; endsAt: number };
const LOBBY: State = { phase: "lobby", q: -1, startedAt: 0, endsAt: 0 };
type Answer = { c: number; pts: number; t: number; streak: number };

const pairs = (flat: string[] | null) => {
  const m: Record<string, string> = {};
  for (let i = 0; flat && i < flat.length; i += 2) m[flat[i]] = flat[i + 1];
  return m;
};

function send(res: any, status: number, body: any) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

async function readState(): Promise<State> {
  const [raw] = await redis([["GET", K.state]]);
  return raw ? JSON.parse(raw) : LOBBY;
}
const saveState = (s: State) => redis([["SET", K.state, JSON.stringify(s)]]);
const textFor = (Q: Question, group: number | null) =>
  Q.anchors ? (group === null ? Q.text.replace("{anchor}", "[half the room saw " + Q.anchors.join(", the other half saw ") + "]") : Q.text.replace("{anchor}", String(Q.anchors[group % Q.anchors.length]))) : Q.text;

async function snapshot(id: string | null, isHost: boolean) {
  const now = Date.now();
  const s = await readState();
  const q = s.q;
  const Q = QUESTIONS[q];
  const [playersFlat, scoresFlat, ansFlat, groupsFlat] = await redis([
    ["HGETALL", K.players],
    ["HGETALL", K.scores],
    ["HGETALL", q >= 0 ? K.ans(q) : "game:none"],
    ["HGETALL", K.groups],
  ]);
  const players = pairs(playersFlat);
  const scores = pairs(scoresFlat);
  const groups = pairs(groupsFlat);
  const answers: Record<string, Answer> = Object.fromEntries(Object.entries(pairs(ansFlat)).map(([k, v]) => [k, JSON.parse(v)]));
  const playerCount = Object.keys(players).length;
  const answeredCount = Object.keys(answers).length;

  // time's up or everyone answered → reveal
  if (s.phase === "question" && (now > s.endsAt || (playerCount > 0 && answeredCount >= playerCount))) {
    s.phase = "reveal";
    await saveState(s);
  }
  const revealing = s.phase === "reveal" && !!Q;

  const rows = Object.entries(players).map(([pid, name]) => {
    const score = Number(scores[pid] ?? 0);
    return { id: pid, name, score, before: score - (revealing ? answers[pid]?.pts ?? 0 : 0) };
  });
  const board = [...rows].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
  const boardBefore = [...rows].sort((a, b) => b.before - a.before || a.name.localeCompare(b.name));
  // no rank arrows until someone had points before this question (ties would be ranked alphabetically)
  const showMoves = revealing && rows.some((r) => r.before !== rows[0].before);

  const out: any = { now, phase: s.phase, q, total: QUESTIONS.length, players: playerCount, answered: answeredCount };
  const myGroup = id && groups[id] !== undefined ? Number(groups[id]) : null;
  if (Q && (s.phase === "question" || s.phase === "reveal")) {
    out.question = {
      text: textFor(Q, isHost ? null : myGroup), choices: Q.choices, visual: Q.visual ?? null,
      seconds: secs(Q), endsAt: s.endsAt, poll: isPoll(Q), double: !!Q.double,
    };
  }
  if (revealing) {
    out.correct = Q.answer ?? null;
    out.explain = Q.explain;
    out.counts = Q.choices.map((_, i) => Object.values(answers).filter((a) => a.c === i).length);
    if (Q.anchors) {
      out.split = Q.anchors.map((anchor, g) => ({
        anchor,
        counts: Q.choices.map((_, i) => Object.entries(answers).filter(([pid, a]) => a.c === i && Number(groups[pid] ?? 0) % Q.anchors!.length === g).length),
      }));
    }
    if (!isPoll(Q)) {
      const fastest = Object.entries(answers).filter(([, a]) => a.c === Q.answer).sort((a, b) => a[1].t - b[1].t)[0];
      if (fastest && players[fastest[0]]) out.fastest = { name: players[fastest[0]], secs: +(fastest[1].t / 1000).toFixed(1) };
    }
  }
  if (s.phase === "lobby") out.names = board.map((p) => p.name);
  if (s.phase === "reveal" || s.phase === "final" || isHost) {
    out.leaderboard = board.slice(0, isHost || s.phase === "final" ? 100 : 10).map(({ id: pid, name, score }) => ({
      name, score, move: showMoves ? boardBefore.findIndex((p) => p.id === pid) - board.findIndex((p) => p.id === pid) : 0,
    }));
  }
  if (id && players[id]) {
    const mine = answers[id] ?? null;
    const rank = board.findIndex((p) => p.id === id) + 1;
    const ahead = board[rank - 2];
    const behind = board[rank];
    out.me = {
      name: players[id],
      score: Number(scores[id] ?? 0),
      rank,
      answered: mine ? mine.c : null,
      points: revealing && mine ? mine.pts : null,
      streak: revealing && mine ? mine.streak : null,
      move: showMoves ? boardBefore.findIndex((p) => p.id === id) + 1 - rank : 0,
      rival: ahead ? { name: ahead.name, gap: ahead.score - Number(scores[id] ?? 0), rank: rank - 1 }
        : behind ? { name: behind.name, gap: Number(scores[id] ?? 0) - behind.score, lead: true } : null,
    };
  }
  return out;
}

export default async function handler(req: any, res: any) {
  if (ON_VERCEL && !KV_URL) return send(res, 500, { error: "Game storage not connected (add Upstash Redis in Vercel → Storage)." });
  const url = new URL(req.url, "http://x");
  try {
    if (req.method === "GET") {
      const key = url.searchParams.get("key");
      const isHost = !!key && !!HOST_KEY && key === HOST_KEY;
      if (key && !isHost) return send(res, 403, { error: "wrong host key" });
      return send(res, 200, await snapshot(url.searchParams.get("id"), isHost));
    }
    if (req.method !== "POST") return send(res, 405, { error: "method not allowed" });

    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const { action } = body;

    if (action === "join") {
      const name = String(body.name ?? "").trim().replace(/\s+/g, " ").slice(0, 20);
      if (!name) return send(res, 400, { error: "enter a name" });
      const id = crypto.randomUUID();
      const [ok] = await redis([["HSETNX", K.names, name.toLowerCase(), id]]);
      if (!ok) return send(res, 409, { error: "that name is taken, pick another" });
      const [n] = await redis([["INCR", K.joins]]);
      await redis([["HSET", K.players, id, name], ["HSETNX", K.scores, id, 0], ["HSET", K.groups, id, n % 2]]);
      return send(res, 200, { id, name });
    }

    if (action === "answer") {
      const s = await readState();
      const choice = Number(body.choice);
      const Q = QUESTIONS[s.q];
      if (s.phase !== "question" || body.q !== s.q || !Q || !(choice >= 0 && choice < Q.choices.length)) return send(res, 409, { error: "question closed" });
      const now = Date.now();
      if (now > s.endsAt + 1000) return send(res, 409, { error: "time's up" });
      const pid = String(body.id);
      const [name, streakRaw] = await redis([["HGET", K.players, pid], ["HGET", K.streaks, pid]]);
      if (!name) return send(res, 404, { error: "unknown player" });

      let pts = 0, streak = 0;
      if (!isPoll(Q)) {
        // streak continues only if the previous scored question was answered correctly
        let prev = s.q - 1;
        while (prev >= 0 && isPoll(QUESTIONS[prev])) prev--;
        const last = streakRaw ? JSON.parse(streakRaw) : { n: 0, q: -99 };
        if (choice === Q.answer) {
          streak = last.q === prev ? last.n + 1 : 1;
          const remaining = Math.max(0, Math.min(1, (s.endsAt - now) / (secs(Q) * 1000)));
          pts = Math.round((500 + 500 * remaining) * (Q.double ? 2 : 1)) + Math.min(500, 100 * (streak - 1));
        }
      }
      const a: Answer = { c: choice, pts, t: Math.max(0, now - s.startedAt), streak };
      const [fresh] = await redis([["HSETNX", K.ans(s.q), pid, JSON.stringify(a)]]);
      if (fresh) {
        const cmds: Cmd[] = [];
        if (pts) cmds.push(["HINCRBY", K.scores, pid, pts]);
        if (!isPoll(Q)) cmds.push(["HSET", K.streaks, pid, JSON.stringify({ n: streak, q: s.q })]);
        if (cmds.length) await redis(cmds);
      }
      return send(res, 200, { ok: true });
    }

    // host-only actions
    if (!HOST_KEY) return send(res, 500, { error: "set GAME_HOST_KEY in Vercel env" });
    if (body.key !== HOST_KEY) return send(res, 403, { error: "wrong host key" });
    const s = await readState();
    if (action === "next") {
      const q = s.phase === "lobby" ? 0 : s.q + 1;
      if (q >= QUESTIONS.length) await saveState({ ...s, phase: "final" });
      else { const t = Date.now(); await saveState({ phase: "question", q, startedAt: t, endsAt: t + secs(QUESTIONS[q]) * 1000 }); }
    } else if (action === "reveal") {
      if (s.phase === "question") await saveState({ ...s, phase: "reveal" });
    } else if (action === "final") {
      await saveState({ ...s, phase: "final" });
    } else if (action === "reset") {
      await redis([["DEL", K.state, K.joins, K.names, K.players, K.scores, K.groups, K.streaks, ...QUESTIONS.map((_, i) => K.ans(i))]]);
    } else {
      return send(res, 400, { error: "unknown action" });
    }
    return send(res, 200, await snapshot(null, true));
  } catch (e: any) {
    return send(res, 500, { error: e?.message || "server error" });
  }
}
