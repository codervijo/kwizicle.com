# Growth Log — kwizicle.com

> **What this file is for:** an honest, append-only log of growth experiments
> on this site — what was tried, what was measured, what happened. The data
> source is GSC; this file narrates *why*. Future-you (or future-Claude)
> reads this when deciding what to try next, both on this site and on
> related sister sites.

## How to use this (workflow — re-read this when you forget)

**Add an entry whenever you do something growth-relevant.** That includes:
shipping new content, structural SEO changes (sitemap, schema, redirects,
internal linking), tech changes that affect crawl/indexing, marketing
pushes, backlink campaigns. *Not* every code commit — just things you'd
want to point at when GSC numbers move (or fail to).

**Each entry is a hypothesis you can be wrong about.** Commit to a
measurable KPI and an observation window before acting — otherwise "did
this work?" is just a feeling.

### Lifecycle of one entry

1. **Day of action** — append a new dated H2 with `Status: active`, the
   hypothesis, the KPI you'll watch, current baseline numbers, what you
   did, and the date to review (default: today + 28 days, matching GSC's
   reporting window).
2. **Review day** — pull current GSC numbers, compute delta vs baseline.
   Fill in **Result** and **Learning**. Set **Status** to `shipped` (worked,
   keep going), `failed` (didn't pay off, abandon), or extend the review
   another window if results are ambiguous.
3. **Never rewrite older entries.** Wrong hypotheses are the most valuable
   data — they tell you what NOT to repeat on the next site. Append, don't
   edit.

### Where to get the numbers

```bash
cd ~/work/projects/sites/portfolio && make run ARGS="gsc sync"
```

Then read the row for `kwizicle.com`. Or pull from
https://search.google.com/search-console directly.

### Format

```
## YYYY-MM-DD — <one-line hypothesis or action>
- **Status:** active | testing | shipped | failed | abandoned
- **KPI:** <what GSC metric / query / page>
- **Baseline:** <numbers at start>
- **Action:** <what was done; 1-2 lines>
- **Result:** <numbers after window; "TBD — review YYYY-MM-DD" until then>
- **Learning:** <why it worked / didn't; what to try next; "TBD" until reviewed>
```

---

## 2026-05-09 — site scaffolded; growth log started
- **Status:** active
- **KPI:** any GSC traffic — clicks, impressions, indexed-page count
- **Baseline:** 0 clicks / 0 impressions (just deployed)
- **Action:** project scaffolded via `portfolio new bootstrap`; first deploy
  pending. After deploy: verify in GSC as `sc-domain:kwizicle.com` and submit
  the sitemap.
- **Result:** TBD — review 2026-06-06
- **Learning:** TBD

## 2026-07-06 — prerender the SPA + ship keyword pages to unblock indexing
- **Status:** active
- **KPI:** indexed-page count in GSC (target: 3), plus impressions for the
  target queries — `emoji puzzle`, `emoji math puzzle` / `math emoji puzzle`,
  `emoji puzzles with answers`.
- **Baseline (GSC 28d, pulled 2026-07-06 via `lamill project seo kwizicle.com
  --refresh`):** 0 impressions, 0 clicks. Coverage: only `/` is indexed
  (`submitted_indexed`, last crawled 11d ago); the two new content pages are
  `url_is_unknown_to_google` (deployed hours ago, not yet crawled). Sitemap
  submitted and fetched by Google ~4h ago. Prior traffic was ~zero because the
  prod HTML was a blank CSR `<div id="root">` — indexing was *blocked*, not
  slow (this is why the 2026-05-09 entry never produced traffic).
- **Action:** shipped build-time prerendering (`vite-react-ssg`, commit
  `37250e8`) so three routes now serve real, crawlable `<body>` content without
  JS: `/` (target *emoji puzzle*, `WebApplication` schema), `/emoji-math-puzzle`
  (target *emoji math puzzle*, KD 0; how-to-play + `FAQPage` schema), and
  `/blog/emoji-puzzles-with-answers` (target *emoji puzzles with answers*; 6
  worked examples). Per-page canonicals + OG image; sitemap trimmed to the 3
  prerendered routes. Sitemap is already submitted + fetched. **Next:** Request
  Indexing on the two uncrawled URLs (`/emoji-math-puzzle`,
  `/blog/emoji-puzzles-with-answers`) in Search Console.
- **Result:** TBD — review 2026-08-03.
- **Learning:** TBD. At review, check: are all 3 pages indexed (GSC → Pages)?
  Any impressions on the target queries? Does the KD-0 term
  (`emoji math puzzle`) rank first, as hypothesized? If pages are crawled but
  *not* indexed, that points to thin-content / low-authority rather than a
  crawl problem — different fix.

## 2026-07-06 — deepen the homepage so `/` can actually rank for "emoji puzzle"
- **Status:** active
- **KPI:** impressions + position for **"emoji puzzle"** (and variants: "daily
  emoji puzzle", "free emoji puzzle") on `/`; secondarily whether `/` gets
  indexed and *stays* indexed rather than being dropped as thin.
- **Baseline (2026-07-06):** `/` prerendered but thin — ~1 sentence / ~1,084
  chars of crawlable body, a single `<h1>`, because the interactive game is
  (correctly) `<ClientOnly>` and no static copy surrounded it. So the page
  targeting the site's *hardest* head term had the *least* content of the three
  prerendered pages. 0 imp / 0 clicks (same GSC pull as the entry above).
- **Action:** added static prerendered SEO body around the client-only game in
  `HomePage.tsx` — intro prose (anchor for "emoji puzzle"), a "why play"/streak
  block with a math-vs-rebus disambiguation sentence, one unsolved 🍔/🐶 teaser
  linking to the full worked example, and text internal links to
  `/emoji-math-puzzle` + `/blog/emoji-puzzles-with-answers`. Kept it
  deliberately *lighter* than `/emoji-math-puzzle` and used the exact phrase
  "emoji math puzzle" only once (a link anchor) to avoid cannibalizing the
  how-to page. Body went ~1,084 → ~1,878 chars.
- **Result:** TBD — review 2026-08-03 (same window as the prerender entry).
- **Learning so far (process, not yet outcome):** "prerendered" ≠ "indexable
  content." SSG firing only guarantees the *shell* is static; if the payload is
  behind `<ClientOnly>`, the crawlable page can still be near-empty. When a
  route's main value is an interactive, state-driven widget, the SEO body has to
  be authored *separately and statically around it* — don't assume the framework
  gives you content just because the route prerenders. Also: on a multi-page
  keyword cluster, decide the head term per page up front and enforce phrase
  discipline (one page owns "emoji puzzle", another owns "emoji math puzzle"),
  or the pages compete with each other. At review, check whether `/` earns
  impressions on "emoji puzzle" specifically (vs the long-tail pages) — that's
  the signal this fix worked, not just total-impressions-up.
