import { useEffect, useState } from "react";
import type { DailyPuzzle } from "./puzzle";

// Archive data: every dated puzzle, bundled at build time so /archive and
// /answer/:date prerender with real content. The same JSON files are also
// fetched at runtime by loadDailyPuzzle(), so bundling exposes nothing new.

const modules = import.meta.glob<DailyPuzzle>("../../public/data/puzzles/*.json", {
  eager: true,
  import: "default",
});

export const ALL_PUZZLES: DailyPuzzle[] = Object.values(modules).sort((a, b) =>
  a.date.localeCompare(b.date),
);

const BY_DATE = new Map(ALL_PUZZLES.map(p => [p.date, p]));

export function getPuzzleByDate(date: string): DailyPuzzle | undefined {
  return BY_DATE.get(date);
}

// A date's answer is safe to publish only once that calendar day has ended in
// every timezone (UTC−12 ends it at D+1 12:00 UTC).
const DAY_OVER_OFFSET_MS = 36 * 3600 * 1000;

export function isDayOver(date: string, now: number): boolean {
  return now >= Date.parse(`${date}T00:00:00Z`) + DAY_OVER_OFFSET_MS;
}

export function pastPuzzles(now: number): DailyPuzzle[] {
  return ALL_PUZZLES.filter(p => isDayOver(p.date, now));
}

// Build timestamp first (so hydration matches the prerendered HTML), then the
// real clock after mount — lets client-side visits see days that ended after
// the last deploy.
export function useNow(): number {
  const [now, setNow] = useState(__BUILD_TIME__);
  useEffect(() => setNow(Date.now()), []);
  return now;
}

export function formatLongDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatMonth(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
