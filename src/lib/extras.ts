import { Equation } from "./puzzle";

export interface ExtraPuzzle {
  id: string;
  equations: Equation[];
  target: string;
  answer: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
}

const SOLVED_KEY = "kwizicle-extras-solved";

export async function loadExtras(): Promise<ExtraPuzzle[]> {
  try {
    const resp = await fetch(`/data/extras/manifest.json`, { cache: "no-cache" });
    if (resp.ok) {
      const extras = await resp.json();
      if (Array.isArray(extras)) return extras;
    }
  } catch {}
  return [];
}

export function getSolvedExtras(): Set<string> {
  try {
    const raw = localStorage.getItem(SOLVED_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

export function markExtraSolved(id: string): void {
  const solved = getSolvedExtras();
  solved.add(id);
  localStorage.setItem(SOLVED_KEY, JSON.stringify([...solved]));
}

export function pickNext(
  extras: ExtraPuzzle[],
  excludeIds: Set<string> = new Set(),
): ExtraPuzzle | null {
  const solved = getSolvedExtras();
  return extras.find(e => !solved.has(e.id) && !excludeIds.has(e.id)) ?? null;
}
