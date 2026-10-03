// shared components — one source for repeated UI

export const NAV_LINKS = [
  ["/projects/", "projects"],
  ["/community/", "community"],
];

export function mountMasthead() {
  const header = document.querySelector("header.masthead");
  if (!header) return;
  const path = location.pathname;
  const links = NAV_LINKS.map(
    ([href, label]) =>
      `<li><a href="${href}"${path.startsWith(href) ? ' class="here"' : ""}>${label}</a></li>`
  ).join("");
  header.innerHTML = `
    <nav class="masthead-nav" aria-label="primary">
      <h1 class="masthead-title"><a class="masthead-home${path === "/" ? " here" : ""}" href="/" aria-label="muhib waqar — home">
        <figure class="morph-mini" aria-hidden="true">
          <div class="morph-mini-stage"><pre class="morph-art" id="morph-art"></pre></div>
        </figure>
        <span class="home-label" aria-hidden="true">home</span>
      </a></h1>
      <ul>${links}</ul>
    </nav>`;
}

export function mountFooter(src = "/meadow.jpg") {
  const hills = document.createElement("div");
  hills.className = "hills-footer";
  hills.setAttribute("aria-hidden", "true");
  const img = document.createElement("img");
  img.src = src;
  img.alt = "";
  img.decoding = "async";
  hills.appendChild(img);
  document.body.appendChild(hills);
  return hills;
}

const svg = (body) => `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
export const ICONS = {
  pause: svg(`<rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none"/><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none"/>`),
  play: svg(`<path d="M7 5l12 7-12 7z" fill="currentColor" stroke="none"/>`),
  muted: svg(`<path d="M11 5L6 9H3v6h3l5 4z" fill="currentColor"/><path d="M22 9l-6 6M16 9l6 6"/>`),
  unmuted: svg(`<path d="M11 5L6 9H3v6h3l5 4z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 010 7M18.5 5.5a9 9 0 010 13"/>`),
};

// swap a pause/mute button to the icon matching the video's state
export function setVidIcon(btn, video) {
  const isPause = btn.dataset.act === "pause" || btn.classList.contains("proj-pause");
  const key = isPause ? (video.paused ? "play" : "pause") : (video.muted ? "muted" : "unmuted");
  btn.innerHTML = ICONS[key];
  btn.setAttribute("aria-label", { play: "play", pause: "pause", muted: "unmute", unmuted: "mute" }[key]);
}

export function videoControls(video, { ctrlClass = "vid-ctrls", btnClass = "vbtn" } = {}) {
  const host = video.closest("figure") || video.parentElement;
  host.style.position = "relative";
  const ctrls = document.createElement("div");
  ctrls.className = ctrlClass;
  ctrls.innerHTML = `<button class="${btnClass}" data-act="pause" aria-label="pause">${ICONS.pause}</button><button class="${btnClass}" data-act="mute" aria-label="unmute">${ICONS.muted}</button>`;
  host.appendChild(ctrls);
  video.muted = true;
  video.play().catch(() => {});
  video.addEventListener("loadeddata", () => video.play().catch(() => {}));
  ctrls.addEventListener("click", (e) => {
    const b = e.target.closest("[data-act]");
    if (!b) return;
    if (b.dataset.act === "pause") {
      if (video.paused) video.play().catch(() => {});
      else video.pause();
      video.dataset.userPaused = video.paused ? "1" : "";
    } else {
      video.muted = !video.muted;
      if (!video.muted) video.play().catch(() => {});
    }
    setVidIcon(b, video);
  });
  return ctrls;
}

let toastEl;
export function showToast(text) {
  if (!toastEl) {
    toastEl = document.createElement("div");
    toastEl.className = "soon-toast";
    document.body.appendChild(toastEl);
  }
  toastEl.textContent = text;
  toastEl.classList.remove("show");
  void toastEl.offsetWidth;
  toastEl.classList.add("show");
}
