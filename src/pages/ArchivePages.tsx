import { useCallback, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Head } from "vite-react-ssg";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { AssetGlyph } from "@/components/AssetGlyph";
import { PuzzleGame } from "@/components/PuzzleGame";
import { getEmoji } from "@/lib/assets";
import { getDayNumber, getTodayDate, MAX_ATTEMPTS, type DailyPuzzle } from "@/lib/puzzle";
import {
  formatLongDate,
  formatMonth,
  getPuzzleByDate,
  isDayOver,
  pastPuzzles,
  useNow,
} from "@/lib/archive";

/**
 * Archive + per-date routes (v0.E).
 *
 *   /archive          — index of past daily puzzles        (prerendered, sitemap)
 *   /answer/:date     — equations + answer for a past day  (prerendered, sitemap)
 *   /puzzle/:date     — replay a past puzzle               (client-only, not in sitemap)
 *
 * Only days that have ended in every timezone are listed or answered (see
 * isDayOver); vite.config.ts applies the same rule to what gets prerendered.
 */

const SITE = "https://kwizicle.com";

function assetsOf(p: DailyPuzzle): string[] {
  return [...new Set(p.equations.flatMap(e => [e.left, e.right]))];
}

function PageHead({ title, description, path }: { title: string; description: string; path: string }) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={`${SITE}${path}`} />
      <meta property="og:type" content="article" />
      <meta property="og:site_name" content="Kwizicle" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={`${SITE}${path}`} />
      <meta property="og:image" content={`${SITE}/og.png`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${SITE}/og.png`} />
    </Head>
  );
}

function BackHeader({ to, title }: { to: string; title: string }) {
  return (
    <div className="w-full flex items-center mb-6">
      <Link to={to} className="p-2 -ml-2 rounded-lg hover:bg-muted">
        <ArrowLeft className="w-5 h-5" />
      </Link>
      <h1 className="text-2xl font-heading font-bold mx-auto pr-9 text-center">{title}</h1>
    </div>
  );
}

function Unavailable({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col flex-1 px-4 py-10 max-w-md mx-auto text-center gap-3">
      <h1 className="text-2xl font-heading font-bold">{title}</h1>
      <p className="text-muted-foreground">{children}</p>
      <Link
        to="/"
        className="mt-2 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold"
      >
        Play today&rsquo;s puzzle
      </Link>
    </div>
  );
}

function EquationCard({ puzzle }: { puzzle: DailyPuzzle }) {
  return (
    <div className="w-full rounded-2xl bg-[hsl(var(--primary))] p-5 flex flex-col items-center gap-3 shadow-lg">
      {puzzle.equations.map((eq, i) => (
        <div key={i} className="flex items-center gap-3 text-3xl">
          <AssetGlyph name={eq.left} />
          <span className="font-heading font-bold text-primary-foreground text-2xl">{eq.operator}</span>
          <AssetGlyph name={eq.right} />
          <span className="font-heading font-bold text-primary-foreground text-2xl">=</span>
          <span className="font-heading font-bold text-primary-foreground">{eq.result}</span>
        </div>
      ))}
      <div className="flex items-center gap-3 text-3xl border-t border-primary-foreground/20 pt-3 w-full justify-center">
        <AssetGlyph name={puzzle.target} />
        <span className="font-heading font-bold text-primary-foreground text-2xl">=</span>
        <span className="font-heading font-bold text-primary-foreground">?</span>
      </div>
    </div>
  );
}

// --- /archive ---------------------------------------------------------------

export function ArchivePage() {
  const now = useNow();
  const past = pastPuzzles(now).reverse();

  const byMonth = new Map<string, DailyPuzzle[]>();
  for (const p of past) {
    const m = formatMonth(p.date);
    byMonth.set(m, [...(byMonth.get(m) ?? []), p]);
  }

  return (
    <div className="flex flex-col flex-1 px-4 py-6 max-w-md mx-auto w-full">
      <PageHead
        title="Kwizicle Archive — Past Daily Emoji Puzzles & Answers"
        description="Every past Kwizicle daily emoji puzzle, with answers and worked explanations. Replay any day or check the solution."
        path="/archive"
      />
      <BackHeader to="/" title="Puzzle Archive" />
      <p className="text-muted-foreground mb-6">
        Every past Kwizicle daily emoji puzzle, newest first. Open a day to see
        its equations, the answer and how to work it out — or replay it.
      </p>

      {[...byMonth].map(([month, list]) => (
        <section key={month} className="mb-6">
          <h2 className="text-lg font-heading font-bold mb-2">{month}</h2>
          <ul className="flex flex-col divide-y divide-border">
            {list.map(p => (
              <li key={p.date} className="py-2 flex items-center justify-between gap-3">
                <Link to={`/answer/${p.date}`} className="flex items-center gap-2 hover:underline">
                  <span className="text-sm tabular-nums text-muted-foreground w-24">
                    {formatLongDate(p.date).split(",").slice(0, 2).join(",")}
                  </span>
                  <span className="text-xl">{assetsOf(p).map(getEmoji).join("")}</span>
                </Link>
                <span className="text-xs text-muted-foreground capitalize">{p.difficulty}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

// --- /answer/:date ----------------------------------------------------------

export function AnswerByDatePage() {
  const { date = "" } = useParams();
  const now = useNow();
  const puzzle = getPuzzleByDate(date);

  if (!puzzle) {
    return <Unavailable title="Puzzle not found">There&rsquo;s no Kwizicle puzzle for {date}.</Unavailable>;
  }
  if (!isDayOver(date, now)) {
    return (
      <Unavailable title="No spoilers yet">
        The answer for {formatLongDate(date)} is published once that day has
        ended everywhere.
      </Unavailable>
    );
  }

  const n = getDayNumber(date);
  const long = formatLongDate(date);
  const target = getEmoji(puzzle.target);
  const prev = getPuzzleByDate(shiftDate(date, -1));
  const next = getPuzzleByDate(shiftDate(date, 1));
  const nextVisible = next && isDayOver(next.date, now);

  return (
    <div className="flex flex-col flex-1 px-4 py-6 max-w-md mx-auto w-full gap-5">
      <PageHead
        title={`Kwizicle #${n} Answer — ${long}`}
        description={`Answer and worked solution for the Kwizicle daily emoji puzzle #${n} (${long}): what is ${target} worth? ${capitalize(puzzle.difficulty)} difficulty.`}
        path={`/answer/${date}`}
      />
      <BackHeader to="/archive" title={`Kwizicle #${n} Answer`} />
      <p className="text-muted-foreground -mt-3">
        The daily emoji puzzle for {long} · <span className="capitalize">{puzzle.difficulty}</span>
      </p>

      <EquationCard puzzle={puzzle} />

      <details className="rounded-xl border border-border p-4">
        <summary className="cursor-pointer font-semibold">Show the answer</summary>
        <p className="mt-3 text-lg font-heading font-bold">
          {target} = {puzzle.answer}
        </p>
        <p className="mt-2 text-muted-foreground">{puzzle.explanation}.</p>
      </details>

      <p className="text-muted-foreground">
        Want to try it first?{" "}
        <Link to={`/puzzle/${date}`} className="text-primary underline">
          Play the {long.split(",").slice(1).join(",").trim()} puzzle &rarr;
        </Link>{" "}
        New to these? Read{" "}
        <Link to="/emoji-math-puzzle" className="text-primary underline">
          how to solve an emoji puzzle
        </Link>
        .
      </p>

      <nav className="flex items-center justify-between text-sm">
        {prev ? (
          <Link to={`/answer/${prev.date}`} className="flex items-center gap-1 text-primary hover:underline">
            <ChevronLeft className="w-4 h-4" /> Previous day
          </Link>
        ) : <span />}
        <Link to="/archive" className="text-muted-foreground hover:text-foreground">All puzzles</Link>
        {nextVisible ? (
          <Link to={`/answer/${next.date}`} className="flex items-center gap-1 text-primary hover:underline">
            Next day <ChevronRight className="w-4 h-4" />
          </Link>
        ) : <span />}
      </nav>
    </div>
  );
}

// --- /puzzle/:date ----------------------------------------------------------

// Replays never touch the daily streak or stats — session-only state, like
// the extras mode.
export function PuzzleByDatePage() {
  const { date = "" } = useParams();
  const puzzle = getPuzzleByDate(date);
  const [attempts, setAttempts] = useState<number[]>([]);

  const onAttempt = useCallback((num: number) => setAttempts(a => [...a, num]), []);

  if (date === getTodayDate()) return <Navigate to="/" replace />;
  if (!puzzle || date > getTodayDate()) {
    return <Unavailable title="Puzzle not available">There&rsquo;s no playable Kwizicle puzzle for {date}.</Unavailable>;
  }

  const solved = attempts.includes(puzzle.answer);
  const failed = !solved && attempts.length >= MAX_ATTEMPTS;

  return (
    <div className="flex flex-col flex-1">
      <div className="px-4 pt-3 flex items-center justify-between max-w-md mx-auto w-full">
        <Link to="/archive" className="p-2 -ml-2 rounded-lg hover:bg-muted">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <span className="text-sm text-muted-foreground">Replay · {formatLongDate(date)}</span>
        <div className="w-9" />
      </div>
      <PuzzleGame
        puzzle={puzzle}
        attempts={attempts}
        solved={solved}
        failed={failed}
        onAttempt={onAttempt}
        gameOverActions={
          <div className="flex flex-col items-center gap-2 text-sm">
            <Link to="/archive" className="text-primary underline">Back to the archive</Link>
            <Link to="/" className="text-muted-foreground hover:text-foreground">Play today&rsquo;s puzzle</Link>
          </div>
        }
      />
    </div>
  );
}

function shiftDate(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
