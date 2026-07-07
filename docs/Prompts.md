# Prompt History — kwizicle.com

<!-- Append new prompts at the bottom, newest last. Format:

## YYYY-MM-DD [optional title]
> <prompt text or short summary>

The dated H2 (`## YYYY-MM-DD`) is what `portfolio project status` parses
to surface "last AI prompt" per project. Keep entries append-only.
-->

## 2026-05-04 — scaffolded via portfolio bootstrap

> Created project skeleton. Stack chosen, scaffolding written, git initialized.

## 2026-05-04 — got Cloudflare Workers build green (tagged v0.1.0)

Iterative debugging of CF Workers Build failures. Each prompt was a fresh
build log pasted in; fix went out, redeploy, next failure surfaced.

1. **"build failed on CF — Outdated lockfile version: failed to parse `bun.lockb`"**
   CF auto-detected bun via `bun.lockb` and `--frozen-lockfile` rejected the legacy
   binary format. Fix: drop `bun.lockb` + `package-lock.json`, commit the
   docker-generated `pnpm-lock.yaml`, update `.gitignore` to lamillrentals.com style.
   Commit `90c8793`.

2. **"can it be made similar to other projects in ../"** → **"use lamillrentals.com as a sample"**
   Aligned package-manager + .gitignore conventions with the sibling project.
   Kept `wrangler.jsonc` (CF Workers) since lamillrentals deploys to Vercel.

3. **"dont use pnpm from the host, use builder repo and ../Makefile to run it inside docker container"**
   Established hard rule: never `pnpm install` on host. Existing
   `pnpm-lock.yaml` was already docker-generated (root-owned, May 4 20:31), so
   no regen needed.

4. **"Rollup failed to resolve import @tanstack/query-core"** (build using `bun run build`)
   CF dashboard's Build command was hard-coded to `bun run build`. Bun's
   resolver doesn't follow pnpm's `.pnpm/` symlinks. User flipped dashboard
   command to `pnpm run build` + cleared build cache; also fixed wrangler
   `name` mismatch (`kwizicle-com` → `kwizicle`) to match the dashboard
   project.

5. **Same `@tanstack/query-core` error after switching to pnpm**
   Root cause: `vite.config.ts` had `dedupe: [..., "@tanstack/query-core"]`.
   Vite dedupe forces resolution from project root, but pnpm's strict layout
   only hoists declared deps — query-core is transitive via react-query.
   Fix: remove `@tanstack/query-core` from the dedupe array (react-query
   alone keeps query state singleton). Commit `a136ad2`, tagged `v0.1.0`.

**Takeaways for future CF Workers + pnpm + vite projects**
- Lockfile: pnpm only; `bun.lockb` and `package-lock.json` in `.gitignore`.
- Dashboard Build command: `pnpm run build` (CF defaults to bun if `bun.lockb`
  is ever present — or hard-codes whatever ran first).
- `wrangler.jsonc` `name` must match the CF project name exactly.
- vite `dedupe` only on directly-declared deps under pnpm strict.

## 2026-05-06 — v0.B/v0.C ship: switching seams, extras mode, SEO basics

> Plan v0 in detail; build asset-name schema with pluggable renderer; build
> extras mode independent of the daily streak; ship sitemap + favicon; fix
> stale meta tags; document the prompt-log convention.

- **PRD revised** (`docs/prd.md`) — phased plan v0.A → v1.B with switching
  seams documented in §7. Pitch and audience still stub paragraphs (working
  assumptions) until the user nails a one-sentence pitch.
- **v0.B — switching seams + daily bank.** `src/lib/assets.ts` central
  registry, `<AssetGlyph>`, `renderMode.ts`. Schema bumped from v2
  (emoji-baked) to v3 (asset names) — `SCHEMA_VERSION_KEY` flushes old
  caches. Five daily JSONs seeded from
  `expoapps/kwizicle/kwizpy/input/next/kwiz{1..5}.json`, themed
  kiwi/cat/pizza/earth/guitar pairs. Fallbacks trimmed 7→1.
- **v0.C — extras mode.** `public/data/extras/manifest.json` (6 puzzles),
  `extras.ts` lib, `<PuzzleGame>` extracted reusable from TodayPage,
  `/extras` route, "Play another" CTA on TodayPage, extras counter on
  Stats. Streak/stats untouched by extras; LocalStorage key
  `kwizicle-extras-solved` is fully separate.
- **Sitemap + favicon.** `public/sitemap.xml` covers all routes;
  `public/favicon.svg` (brand-green K tile) replaces Lovable placeholder
  `favicon.ico` (deleted).
- **Meta tags rewritten.** `index.html` title/description/OG/Twitter/JSON-LD
  all still described a Wordle-style "5-letter word puzzle, 6 tries" from
  the original Lovable export — fixed to actually describe the game.
- **Prompt-log convention.** New section in `AI_AGENTS.md` requires
  appending a session summary to this file before every git commit. This
  entry is the first that follows the rule.

User-stated principle that shaped the architecture: **optionality over
specifics** — every hedged decision (renderer = emoji vs PNG, var encoding,
manifest layout, source = local JSON vs API) sits behind a single
indirection point so flipping it is one edit. PRD §7 enumerates each seam.

Pitch-for-marketing-copy reminder is still pending; user has been asked
multiple times and deferred. Working assumption used for meta tags this
commit.

## 2026-07-06 — SEO: prerendering + keyword content pages

> The prod HTML shell was blank (CSR, no prerender) so crawlers indexed an
> empty page. Fix indexability first, then widen the indexable surface with
> keyword-targeted pages (Ahrefs targets: "emoji puzzle", "emoji math puzzle"
> KD 0, "emoji puzzles with answers"). Work step-by-step, stop to verify.

- **Diagnosis:** confirmed CSR-with-no-prerender — `dist/index.html` body was
  just `<div id="root">`. Head SEO already existed; only body was empty.
- **Prerendering (`vite-react-ssg`):** converted router to the data-router with
  a root `Layout` (providers + `<Outlet/>`); chose vite-react-ssg over
  react-snap because it renders in Node (no headless browser → works in the
  docker/CF build env). `ssgOptions.includedRoutes` prerenders ONLY `/`,
  `/emoji-math-puzzle`, `/blog/emoji-puzzles-with-answers`; the daily game
  stays client-only via `<ClientOnly>`. Homepage became a hub (game embedded +
  SEO hero); `/today` → `/`.
- **Head consolidation:** moved all per-page SEO (title/description/canonical/
  OG/Twitter/JSON-LD) into per-route `<Head>` (helmet) and stripped the static
  SEO block from `index.html` — fixes a duplicate-`<title>`/duplicate-canonical
  bug where every prerendered page canonicalized to the homepage.
- **Content:** `/` targets "emoji puzzle" + `WebApplication` JSON-LD;
  `/emoji-math-puzzle` (KD-0 term, doubles as how-to-play) with worked example,
  tips, FAQ + `FAQPage` JSON-LD; `/blog/emoji-puzzles-with-answers` — 6 real
  puzzles with answers in `<details>`. Real `og.png` (1200×630) rendered via
  Inkscape as vector art (server can't rasterize the color-emoji font).
- **Crawl + scaffolding:** sitemap lists only prerendered routes; `/how-to-play`
  → `/emoji-math-puzzle` (old page deleted); dormant `/archive`, `/puzzle/:date`,
  `/answer/:date` scaffolded (NOT prerendered/sitemapped) per §v0.C-style
  "build dormant" rationale.
- **Validation:** Playwright (in the Playwright container) against the built
  `dist/` served CF-style — all 3 prerendered pages hydrate clean, the game is
  interactive, redirects + client nav work.
- **Deploy fix:** the project `pnpm-lock.yaml` had NOT picked up
  `vite-react-ssg` (pnpm hoisted it to the `sites/` workspace lock); regenerated
  standalone (`--ignore-workspace`) so CF's `--frozen-lockfile` install passes.
- Also generated 3 extra puzzle-card PNGs (`public/puzzles/`) — committed but
  left unwired; operator is evaluating the vector style.

## 2026-07-06 — verify live deploy + growth-log entry

> Push, verify the live site once CF finishes, then log the SEO ship in the
> growth log — with a real GSC baseline synced via the lamill tool.

- Pushed `37250e8`; CF auto-built. Verified live via curl (crawler JS-off view):
  all 3 prerendered pages serve real `<body>`, single self-canonical each
  (duplicate-canonical bug gone), `WebApplication` + `FAQPage` JSON-LD present,
  sitemap lists only the 3 routes, `og.png` serves as `image/png`.
- Synced GSC via `lamill project seo kwizicle.com --refresh`: 0 imp / 0 clicks
  (28d); sitemap already fetched ~4h ago; `/` indexed, the 2 new pages still
  `url_is_unknown_to_google` (expected crawl lag). Recorded as the baseline in
  `docs/growth.md` with review 2026-08-03.

## 2026-07-06 — homepage thin-content fix (SEO body around the client-only game)

> View-source of `/` showed only a one-sentence hero: SSG fires, but the game
> (`TodayPage`) is correctly `<ClientOnly>`, so the homepage — targeting the
> HARDEST term "emoji puzzle" — had the LEAST crawlable content of the 3
> prerendered pages (~1k chars vs ~3k on `/emoji-math-puzzle`). Add static
> prerendered SEO body AROUND the client-only game; keep the game client-only.

- **Not an SSG bug.** `data-server-rendered="true"` was already present; the
  blank-shell bug was gone. The gap was content depth: I'd wrapped the game in
  `<ClientOnly>` last session but never added static body copy around it.
- **Anti-cannibalization was the whole constraint.** `/` and
  `/emoji-math-puzzle` have distinct jobs/keywords and must reinforce, not
  compete. Rules applied in `HomePage.tsx`: homepage primary phrase stays
  "emoji puzzle" (11× in output); the exact phrase "emoji math puzzle" used
  **once**, only as the how-to link anchor (also retitled `og:image:alt` off
  "…math puzzle" → "…emoji puzzle" to hold that to one). No second FAQ / no
  `FAQPage` JSON-LD on `/` (that schema stays unique to `/emoji-math-puzzle`).
- **Blocks added** (static, prerendered, around the `<ClientOnly>` game):
  (1) intro prose = ranking anchor for "emoji puzzle"; (2) "why play" + a
  math-vs-rebus disambiguation sentence to catch "emoji guess puzzle" searchers
  and steer AI citations; (3) ONE unsolved teaser using 🍔/🐶 — deliberately a
  different pair from the how-to page's 🥝/🥕 and the blog's pizza/cat/earth/
  guitar — teased, not solved, linking out to the full worked example;
  (4) text internal links (real anchor text) to the how-to + blog pages.
- **Result:** prerendered `/` body ~1 sentence → **~1,878 chars**, still lighter
  than `/emoji-math-puzzle` (~3,060) so it's complementary, not a lighter copy.
  Canonical still single self-referential `https://kwizicle.com/`.
- `/stats` needed no change — already excluded from `sitemap.xml` and serves no
  prerendered content to crawlers.
- Verified in the docker build (`funny_shannon`): `pnpm build` green, all 3
  pages prerender; grep-checks on `dist/index.html` confirm the counts above.
  Content/copy change only — no logic touched, no suite run.
