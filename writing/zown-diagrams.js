let actx;
const sfx = (zoomIn) => {
  try {
    actx ||= new (window.AudioContext || window.webkitAudioContext)();
    const a = actx, t = a.currentTime;
    if (a.state === "suspended") a.resume();
    const blip = a.createOscillator(), bg = a.createGain();
    blip.type = "sine";
    blip.frequency.setValueAtTime(340, t);
    blip.frequency.exponentialRampToValueAtTime(150, t + 0.06);
    bg.gain.setValueAtTime(0.0001, t);
    bg.gain.exponentialRampToValueAtTime(0.18, t + 0.004);
    bg.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
    blip.connect(bg).connect(a.destination);
    blip.start(t);
    blip.stop(t + 0.1);
    const len = 0.45, buf = a.createBuffer(1, a.sampleRate * len, a.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const n = a.createBufferSource(), f = a.createBiquadFilter(), ng = a.createGain(), t0 = t + 0.04;
    n.buffer = buf;
    f.type = "bandpass";
    f.Q.value = 1.2;
    f.frequency.setValueAtTime(zoomIn ? 300 : 2400, t0);
    f.frequency.exponentialRampToValueAtTime(zoomIn ? 2400 : 300, t0 + len);
    ng.gain.setValueAtTime(0.0001, t0);
    ng.gain.exponentialRampToValueAtTime(0.12, t0 + len * 0.6);
    ng.gain.exponentialRampToValueAtTime(0.0001, t0 + len);
    n.connect(f).connect(ng).connect(a.destination);
    n.start(t0);
    n.stop(t0 + len);
  } catch {}
};

// interactive diagrams for the zown writeup — each mounts into <div class="zd" data-zd="name">
const money = (n) => "$" + n.toLocaleString("en-CA");
const seg = (name, opts, on) =>
  `<div class="zd-seg" role="group" data-seg="${name}">${opts
    .map(([v, label]) => `<button type="button" data-v="${v}"${v === on ? ' class="on"' : ""}>${label}</button>`)
    .join("")}</div>`;
const bindSeg = (el, name, fn) => {
  const g = el.querySelector(`[data-seg="${name}"]`);
  g.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    g.querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b));
    fn(b.dataset.v);
  });
};
const arrow = `<span class="zd-arrow" aria-hidden="true">&rarr;</span>`;
const SAMPLE = "/zown/sample-listing.jpg";
const HOUSE = `<svg class="zd-house" viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true"><path d="M2 7.5 8 2.5l6 5"/><path d="M3.8 6.3v7.2h8.4V6.3"/><path d="M6.6 13.5V9.9h2.8v3.6"/></svg>`;

const D = {
  cutover(el) {
    const CH = `stroke="#c9ccd1"`, GL = `fill="#16181c"`;
    const OLD = `<svg viewBox="0 0 160 70" aria-hidden="true">
      <g class="zd-puff"><circle cx="2" cy="44" r="3"/><circle cx="-5" cy="47" r="4"/><circle cx="-13" cy="44" r="3"/></g>
      <path fill="#3776ab" stroke="#1f4f7a" d="M16 16Q12 35 16 54Q20 61 40 61H120Q144 61 148 50Q151 35 148 20Q144 9 120 9H40Q20 9 16 16Z"/>
      <path fill="none" stroke="#ffd43b" stroke-width="1" d="M146 29Q122 27 100 31M146 41Q122 43 100 39M140 13Q130 18 128 12M140 57Q130 52 128 58"/>
      <path fill="none" ${CH} stroke-width="1" d="M22 11.5H122M22 58.5H122"/>
      <image href="/zown/python.webp" x="24" y="23" width="24" height="24"/>
      <rect fill="none" stroke="#24577f" stroke-width="1" x="20" y="16" width="32" height="38" rx="5"/>
      <rect ${GL} ${CH} stroke-width="1.6" x="56" y="14" width="40" height="42" rx="7"/>
      <rect fill="#2a2c31" stroke="#3d4047" stroke-width=".8" x="62" y="17" width="24" height="16" rx="4"/>
      <rect fill="#2a2c31" stroke="#3d4047" stroke-width=".8" x="62" y="37" width="24" height="16" rx="4"/>
      <path fill="none" stroke="#45484f" stroke-width=".7" d="M67 18v14M72 18v14M77 18v14M67 38v14M72 38v14M77 38v14"/>
      <rect fill="#3a2a22" x="64" y="33.2" width="26" height="3.6" rx="1"/>
      <circle fill="none" ${CH} stroke-width="1.2" cx="90" cy="45" r="5"/>
      <path fill="#cfe3ea" fill-opacity=".35" ${CH} stroke-width="2.4" d="M96 13Q105 35 96 57"/>
      <path fill="none" ${CH} stroke-width="2.4" d="M149.5 18Q153.5 35 149.5 52M12 18Q8.5 35 12 52"/>
      <circle fill="#eef1f4" stroke="#9aa0a8" stroke-width=".8" cx="145" cy="16" r="2.6"/><circle fill="#eef1f4" stroke="#9aa0a8" stroke-width=".8" cx="145" cy="54" r="2.6"/>
      <circle fill="#c9ccd1" cx="150" cy="35" r="1.4"/>
    </svg>`;
    const RACE = `<svg viewBox="0 0 160 70" aria-hidden="true">
      <g class="zd-speed"><path d="M-18 20h14M-22 35h18M-16 50h12"/></g>
      <path fill="#3178c6" stroke="#1d4f8a" d="M14 20Q12 35 14 50Q16 61 34 62L60 61Q67 64 77 62L118 60Q140 58 148 48Q152 35 148 22Q140 12 118 10L77 8Q67 6 60 9L34 8Q16 9 14 20Z"/>
      <path fill="none" stroke="#7fb2ea" stroke-width=".9" d="M146 35H112M116 14Q134 18 146 26M116 56Q134 52 146 44M20 22Q40 18 60 14M20 48Q40 52 60 56"/>
      <path ${GL} d="M139 13Q146 16 148.5 23L145 22Q142 17 137 15ZM139 57Q146 54 148.5 47L145 48Q142 53 137 55Z"/>
      <path ${GL} d="M126 20l8 2-2 4-7-2zM126 50l8-2-2-4-7 2z"/>
      <path ${GL} d="M108 15Q114 35 108 55L86 53Q82 35 86 17Z"/>
      <path ${GL} d="M84 13.5L60 15L60 17L84 16.5ZM84 56.5L60 55L60 53L84 53.5Z"/>
      <path ${GL} d="M94 9l6-4 3 1-4 5zM94 61l6 4 3-1-4-5z"/>
      <rect ${GL} x="24" y="22" width="32" height="26" rx="6"/>
      <path fill="none" stroke="#1d4f8a" stroke-width=".7" d="M29 24v22M34 24v22M39 24v22M44 24v22M49 24v22M26 35h28"/>
      <path fill="none" stroke="#16181c" stroke-width="1.1" d="M18 14l8 2M17 18l8 2M18 56l8-2M17 52l8-2"/>
      <circle fill="#d9dce0" stroke="#9aa0a8" stroke-width=".7" cx="36" cy="57" r="2.4"/>
      <rect fill="#e8c43a" x="148" y="34" width="1.6" height="2.2" rx=".4"/><circle fill="#e8c43a" cx="113" cy="12" r=".9"/><circle fill="#e8c43a" cx="113" cy="58" r=".9"/>
      <image href="/zown/typescript.webp" x="113" y="27" width="16" height="16"/>
    </svg>`;
    const inner = (svg) => svg.replace(/^<svg[^>]*>|<\/svg>$/g, "");
    const WHY = {
      old: ["python", ["built fast on langchain to prove the idea worked", "the model wrote every answer itself, so each one needed quality checks and a confidence score", "ran on aws ec2, a machine we had to look after"]],
      new: ["typescript", ["i redesigned the whole structure, on mastra", "deterministic tools do the work: fewer llm calls, more tool calls", "answers come from tools, so most of the extra checks went away", "runs on aws fargate, and reminders run on cron jobs"]],
    };
    const carG = (k, art) => `<g class="zd-racer" data-car="${k}" role="button" tabindex="0" aria-label="zoom in on the ${k === "old" ? "python" : "typescript"} car"><g transform="scale(.42) translate(-80 -35)">${inner(art)}</g></g>`;
    el.innerHTML = `
      <div class="zd-stage"><svg class="zd-track" viewBox="0 10 600 120" aria-label="two cars side by side. the typescript race car keeps passing the python old car. click a car to zoom in.">
        <rect x="-400" y="10" width="1400" height="120" fill="#e9e9e5"/>
        <path d="M-400 10H1000M-400 130H1000" stroke="#d6d6d1" stroke-width="1.5"/>
        <path d="M-400 70H1000" stroke="#fff" stroke-width="1.5" stroke-dasharray="14 10"/>
        <text class="zd-lane-tag" x="8" y="26">python v0</text><text class="zd-lane-tag" x="8" y="86">typescript v1</text>
        <path class="zd-ticks" d="${Array.from({ length: 36 }, (_, i) => `M${-400 + i * 40} 10V130`).join("")}"/>
        <g class="zd-paint">${[["can you get me a cma", "on this home?"], ["what’s the difference", "between In-fill or", "Over-improved?"], ["is this in my budget?"]].map((ls, i) => `<g transform="translate(${150 + i * 165} 70) rotate(90)">${ls.map((l) => `<text text-anchor="middle">${l}</text>`).join("")}</g>`).join("")}</g>
        ${carG("old", OLD)}${carG("new", RACE)}
      </svg>
      <div class="zd-over" aria-live="polite"><div class="zd-over-head"><img alt="" width="28" height="28"/><strong></strong></div><ul></ul><button type="button" class="zd-out">← zoom out</button></div></div>
      <p class="zd-hint">click a car to look closer <button type="button" class="zd-pick" data-pick="old">${OLD}python v0</button><button type="button" class="zd-pick" data-pick="new">${RACE}typescript v1</button></p>`;
    const svg = el.querySelector(".zd-track");
    el.querySelectorAll(".zd-paint > g").forEach((q) => {
      const ts = [...q.querySelectorAll("text")];
      const fs = Math.min(...ts.map((t) => 112 / t.getComputedTextLength()));
      ts.forEach((t, i) => {
        t.style.fontSize = `${fs}px`;
        t.setAttribute("y", ((i - (ts.length - 1) / 2) * fs * 1.15 + fs * 0.35).toFixed(1));
      });
    });
    let zoomed = null, dragged = false, was = null;
    const over = el.querySelector(".zd-over");
    const hl = () => {
      if (zoomed !== was) sfx(!!zoomed);
      was = zoomed;
      el.querySelectorAll("[data-car]").forEach((n) => n.classList.toggle("live", n.dataset.car === zoomed));
      el.classList.toggle("zd-zoomed", !!zoomed);
      if (zoomed) {
        over.querySelector("strong").textContent = `${WHY[zoomed][0]} ${zoomed === "old" ? "v0" : "v1"}`;
        over.dataset.lang = WHY[zoomed][0];
        over.querySelector("img").src = `/zown/${WHY[zoomed][0]}.webp`;
        over.querySelector("ul").innerHTML = WHY[zoomed][1].map((w) => `<li>${w}</li>`).join("");
      }
    };
    el.querySelectorAll("[data-car]").forEach((n) => {
      const k = n.dataset.car;
      n.addEventListener("click", (e) => {
        e.stopPropagation();
        if (dragged) return void (dragged = false);
        zoomed = zoomed === k ? null : k;
        hl();
      });
      n.addEventListener("keydown", (e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), n.click()));
    });
    svg.addEventListener("click", () => ((zoomed = null), hl()));
    el.querySelectorAll("[data-pick]").forEach((b) => b.addEventListener("click", () => el.querySelector(`[data-car="${b.dataset.pick}"]`).dispatchEvent(new MouseEvent("click", { bubbles: true }))));
    over.querySelector(".zd-out").addEventListener("click", () => ((zoomed = null), hl()));
    document.addEventListener("keydown", (e) => e.key === "Escape" && zoomed && ((zoomed = null), hl()));
    const SPEED = { old: 70, new: 210 }, Y = { old: 42, new: 102 }, START = { old: 120, new: 40 }, SPAN = 680;
    const g = { old: el.querySelector('[data-car="old"]'), new: el.querySelector('[data-car="new"]') };
    const xs = {};
    const off = { old: 0, new: 0 }, drag = { old: null, new: null }, extra = { old: 0, new: 0 };
    let lastMs = 0;
    Object.entries(g).forEach(([k, n]) => {
      let x0 = 0, p0 = 0, v = 0, pt = 0, px = 0;
      n.addEventListener("pointerdown", (e) => {
        v = 0; pt = e.timeStamp; px = e.clientX; extra[k] = 0;
        n.setPointerCapture(e.pointerId);
        x0 = xs[k];
        p0 = e.clientX;
        drag[k] = x0;
        dragged = false;
      });
      n.addEventListener("pointermove", (e) => {
        if (drag[k] == null) return;
        const dx = (e.clientX - p0) / svg.getScreenCTM().a;
        if (Math.abs(dx) > 3) dragged = true;
        drag[k] = ((((x0 + dx + 40) % SPAN) + SPAN) % SPAN) - 40;
        const dt = (e.timeStamp - pt) / 1000;
        if (dt > 0) v = 0.6 * v + 0.4 * ((e.clientX - px) / svg.getScreenCTM().a / dt);
        pt = e.timeStamp; px = e.clientX;
        if (!animated) place(lastMs);
      });
      const drop = () => {
        if (drag[k] == null) return;
        off[k] = drag[k] + 40 - START[k] - (SPEED[k] * lastMs) / 1000;
        drag[k] = null;
        const fling = performance.now() - pt > 90 ? 0 : Math.max(-450, Math.min(450, v));
        if (dragged && animated) extra[k] = fling - SPEED[k];
      };
      n.addEventListener("pointerup", drop);
      n.addEventListener("pointercancel", drop);
    });
    let z = 0, last = null;
    const place = (ms) => {
      const dt = Math.max(0, Math.min(0.05, (ms - lastMs) / 1000));
      lastMs = ms;
      ["old", "new"].forEach((k) => {
        if (!extra[k] || drag[k] != null) return;
        off[k] += extra[k] * dt;
        extra[k] *= Math.exp(-4 * dt);
        if (Math.abs(extra[k]) < 1) extra[k] = 0;
      });
      ["old", "new"].forEach((k) => {
        xs[k] = drag[k] != null ? drag[k] : ((((START[k] + off[k] + (SPEED[k] * ms) / 1000) % SPAN) + SPAN) % SPAN) - 40;
        g[k].setAttribute("transform", `translate(${xs[k].toFixed(1)} ${Y[k]})`);
      });
      if (zoomed) last = zoomed;
      z += ((zoomed ? 1 : 0) - z) * 0.12;
      if (z < 0.001) z = 0;
      const side = el.clientWidth > 560 ? 1 : 0;
      const w = 600 - 440 * z, h = w / (5 - (side ? 2.9 : 1.8) * z);
      const fx = last ? xs[last] + w * 0.27 * side : 300;
      const cx = 300 + (fx - 300) * z;
      const cy = Math.min(130 - h / 2, Math.max(10 + h / 2, last ? 70 + (Y[last] - 70) * z : 70));
      svg.setAttribute("viewBox", `${(cx - w / 2).toFixed(1)} ${(cy - h / 2).toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`);
    };
    const animated = !matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!animated) {
      place(1500);
      el.querySelectorAll("[data-car]").forEach((n) => n.addEventListener("click", () => { z = zoomed ? 0.99 : 0.01; place(1500); }));
    } else {
      let t0 = null, visible = false;
      new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(el);
      const tick = (now) => {
        if (t0 === null) t0 = now;
        if (visible) place(now - t0);
        else t0 += 16;
        requestAnimationFrame(tick);
      };
      place(0);
      requestAnimationFrame(tick);
    }
  },

  signal(el) {
    const k = (v) => (v >= 1e6 ? `$${(v / 1e6).toFixed(2).replace(/0$/, "")}M` : `$${Math.round(v / 1000)}k`);
    const S = {
      driver: {
        list: 649000, addr: "semi · leslieville", hist: [["mar", 849000], ["may", 799000], ["now", 649000]],
        rivals: [661000, 690000, 712000, 745000, 778000, 805000, 842000],
        open: "offers welcome! what are you thinking?",
        agent: "we have 7 offers, but for you we'd close asap",
        zoro: "the seller listed low on purpose to start a bidding war, then pushes buyers with “7 offers”. listed 3× in 4 months, price cut 24%, similar homes sold ~$835k. plan near $835k, not $649k.",
      },
      still: {
        list: 829000, addr: "semi · riverdale", hist: [["now", 829000]],
        rivals: [805000, 815000],
        open: "we review offers as they come in. what are you thinking?",
        agent: "we have a couple of offers in",
        zoro: "the seller priced at what they want and is waiting for it. listed once, price unchanged, close to similar sales (~$835k). no war expected: offer near asking.",
      },
    };
    const OFFERS = [["at asking", 0], ["+5%", 0.05], ["+15%", 0.15], ["+30%", 0.3]];
    const fast = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let mode = "driver", timers = [];
    el.innerHTML = `
      <div class="zd-head"><span class="zd-title">is this price a lure?</span></div>
      <div class="zd-row">${seg("seller", [["driver", "seller a"], ["still", "seller b"]], "driver")}</div>
      <div class="zd-im">
        <div class="zd-im-top"><button type="button" class="zd-im-back" aria-label="back">‹</button><span class="zd-im-av" aria-hidden="true">LA</span><span class="zd-im-name">listing agent <i>›</i></span></div>
        <div class="zd-im-banner" hidden></div>
        <div class="zd-im-thread" aria-live="polite"></div>
        <div class="zd-im-chips"></div>
        <div class="zd-im-bar" aria-hidden="true">iMessage</div>
      </div>`;
    el.insertAdjacentHTML("afterend", `<p class="zd-im-note">* zown didn't officially launch on imessage. this is from a file i was just messing around with.</p>`);
    const thread = el.querySelector(".zd-im-thread"), chips = el.querySelector(".zd-im-chips"), banner = el.querySelector(".zd-im-banner");
    const later = (ms, fn) => timers.push(setTimeout(fn, fast ? 0 : ms));
    const notif = (name, text) => `<div class="zd-im-nhead"><span class="zd-im-ico" aria-hidden="true"></span>MESSAGES<small>now</small></div><b>${name}</b><p>${text}</p>`;
    const add = (cls, html) => {
      const d = document.createElement("div");
      d.className = `zd-im-msg ${cls}`;
      d.innerHTML = html;
      thread.append(d);
      thread.scrollTop = thread.scrollHeight;
      return d;
    };
    const say = (t, html, cls = "") => {
      let dots;
      later(t, () => (dots = add("typing", "<span></span><span></span><span></span>")));
      later(t + 800, () => { dots?.remove(); add(`them ${cls}`, html); });
      return t + 800;
    };
    const setChips = (html) => {
      chips.innerHTML = html;
      chips.querySelectorAll("[data-p]").forEach((b) => b.addEventListener("click", () => play(+b.dataset.p)));
      chips.querySelector("[data-again]")?.addEventListener("click", reset);
    };
    const reset = () => {
      timers.forEach(clearTimeout);
      timers = [];
      const s = S[mode];
      banner.hidden = true;
      thread.innerHTML = "";
      add("them", `<div class="zd-im-card"><img src="${SAMPLE}" alt="" loading="lazy" decoding="async" /><div><small>${s.addr}</small><b>listed at ${k(s.list)}</b><span>${s.hist.map(([m, p], i) => `<em class="${i === s.hist.length - 1 ? "now" : ""}">${m} ${k(p)}</em>`).join(" → ")}</span></div></div>`);
      add("them", s.open);
      setChips(OFFERS.map(([t, p]) => `<button type="button" data-p="${p}">${t} <em>${k(s.list * (1 + p))}</em></button>`).join(""));
    };
    const play = (p) => {
      const s = S[mode], mine = Math.round(s.list * (1 + p)), top = Math.max(...s.rivals), won = mine > top;
      setChips("");
      add("me", `I'll offer ${k(mine)}`);
      later(300, () => add("status", "Delivered"));
      let t = say(600, s.agent);
      later((t += 900), () => add("time", "a few days later"));
      const sold = won ? mine : top, over = sold - s.list;
      t = say(t + 600, won
        ? `congrats, it's yours at <b>${k(sold)}</b>${over > 0 ? ` (${k(over)} over asking)` : ""}`
        : `sorry, the seller went with another offer. it sold for <b>${k(sold)}</b>, ${k(over)} over asking.`, won ? "win" : "lose");
      later(t + 700, () => {
        banner.innerHTML = notif("zoro", s.zoro);
        banner.hidden = false;
        setChips(`<button type="button" data-again>↺ try again</button>`);
      });
    };
    banner.addEventListener("click", () => (banner.hidden = true));
    let peek, taps = 0;
    const JOKES = ["stop tryna see my messages lol", "dang bro chill", "u not finding anything crazy here"];
    el.querySelector(".zd-im-back").addEventListener("click", () => {
      banner.hidden = true;
      requestAnimationFrame(() => {
        banner.innerHTML = notif("muhib", JOKES[taps++ % JOKES.length]);
        banner.hidden = false;
      });
      clearTimeout(peek);
      peek = setTimeout(() => (banner.hidden = true), 3000);
    });
    bindSeg(el, "seller", (v) => { mode = v; reset(); });
    reset();
  },

  api(el) {
    const N = {
      feeds: ["board feeds", "the real estate boards (trreb, itso) send us their listings."],
      media: ["photos", "photos arrive separately. no published photo, no listing on the app."],
      ingest: ["clean-up", "puts every listing in the same format and pins the address on a map."],
      pg: ["database", "postgres. every listing in one shape. price changes spotted here trigger alerts."],
      listapi: ["listings api", "what the app reads from. it only talks to our database."],
      app: ["buyer app", "the map, the filters, the published photos."],
      zoro: ["zoro", "the agent, mid whatsapp turn."],
      client: ["connector", "zoro's only door to an mls. switching providers means changing one file."],
      repliers: ["live mls", "repliers: up-to-the-minute listings, because in a chat, fresh matters."],
      apple: ["apple maps", "turns an address into a point on the map."],
      osm: ["openstreetmap", "fills in what's nearby: parks, transit, shops."],
      poi: ["nearby places", "a catalog of what's around every home, stored once (postgis)."],
      local: ["area stats", "schools, census, climate, walk + transit scores, refreshed on a schedule."],
      mv: ["summary table", "the home plus everything around it, pre-joined, in a shape zoro can read out loud."],
    };
    const P = { feeds: [40, 60], media: [120, 60], ingest: [200, 60], pg: [280, 60], listapi: [360, 60], app: [440, 60], zoro: [400, 150], client: [480, 150], repliers: [560, 150], apple: [40, 220], osm: [120, 220], poi: [200, 220], local: [280, 220], mv: [360, 220] };
    const C = { red: "#e5484d", blue: "#2f7de1", green: "#2fa05a", grey: "#9a9a95" };
    const LINES = [["red", ["feeds", "media", "ingest", "pg", "listapi", "app"]], ["blue", ["zoro", "client", "repliers"]], ["green", ["apple", "osm", "poi", "local", "mv", "zoro"]]];
    const color = (a, b) => (LINES.find(([, s]) => s.some((x, i) => (x === a && (s[i + 1] === b || s[i - 1] === b))))?.[0]) || "grey";
    const R = {
      listing: ["a new listing hits the board", ["feeds", "media", "ingest", "pg", "listapi", "app"], "✓ the buyer sees it on the map, with photos."],
      nophoto: ["…but it has no photo", ["feeds", "media"], "✗ no published photo, so it never reaches the app.", true],
      search: ["“3-bed semis under $900k?”", ["zoro", "client", "repliers", "client", "zoro", "mv", "zoro"], "✓ live mls results, plus neighbourhood facts from one lookup."],
      sparse: ["live results come up short", ["zoro", "client", "repliers", "client", "zoro", "pg", "zoro"], "✓ our own database tops up the list."],
      nearby: ["“what's within 1 km?”", ["zoro", "mv", "zoro"], "✓ one quick lookup in the summary table. no live map calls."],
      hood: ["nightly neighbourhood refresh", ["apple", "osm", "poi", "local", "mv"], "✓ everything around every home is pre-joined before anyone asks."],
    };
    const lab = (k) => {
      const [x, y] = P[k], above = ["feeds", "ingest", "pg", "app", "osm", "local"].includes(k);
      return `<text x="${x}" y="${above ? y - 16 : y + 26}" text-anchor="middle" class="zd-tm-lab${k === "zoro" ? " big" : ""}">${N[k][0]}</text>`;
    };
    const seg2 = (a, b, c, dash) => `<line x1="${P[a][0]}" y1="${P[a][1]}" x2="${P[b][0]}" y2="${P[b][1]}" stroke="${C[c]}" class="zd-tm-line${dash ? " dash" : ""}"/>`;
    el.innerHTML = `
      <div class="zd-head"><span class="zd-title">where zoro's home facts come from</span></div>
      <div class="zd-tm-chips">${Object.entries(R).map(([k, r]) => `<button type="button" data-r="${k}">${r[0]}</button>`).join("")}</div>
      <div class="zd-tm-wrap"><svg viewBox="-20 -8 660 270" class="zd-tm" role="img" aria-label="a transit map with three lines meeting at zoro">
        ${LINES.map(([c, s]) => s.slice(1).map((b, i) => seg2(s[i], b, c)).join("")).join("")}
        ${seg2("pg", "zoro", "grey", true)}
        ${Object.keys(P).map((k) => `<circle data-k="${k}" cx="${P[k][0]}" cy="${P[k][1]}" r="${k === "zoro" ? 11 : 7}" class="zd-tm-st"/>`).join("")}
        ${Object.keys(P).map(lab).join("")}
        <g data-train class="zd-tm-train"><rect x="-13" y="-7" width="26" height="14" rx="5"/><rect x="-8" y="-3" width="5" height="4" rx="1" class="w"/><rect x="2" y="-3" width="5" height="4" rx="1" class="w"/></g>
      </svg></div>
      <div class="zd-tm-legend"><span style="--c:${C.red}">listings</span><span style="--c:${C.blue}">live search</span><span style="--c:${C.green}">neighbourhood</span><span style="--c:${C.grey}" class="dash">transfer</span></div>
      <div class="zd-out" data-cap></div>`;
    const train = el.querySelector("[data-train]"), cap = el.querySelector("[data-cap]");
    const fast = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let token = 0, auto = true;
    const put = ([x, y]) => train.setAttribute("transform", `translate(${x} ${y})`);
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const tween = (a, b, ms, my) => new Promise((done) => {
      const t0 = performance.now();
      const f = (now) => {
        if (my !== token) return done();
        const u = Math.min(1, (now - t0) / ms), e = u * u * (3 - 2 * u);
        put([a[0] + (b[0] - a[0]) * e, a[1] + (b[1] - a[1]) * e]);
        u < 1 ? requestAnimationFrame(f) : done();
      };
      requestAnimationFrame(f);
    });
    const st = (k, cls) => el.querySelector(`[data-k="${k}"]`).classList.add(cls);
    const run = async (key) => {
      const my = ++token, [, path, answer, drop] = R[key];
      el.querySelectorAll("[data-r]").forEach((b) => b.classList.toggle("on", b.dataset.r === key));
      el.querySelectorAll("[data-k]").forEach((c) => { c.classList.remove("on", "seen", "x"); c.style.fill = ""; });
      train.classList.remove("gone");
      const light = (k, c) => { el.querySelectorAll(".zd-tm-st.on").forEach((n) => { n.classList.replace("on", "seen"); n.style.fill = ""; }); st(k, "on"); el.querySelector(`[data-k="${k}"]`).style.fill = C[c]; };
      const end = () => {
        if (drop) { st(path.at(-1), "x"); train.classList.add("gone"); }
        cap.className = `zd-out ${drop ? "warn" : ""}`;
        cap.textContent = answer;
      };
      if (fast) { path.forEach((k) => st(k, "seen")); put(P[path.at(-1)]); return end(); }
      const c0 = color(path[0], path[1]);
      train.style.fill = C[c0];
      put(P[path[0]]);
      light(path[0], c0);
      cap.className = "zd-out";
      cap.innerHTML = `<strong>${N[path[0]][0]}</strong>: ${N[path[0]][1]}`;
      for (let i = 1; i < path.length; i++) {
        await sleep(650);
        if (my !== token) return;
        const c = color(path[i - 1], path[i]);
        train.style.fill = C[c];
        await tween(P[path[i - 1]], P[path[i]], 750, my);
        if (my !== token) return;
        light(path[i], c);
        cap.innerHTML = `<strong>${N[path[i]][0]}</strong>: ${N[path[i]][1]}`;
      }
      await sleep(500);
      if (my !== token) return;
      end();
      if (!auto) return;
      await sleep(2600);
      const ks = Object.keys(R);
      if (my === token && auto) run(ks[(ks.indexOf(key) + 1) % ks.length]);
    };
    el.querySelector(".zd-tm-chips").addEventListener("click", (e) => { const b = e.target.closest("[data-r]"); if (b) { auto = false; run(b.dataset.r); } });
    el.querySelector(".zd-tm").addEventListener("click", (e) => {
      const c = e.target.closest("[data-k]");
      if (c) cap.innerHTML = `<strong>${N[c.dataset.k][0]}</strong>: ${N[c.dataset.k][1]}`;
    });
    put(P.feeds);
    cap.textContent = "pick a trip, or watch them run.";
    new IntersectionObserver((en, io) => { if (en[0].isIntersecting) { run("listing"); io.disconnect(); } }, { threshold: 0.4 }).observe(el);
  },
};

const TLDR = {
  signal: "sellers play one of two games: list low and start a bidding war, or list at the real price and wait. zoro reads the listing history to tell them apart before the buyer bids.",
  api: "three subway lines. listings flow into our own database, live searches go out to the mls, and neighbourhood facts are prepared ahead of time. they all meet at zoro.",
};

document.querySelectorAll(".zd[data-zd]").forEach((el) => {
  D[el.dataset.zd]?.(el);
  if (TLDR[el.dataset.zd]) el.querySelector(".zd-head")?.insertAdjacentHTML("afterend", `<div class="zd-tldr">${TLDR[el.dataset.zd]}</div>`);
});
