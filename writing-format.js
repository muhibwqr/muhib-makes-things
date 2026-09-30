// writing-format.js — benji.org-style article chrome, injected on /writing pages.
// minimal: [ Index ] back-link top-left, title + meta, # section headings,
// footer socials. no TOC, no breadcrumb trail, no byline.

const SOCIALS = `
  <a href="mailto:muhib.waqar@uwaterloo.ca">email</a>
  <a href="https://linkedin.com/in/muhibwaqar" target="_blank" rel="noopener">linkedin</a>
  <a href="https://github.com/muhibwqr" target="_blank" rel="noopener">github</a>
  <a href="https://x.com/muhibwqr" target="_blank" rel="noopener">x</a>`;

const buildIndex = () => {
  const nav = document.createElement("nav");
  nav.className = "wfmt-index mono dim";
  nav.setAttribute("aria-label", "index");
  nav.innerHTML = `<a href="/">&larr; muhib</a>`;
  return nav;
};

const buildSocials = () => {
  const p = document.createElement("p");
  p.className = "wfmt-footer mono dim";
  p.innerHTML = SOCIALS;
  return p;
};

// template A — flat articles: kicker + article-title + article-meta + .article-prose
const flat = document.querySelector(".article-prose");
const flatTitle = document.querySelector(".article-title");
if (flat && flatTitle) {
  const article = flatTitle.closest(".article") || flat.parentElement;
  const index = buildIndex();
  if (document.body.classList.contains("maker")) {
    // benji-style left rail: [ Index ] + section list
    const side = document.createElement("div");
    side.className = "wfmt-side";
    side.appendChild(index);
    const heads = flat.querySelectorAll("h2, h3");
    if (heads.length) {
      const ul = document.createElement("ul");
      ul.className = "wfmt-toc";
      heads.forEach((h) => {
        if (!h.id) {
          h.id = h.textContent.trim().toLowerCase()
            .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        }
        const li = document.createElement("li");
        li.innerHTML = `<a href="#${h.id}">${h.textContent}</a>`;
        ul.appendChild(li);
      });
      side.appendChild(ul);

      // highlight the section you're reading
      const links = [...ul.querySelectorAll("a")];
      const mark = (id) => links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${id}`));
      const spy = new IntersectionObserver(
        (entries) => {
          for (const en of entries) if (en.isIntersecting) mark(en.target.id);
        },
        { rootMargin: "-15% 0px -70% 0px" }
      );
      heads.forEach((h) => spy.observe(h));
    }
    document.body.insertBefore(side, article);

    // benji pages have no top nav — the rail carries [ Index ]
    const topNav = document.querySelector("body > nav");
    if (topNav) topNav.style.display = "none";

    // glass pause/mute pills on article videos (same feel as project cards)
    document.querySelectorAll("article video, .article video").forEach((v) => {
      const fig = v.closest("figure") || v.parentElement;
      fig.style.position = "relative";
      const ctrls = document.createElement("div");
      ctrls.className = "wfmt-vid-ctrls";
      ctrls.innerHTML = `<button class="wfmt-vbtn" data-act="pause">pause</button><button class="wfmt-vbtn" data-act="mute">unmute</button>`;
      fig.appendChild(ctrls);
      v.muted = true;
      v.play().catch(() => {});
      v.addEventListener("loadeddata", () => v.play().catch(() => {}));
      ctrls.addEventListener("click", (e) => {
        const b = e.target.closest("[data-act]");
        if (!b) return;
        if (b.dataset.act === "pause") {
          if (v.paused) v.play().catch(() => {});
          else v.pause();
          v.dataset.userPaused = v.paused ? "1" : "";
          b.textContent = v.paused ? "play" : "pause";
        } else {
          v.muted = !v.muted;
          if (!v.muted) v.play().catch(() => {});
          b.textContent = v.muted ? "unmute" : "mute";
        }
      });
    });
  } else {
    article.insertBefore(index, article.firstChild);
  }
  article.appendChild(buildSocials());
} else {
  // template B — longform essays: header.hero (eyebrow + h1 + byline) + main sections
  const hero = document.querySelector("header.hero");
  const main = document.querySelector("main.wrap") || document.querySelector("main");
  if (hero && main && hero.querySelector("h1")) {
    hero.insertBefore(buildIndex(), hero.firstChild);
    const foot = document.querySelector("footer") || main;
    foot.appendChild(buildSocials());
  }
}
