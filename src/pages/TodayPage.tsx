import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  DailyPuzzle, PuzzleState, MAX_ATTEMPTS,
  getTodayDate, loadDailyPuzzle, loadPuzzleState, savePuzzleState,
  createNewPuzzleState, updateStatsAfterGame, generateShareText,
} from "@/lib/puzzle";
import { Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function TodayPage() {
  const { toast } = useToast();
  const [puzzle, setPuzzle] = useState<DailyPuzzle | null>(null);
  const [state, setState] = useState<PuzzleState | null>(null);
  const [input, setInput] = useState("");
  const [shakeInput, setShakeInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const today = getTodayDate();
    loadDailyPuzzle(today).then(p => {
      setPuzzle(p);
      const saved = loadPuzzleState();
      if (saved && saved.date === today) {
        setState(saved);
      } else {
        const fresh = createNewPuzzleState(today);
        savePuzzleState(fresh);
        setState(fresh);
      }
    });
  }, []);

  const isGameOver = state ? state.solved || state.failed : false;

  const handleSubmit = useCallback(() => {
    if (!puzzle || !state || isGameOver) return;
    const num = parseInt(input, 10);
    if (isNaN(num)) {
      setShakeInput(true);
      setTimeout(() => setShakeInput(false), 400);
      return;
    }

    const newAttempts = [...state.attempts, num];
    const solved = num === puzzle.answer;
    const failed = !solved && newAttempts.length >= MAX_ATTEMPTS;

    const newState: PuzzleState = {
      ...state,
      attempts: newAttempts,
      solved,
      failed,
      endTime: solved || failed ? Date.now() : null,
    };

    setState(newState);
    savePuzzleState(newState);
    setInput("");

    if (solved || failed) {
      updateStatsAfterGame(solved, newAttempts.length);
    }
  }, [puzzle, state, input, isGameOver]);

  const handleShare = async () => {
    if (!puzzle || !state) return;
    const text = generateShareText(puzzle, state);
    if (navigator.share) {
      try { await navigator.share({ text }); return; } catch {}
    }
    await navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!", description: "Share your result with friends" });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  if (!puzzle || !state) {
    return (
      <div className="flex items-center justify-center flex-1">
        <div className="animate-pulse text-muted-foreground text-lg">Loading puzzle…</div>
      </div>
    );
  }

  const attemptsLeft = MAX_ATTEMPTS - state.attempts.length;

  return (
    <div className="flex flex-col items-center flex-1 pt-8 pb-4 px-4 gap-6">
      {/* Equations display — styled like the reference image */}
      <div className="w-full max-w-sm rounded-2xl bg-[hsl(var(--primary))] p-6 flex flex-col items-center gap-5 animate-bounce-in shadow-lg">
        {puzzle.equations.map((eq, i) => (
          <div key={i} className="flex items-center gap-4 text-3xl sm:text-4xl">
            <span>{eq.left}</span>
            <span className="font-heading font-bold text-primary-foreground text-2xl sm:text-3xl">{eq.operator}</span>
            <span>{eq.right}</span>
            <span className="font-heading font-bold text-primary-foreground text-2xl sm:text-3xl">=</span>
            <span className="font-heading font-bold text-primary-foreground text-3xl sm:text-4xl">{eq.result}</span>
          </div>
        ))}

        {/* Target question */}
        <div className="flex items-center gap-4 text-3xl sm:text-4xl mt-1 border-t border-primary-foreground/20 pt-4 w-full justify-center">
          <span>{puzzle.target}</span>
          <span className="font-heading font-bold text-primary-foreground text-2xl sm:text-3xl">=</span>
          {isGameOver ? (
            <span className={`font-heading font-bold text-3xl sm:text-4xl ${state.solved ? "text-primary-foreground" : "text-primary-foreground/70"}`}>
              {puzzle.answer}
            </span>
          ) : (
            <span className="font-heading font-bold text-primary-foreground/60 text-3xl sm:text-4xl">?</span>
          )}
        </div>
      </div>

      {/* Input area */}
      {!isGameOver && (
        <div className="flex flex-col items-center gap-3 w-full max-w-xs">
          <div className={`flex items-center gap-2 w-full ${shakeInput ? "animate-shake" : ""}`}>
            <input
              ref={inputRef}
              type="number"
              inputMode="numeric"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="?"
              autoFocus
              className="flex-1 h-14 text-center text-2xl font-heading font-bold rounded-xl border-2 border-border bg-card text-foreground focus:border-primary focus:outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              onClick={handleSubmit}
              className="h-14 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity active:scale-95"
            >
              Go
            </button>
          </div>

          {/* Attempt indicators */}
          <div className="flex items-center gap-2">
            {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => {
              const attempt = state.attempts[i];
              const isWrong = attempt !== undefined && attempt !== puzzle.answer;
              return (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    attempt === undefined
                      ? "bg-border"
                      : isWrong
                      ? "bg-destructive"
                      : "bg-correct"
                  }`}
                />
              );
            })}
            <span className="text-sm text-muted-foreground ml-1">
              {attemptsLeft} {attemptsLeft === 1 ? "try" : "tries"} left
            </span>
          </div>

          {/* Previous wrong guesses */}
          {state.attempts.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {state.attempts.map((a, i) => (
                <span key={i} className="text-sm px-2 py-1 rounded-md bg-destructive/10 text-destructive font-semibold line-through">
                  {a}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Game over */}
      {isGameOver && (
        <div className="flex flex-col items-center gap-4 animate-bounce-in">
          <div className="text-center">
            <h2 className="text-2xl font-heading font-bold">
              {state.solved ? "🎉 Brilliant!" : "😔 Not this time"}
            </h2>
            <p className="text-muted-foreground mt-1">
              {state.solved
                ? `Solved in ${state.attempts.length}/${MAX_ATTEMPTS} ${state.attempts.length === 1 ? "try" : "tries"}`
                : `The answer was ${puzzle.answer}`}
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl px-4 py-3 max-w-sm text-center">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Solution: </span>
              {puzzle.explanation}
            </p>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity active:scale-95"
          >
            <Share2 className="w-5 h-5" />
            Share Result
          </button>
        </div>
      )}
    </div>
  );
}
