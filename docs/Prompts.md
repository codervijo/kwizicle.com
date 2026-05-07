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
