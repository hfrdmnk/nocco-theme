import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import ViteRestart from "vite-plugin-restart";
import ghostManifestPartials from "./lib/vite/ghost-manifest-partials.js";

export default defineConfig({
  base: "./",
  publicDir: false,
  css: {
    devSourcemap: true,
  },
  build: {
    outDir: "assets/built",
    assetsDir: ".",
    emptyOutDir: true,
    manifest: "manifest.json",
    rollupOptions: {
      input: "assets/js/index.js",
    },
    watch: {
      exclude: ["assets/built/**", "partials/vite_assets/**"],
    },
  },
  plugins: [
    ViteRestart({
      reload: ["**/*.hbs"],
    }),
    ghostManifestPartials(
      "assets/built/manifest.json",
      "partials/vite_assets/head.hbs",
      "partials/vite_assets/foot.hbs",
    ),
    tailwindcss(),
  ],
});
