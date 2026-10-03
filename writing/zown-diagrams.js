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
    const wheel = (x, y, r) =>
      `<g class="zd-wheel"><circle cx="${x}" cy="${y}" r="${r}"/><circle cx="${x}" cy="${y}" r="${r * 0.3}"/><path d="M${x - r * 0.8} ${y}h${r * 1.6}M${x} ${y - r * 0.8}v${r * 1.6}"/></g>`;
    const OLD = `<svg viewBox="0 0 120 50" aria-hidden="true">
      <path d="M8 37V29q2-5 12-6l14-1 6-10q2-2 6-2h26q4 0 6 3l6 9 20 1q8 1 8 7v7z"/>
      <path d="M44 13l-2 8h16v-8zM62 13v8h18l-4-8z"/><path d="M8 33h104"/><circle cx="109" cy="27" r="1.6"/>
      <g class="zd-puff"><circle cx="3" cy="33" r="2"/><circle cx="-3" cy="29" r="2.8"/></g>
      ${wheel(28, 39, 7)}${wheel(92, 39, 7)}</svg>`;
    const RACE = `<svg viewBox="0 0 120 50" aria-hidden="true">
      <path d="M4 37l2-7 24-2 20-6q6-3 14-2l10 2q6 0 12 4l24 4q6 1 6 5v2z"/>
      <path d="M54 22q6-8 16-1"/><path d="M8 30V19h14M10 19l4 9"/><circle cx="84" cy="31" r="3.5"/><path d="M30 33h70"/>
      <g class="zd-speed"><path d="M-14 24h10M-18 30h12M-12 36h8"/></g>
      ${wheel(24, 38, 8)}${wheel(98, 38, 8)}</svg>`;
    const car = (k, art, name, rows) => `
      <div class="zd-car" data-host="${k}"><span class="zd-tag"></span><strong>${name}</strong>
        <div class="zd-car-art">${art}<div class="zd-road"></div></div>
        <dl>${rows.map(([t, d]) => `<dt>${t}</dt><dd>${d}</dd>`).join("")}</dl></div>`;
    el.innerHTML = `
      <div class="zd-head"><span class="zd-title">switching servers without a big launch</span>
        <span class="zd-label">whatsapp drives ${seg("host", [["old", "old car"], ["new", "race car"]], "old")}</span></div>
      <div class="zd-cars">
        ${car("old", OLD, "the old car", [["is", "the old server"], ["engine", "python + langchain"], ["garage", "aws ec2, a machine we look after"]])}
        ${car("new", RACE, "the race car", [["is", "the new server"], ["engine", "typescript on mastra"], ["garage", "aws fargate, a container aws runs for us"], ["safety", "check the message → think + use tools → check the reply"]])}
      </div>
      <div class="zd-side"><span>same fuel: knowledge base, cma pdfs</span><span>same routes: follow-ups, listing alerts</span><span>the key: one setting in maytapi</span></div>
      <div class="zd-note"></div>`;
    const notes = {
      old: "whatsapp is still driving the old car. the race car is parked next to it with the engine running, it just has no driver yet.",
      new: "whatsapp moved into the race car. the old car stays parked beside it as a backup. moving over was one setting, and moving back is the same setting.",
    };
    const set = (v) => {
      el.querySelectorAll("[data-host]").forEach((n) => {
        const live = n.dataset.host === v;
        n.classList.toggle("live", live);
        n.querySelector(".zd-tag").textContent = live ? "driving" : "parked, engine on";
      });
      el.querySelector(".zd-note").textContent = notes[v];
    };
    bindSeg(el, "host", set);
    set("old");
  },

  signal(el) {
    const ASK = 799900;
    el.innerHTML = `
      <div class="zd-head"><span class="zd-title">is this price a lure?</span></div>
      <div class="zd-listing">
        <div class="zd-listing-img"><img src="${SAMPLE}" alt="aerial photo of a sample toronto listing" loading="lazy" decoding="async" /><span class="zd-badge">likely sells over asking</span></div>
        <div class="zd-listing-info"><small>sample listing</small><strong>${money(ASK)}</strong><span>remarks: “<em data-remark></em>”</span></div>
      </div>
      <div class="zd-row zd-col"><span>what similar homes sold for (cma) <strong data-cma></strong></span>
        <input type="range" min="700000" max="1000000" step="5000" value="850000" aria-label="cma midpoint" /></div>
      <div class="zd-row"><span>public remarks</span>${seg("remarks", [["anytime", "offers welcome anytime"], ["held", "offers held until a set date"]], "anytime")}</div>
      <div class="zd-checks"><div data-c="gap"></div><div data-c="date"></div></div>
      <div class="zd-out"></div>`;
    const range = el.querySelector("input");
    let held = false;
    const render = () => {
      const cma = +range.value, gap = cma - ASK, gapHit = gap >= 100000;
      el.querySelector("[data-cma]").textContent = `${money(cma)} (${gap >= 0 ? "+" : "−"}${money(Math.abs(gap))} vs ask)`;
      const chk = (k, ok, text) => {
        const c = el.querySelector(`[data-c="${k}"]`);
        c.className = ok ? "zd-ok" : "zd-no";
        c.textContent = (ok ? "✓ " : "✗ ") + text;
      };
      chk("gap", gapHit, "similar homes sold for $100k+ more than the ask");
      chk("date", held, "the listing holds offers until a set date");
      const out = el.querySelector(".zd-out");
      out.classList.toggle("warn", gapHit && held);
      el.querySelector(".zd-listing").classList.toggle("warn", gapHit && held);
      el.querySelector("[data-remark]").textContent = held ? "offers reviewed on a set date" : "offers welcome anytime";
      out.textContent = gapHit && held
        ? "both are true, so zoro adds a fixed heads-up, not a guess: this home is likely priced to draw offers and may sell above asking. a human on the team is flagged too."
        : "no warning. one clue on its own isn't proof, and a false alarm is worse than saying nothing.";
    };
    range.addEventListener("input", render);
    bindSeg(el, "remarks", (v) => { held = v === "held"; render(); });
    render();
  },

  stage(el) {
    el.innerHTML = `
      <div class="zd-head"><span class="zd-title">what can zoro do for this buyer, right now?</span></div>
      <div class="zd-row zd-col"><span>did they fill the qualification form?</span>
        ${seg("form", [["none", "never filled"], ["fail", "filled · score short"], ["pass", "filled · passed"]], "none")}</div>
      <div class="zd-row zd-col"><span>where are they in the sales pipeline (hubspot)?</span>
        ${seg("journey", [["none", "no deal"], ["deal", "deal · has an agent"], ["contract", "under contract"], ["hold", "on hold"], ["unknown", "unknown stage"]], "none")}</div>
      <div class="zd-out zd-state"><div data-state></div><small data-why></small></div>
      <div class="zd-rules"></div>
      <div class="zd-controls">
        <div class="zd-player">
          <button type="button" data-p="prev" aria-label="previous case">&lsaquo;</button>
          <button type="button" data-p="play" aria-label="play">&#9654;</button>
          <button type="button" data-p="next" aria-label="next case">&rsaquo;</button>
          <span class="zd-count"></span>
        </div>
        <span class="zd-tally"></span>
      </div>
      <div class="zd-limits"><span>never submits, counters, or negotiates</span><span>no internal jargon to clients</span><span>never passes a verdict on the buyer</span><span>never says “you don’t qualify”, but can say what a lender may think of a specific price</span></div>
      <div class="zd-note">a simplified slice of the real rulebook: eleven actions × seven buyer types. if any cell is left empty, the code won't build.</div>`;
    // [form, journey, why]
    const CASES = [
      ["none", "none", "never filled the form, no deal: no showing until the form is done."],
      ["fail", "none", "filled but scored short: omar's call. completing the form is the gate, so showings unlock."],
      ["pass", "none", "filled and passed: a qualified lead."],
      ["pass", "deal", "passed, but there's a deal: journey outranks the score. they have an agent."],
      ["fail", "contract", "under contract: no new searches volunteered, hand them to their account manager."],
      ["none", "hold", "on hold: nurture them, don't treat them as a fresh lead."],
      ["none", "unknown", "a stage we don't recognize? assume they have an agent. when unsure, do less."],
    ];
    const ACTIONS = ["encourage a sale showing", "volunteer a new search", "treat as a fresh lead", "nudge to their account manager"];
    el.querySelector(".zd-rules").innerHTML = ACTIONS
      .map((a, n) => `<div class="zd-row zd-rule" data-r="${n}"><span><i class="zd-lamp"></i><span class="zd-act">${a}</span></span><small></small></div>`).join("");
    const rows = [...el.querySelectorAll(".zd-rule")];
    const playBtn = el.querySelector('[data-p="play"]'), count = el.querySelector(".zd-count");
    let form = "none", journey = "none", c = 0, timer = null, why = CASES[0][2];

    const syncSeg = (name, v) => el.querySelectorAll(`[data-seg="${name}"] button`).forEach((b) => b.classList.toggle("on", b.dataset.v === v));
    const render = () => {
      const j = journey === "unknown" ? "deal" : journey;
      const formDone = form !== "none";
      const state = {
        none: formDone ? (form === "pass" ? "qualified lead" : "lead · form completed") : "lead · no form yet",
        deal: "has an agent",
        contract: "under contract",
        hold: "on hold",
      }[j];
      el.querySelector("[data-state]").innerHTML = `this buyer is: <strong>${state}</strong>`;
      el.querySelector("[data-why]").textContent = why;
      const agent = j === "deal" || j === "contract";
      const verdicts = [
        [formDone, formDone ? "completing the form is the gate, passing it is not" : "the app would refuse it, so zoro won't offer it"],
        [j !== "contract", j === "contract" ? "not while under contract" : "fine"],
        [j === "none", j === "hold" ? "nurture instead" : agent ? "past the lead stage, they have an agent" : "fine"],
        [agent, agent ? "they already have a human" : "not yet"],
      ];
      let green = 0;
      verdicts.forEach(([ok, note], n) => {
        const row = rows[n], lamp = row.querySelector(".zd-lamp");
        if (ok) green++;
        if (lamp.classList.contains("ok") !== ok || !lamp.className.includes(" ")) {
          lamp.className = `zd-lamp ${ok ? "ok" : "no"}`;
          void lamp.offsetWidth; lamp.classList.add("flip");
        }
        row.classList.toggle("is-ok", ok);
        row.querySelector("small").textContent = note;
      });
      el.querySelector(".zd-tally").innerHTML = `<i class="zd-lamp ok"></i>${green} allowed <i class="zd-lamp no"></i>${4 - green} blocked`;
    };
    const goCase = (to) => {
      c = (to + CASES.length) % CASES.length;
      [form, journey, why] = CASES[c];
      syncSeg("form", form); syncSeg("journey", journey);
      count.textContent = `case ${c + 1} / ${CASES.length}`;
      render();
    };
    const stop = () => { clearInterval(timer); timer = null; playBtn.innerHTML = "&#9654;"; playBtn.setAttribute("aria-label", "play"); };
    const play = () => {
      playBtn.innerHTML = "&#10073;&#10073;"; playBtn.setAttribute("aria-label", "pause");
      timer = setInterval(() => goCase(c + 1), 2800);
    };
    const manual = () => { stop(); why = "your pick."; count.textContent = "custom"; render(); };
    bindSeg(el, "form", (v) => { form = v; manual(); });
    bindSeg(el, "journey", (v) => { journey = v; manual(); });
    el.addEventListener("click", (e) => {
      const p = e.target.closest("[data-p]");
      if (!p) return;
      if (p.dataset.p === "play") return timer ? stop() : play();
      stop();
      goCase(c + (p.dataset.p === "next" ? 1 : -1));
    });
    goCase(0);
    new IntersectionObserver((en, io) => { if (en[0].isIntersecting) { play(); io.disconnect(); } }, { threshold: 0.5 }).observe(el);
  },

  api(el) {
    const N = {
      feeds: ["board feeds", "the real estate boards (trreb, itso) send us their listings."],
      media: ["photos", "photos arrive separately. no published photo, no listing on the app."],
      ingest: ["clean-up", "puts every listing in the same format and pins the address on a map."],
      pg: ["database", "postgres. every listing in one shape. price changes spotted here trigger alerts."],
      listapi: ["listings api", "what the app reads from. it only talks to our database, and gives each listing page a price estimate."],
      app: ["buyer app", "the map, the filters, the published photos."],
      zoro: ["zoro", "the agent, mid whatsapp turn."],
      client: ["one connector", "zoro's only door to an mls. switching providers means changing one file."],
      repliers: ["live mls", "repliers: up-to-the-minute listings. in a chat, fresh matters, so sold history and photo search come from here."],
      apple: ["apple maps", "turns an address into a point on the map."],
      osm: ["openstreetmap", "fills in what's nearby: parks, transit, shops."],
      poi: ["nearby places", "a catalog of what's around every home, stored once (postgis). “what's within 1 km?” is a quick lookup, not a live call."],
      local: ["area stats", "schools (eqao, fraser, catchments), census, climate, walk + transit scores, market stats. refreshed on a schedule, with a lock so two jobs never scrape the province twice."],
      mv: ["summary table", "a materialized view: the home plus everything around it, pre-joined, in a shape zoro can read out loud."],
    };
    const n = (k) => `<button type="button" class="zd-node" data-k="${k}">${N[k][0]}</button>`;
    const stack = (...ks) => `<div class="zd-stack zd-stack-sm">${ks.map(n).join("")}</div>`;
    el.innerHTML = `
      <div class="zd-head"><span class="zd-title">where zoro's home facts come from</span>${seg("sc", [["listing", "a listing arrives"], ["ask", "a buyer asks zoro"], ["hood", "neighbourhood refresh"]], "listing")}</div>
      <div class="zd-pipeline">
        <div class="zd-lane"><span class="zd-lane-name">listings</span><div class="zd-flow">${stack("feeds", "media")}${arrow}${n("ingest")}${arrow}${n("pg")}${arrow}${n("listapi")}${arrow}${n("app")}</div></div>
        <div class="zd-lane"><span class="zd-lane-name">live search</span><div class="zd-flow">${n("zoro")}${arrow}${n("client")}${arrow}${n("repliers")}</div></div>
        <div class="zd-lane"><span class="zd-lane-name">neighbourhood</span><div class="zd-flow">${stack("apple", "osm")}${arrow}${stack("poi", "local")}${arrow}${n("mv")}</div></div>
        <span class="zd-packet no-anim"></span>
      </div>
      <div class="zd-out" data-detail></div>
      <div class="zd-controls">
        <div class="zd-player">
          <button type="button" data-p="prev" aria-label="previous step">&lsaquo;</button>
          <button type="button" data-p="play" aria-label="play">&#9654;</button>
          <button type="button" data-p="next" aria-label="next step">&rsaquo;</button>
          <span class="zd-count"></span>
        </div>
        <div class="zd-toggles"></div>
      </div>`;

    const T = { photo: true, sparse: false, legacy: false };
    const TOGGLES = { listing: [["photo", "has a published photo"]], ask: [["sparse", "live results come up short"], ["legacy", "switch back to the old order"]], hood: [] };
    // each step: [node, packet label, explanation, dropped?]
    const build = (sc) => {
      if (sc === "listing") {
        const head = [["feeds", "listing", "a real estate board publishes a new listing.", false, true], ["media", "photos", "its photos come in separately.", false, true]];
        if (!T.photo) return [...head, ["media", "no photo", "no published photo, so it never shows up on the app.", true]];
        return [...head,
          ["ingest", "listing", "we clean it up and pin the address on a map.", false, true],
          ["pg", "listing", "it's saved in our database. if the price changes later, buyers watching it get an alert.", false, true],
          ["listapi", "listing", "the listings api reads only from our database. no outside calls.", false, true],
          ["app", "home", "the buyer sees it on the map, in the filters, with photos.", false, true]];
      }
      if (sc === "ask") {
        const first = T.legacy ? ["pg", "search", "switched back to the old order: our database answers first."] : ["repliers", "search", "first stop is the live mls, because in a chat, fresh beats fast."];
        const topUp = T.legacy ? ["repliers", "top-up", "our database came up short, so the live mls fills in the rest."] : ["pg", "top-up", "the live mls came up short, so our database fills in the rest."];
        return [
          ["zoro", "search", "a buyer asks zoro for homes on whatsapp."],
          ["client", "search", "the request goes through one connector, zoro's only door to an mls."],
          first,
          T.sparse ? topUp : [first[0], "results", "enough results came back. no top-up needed."],
          ["mv", "homes", "for each home, one lookup in the summary table.", false, true],
          ["zoro", "answer", "zoro answers with facts already prepared. no searching the web mid conversation.", false, true]];
      }
      return [
        ["apple", "address", "apple maps turns the address into a point on the map."],
        ["osm", "sweep", "openstreetmap finds what's nearby."],
        ["poi", "pois", "both fill the nearby places catalog."],
        ["local", "stats", "schools, census, climate, walk + transit and market stats refresh on a schedule."],
        ["mv", "view", "everything is joined into one summary table."],
        ["zoro", "1 query", "zoro asks “what's within 1 km?” and gets one quick answer. no live map calls."]];
    };

    const pipe = el.querySelector(".zd-pipeline"), packet = el.querySelector(".zd-packet");
    const detail = el.querySelector("[data-detail]"), count = el.querySelector(".zd-count");
    const playBtn = el.querySelector('[data-p="play"]');
    let sc = "listing", steps = [], i = 0, timer = null;

    const place = (k) => {
      const c = pipe.getBoundingClientRect(), r = el.querySelector(`[data-k="${k}"]`).getBoundingClientRect();
      packet.style.transform = `translate(${r.right - c.left}px, ${r.top - c.top}px) translate(-85%, -55%)`;
    };
    const go = (to) => {
      i = Math.max(0, Math.min(steps.length - 1, to));
      const [k, label, text, drop, pic] = steps[i];
      const seen = new Set(steps.slice(0, i).map((st) => st[0]));
      const order = {};
      steps.forEach(([nk], j) => (order[nk] = order[nk] ? `${order[nk]}·${j + 1}` : `${j + 1}`));
      el.querySelectorAll("[data-k]").forEach((b) => {
        const nk = b.dataset.k;
        b.classList.toggle("live", nk === k);
        b.classList.toggle("done", nk !== k && seen.has(nk));
        b.classList.toggle("off", !order[nk]);
        order[nk] ? (b.dataset.n = order[nk]) : delete b.dataset.n;
      });
      el.querySelectorAll(".zd-lane").forEach((ln) => ln.classList.toggle("off-lane", !ln.querySelector("[data-n]")));
      packet.innerHTML = (pic ? `<img src="${SAMPLE}" alt="" />` : HOUSE) + label;
      packet.classList.toggle("pic", !!pic);
      packet.classList.toggle("drop", !!drop);
      place(k);
      detail.innerHTML = `<span class="zd-step">step ${i + 1}</span>${text}`;
      count.textContent = `${i + 1} / ${steps.length}`;
    };
    const stop = () => { clearInterval(timer); timer = null; playBtn.innerHTML = "&#9654;"; playBtn.setAttribute("aria-label", "play"); };
    const play = () => {
      if (i >= steps.length - 1) go(0);
      playBtn.innerHTML = "&#10073;&#10073;"; playBtn.setAttribute("aria-label", "pause");
      timer = setInterval(() => (i >= steps.length - 1 ? stop() : go(i + 1)), 1700);
    };
    const restart = () => {
      stop();
      steps = build(sc);
      el.querySelector(".zd-toggles").innerHTML = TOGGLES[sc]
        .map(([k, label]) => `<label><input type="checkbox" data-t="${k}"${T[k] ? " checked" : ""} /> ${label}</label>`).join("");
      go(0);
    };

    bindSeg(el, "sc", (v) => { sc = v; restart(); });
    el.addEventListener("change", (e) => { const t = e.target.closest("[data-t]"); if (t) { T[t.dataset.t] = t.checked; restart(); play(); } });
    el.addEventListener("click", (e) => {
      const p = e.target.closest("[data-p]");
      if (p) {
        if (p.dataset.p === "play") return timer ? stop() : play();
        stop();
        return go(i + (p.dataset.p === "next" ? 1 : -1));
      }
      const b = e.target.closest("[data-k]");
      if (!b) return;
      stop();
      detail.innerHTML = `<strong>${N[b.dataset.k][0]}</strong>: ${N[b.dataset.k][1]}`;
    });
    addEventListener("resize", () => steps.length && place(steps[i][0]));
    restart();
    requestAnimationFrame(() => packet.classList.remove("no-anim"));
    new IntersectionObserver((en, io) => { if (en[0].isIntersecting) { play(); io.disconnect(); } }, { threshold: 0.5 }).observe(el);
  },

  hubspot(el) {
    // [label, side that owns the write ("app" | "hs" | null = stays level), weight, steps, result]
    const E = {
      submit: ["form submitted", "hs", "qualification lead", ["only approved fields, same from web and mobile", "<code>cid</code> and <code>zcid</code> treated as one field", "queued, so a retry can't send it twice"], "one lead per buyer in hubspot. after that, account managers own it. a glitchy retry never creates a duplicate."],
      edit: ["form edited", "hs", "edit note", ["only approved fields", "queued, so a retry can't send it twice"], "saved with a different note title than a first submission, so fixing a typo doesn't trigger another sales call."],
      stage: ["deal stage changed", "app", "deal stage", ["hubspot tells us", "we copy the stage name exactly"], "zoro now knows where the buyer is, straight from the deal."],
      echo: ["hubspot echoes our own deal", null, "echo", ["hubspot tells us", "we recognize it as our own change"], "ignored, so nothing loops."],
      claim: ["chat claims “highly qualified”", null, "HIGHLY_QUALIFIED", ["the chat app says the buyer is highly qualified"], "rejected. if the chat could set its own stage, it could talk the bot past every rule."],
      admin: ["ops tool saves data", "app", "ops data", ["never talks to hubspot"], "two separate systems, on purpose. we chose not to sync them."],
    };
    el.innerHTML = `
      <div class="zd-head"><span class="zd-title">who owns which data?</span><button type="button" class="zd-chip" data-reset>reset</button></div>
      <div class="zd-chips">${Object.entries(E).map(([k, [label]]) => `<button type="button" class="zd-chip" data-e="${k}">${label}</button>`).join("")}</div>
      <div class="zd-seesaw">
        <span class="zd-bounce"></span>
        <div class="zd-beam">
          <div class="zd-pan" data-side="app"><span class="zd-weights"></span><span class="zd-pan-name">our app · our database</span></div>
          <div class="zd-pan" data-side="hs"><span class="zd-weights"></span><span class="zd-pan-name">hubspot · the sales record</span></div>
        </div>
        <div class="zd-fulcrum" aria-hidden="true"></div>
      </div>
      <div class="zd-flow zd-steps"></div>
      <div class="zd-out"></div>`;
    const beam = el.querySelector(".zd-beam"), bounce = el.querySelector(".zd-bounce");
    const active = new Set();
    const show = (k) => {
      const [, , , steps, result] = E[k] || [, , , [], "tap an event. it lands on whichever system owns that data."];
      el.querySelector(".zd-steps").innerHTML = steps.map((s) => `<div class="zd-node">${s}</div>`).join(arrow);
      el.querySelector(".zd-out").innerHTML = result;
    };
    const tilt = () => {
      let d = 0;
      active.forEach((k) => (d += E[k][1] === "hs" ? 1 : -1));
      beam.style.transform = `rotate(${Math.max(-12, Math.min(12, d * 5))}deg)`;
    };
    const toggle = (k) => {
      const [, side, weight] = E[k];
      const chip = el.querySelector(`[data-e="${k}"]`);
      if (!side) {
        bounce.textContent = weight;
        bounce.classList.remove("in"); void bounce.offsetWidth; bounce.classList.add("in");
        chip.classList.add("on"); setTimeout(() => chip.classList.remove("on"), 900);
        return show(k);
      }
      if (active.has(k)) {
        active.delete(k);
        el.querySelector(`[data-w="${k}"]`)?.remove();
        chip.classList.remove("on");
        show([...active].pop());
      } else {
        active.add(k);
        const w = document.createElement("span");
        w.className = "zd-weight in"; w.dataset.w = k; w.textContent = weight;
        el.querySelector(`.zd-pan[data-side="${side}"] .zd-weights`).appendChild(w);
        chip.classList.add("on");
        show(k);
      }
      tilt();
    };
    el.addEventListener("click", (e) => {
      if (e.target.closest("[data-reset]")) {
        [...active].forEach(toggle);
        return show();
      }
      const b = e.target.closest("[data-e]");
      if (b) toggle(b.dataset.e);
    });
    toggle("submit");
  },
};

const TLDR = {
  cutover: "think of two cars parked side by side, both running. whatsapp is the driver. switching cars is one setting, and so is switching back.",
  signal: "a low price alone means nothing. a price well under what similar homes sold for, plus “offers held until a date”, means it will likely sell over asking. so zoro warns the buyer with a fixed sentence instead of guessing.",
  stage: "two facts decide it: did they fill the form, and where are they in the sales pipeline. the pipeline wins, because a buyer with a deal already has a human agent.",
  api: "three lanes. listings flow into our own database, live searches hit the mls, and neighbourhood facts are prepared ahead of time. zoro asks once and gets one clean answer.",
  hubspot: "hubspot and our app each own their own data. every event lands on exactly one side, and anything that would blur the line is ignored.",
};

document.querySelectorAll(".zd[data-zd]").forEach((el) => {
  D[el.dataset.zd]?.(el);
  if (TLDR[el.dataset.zd]) el.querySelector(".zd-head")?.insertAdjacentHTML("afterend", `<div class="zd-tldr">${TLDR[el.dataset.zd]}</div>`);
  el.querySelector(".zd-title")?.insertAdjacentHTML("afterbegin", HOUSE);
});
