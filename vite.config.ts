import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";

// One timestamp per build, shared by the prerender cutoff and the client
// (`__BUILD_TIME__`, see src/lib/archive.ts useNow).
const BUILD_TIME = Date.now();
const SITE = "https://kwizicle.com";

// Past puzzle dates whose day has ended in every timezone (D+1 12:00 UTC).
// Mirrors isDayOver() in src/lib/archive.ts.
function pastPuzzleDates(): string[] {
  return fs
    .readdirSync(path.resolve(__dirname, "public/data/puzzles"))
    .filter(f => f.endsWith(".json"))
    .map(f => f.slice(0, -5))
    .filter(d => BUILD_TIME >= Date.parse(`${d}T00:00:00Z`) + 36 * 3600 * 1000)
    .sort();
}

// Sitemap = exactly the prerendered routes; anything client-only (/today,
// /extras, /stats, /puzzle/:date) is deliberately absent.
function writeSitemap(dir: string) {
  const urls: { loc: string; changefreq: string; priority: string; lastmod?: string }[] = [
    { loc: "/", changefreq: "daily", priority: "1.0" },
    { loc: "/emoji-math-puzzle", changefreq: "monthly", priority: "0.9" },
    { loc: "/blog/emoji-puzzles-with-answers", changefreq: "monthly", priority: "0.7" },
    { loc: "/archive", changefreq: "daily", priority: "0.8" },
    ...pastPuzzleDates().map(d => ({ loc: `/answer/${d}`, changefreq: "yearly", priority: "0.5", lastmod: d })),
  ];
  const body = urls
    .map(u =>
      [
        "  <url>",
        `    <loc>${SITE}${u.loc}</loc>`,
        u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>` : null,
        `    <changefreq>${u.changefreq}</changefreq>`,
        `    <priority>${u.priority}</priority>`,
        "  </url>",
      ].filter(Boolean).join("\n"),
    )
    .join("\n");
  fs.writeFileSync(
    path.join(dir, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
  );
}

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
  define: {
    __BUILD_TIME__: JSON.stringify(BUILD_TIME),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query"],
  },
  // vite-react-ssg: prerender the content pages plus the archive and one
  // answer page per past day. The daily game and every other route stay
  // client-side-rendered and are served via Cloudflare's SPA fallback
  // (wrangler.jsonc not_found_handling).
  ssgOptions: {
    includedRoutes() {
      return [
        "/",
        "/emoji-math-puzzle",
        "/blog/emoji-puzzles-with-answers",
        "/archive",
        ...pastPuzzleDates().map(d => `/answer/${d}`),
      ];
    },
    onFinished(dir) {
      writeSitemap(dir);
    },
  },
}));
