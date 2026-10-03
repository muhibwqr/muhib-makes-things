// works-wheel, vanilla port — a ring of cards that scrolls open into a
// vertical drum. One number `turn` eased per rAF; transforms written to DOM.
const CARD_H = 0.38, CARD_MAX_W = 0.34, CARD_RATIO = 1;
const STEP = 40, DRUM = 2.22, LENS = 2.7, RING_R = 0.9, BOW = 1.82;
const TITLE = 0.124, INDEX = 0.04, CULL = 1.6;
const WHEEL_UNITS = 1400, DRAG_UNITS = 420, SETTLE = 90, EASE = 0.14;

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const lerp = (a, b, t) => a + (b - a) * t;
const rad = (deg) => (deg * Math.PI) / 180;
const bowAt = (deg, bow) => -bow * (1 - Math.cos(rad(deg)));

const place = (ringDeg, drumDeg, ringR, drumR, bow, m) =>
  `translateX(${m * bowAt(drumDeg, bow)}px)` +
  ` rotateZ(${(1 - m) * ringDeg}deg) translateY(${-(1 - m) * ringR}px)` +
  ` rotateX(${m * drumDeg}deg) translateZ(${m * drumR}px)`;

export function initWheel(root, items, { label = "", action = "", onOpen } = {}) {
  const count = items.length;
  const last = Math.max(count - 1, 0);

  root.innerHTML = `
    <div class="wheel-stage" tabindex="0" role="listbox" aria-label="${label}">
      <div class="wheel">
        ${items.map((item, i) => `
          <div class="wheel-card" id="wheel-card-${i}" role="option" aria-selected="${i === 0}" data-i="${i}">
            <span class="wheel-card-face">
              <img src="${item.image}" alt="${item.title}" draggable="false" loading="lazy" decoding="async" />
              ${action ? `<span class="wheel-chips">
                <span class="wheel-chip"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 9 9 3M4 3h5v5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>${action}</span>
                <a class="wheel-chip wheel-chip-link" href="${item.href}" target="_blank" rel="noopener"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 9 9 3M4 3h5v5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>open on luma</a>
              </span>` : ""}
            </span>
          </div>`).join("")}
      </div>
    </div>
    <div class="wheel-label">${label}</div>
    <div class="wheel-title"><div class="wheel-title-name"></div><div class="wheel-title-date"></div></div>
    <div class="wheel-media"><div class="wheel-media-track"></div></div>
    <ol class="wheel-index">
      ${items.map((item, i) => `<li><button type="button" data-i="${i}" class="${i === 0 ? "on" : ""}">${item.title}</button></li>`).join("")}
    </ol>`;

  const stage = root.querySelector(".wheel-stage");
  const wheel = root.querySelector(".wheel");
  const labelEl = root.querySelector(".wheel-label");
  const titleEl = root.querySelector(".wheel-title");
  const titleName = root.querySelector(".wheel-title-name");
  const titleDate = root.querySelector(".wheel-title-date");
  const mediaEl = root.querySelector(".wheel-media");
  const mediaTrack = root.querySelector(".wheel-media-track");
  const cards = [...root.querySelectorAll(".wheel-card")];
  const indexBtns = [...root.querySelectorAll(".wheel-index button")];
  titleName.textContent = items[0]?.title || "";
  titleDate.textContent = items[0]?.date || "";

  let turn = 0, target = 0, active = -1, metrics = null, settling = 0;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const measure = () => {
    const w = stage.clientWidth, h = stage.clientHeight;
    const cardW = Math.min(h * CARD_H * CARD_RATIO, w * CARD_MAX_W);
    const cardH = cardW / CARD_RATIO;
    const ringR = cardH * RING_R;
    metrics = {
      cardW, cardH, ringR,
      ringScale: count ? clamp((((2 * Math.PI * ringR) / count) * 0.7) / (cardW || 1), 0.16, 1) : 1,
      drumR: cardH * DRUM,
      bow: cardH * BOW,
      title: cardH * TITLE,
      index: cardH * INDEX,
    };
    stage.style.perspective = `${cardH * LENS}px`;
    cards.forEach((c) => {
      c.style.width = `${cardW}px`;
      c.style.height = `${cardH}px`;
      c.style.marginLeft = `${-cardW / 2}px`;
      c.style.marginTop = `${-cardH / 2}px`;
    });
    labelEl.style.fontSize = `${metrics.title}px`;
    titleEl.style.fontSize = `${metrics.title}px`;
    root.querySelector(".wheel-index").style.fontSize = `${metrics.index}px`;
  };
  measure();
  new ResizeObserver(measure).observe(stage);

  const to = (next) => { target = clamp(next, 0, last + 1); };

  let shown = -1;
  const setActive = (i) => {
    if (i === active) return;
    active = i;
    titleName.textContent = items[i]?.title || "";
    titleDate.textContent = items[i]?.date || "";
    cards.forEach((c, j) => c.setAttribute("aria-selected", String(j === i)));
    indexBtns.forEach((b, j) => b.classList.toggle("on", j === i));
  };

  // media strip is only visible once the drum is open — don't fetch it before
  const showMedia = (i) => {
    if (i === shown) return;
    shown = i;
    const html = (items[i].mediaSmall || items[i].media || []).map((p) =>
      /\.(mp4|mov|m4v)$/i.test(p)
        ? `<video src="${p}" autoplay muted loop playsinline preload="metadata"></video>`
        : `<img src="${p}" alt="" loading="lazy" decoding="async" />`
    ).join("");
    let half = html;
    mediaTrack.innerHTML = half;
    while (half && mediaTrack.scrollWidth < stage.clientWidth) {
      half += html;
      mediaTrack.innerHTML = half;
    }
    mediaTrack.innerHTML = half + half;
    mediaTrack.querySelectorAll("img").forEach((im) => {
      const mark = () => im.classList.add("on");
      im.complete ? mark() : im.addEventListener("load", mark, { once: true });
    });
    mediaTrack.querySelectorAll("video").forEach((v) => {
      const mark = () => v.classList.add("on");
      v.readyState >= 2 ? mark() : v.addEventListener("loadeddata", mark, { once: true });
      v.play().catch(() => {});
    });
  };
  setActive(0);

  const draw = () => {
    requestAnimationFrame(draw);
    if (!metrics) return;
    const gap = target - turn;
    if (Math.abs(gap) < 0.0005) turn = target;
    else turn += gap * (reduced ? 1 : EASE);

    const t = turn, m = clamp(t, 0, 1), pos = Math.max(0, t - 1);
    const { ringR, ringScale, drumR, bow } = metrics;

    wheel.style.transform = `translateZ(${-m * drumR}px)`;
    for (let i = 0; i < count; i++) {
      const d = i - pos;
      const card = cards[i];
      card.style.transform = place(d * (360 / count), d * STEP, ringR, drumR, bow, m);
      card.style.opacity = m > 0.5 && Math.abs(d) > CULL ? "0" : "1";
      card.style.zIndex = String(Math.round(100 - Math.abs(d) * 2));
      card.firstElementChild.style.transform = `scale(${lerp(ringScale, 1, m)})`;
    }
    labelEl.style.opacity = String(1 - m);
    titleEl.style.opacity = String(m);
    mediaEl.style.opacity = String(m);
    setActive(clamp(Math.round(pos), 0, last));
    if (m > 0.5 && Math.abs(target - turn) < 0.02) showMedia(active);
  };
  requestAnimationFrame(draw);

  // heavy continuous scroll — trackpad drags the drum, snap locks it
  stage.addEventListener("wheel", (e) => {
    const next = target + e.deltaY / WHEEL_UNITS;
    if (next > 0 && next < last + 1) e.preventDefault();
    to(next);
    clearTimeout(settling);
    settling = setTimeout(() => to(Math.round(target)), SETTLE);
  }, { passive: false });

  let drag = null, dragged = false, downI = -1;
  stage.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".wheel-chip-link")) return;
    drag = e.clientY;
    dragged = false;
    const card = e.target.closest(".wheel-card");
    downI = card ? +card.dataset.i : -1;
    stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener("pointermove", (e) => {
    if (drag === null) return;
    if (Math.abs(drag - e.clientY) > 4) dragged = true;
    to(target + (drag - e.clientY) / DRAG_UNITS);
    drag = e.clientY;
  });
  stage.addEventListener("pointerup", () => {
    if (drag !== null && !dragged && downI >= 0) onOpen?.(items[downI]);
    drag = null;
    downI = -1;
    if (target > 1) to(Math.round(target));
  });
  stage.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") to(Math.round(target) + 1);
    else if (e.key === "ArrowUp") to(Math.round(target) - 1);
    else return;
    e.preventDefault();
  });

  indexBtns.forEach((b) => b.addEventListener("click", () => to(+b.dataset.i + 1)));
}
