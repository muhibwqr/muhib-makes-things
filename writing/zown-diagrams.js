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
    el.innerHTML = `
      <div class="zd-head"><span class="zd-title">cutover: two real hosts, one pointer</span>
        <span class="zd-label">maytapi points at ${seg("host", [["old", "ec2 · python"], ["new", "fargate · typescript"]], "old")}</span></div>
      <div class="zd-flow">
        <div class="zd-node">whatsapp<small>via maytapi</small></div>${arrow}
        <div class="zd-stack">
          <div class="zd-node" data-host="old"><span class="zd-tag"></span>ec2<small>python agent · <code>backend/agents/orchestrator.py</code></small></div>
          <div class="zd-node" data-host="new"><span class="zd-tag"></span>fargate container<small>typescript on mastra</small>
            <div class="zd-pipe"><span>inbound validator</span>${arrow}<span>orchestrator + tool loop</span>${arrow}<span>outbound validator</span></div>
          </div>
        </div>
      </div>
      <div class="zd-side"><span>object storage: knowledge, cma pdfs</span><span>scheduled jobs: follow-ups, listing alerts</span></div>
      <div class="zd-note"></div>`;
    const notes = {
      old: "traffic still lands on the python service. the typescript one is deployed and real, just not receiving messages yet.",
      new: "traffic lands on fargate. ec2 stays up beside it until the new host is boring. cutover is a pointer change, not a press release.",
    };
    const set = (v) => {
      el.querySelectorAll("[data-host]").forEach((n) => {
        const live = n.dataset.host === v;
        n.classList.toggle("live", live);
        n.querySelector(".zd-tag").textContent = live ? "receiving" : "standby";
      });
      el.querySelector(".zd-note").textContent = notes[v];
    };
    bindSeg(el, "host", set);
    set("old");
  },

  signal(el) {
    const ASK = 799900;
    el.innerHTML = `
      <div class="zd-head"><span class="zd-title">is this list price bait?</span></div>
      <div class="zd-listing">
        <div class="zd-listing-img"><img src="${SAMPLE}" alt="aerial photo of a sample toronto listing" loading="lazy" decoding="async" /><span class="zd-badge">likely sells over asking</span></div>
        <div class="zd-listing-info"><small>sample listing</small><strong>${money(ASK)}</strong><span>remarks: “<em data-remark></em>”</span></div>
      </div>
      <div class="zd-row zd-col"><span>cma midpoint from comparable sales <strong data-cma></strong></span>
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
      chk("gap", gapHit, "cma midpoint sits $100k+ above ask");
      chk("date", held, "deferred offer date found in remarks");
      const out = el.querySelector(".zd-out");
      out.classList.toggle("warn", gapHit && held);
      el.querySelector(".zd-listing").classList.toggle("warn", gapHit && held);
      el.querySelector("[data-remark]").textContent = held ? "offers reviewed on a set date" : "offers welcome anytime";
      out.textContent = gapHit && held
        ? "both arrived together, so it's deterministic: a heads-up is appended in zoro's voice (likely priced to draw offers, may sell above asking) and the account manager is flagged."
        : "no warning. one signal alone is not the fact, and a false warning is worse than silence.";
    };
    range.addEventListener("input", render);
    bindSeg(el, "remarks", (v) => { held = v === "held"; render(); });
    render();
  },

  stage(el) {
    el.innerHTML = `
      <div class="zd-head"><span class="zd-title">two independent facts, one operating state</span></div>
      <div class="zd-row zd-col"><span>score from the qualification form</span>
        ${seg("form", [["none", "never filled"], ["fail", "filled · score short"], ["pass", "filled · passed"]], "none")}</div>
      <div class="zd-row zd-col"><span>journey from the hubspot deal stage label</span>
        ${seg("journey", [["none", "no deal"], ["deal", "deal · has an agent"], ["contract", "under contract"], ["hold", "on hold"], ["unknown", "unrecognized label"]], "none")}</div>
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
      <div class="zd-limits"><span>never submits, counters, or negotiates</span><span>internal language never reaches a client</span><span>never passes a verdict on the buyer</span><span>no tier names or “you don’t qualify”, but what a lender may do about a specific price is fair</span></div>
      <div class="zd-note">a simplified slice of the real table: eleven actions × seven states, every cell filled or the build breaks.</div>`;
    // [form, journey, why]
    const CASES = [
      ["none", "none", "never filled the form, no deal: no showing until the form is done."],
      ["fail", "none", "filled but scored short: omar's call. completing the form is the gate, so showings unlock."],
      ["pass", "none", "filled and passed: a qualified lead."],
      ["pass", "deal", "passed, but there's a deal: journey outranks the score. they have an agent."],
      ["fail", "contract", "under contract: no new searches volunteered, hand them to their account manager."],
      ["none", "hold", "on hold: nurture them, don't treat them as a fresh lead."],
      ["none", "unknown", "an unrecognized stage label still means they have an agent. fail closed."],
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
      el.querySelector("[data-state]").innerHTML = `operating state: <strong>${state}</strong>`;
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
      feeds: ["board feeds", "trreb and itso arrive as odata feeds."],
      media: ["media pipeline", "photos arrive separately. a listing with no published image is not a listing you show."],
      ingest: ["ingest", "normalizes rows and geocodes addresses on the way in."],
      pg: ["postgres", "our normalized inventory. price changes observed here drive alerts."],
      listapi: ["listings api", "reads postgres and never imports repliers. serves an avm for listing pages."],
      app: ["buyer app", "the map, the filters, the published photos."],
      zoro: ["zoro", "the agent, mid whatsapp turn."],
      client: ["one http client", "the agent's only door to an mls. swapping providers is a one-file change."],
      repliers: ["repliers", "the live mls. freshness matters in a conversation, so sold history and photo search stay here."],
      apple: ["apple maps", "geocoding on ingest."],
      osm: ["openstreetmap", "a sweep that fills in what is nearby."],
      poi: ["poi · postgis", "the points-of-interest catalog. insights ask what is within a kilometre, no live apple calls."],
      local: ["local logic", "eqao results, fraser rankings, catchment polygons, census, climate, walk + transit scores, market stats. on a schedule, under a lock so two crons don't scrape the province twice."],
      mv: ["materialized view", "the home and what is around it, in one shape a tool can return and a model can speak."],
    };
    const n = (k) => `<button type="button" class="zd-node" data-k="${k}">${N[k][0]}</button>`;
    const stack = (...ks) => `<div class="zd-stack zd-stack-sm">${ks.map(n).join("")}</div>`;
    el.innerHTML = `
      <div class="zd-head"><span class="zd-title">the api underneath</span>${seg("sc", [["listing", "a listing arrives"], ["ask", "a buyer asks zoro"], ["hood", "neighbourhood refresh"]], "listing")}</div>
      <div class="zd-pipeline">
        <div class="zd-lane"><span class="zd-lane-name">inventory</span><div class="zd-flow">${stack("feeds", "media")}${arrow}${n("ingest")}${arrow}${n("pg")}${arrow}${n("listapi")}${arrow}${n("app")}</div></div>
        <div class="zd-lane"><span class="zd-lane-name">discovery</span><div class="zd-flow">${n("zoro")}${arrow}${n("client")}${arrow}${n("repliers")}</div></div>
        <div class="zd-lane"><span class="zd-lane-name">context</span><div class="zd-flow">${stack("apple", "osm")}${arrow}${stack("poi", "local")}${arrow}${n("mv")}</div></div>
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
    const TOGGLES = { listing: [["photo", "has a published photo"]], ask: [["sparse", "live results are sparse"], ["legacy", "env flag: old order"]], hood: [] };
    // each step: [node, packet label, explanation, dropped?]
    const build = (sc) => {
      if (sc === "listing") {
        const head = [["feeds", "listing", "trreb or itso publishes a listing as an odata row.", false, true], ["media", "photos", "its photos come through a separate media pipeline.", false, true]];
        if (!T.photo) return [...head, ["media", "no photo", "no published image, so it never becomes a listing you show.", true]];
        return [...head,
          ["ingest", "listing", "ingest normalizes the row and geocodes the address on the way in.", false, true],
          ["pg", "row", "a normalized row lands in postgres. price changes observed here drive alerts.", false, true],
          ["listapi", "row", "the listings api reads postgres. it does not import repliers at all.", false, true],
          ["app", "home", "the buyer sees it: on the map, in the filters, with published photos.", false, true]];
      }
      if (sc === "ask") {
        const first = T.legacy ? ["pg", "search", "env flag set: the old order, our db answers first."] : ["repliers", "search", "repliers first: the live mls, because freshness matters in a conversation."];
        const topUp = T.legacy ? ["repliers", "top-up", "our db came back sparse, so repliers tops up the list."] : ["pg", "top-up", "the live source came back sparse, so our db tops up the list."];
        return [
          ["zoro", "search", "a buyer asks for homes mid whatsapp turn."],
          ["client", "search", "the request goes through one http client, the agent's only door to an mls."],
          first,
          T.sparse ? topUp : [first[0], "results", "enough results came back. no top-up needed."],
          ["mv", "homes", "for each home: one query against the materialized view.", false, true],
          ["zoro", "answer", "the answer arrives pre-chewed. no browsing the internet for eqao mid turn.", false, true]];
      }
      return [
        ["apple", "address", "apple maps geocodes the address."],
        ["osm", "sweep", "an openstreetmap sweep finds what is nearby."],
        ["poi", "pois", "both fill the points-of-interest catalog in postgis."],
        ["local", "stats", "schools, census, climate, walk + transit and market stats refresh on a schedule, under a lock."],
        ["mv", "view", "everything rolls into one materialized view."],
        ["zoro", "1 query", "insights ask postgis what is within a kilometre. no live apple calls."]];
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
      submit: ["form submitted", "hs", "qualification lead", ["allowlisted properties, same bytes from web and mobile", "<code>cid</code> / <code>zcid</code> aliased to one field", "queued on the outbox"], "one qualification lead per user. account managers own the pipeline after this. a flaky request never becomes two leads."],
      edit: ["form edited", "hs", "edit note", ["allowlisted properties", "queued on the outbox"], "logged with a different note title than a first submission, so the “form submission” call workflow doesn't fire again over a typo."],
      stage: ["deal stage changed", "app", "stage label, verbatim", ["webhook in", "label stored verbatim, no frozen enum"], "zoro's stage is now a fact, mirrored from the deal."],
      echo: ["echo of our own deal", null, "echo", ["webhook in", "recognized as a deal we just created"], "ignored. nothing moves."],
      claim: ["chat sends HIGHLY_QUALIFIED", null, "HIGHLY_QUALIFIED", ["metadata from the chat client"], "rejected. if the client could claim a stage, it could talk the bot past every rule in the table."],
      admin: ["admin crm (ops tool)", "app", "ops data", ["no hubspot connection"], "two systems side by side, on purpose. reconciliation was a problem we declined."],
    };
    el.innerHTML = `
      <div class="zd-head"><span class="zd-title">two systems, side by side: stack what happens</span><button type="button" class="zd-chip" data-reset>reset</button></div>
      <div class="zd-chips">${Object.entries(E).map(([k, [label]]) => `<button type="button" class="zd-chip" data-e="${k}">${label}</button>`).join("")}</div>
      <div class="zd-seesaw">
        <span class="zd-bounce"></span>
        <div class="zd-beam">
          <div class="zd-pan" data-side="app"><span class="zd-weights"></span><span class="zd-pan-name">our app · postgres</span></div>
          <div class="zd-pan" data-side="hs"><span class="zd-weights"></span><span class="zd-pan-name">hubspot · system of record</span></div>
        </div>
        <div class="zd-fulcrum" aria-hidden="true"></div>
      </div>
      <div class="zd-flow zd-steps"></div>
      <div class="zd-out"></div>`;
    const beam = el.querySelector(".zd-beam"), bounce = el.querySelector(".zd-bounce");
    const active = new Set();
    const show = (k) => {
      const [, , , steps, result] = E[k] || [, , , [], "tap events to stack them. each one lands on the system that owns the write."];
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

document.querySelectorAll(".zd[data-zd]").forEach((el) => {
  D[el.dataset.zd]?.(el);
  el.querySelector(".zd-title")?.insertAdjacentHTML("afterbegin", HOUSE);
});
