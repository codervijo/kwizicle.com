import { Link, useParams } from "react-router-dom";

/**
 * DORMANT scaffolding — archive + per-date puzzle/answer routes.
 *
 * The URL scheme is intentionally clean and stable so we never have to break
 * links later:
 *   /archive          — index of past daily puzzles
 *   /puzzle/:date     — a playable past puzzle   (date = YYYY-MM-DD)
 *   /answer/:date     — the answer for a past puzzle
 *
 * TODO(enable-when-daily-players-exist): add these to the sitemap
 * (public/sitemap.xml) AND to vite.config.ts `ssgOptions.includedRoutes`
 * (enumerating real dates via getStaticPaths) only once each page is a real,
 * populated, playable/answerable artifact. Empty dated pages with no players
 * get crawled-but-not-indexed and can drag down site quality, so they stay
 * client-side-only and unlisted until then.
 */

function Placeholder({ title, children }: { title: string; children: React.ReactNode }) {
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

export function ArchivePage() {
  return (
    <Placeholder title="Puzzle Archive">
      The archive of past daily puzzles is coming soon.
    </Placeholder>
  );
}

export function PuzzleByDatePage() {
  const { date } = useParams();
  return (
    <Placeholder title="Past Puzzle">
      The puzzle for {date} isn&rsquo;t available yet — check back soon.
    </Placeholder>
  );
}

export function AnswerByDatePage() {
  const { date } = useParams();
  return (
    <Placeholder title="Puzzle Answer">
      The answer for {date} isn&rsquo;t published yet — check back soon.
    </Placeholder>
  );
}
