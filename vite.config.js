import { defineConfig } from "vite";
import { readdirSync, readFileSync } from "node:fs";

// every top-level page and every article in writing/ is its own entry
const html = (dir) =>
  readdirSync(dir, { withFileTypes: true })
    .filter((f) => f.isFile() && f.name.endsWith(".html"))
    .map((f) => (dir === "." ? f.name : `${dir}/${f.name}`));

const pages = [
  ...html("."),
  ...html("yusufproject"),
  ...html("learning"),
  ...html("aislop"),
  ...html("writing"),
  ...html("stills"),
  ...html("timeline"),
  ...html("my-purpose"),
  ...html("projects"),
  ...html("community"),
  ...html("books"),
  ...html("perception"),
  ...html("writing/attention"),
  ...html("writing/attention/explore"),
  ...html("writing/flash-attention"),
  ...html("writing/flash-attention/explore"),
  ...html("work/fanout"),
  ...html("work/triageo"),
  ...html("work/duaos"),
  ...html("work/goosetype"),
  ...html("work/scrollify"),
  ...html("work/incinerator"),
];

// test: inject the darker grey background into every page except the bespoke interactive pages
const bgTest = {
  name: "bg-test",
  transformIndexHtml(page, ctx) {
    if (["/writing/attention/", "/writing/flash-attention/", "/yusufproject/"].some((p) => ctx.path.startsWith(p))) return page;
    return page.replace("</head>", `<style>${readFileSync("bg-test.css", "utf8")}</style></head>`);
  },
};

export default defineConfig({
  plugins: [bgTest],
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        pages.map((p) => [p.replace(/\.html$/, "").replace(/\//g, "-"), p])
      ),
    },
  },
});
