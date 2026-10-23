---
project: kwizicle.com
prd_version: 2
project_version: v0.F
status: v0.F built — awaiting deploy-hook secret
owner: Vijo
last_updated: 2026-10-23
---

# kwizicle.com — PRD

## 1. Purpose

*Pending one-sentence pitch from owner. Working assumption: a daily emoji-equation deduction puzzle ("solve for 🥝 given 🥝+🥕=5, 🥕−🥝=1") with a small "play another" mode for users who want more after the daily.*

## 2. Audience

*Pending pitch. Working assumption: casual daily-puzzle players (Wordle/Connections audience) on mobile-web, low time-per-session, share-driven distribution.*

## 3. Goals & non-goals

**Goals:**
- One daily puzzle per UTC date, 3-attempt loop, persistent stats and streak
- "Play another" mode (extras) that doesn't dilute the daily streak
- Cross-platform glyph stability (renderer is pluggable: emoji default, PNG escape hatch wired but empty)
- Source of truth lives outside the web repo (sibling `kwizpy` Python generator) — web ingests JSON
- Every contested architectural choice sits behind a single switching seam (see §7)

**Non-goals (for now):**
- Accounts / cloud sync — localStorage only
- Multiplayer or real-time
- An HTTP API — daily and extras both ship as static JSON under `public/data/`
- Authoring puzzles in the web repo (kwizpy owns generation)

## 4. Versions

| Version | Theme | Acceptance |
|---|---|---|
| **v0** | private launch with seeded bank | Daily puzzle, extras mode, deployed to Cloudflare, switching seams in place |
| **v1** | kwizpy as source of truth | Generator emits the web's schema directly; year of puzzles pre-published; ad-hoc importer retired |
| **v2** | TBD — depends on pitch | — |

## 5. Phases

| Phase | Theme | Features |
|---|---|---|
| **v0.A** *(done)* | scaffold + deploy | Vite/CF Pages, game UI, stats, hard-coded fallback puzzles, theme toggle, share text |
| **v0.B** *(built)* | switching seams + seed bank | `assets.ts` registry · `<AssetGlyph>` component · render-mode flag (emoji default, PNG branch wired) · `abstractVars.ts` (temporary `a→kiwi` map) · loader normalizes asset-name and emoji-baked schemas · import 5 kwizpy JSONs (`kwiz1`–`kwiz5`) into `public/data/puzzles/` · trim hard-coded fallbacks to one safety-net |
| **v0.C** *(built)* | next-kwiz mode | `public/data/extras/manifest.json` · `extras.ts` loader + solved-set tracker · post-game "Play another" CTA · separate counter on Stats page · streak untouched by extras |
| **v0.D** *(built)* | daily content through 2026-12-31 | Claude-authored (generator kept outside the repo; output committed as data) — 237 dated puzzles in the existing v3 asset-name schema: **backfill** 2026-05-09 → 2026-10-22 (167) + **forward-fill** 2026-10-23 → 2026-12-31 (70) into `public/data/puzzles/` · batch validator (unique solution, integer answer = `answer`, `target` appears in equations, every asset name in `assets.ts`, no back-to-back repeats of an asset pair) · difficulty mix across the week · no puzzle reuses the safety-net or SEO-page examples (🥝/🥕, 🍔/🐶, the blog's six) · end-of-data alert so the daily never silently falls back again · expand `assets.ts` vocabulary so 237 days don't cycle 10 glyphs |
| **v0.E** *(built)* | wake archive routes | Prerender `/archive` + `/answer/:date` for every past date (build-date cutoff; today/future never prerendered or revealed) · per-date title/meta/canonical · answer page = equations + answer + worked explanation + prev/next + "play it" link · `/puzzle/:date` playable via `<PuzzleGame>` with session-only state (never touches streak/stats), client-only, not in sitemap · sitemap generated at build from puzzle data (replaces static `public/sitemap.xml`) · archive linked from homepage |
| **v0.F** *(built)* | daily rebuild | Scheduled GitHub Actions workflow (12:15 UTC — just after the previous day ends in every timezone) POSTs a Cloudflare Workers Builds deploy hook so `/archive`, `/answer/<date>` and the sitemap advance daily without a push · hook URL stored as GitHub secret `CF_DEPLOY_HOOK_URL` · manual `workflow_dispatch` trigger · response parsed, failures surfaced in the run log |
| **v1.A** | adopt kwizpy | Coordinate sibling repo to emit our schema (asset names + `target` + `result` + `difficulty`) · drop `abstractVars.ts` once kwizpy emits asset names directly · scheduled bulk publish |
| **v1.B** | pipeline polish | Solvability validator · difficulty curve · 2027+ puzzles pre-published · automation/cron for daily emit |
| **v2.x** | TBD | — |

## 6. Open questions

*(append-only log; mark answered with date but never delete)*

- **2026-05-04** — One-sentence pitch for Purpose/Audience? *(unanswered, blocks user-facing copy)*
- **2026-05-04** — Asset-name vocabulary: lowercase snake_case (`kiwi`, `bell_pepper`)? *(default until contested)*
- **2026-05-04** — Asset registry shared between web and mobile, or per-app? *(default: per-app, extract later if needed)*
- **2026-05-04** — kwizpy schema-change (emit `vars: {a: "kiwi"}`) — owned by Vijo or coordinated when v1.A starts? *(unanswered)*
- **2026-05-04** — Palette audit: cross-platform-test the existing 7 fallback puzzles, or pick a fresh themed safe-list of ~20? *(decided: either; deferred until needed)*
- **2026-10-23** — v0.D puzzle source: kwizpy only renders PNGs from hand-written specs, it doesn't generate. Who authors the 237 — a generator script, extend kwizpy now (pulls v1.A forward), or author by hand/Claude + validator? *(answered 2026-10-23: Claude-authored + validator)*
- **2026-10-23** — Once v0.D fills the past dates, wake the dormant `/archive` + `/answer/:date` routes as indexable content? Their TODO gate is "populated, real artifacts" — v0.D satisfies the populated half. *(answered 2026-10-23: yes → v0.E)*

## 7. Switching seams

For each hedged decision, the seam that lets us change our minds without rippling. Owner principle: **optionality over specifics.**

| Decision | Current | Seam |
|---|---|---|
| Renderer | native emoji | `<AssetGlyph name>` reads `renderMode.ts` constant + per-asset override field |
| Asset → glyph | `kiwi → 🥝` | Central `src/lib/assets.ts` registry: `{ emoji, png?, render? }` |
| kwizpy var encoding | abstract `a/b` (legacy) | Web has `abstractVars.ts` translating to asset names until kwizpy emits asset names directly |
| Puzzle JSON shape | asset-name based (post-v0.B) | Loader normalizes both old emoji-baked and new asset-name shapes to one in-memory `Puzzle` |
| Daily source | static JSON in `public/data/puzzles/` | `loadDailyPuzzle()` already async — swap to API later by changing function body |
| Extras pool layout | single `manifest.json` | `loadExtrasManifest()` returns `Puzzle[]` — move to per-file later inside the loader only |
| Theme coherence | mix per puzzle | Authoring concern, no code |
| Streak vs extras tracking | separate localStorage keys | Independent reducers, merge or split later without touching either side |
| Schema migration | `SCHEMA_VERSION_KEY` already in `puzzle.ts` | Bump version → cache flush, existing pattern |

## Problem

Daily-puzzle players burn through Wordle/Connections in two minutes and want another quick, share-friendly brainteaser before moving on with their day. Kwizicle gives them a single emoji-equation deduction puzzle per day (e.g. solve for 🥝 given 🥝+🥕=5, 🥕−🥝=1) with a 3-attempt loop, a streak, and an opt-in "play another" mode that doesn't dilute the streak.

## Users

Casual daily-puzzle players on mobile-web — the same audience that already plays Wordle, Connections, and Strands. They care about: a fast session (under ~2 min), a streak worth protecting, shareable results, and zero friction (no account, no app install). We hypothesize the addressable pool is in the low millions of daily players globally (estimated ~2–5M daily-puzzle regulars — verify), of which kwizicle would realistically reach a niche slice via word-of-mouth share-text. Willingness to pay is near zero at this stage; engagement signal is return-visits and streak length, not revenue.

