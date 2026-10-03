// writing-format.js — benji.org-style article chrome, injected on /writing pages.
// minimal: [ Index ] back-link top-left, title + meta, # section headings,
// footer socials. no TOC, no breadcrumb trail, no byline.

import { videoControls, mountClouds } from "./components.js";

mountClouds();

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
        if (h.tagName === "H3") li.className = "sub";
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

    // top bar: home pill left, external site link right
    const top = document.createElement("div");
    top.className = "wfmt-top";
    top.innerHTML = `<a class="wfmt-home" href="/"><span class="wfmt-home-arrow" aria-hidden="true">&larr;</span>muhib</a>` +
      (article.dataset.site ? `<a href="${article.dataset.site}" target="_blank" rel="noopener">website &#8599;</a>` : "");
    document.body.insertBefore(top, side);

    // benji pages have no top nav — the rail carries [ Index ]
    const topNav = document.querySelector("body > nav");
    if (topNav) topNav.style.display = "none";

    // glass pause/mute pills on article videos (same feel as project cards)
    document.querySelectorAll("article video, .article video").forEach((v) => {
      videoControls(v, { ctrlClass: "wfmt-vid-ctrls", btnClass: "wfmt-vbtn" });
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
