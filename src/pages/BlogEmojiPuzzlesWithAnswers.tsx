import { Head } from "vite-react-ssg";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { AssetGlyph } from "@/components/AssetGlyph";

// A "part" of an equation: an emoji (asset name) or a literal symbol/number.
type Part = { g: string } | { s: string };

interface Puzzle {
  id: number;
  level: "Easy" | "Medium" | "Tricky";
  equations: Part[][];
  answer: string; // shown inside <details>
  how: string; // one-line working
}

const PUZZLES: Puzzle[] = [
  {
    id: 1,
    level: "Easy",
    equations: [[{ g: "pizza" }, { s: "+" }, { g: "pizza" }, { s: "=" }, { s: "8" }]],
    answer: "🍕 = 4",
    how: "Two equal slices add to 8, so each slice is 8 ÷ 2 = 4.",
  },
  {
    id: 2,
    level: "Easy",
    equations: [[{ g: "cat" }, { s: "+" }, { g: "cat" }, { s: "+" }, { g: "cat" }, { s: "=" }, { s: "9" }]],
    answer: "🐱 = 3",
    how: "Three equal cats make 9, so one cat is 9 ÷ 3 = 3.",
  },
  {
    id: 3,
    level: "Medium",
    equations: [
      [{ g: "kiwi" }, { s: "+" }, { g: "carrot" }, { s: "=" }, { s: "5" }],
      [{ g: "carrot" }, { s: "−" }, { g: "kiwi" }, { s: "=" }, { s: "1" }],
    ],
    answer: "🥝 = 2, 🥕 = 3",
    how: "Add the two equations: the kiwis cancel and 2 × 🥕 = 6, so 🥕 = 3 and 🥝 = 2.",
  },
  {
    id: 4,
    level: "Medium",
    equations: [
      [{ g: "earth" }, { s: "+" }, { g: "moon" }, { s: "=" }, { s: "7" }],
      [{ g: "earth" }, { s: "−" }, { g: "moon" }, { s: "=" }, { s: "3" }],
    ],
    answer: "🌍 = 5, 🌙 = 2",
    how: "Add both equations: 2 × 🌍 = 10, so 🌍 = 5, and then 🌙 = 2.",
  },
  {
    id: 5,
    level: "Medium",
    equations: [
      [{ g: "guitar" }, { s: "+" }, { g: "drum" }, { s: "=" }, { s: "6" }],
      [{ g: "guitar" }, { s: "−" }, { g: "drum" }, { s: "=" }, { s: "2" }],
    ],
    answer: "🎸 = 4, 🥁 = 2",
    how: "Add the equations: 2 × 🎸 = 8, so 🎸 = 4, which leaves 🥁 = 2.",
  },
  {
    id: 6,
    level: "Tricky",
    equations: [
      [{ g: "dog" }, { s: "+" }, { g: "dog" }, { s: "=" }, { s: "10" }],
      [{ g: "dog" }, { s: "+" }, { g: "burger" }, { s: "=" }, { s: "11" }],
    ],
    answer: "🐶 = 5, 🍔 = 6",
    how: "The first line gives 🐶 = 5. Substitute into the second: 5 + 🍔 = 11, so 🍔 = 6.",
  },
];

function Equation({ parts }: { parts: Part[] }) {
  return (
    <div className="flex items-center gap-2 text-2xl justify-center">
      {parts.map((p, i) =>
        "g" in p ? (
          <AssetGlyph key={i} name={p.g} />
        ) : (
          <span key={i} className="font-heading font-bold text-foreground">
            {p.s}
          </span>
        )
      )}
    </div>
  );
}

// /blog/emoji-puzzles-with-answers — target: "emoji puzzles with answers" /
// "emoji puzzle examples". Fully prerendered; the equations render as real
// emoji text (crawlable) and each answer sits in a native <details> so readers
// can try first.
export default function BlogEmojiPuzzlesWithAnswers() {
  return (
    <div className="flex flex-col flex-1 px-4 py-6 max-w-md mx-auto">
      <Head>
        <title>6 Emoji Puzzles With Answers (Examples to Try)</title>
        <meta
          name="description"
          content="Six free emoji math puzzles with answers — worked examples from easy to tricky. Solve the emoji equations, then reveal the answer and the step-by-step working."
        />
        <link
          rel="canonical"
          href="https://kwizicle.com/blog/emoji-puzzles-with-answers"
        />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Kwizicle" />
        <meta property="og:title" content="6 Emoji Puzzles With Answers (Examples to Try)" />
        <meta
          property="og:description"
          content="Six free emoji math puzzles with answers and worked solutions, from easy to tricky."
        />
        <meta property="og:url" content="https://kwizicle.com/blog/emoji-puzzles-with-answers" />
        <meta property="og:image" content="https://kwizicle.com/og.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://kwizicle.com/og.png" />
      </Head>

      <div className="w-full flex items-center mb-6">
        <Link to="/" className="p-2 -ml-2 rounded-lg hover:bg-muted">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-heading font-bold mx-auto pr-9 text-center">
          Emoji Puzzles With Answers
        </h1>
      </div>

      <div className="flex flex-col gap-5 text-sm leading-relaxed">
        <p className="text-base">
          Here are six free <strong>emoji math puzzles with answers</strong> —
          worked examples that run from easy to tricky. Each emoji stands for a
          hidden number; use the equations to work it out, then reveal the
          answer and the full working. Want a fresh one every day?{" "}
          <Link to="/" className="text-primary underline">
            Play today&rsquo;s Kwizicle
          </Link>
          .
        </p>

        {PUZZLES.map((p) => (
          <div key={p.id} className="rounded-xl border border-border p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-heading font-semibold">Puzzle {p.id}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                {p.level}
              </span>
            </div>
            <div className="flex flex-col gap-2 py-1">
              {p.equations.map((eq, i) => (
                <Equation key={i} parts={eq} />
              ))}
            </div>
            <details className="text-sm">
              <summary className="cursor-pointer font-semibold text-primary">
                Show answer
              </summary>
              <p className="mt-2">
                <strong>{p.answer}</strong>
              </p>
              <p className="mt-1 text-muted-foreground">{p.how}</p>
            </details>
          </div>
        ))}

        <hr className="border-border" />
        <p className="text-muted-foreground">
          New to these? Read{" "}
          <Link to="/emoji-math-puzzle" className="text-primary underline">
            what an emoji math puzzle is and how to play
          </Link>
          , or jump straight into{" "}
          <Link to="/" className="text-primary underline">
            today&rsquo;s free daily puzzle
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
