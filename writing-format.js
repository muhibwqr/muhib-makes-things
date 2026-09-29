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
  nav.innerHTML = `<a href="/">[ Index ]</a>`;
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
  article.insertBefore(buildIndex(), article.firstChild);
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
