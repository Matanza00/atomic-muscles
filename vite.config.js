import { defineConfig } from "vite";
import { resolve } from "node:path";
import { copyFileSync, existsSync } from "node:fs";

const ENTRY = "atomicmuscles3jjs.html";

// Serve the single-page site at "/" as well as at its own filename.
const serveEntryAtRoot = {
  name: "serve-entry-at-root",
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      if (req.url === "/" || req.url === "/index.html") req.url = `/${ENTRY}`;
      next();
    });
  },
  configurePreviewServer(server) {
    server.middlewares.use((req, _res, next) => {
      if (req.url === "/" || req.url === "/index.html") req.url = `/${ENTRY}`;
      next();
    });
  },
  // static hosts serve index.html at "/", so the build ships the page under that name too
  writeBundle(opts) {
    const page = resolve(opts.dir, ENTRY);
    if (existsSync(page)) copyFileSync(page, resolve(opts.dir, "index.html"));
  },
};

export default defineConfig({
  plugins: [serveEntryAtRoot],
  // three.js and Lenis are imported lazily; pre-bundle them at startup so the dev server doesn't reload mid-visit
  optimizeDeps: { include: ["three", "lenis"] },
  build: {
    rollupOptions: {
      input: resolve(__dirname, ENTRY),
    },
  },
  server: { port: 5177, open: true },
  preview: { port: 5178 },
});
