import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query"],
  },
  // vite-react-ssg: prerender ONLY the static marketing/instructional shells.
  // The daily game and every other route stay client-side-rendered and are
  // served via Cloudflare's SPA fallback (wrangler.jsonc not_found_handling).
  ssgOptions: {
    includedRoutes() {
      return ["/", "/emoji-math-puzzle", "/blog/emoji-puzzles-with-answers"];
    },
  },
}));
