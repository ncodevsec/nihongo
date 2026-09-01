import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// A relative base ("./") makes every built asset URL relative
// (./assets/...) instead of root-absolute (/assets/...). Root-absolute
// paths only work when the site is served from the domain root — on
// GitHub Pages project sites the app actually lives under
// https://<user>.github.io/<repo>/, so a root-absolute path 404s and the
// page loads blank except for the <title>. A relative base works
// correctly both locally and under any subpath, with no extra
// configuration needed.
//
// PWA support (offline caching + installability) is implemented with a
// small hand-written service worker in public/sw.js and a static
// public/manifest.webmanifest instead of a build-plugin. An earlier
// version used vite-plugin-pwa, but its workbox-build postbuild step can
// hang for minutes (a known issue in some environments) — since public/
// files are copied straight through by Vite with zero processing, this
// approach is both simpler and cannot slow down or hang the build.
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    outDir: 'docs',
    rollupOptions: {
      output: {
        // Forces the entry file name to be index.js
        entryFileNames: 'assets/index.js',
        // Forces split chunks (if any) to use a predictable template
        chunkFileNames: 'assets/[name].js',
        // Forces CSS and other assets to use index.[ext]
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'assets/index.css';
          }
          // Fallback for other assets (images, fonts, etc.)
          return 'assets/[name].[ext]';
        }
      }
    }
  },
});
