import { Head, ClientOnly } from "vite-react-ssg";
import TodayPage from "@/pages/TodayPage";

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
        <meta property="og:image:alt" content="Kwizicle — a free daily emoji math puzzle" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Kwizicle — Free Daily Emoji Puzzle" />
        <meta
          name="twitter:description"
          content="Wordle but with emoji equations — a free daily emoji-math puzzle."
        />
        <meta name="twitter:image" content="https://kwizicle.com/og.png" />

        <script type="application/ld+json">{JSON.stringify(WEBAPP_JSONLD)}</script>
      </Head>

      <section className="px-4 pt-6 pb-2 max-w-md mx-auto text-center">
        <h1 className="text-2xl font-heading font-bold">
          A free daily emoji puzzle
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Kwizicle is a daily emoji math puzzle. Crack the emoji equation and
          solve for the hidden value in 3 tries — a new free puzzle every day.
        </p>
      </section>
      <ClientOnly>{() => <TodayPage />}</ClientOnly>
    </>
  );
}
