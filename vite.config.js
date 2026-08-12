import { defineConfig } from "vite";
import { readdirSync } from "node:fs";

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
  ...html("slop"),
  ...html("writing"),
  ...html("memories"),
  ...html("writing/attention"),
  ...html("writing/attention/explore"),
  ...html("writing/flash-attention"),
  ...html("writing/flash-attention/explore"),
  ...html("work"),
  ...html("work/fanout"),
  ...html("work/nanovsm"),
  ...html("work/triageo"),
  ...html("work/shepherd"),
  ...html("work/duaos"),
  ...html("work/goosetype"),
  ...html("work/scrollify"),
  ...html("work/incinerator"),
];

export default defineConfig({
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        pages.map((p) => [p.replace(/\.html$/, "").replace(/\//g, "-"), p])
      ),
    },
  },
});
