import { Head, ClientOnly } from "vite-react-ssg";
import { Link } from "react-router-dom";
import TodayPage from "@/pages/TodayPage";
import { AssetGlyph } from "@/components/AssetGlyph";

const WEBAPP_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Kwizicle",
  url: "https://kwizicle.com/",
  description:
    "Kwizicle is a free daily emoji puzzle. Solve the emoji equation for the hidden number in 3 tries.",
  applicationCategory: "GameApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

// Homepage / hub, target keyword: "emoji puzzle". The hero (H1 + intro) and all
// SEO tags below are prerendered into the static HTML so crawlers and social
// scrapers see real content; the interactive daily puzzle hydrates client-side.
export default function HomePage() {
  return (
    <>
      <Head>
        <title>Kwizicle — Free Daily Emoji Puzzle</title>
        <meta
          name="description"
          content="Kwizicle is a free daily emoji puzzle — a quick emoji math game where you solve the emoji equation for the hidden number in 3 tries. A new puzzle every day."
        />
        <link rel="canonical" href="https://kwizicle.com/" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Kwizicle" />
        <meta property="og:title" content="Kwizicle — Free Daily Emoji Puzzle" />
        <meta
          property="og:description"
          content="Wordle but with emoji equations — a free daily emoji-math puzzle."
        />
        <meta property="og:url" content="https://kwizicle.com/" />
        <meta property="og:image" content="https://kwizicle.com/og.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Kwizicle — a free daily emoji puzzle" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Kwizicle — Free Daily Emoji Puzzle" />
        <meta
          name="twitter:description"
          content="Wordle but with emoji equations — a free daily emoji-math puzzle."
        />
        <meta name="twitter:image" content="https://kwizicle.com/og.png" />

        <script type="application/ld+json">{JSON.stringify(WEBAPP_JSONLD)}</script>
      </Head>

      {/* Block 1 — hero + intro prose. Ranking anchor for "emoji puzzle".
          Category framing (what Kwizicle IS), NOT the mechanic-depth framing
          that lives on /emoji-math-puzzle. */}
      <section className="px-4 pt-6 pb-2 max-w-md mx-auto text-center">
        <h1 className="text-2xl font-heading font-bold">
          A free daily emoji puzzle
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Kwizicle is a free daily emoji puzzle you can play in about a minute.
          A fresh emoji puzzle drops every day: the emoji stand for hidden
          numbers, so you read the clues, crack the equation, and solve for the
          answer in three tries. No account, no app, no cost.
        </p>
      </section>

      {/* The interactive daily game — client-only on purpose (localStorage +
          day-specific state, no SEO value, avoids a hydration mismatch). All
          the crawlable content lives in the static blocks around it. */}
      <ClientOnly>{() => <TodayPage />}</ClientOnly>

      {/* Blocks 2–4 — static, prerendered SEO body. Complements
          /emoji-math-puzzle (the deep how-to page); it does not duplicate it.
          No FAQ / FAQPage schema here — that stays on /emoji-math-puzzle. */}
      <section className="px-4 pb-10 pt-4 max-w-md mx-auto flex flex-col gap-6 text-sm leading-relaxed border-t border-border mt-4">
        {/* Block 2 — why play + the math-vs-rebus disambiguation. */}
        <div className="flex flex-col gap-2">
          <h2 className="font-heading font-semibold text-lg">
            A quick daily brain-teaser
          </h2>
          <p className="text-muted-foreground">
            One new puzzle lands every day, so it&rsquo;s a fast way to wake up
            your brain over coffee — and each solve keeps your daily streak
            going. A round takes only a couple of minutes, with three tries to
            land the answer.
          </p>
          <p className="text-muted-foreground">
            Kwizicle is the math kind of emoji puzzle: the emoji are hidden
            <em> numbers</em> you solve for. It is not an emoji-guessing or
            rebus puzzle where the emoji spell out a word or phrase.
          </p>
        </div>

        {/* Block 3 — one static teaser, unsolved. Distinct emoji (burger/dog),
            NOT the kiwi/carrot example on /emoji-math-puzzle. Answer teased,
            not given; links out to the full worked example. */}
        <div className="flex flex-col gap-3">
          <h2 className="font-heading font-semibold text-lg">A quick example</h2>
          <p className="text-muted-foreground">
            Here&rsquo;s the kind of thing you&rsquo;ll crack each day:
          </p>
          <div className="bg-[hsl(var(--primary))] rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center gap-3 text-2xl justify-center">
              <AssetGlyph name="burger" />
              <span className="text-primary-foreground font-heading font-bold">+</span>
              <AssetGlyph name="burger" />
              <span className="text-primary-foreground font-heading font-bold">=</span>
              <span className="font-heading font-bold text-primary-foreground">8</span>
            </div>
            <div className="flex items-center gap-3 text-2xl justify-center">
              <AssetGlyph name="burger" />
              <span className="text-primary-foreground font-heading font-bold">+</span>
              <AssetGlyph name="dog" />
              <span className="text-primary-foreground font-heading font-bold">=</span>
              <span className="font-heading font-bold text-primary-foreground">6</span>
            </div>
            <div className="flex items-center gap-3 text-2xl justify-center border-t border-primary-foreground/20 pt-3">
              <AssetGlyph name="dog" />
              <span className="text-primary-foreground font-heading font-bold">=</span>
              <span className="font-heading font-bold text-primary-foreground">?</span>
            </div>
          </div>
          <p className="text-muted-foreground">
            Can you work out what the 🐶 is worth? We won&rsquo;t spoil it here.{" "}
            <Link to="/emoji-math-puzzle" className="text-primary underline">
              See a full worked example &rarr;
            </Link>
          </p>
        </div>

        {/* Block 4 — text internal links (real anchor text, not bare icons).
            The one allowed use of the phrase "emoji math puzzle" is the
            how-to link anchor. */}
        <nav className="flex flex-col gap-2">
          <Link to="/emoji-math-puzzle" className="text-primary underline">
            How to play — emoji math puzzle guide &rarr;
          </Link>
          <Link
            to="/blog/emoji-puzzles-with-answers"
            className="text-primary underline"
          >
            Emoji puzzles with answers &rarr;
          </Link>
        </nav>
      </section>
    </>
  );
}
