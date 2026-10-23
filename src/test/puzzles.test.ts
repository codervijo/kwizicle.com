import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { assets } from "@/lib/assets";
import { getTodayDate, type DailyPuzzle } from "@/lib/puzzle";

// Validator for every dated puzzle in public/data/puzzles/. Players assume
// positive whole numbers, so uniqueness is checked by brute force over 1..30.

const DIR = path.resolve(__dirname, "../../public/data/puzzles");
const files = fs.readdirSync(DIR).filter(f => f.endsWith(".json")).sort();
const puzzles: DailyPuzzle[] = files.map(f => JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8")));

const OPS: Record<string, (x: number, y: number) => number> = {
  "+": (x, y) => x + y,
  "-": (x, y) => x - y,
  "×": (x, y) => x * y,
  "÷": (x, y) => x / y,
};
const DOMAIN = Array.from({ length: 30 }, (_, i) => i + 1);

function solutions(p: DailyPuzzle): Record<string, number>[] {
  const names = [...new Set(p.equations.flatMap(e => [e.left, e.right]))];
  const out: Record<string, number>[] = [];
  const walk = (i: number, env: Record<string, number>) => {
    if (out.length > 1) return;
    if (i === names.length) {
      if (p.equations.every(e => OPS[e.operator](env[e.left], env[e.right]) === e.result)) out.push({ ...env });
      return;
    }
    for (const v of DOMAIN) walk(i + 1, { ...env, [names[i]]: v });
  };
  walk(0, {});
  return out;
}

// Pairs used in the safety-net puzzle and the SEO pages' worked examples.
const RESERVED_PAIRS = [
  ["kiwi", "carrot"], ["cat", "dog"], ["pizza", "burger"], ["earth", "moon"],
  ["guitar", "drum"], ["pizza", "cat"], ["burger", "dog"],
];
const SEED_DATES = new Set(["2026-05-04", "2026-05-05", "2026-05-06", "2026-05-07", "2026-05-08"]);

describe.each(puzzles.map((p, i) => [files[i], p] as const))("%s", (file, p) => {
  it("date matches filename", () => {
    expect(`${p.date}.json`).toBe(file);
  });

  it("uses only registered assets", () => {
    for (const e of p.equations) {
      expect(assets[e.left], e.left).toBeDefined();
      expect(assets[e.right], e.right).toBeDefined();
      expect(OPS[e.operator], e.operator).toBeDefined();
    }
    expect(p.equations.some(e => e.left === p.target || e.right === p.target)).toBe(true);
  });

  it("has exactly one positive whole-number solution, matching answer", () => {
    const sols = solutions(p);
    expect(sols).toHaveLength(1);
    expect(sols[0][p.target]).toBe(p.answer);
  });

  it("does not reuse a reserved SEO/safety-net pair", () => {
    if (SEED_DATES.has(p.date)) return;
    const used = new Set(p.equations.flatMap(e => [e.left, e.right]));
    for (const [a, b] of RESERVED_PAIRS) expect(used.has(a) && used.has(b), `${a}+${b}`).toBe(false);
  });
});

describe("daily calendar", () => {
  it("has no gaps between first and last date", () => {
    const first = new Date(`${puzzles[0].date}T00:00:00Z`).getTime();
    const last = new Date(`${puzzles[puzzles.length - 1].date}T00:00:00Z`).getTime();
    expect(puzzles).toHaveLength((last - first) / 86400000 + 1);
  });

  it("never repeats an asset on consecutive days", () => {
    for (let i = 1; i < puzzles.length; i++) {
      if (SEED_DATES.has(puzzles[i].date)) continue;
      const prev = new Set(puzzles[i - 1].equations.flatMap(e => [e.left, e.right]));
      const shared = puzzles[i].equations.flatMap(e => [e.left, e.right]).filter(a => prev.has(a));
      expect(shared, puzzles[i].date).toEqual([]);
    }
  });

  // End-of-data alert: fails while there are fewer than 14 days of puzzles
  // ahead, so the daily never silently drops to the safety-net puzzle again.
  it("has at least 14 days of puzzles ahead of today", () => {
    const ahead = new Date(`${getTodayDate()}T00:00:00Z`);
    ahead.setUTCDate(ahead.getUTCDate() + 14);
    const last = puzzles[puzzles.length - 1].date;
    expect(last >= ahead.toISOString().slice(0, 10), `puzzles end ${last} — author more`).toBe(true);
  });
});
