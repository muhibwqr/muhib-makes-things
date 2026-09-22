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
  ...html("writing"),
  ...html("stills"),
  ...html("timeline"),
  ...html("my-purpose"),
  ...html("work"),
  ...html("why-am-i-a-good-fit"),
  ...html("books"),
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

// `vite dev` serves static files only; this runs the Vercel functions in api/ through
// the same request/response contract so the AI pages work locally too.
const devApi = () => ({
  name: "dev-api",
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      const path = (req.url || "").split("?")[0];
      if (!path.startsWith("/api/")) return next();
      try {
        const mod = await server.ssrLoadModule("." + path + ".ts");
        await mod.default(req, res);
      } catch (err) {
        res.statusCode = 500;
        res.end(String(err));
      }
    });
  },
});

export default defineConfig({
  plugins: [devApi()],
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        pages.map((p) => [p.replace(/\.html$/, "").replace(/\//g, "-"), p])
      ),
    },
  },
});
