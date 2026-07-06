import { Head } from "vite-react-ssg";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { AssetGlyph } from "@/components/AssetGlyph";

// FAQPage schema — answers mirror the visible FAQ below (keep them in sync).
const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is an emoji math puzzle?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An emoji math puzzle is a puzzle where emoji stand in for unknown numbers inside equations. You solve the equations to find what each emoji is worth — the same logic as a small system of equations, dressed up with emoji.",
      },
    },
    {
      "@type": "Question",
      name: "How do you play Kwizicle?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Read the day's emoji equations, work out the value of the target emoji, and enter it as a number. You have 3 tries; after you solve it or run out, the solution is revealed.",
      },
    },
    {
      "@type": "Question",
      name: "How many tries do you get?",
      acceptedAnswer: { "@type": "Answer", text: "Three tries per puzzle." },
    },
    {
      "@type": "Question",
      name: "Is Kwizicle free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — Kwizicle is completely free, with a new daily puzzle and no account required.",
      },
    },
  ],
};

// /emoji-math-puzzle — the dedicated keyword page (target: "emoji math puzzle",
// KD 0), which also serves as the how-to-play / rules page. Fully prerendered.
export default function EmojiMathPuzzlePage() {
  return (
    <div className="flex flex-col flex-1 px-4 py-6 max-w-md mx-auto">
      <Head>
        <title>Emoji Math Puzzle — How to Play Kwizicle</title>
        <meta
          name="description"
          content="What is an emoji math puzzle? Learn how to play Kwizicle — a free daily math emoji puzzle where you solve the emoji equation for the hidden value in 3 tries."
        />
        <link rel="canonical" href="https://kwizicle.com/emoji-math-puzzle" />

        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Kwizicle" />
        <meta property="og:title" content="Emoji Math Puzzle — How to Play Kwizicle" />
        <meta
          property="og:description"
          content="What is an emoji math puzzle, and how do you play Kwizicle? The rules, a worked example, tips, and a quick FAQ."
        />
        <meta property="og:url" content="https://kwizicle.com/emoji-math-puzzle" />
        <meta property="og:image" content="https://kwizicle.com/og.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Emoji Math Puzzle — How to Play Kwizicle" />
        <meta
          name="twitter:description"
          content="What is an emoji math puzzle, and how do you play Kwizicle? Rules, a worked example, tips, and an FAQ."
        />
        <meta name="twitter:image" content="https://kwizicle.com/og.png" />

        <script type="application/ld+json">{JSON.stringify(FAQ_JSONLD)}</script>
      </Head>

      <div className="w-full flex items-center mb-6">
        <Link to="/" className="p-2 -ml-2 rounded-lg hover:bg-muted">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-heading font-bold mx-auto pr-9">
          Emoji Math Puzzle
        </h1>
      </div>

      <div className="flex flex-col gap-5 text-sm leading-relaxed">
        <p className="text-base">
          An <strong>emoji math puzzle</strong> replaces the numbers in a set of
          equations with emoji. Each emoji stands for a hidden value, and your
          job is to use the clues to work out what one of them equals. Kwizicle
          is a free daily math emoji puzzle built on exactly this idea.
        </p>

        <h2 className="font-heading font-semibold text-lg">How to play</h2>
        <p>
          You&rsquo;re given two or more emoji equations. Together they pin down
          a single value for the target emoji. Read the clues, do the arithmetic,
          and enter your answer as a number. You get <strong>3 tries</strong>.
        </p>

        <h2 className="font-heading font-semibold text-lg">A worked example</h2>
        <div className="bg-[hsl(var(--primary))] rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center gap-3 text-2xl justify-center">
            <AssetGlyph name="kiwi" />
            <span className="text-primary-foreground font-heading font-bold">+</span>
            <AssetGlyph name="carrot" />
            <span className="text-primary-foreground font-heading font-bold">=</span>
            <span className="font-heading font-bold text-primary-foreground">5</span>
          </div>
          <div className="flex items-center gap-3 text-2xl justify-center">
            <AssetGlyph name="carrot" />
            <span className="text-primary-foreground font-heading font-bold">−</span>
            <AssetGlyph name="kiwi" />
            <span className="text-primary-foreground font-heading font-bold">=</span>
            <span className="font-heading font-bold text-primary-foreground">1</span>
          </div>
          <div className="flex items-center gap-3 text-2xl justify-center border-t border-primary-foreground/20 pt-3">
            <AssetGlyph name="kiwi" />
            <span className="text-primary-foreground font-heading font-bold">=</span>
            <span className="font-heading font-bold text-primary-foreground">2</span>
          </div>
        </div>
        <p>
          Add the two equations and the carrots double: 🥝 + 🥕 plus 🥕 − 🥝
          leaves 2 × 🥕 = 6, so 🥕 = 3. Substitute back and 🥝 = 2. That&rsquo;s
          the answer.
        </p>

        <h2 className="font-heading font-semibold text-lg">Tips</h2>
        <ul className="flex flex-col gap-2 list-disc pl-5">
          <li>Add or subtract whole equations to cancel an emoji you don&rsquo;t need yet.</li>
          <li>Look for an emoji that appears alone or with a small coefficient first.</li>
          <li>Once you know one value, substitute it everywhere before guessing.</li>
        </ul>

        <hr className="border-border" />

        <h2 className="font-heading font-semibold text-lg">FAQ</h2>
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="font-semibold">What is an emoji math puzzle?</h3>
            <p className="text-muted-foreground">
              It&rsquo;s a puzzle where emoji stand in for unknown numbers inside
              equations. You solve the equations to find what each emoji is
              worth — the same logic as a small system of equations, dressed up
              with emoji.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">How do you play Kwizicle?</h3>
            <p className="text-muted-foreground">
              Read the day&rsquo;s emoji equations, figure out the value of the
              target emoji, and enter it as a number. You have 3 tries; after you
              solve it (or run out), the solution is revealed.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">How many tries do you get?</h3>
            <p className="text-muted-foreground">Three tries per puzzle.</p>
          </div>
          <div>
            <h3 className="font-semibold">Is Kwizicle free?</h3>
            <p className="text-muted-foreground">
              Yes — Kwizicle is completely free, with a new daily puzzle and no
              account required.
            </p>
          </div>
        </div>

        <Link
          to="/"
          className="mt-2 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity active:scale-95"
        >
          Play today&rsquo;s puzzle
        </Link>
      </div>
    </div>
  );
}
