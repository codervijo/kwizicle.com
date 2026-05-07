import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  DailyPuzzle, PuzzleState, MAX_ATTEMPTS,
  getTodayDate, loadDailyPuzzle, loadPuzzleState, savePuzzleState,
  createNewPuzzleState, updateStatsAfterGame, generateShareText,
} from "@/lib/puzzle";
import { Share2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PuzzleGame } from "@/components/PuzzleGame";

export default function TodayPage() {
  const { toast } = useToast();
  const [puzzle, setPuzzle] = useState<DailyPuzzle | null>(null);
  const [state, setState] = useState<PuzzleState | null>(null);

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

  const handleAttempt = useCallback((num: number) => {
    if (!puzzle || !state) return;
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

    if (solved || failed) {
      updateStatsAfterGame(solved, newAttempts.length);
    }
  }, [puzzle, state]);

  const handleShare = async () => {
    if (!puzzle || !state) return;
    const text = generateShareText(puzzle, state);
    if (navigator.share) {
      try { await navigator.share({ text }); return; } catch {}
    }
    await navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!", description: "Share your result with friends" });
  };

  if (!puzzle || !state) {
    return (
      <div className="flex items-center justify-center flex-1">
        <div className="animate-pulse text-muted-foreground text-lg">Loading puzzle…</div>
      </div>
    );
  }

  const gameOverActions = (
    <div className="flex flex-col items-center gap-3 w-full">
      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity active:scale-95"
      >
        <Share2 className="w-5 h-5" />
        Share Result
      </button>
      <Link
        to="/extras"
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent/10 text-accent font-semibold text-base hover:bg-accent/20 transition-colors active:scale-95"
      >
        <Sparkles className="w-5 h-5" />
        Play another
      </Link>
    </div>
  );

  return (
    <PuzzleGame
      puzzle={puzzle}
      attempts={state.attempts}
      solved={state.solved}
      failed={state.failed}
      onAttempt={handleAttempt}
      gameOverActions={gameOverActions}
    />
  );
}
