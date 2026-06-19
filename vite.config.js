import { defineConfig } from "vite";
import { readdirSync } from "node:fs";

// every top-level page and every article in writing/ is its own entry
const html = (dir) =>
  readdirSync(dir, { withFileTypes: true })
    .filter((f) => f.isFile() && f.name.endsWith(".html"))
    .map((f) => (dir === "." ? f.name : `${dir}/${f.name}`));

const pages = [
  ...html("."),
  ...html("writing"),
  ...html("writing/attention"),
  ...html("writing/attention/explore"),
  ...html("writing/flash-attention"),
  ...html("writing/flash-attention/explore"),
  ...html("writing/abdurrahman-ibn-awf"),
  ...html("writing/abdurrahman-ibn-awf/explore"),
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
