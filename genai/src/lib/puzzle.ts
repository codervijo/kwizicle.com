// Puzzle data model: equation-based emoji deduction (e.g. 🥝+🥕=5, 🥕-🥝=1)

export interface Equation {
  left: string;   // emoji
  operator: "+" | "-" | "×" | "÷";
  right: string;  // emoji
  result: number;
}

export interface DailyPuzzle {
  date: string;
  equations: Equation[];
  target: string;        // emoji to solve for
  answer: number;        // correct answer
  explanation: string;   // shown after game
  difficulty: "easy" | "medium" | "hard";
}

export interface PuzzleState {
  date: string;
  attempts: number[];
  solved: boolean;
  failed: boolean;
  startTime: number;
  endTime: number | null;
}

export interface PuzzleStats {
  played: number;
  solved: number;
  streak: number;
  maxStreak: number;
  totalAttempts: number;
  lastPlayedDate: string;
}

export const MAX_ATTEMPTS = 3;

// --- Date helpers ---

export function getTodayDate(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function getYesterdayDate(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function getDayNumber(dateStr: string): number {
  const epoch = new Date("2025-01-01").getTime();
  const target = new Date(dateStr).getTime();
  return Math.floor((target - epoch) / 86400000) + 1;
}

// --- Fallback puzzles ---

const FALLBACK_PUZZLES: DailyPuzzle[] = [
  {
    date: "",
    equations: [
      { left: "🥝", operator: "+", right: "🥕", result: 5 },
      { left: "🥕", operator: "-", right: "🥝", result: 1 },
    ],
    target: "🥝", answer: 2,
    explanation: "🥝=2, 🥕=3. From the equations: 2+3=5 and 3-2=1",
    difficulty: "easy",
  },
  {
    date: "",
    equations: [
      { left: "🐱", operator: "+", right: "🐶", result: 10 },
      { left: "🐶", operator: "-", right: "🐱", result: 2 },
    ],
    target: "🐱", answer: 4,
    explanation: "🐱=4, 🐶=6. From the equations: 4+6=10 and 6-4=2",
    difficulty: "easy",
  },
  {
    date: "",
    equations: [
      { left: "🍕", operator: "+", right: "🍔", result: 9 },
      { left: "🍕", operator: "-", right: "🍔", result: 3 },
    ],
    target: "🍔", answer: 3,
    explanation: "🍕=6, 🍔=3. From the equations: 6+3=9 and 6-3=3",
    difficulty: "easy",
  },
  {
    date: "",
    equations: [
      { left: "🌍", operator: "+", right: "🌙", result: 11 },
      { left: "🌍", operator: "-", right: "🌙", result: 3 },
    ],
    target: "🌙", answer: 4,
    explanation: "🌍=7, 🌙=4. From the equations: 7+4=11 and 7-4=3",
    difficulty: "easy",
  },
  {
    date: "",
    equations: [
      { left: "🎸", operator: "+", right: "🥁", result: 12 },
      { left: "🎸", operator: "-", right: "🥁", result: 4 },
    ],
    target: "🥁", answer: 4,
    explanation: "🎸=8, 🥁=4. From the equations: 8+4=12 and 8-4=4",
    difficulty: "easy",
  },
  {
    date: "",
    equations: [
      { left: "🚀", operator: "+", right: "⭐", result: 15 },
      { left: "🚀", operator: "-", right: "⭐", result: 5 },
    ],
    target: "⭐", answer: 5,
    explanation: "🚀=10, ⭐=5. From the equations: 10+5=15 and 10-5=5",
    difficulty: "easy",
  },
  {
    date: "",
    equations: [
      { left: "🎨", operator: "×", right: "🖌️", result: 12 },
      { left: "🎨", operator: "+", right: "🖌️", result: 7 },
    ],
    target: "🖌️", answer: 3,
    explanation: "🎨=4, 🖌️=3. From the equations: 4×3=12 and 4+3=7",
    difficulty: "medium",
  },
];

function getFallbackPuzzle(dateStr: string): DailyPuzzle {
  const epoch = new Date("2025-01-01").getTime();
  const target = new Date(dateStr).getTime();
  const dayIndex = Math.floor((target - epoch) / 86400000);
  const idx = ((dayIndex % FALLBACK_PUZZLES.length) + FALLBACK_PUZZLES.length) % FALLBACK_PUZZLES.length;
  return { ...FALLBACK_PUZZLES[idx], date: dateStr };
}

// --- Schema migration ---

const PUZZLE_CACHE_KEY = "kwizicle-puzzle-cache";
const SCHEMA_VERSION_KEY = "kwizicle-schema-version";
const CURRENT_SCHEMA_VERSION = 2; // bumped from v1 (pairs) to v2 (equations)

function migrateIfNeeded(): void {
  try {
    const version = parseInt(localStorage.getItem(SCHEMA_VERSION_KEY) || "0", 10);
    if (version < CURRENT_SCHEMA_VERSION) {
      localStorage.removeItem(PUZZLE_CACHE_KEY);
      localStorage.removeItem("kwizicle-puzzle-state");
      localStorage.setItem(SCHEMA_VERSION_KEY, String(CURRENT_SCHEMA_VERSION));
    }
  } catch {}
}

// --- Puzzle loader ---

export async function loadDailyPuzzle(dateStr: string): Promise<DailyPuzzle> {
  migrateIfNeeded();

  try {
    const cached = localStorage.getItem(PUZZLE_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached) as DailyPuzzle;
      if (parsed.date === dateStr && Array.isArray(parsed.equations)) return parsed;
    }
  } catch {}

  try {
    const resp = await fetch(`/data/puzzles/${dateStr}.json`, { cache: "no-cache" });
    if (resp.ok) {
      const puzzle: DailyPuzzle = await resp.json();
      localStorage.setItem(PUZZLE_CACHE_KEY, JSON.stringify(puzzle));
      return puzzle;
    }
  } catch {}

  const fallback = getFallbackPuzzle(dateStr);
  localStorage.setItem(PUZZLE_CACHE_KEY, JSON.stringify(fallback));
  return fallback;
}

// --- State persistence ---

const STATE_KEY = "kwizicle-puzzle-state";
const STATS_KEY = "kwizicle-stats";

export function loadPuzzleState(): PuzzleState | null {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

export function savePuzzleState(state: PuzzleState): void {
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
}

export function createNewPuzzleState(date: string): PuzzleState {
  return { date, attempts: [], solved: false, failed: false, startTime: Date.now(), endTime: null };
}

export function loadStats(): PuzzleStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { played: 0, solved: 0, streak: 0, maxStreak: 0, totalAttempts: 0, lastPlayedDate: "" };
}

export function saveStats(stats: PuzzleStats): void {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function updateStatsAfterGame(won: boolean, attemptsUsed: number): void {
  const stats = loadStats();
  stats.played++;
  stats.totalAttempts += attemptsUsed;
  if (won) {
    stats.solved++;
    stats.streak = stats.lastPlayedDate === getYesterdayDate() ? stats.streak + 1 : 1;
    stats.maxStreak = Math.max(stats.maxStreak, stats.streak);
  } else {
    stats.streak = 0;
  }
  stats.lastPlayedDate = getTodayDate();
  saveStats(stats);
}

// --- Share ---

export function generateShareText(puzzle: DailyPuzzle, state: PuzzleState): string {
  const dayNum = getDayNumber(puzzle.date);
  const eqStr = puzzle.equations
    .map(eq => `${eq.left}${eq.operator}${eq.right}=${eq.result}`)
    .join(" ");
  const status = state.solved
    ? `✅ ${state.attempts.length}/${MAX_ATTEMPTS}`
    : `❌`;
  const time = state.endTime && state.startTime
    ? Math.round((state.endTime - state.startTime) / 1000)
    : null;

  let text = `Kwizicle #${dayNum}\n${eqStr}\n${puzzle.target}=? ${status}`;
  if (time) text += `\n⏱️ ${time}s`;
  text += `\n\nPlay → kwizicle.com`;
  return text;
}
