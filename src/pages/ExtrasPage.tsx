import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import { MAX_ATTEMPTS } from "@/lib/puzzle";
import { ExtraPuzzle, loadExtras, markExtraSolved, pickNext, getSolvedExtras } from "@/lib/extras";
import { PuzzleGame } from "@/components/PuzzleGame";

interface SessionState {
  attempts: number[];
  solved: boolean;
  failed: boolean;
}

const FRESH_SESSION: SessionState = { attempts: [], solved: false, failed: false };

export default function ExtrasPage() {
  const [extras, setExtras] = useState<ExtraPuzzle[] | null>(null);
  const [current, setCurrent] = useState<ExtraPuzzle | null>(null);
  const [sessionSkipped, setSessionSkipped] = useState<Set<string>>(new Set());
  const [session, setSession] = useState<SessionState>(FRESH_SESSION);

  useEffect(() => {
    loadExtras().then(list => {
      setExtras(list);
      setCurrent(pickNext(list));
    });
  }, []);

  const handleAttempt = useCallback((num: number) => {
    if (!current) return;
    const newAttempts = [...session.attempts, num];
    const solved = num === current.answer;
    const failed = !solved && newAttempts.length >= MAX_ATTEMPTS;

    setSession({ attempts: newAttempts, solved, failed });

    if (solved) {
      markExtraSolved(current.id);
    }
  }, [current, session.attempts]);

  const handleNext = useCallback(() => {
    if (!extras || !current) return;
    // Skip the current one whether solved or failed; markExtraSolved already
    // filters solved ones, but we also exclude failed-this-session so the
    // user doesn't immediately see the same puzzle they just bombed.
    const skipped = new Set(sessionSkipped);
    skipped.add(current.id);
    setSessionSkipped(skipped);
    setSession(FRESH_SESSION);
    setCurrent(pickNext(extras, skipped));
  }, [extras, current, sessionSkipped]);

  if (extras === null) {
    return (
      <div className="flex items-center justify-center flex-1">
        <div className="animate-pulse text-muted-foreground text-lg">Loading extras…</div>
      </div>
    );
  }

  const totalSolved = getSolvedExtras().size;

  if (!current) {
    return (
      <div className="flex flex-col items-center flex-1 px-4 py-6 max-w-md mx-auto">
        <div className="w-full flex items-center mb-6">
          <Link to="/today" className="p-2 -ml-2 rounded-lg hover:bg-muted">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-heading font-bold mx-auto pr-9">Extras</h1>
        </div>
        <div className="flex flex-col items-center gap-4 mt-12 text-center">
          <Sparkles className="w-12 h-12 text-accent" />
          <h2 className="text-xl font-heading font-bold">All caught up!</h2>
          <p className="text-muted-foreground">
            {extras.length === 0
              ? "No extras available right now. Check back later!"
              : `You've solved all ${totalSolved} extras. New ones coming soon.`}
          </p>
          <Link
            to="/today"
            className="mt-4 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
          >
            Back to today
          </Link>
        </div>
      </div>
    );
  }

  const gameOverActions = (
    <div className="flex flex-col items-center gap-3 w-full">
      <button
        onClick={handleNext}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity active:scale-95"
      >
        <Sparkles className="w-5 h-5" />
        Play another
      </button>
      <Link
        to="/today"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Done — back to today
      </Link>
    </div>
  );

  return (
    <div className="flex flex-col flex-1">
      <div className="px-4 pt-3 flex items-center justify-between max-w-md mx-auto w-full">
        <Link to="/today" className="p-2 -ml-2 rounded-lg hover:bg-muted">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <span className="text-sm text-muted-foreground">
          Extras · {totalSolved} solved
        </span>
        <div className="w-9" />
      </div>
      <PuzzleGame
        puzzle={current}
        attempts={session.attempts}
        solved={session.solved}
        failed={session.failed}
        onAttempt={handleAttempt}
        gameOverActions={gameOverActions}
      />
    </div>
  );
}
