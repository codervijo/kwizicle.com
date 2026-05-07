import React, { useState, useRef } from "react";
import { Equation, MAX_ATTEMPTS } from "@/lib/puzzle";
import { AssetGlyph } from "@/components/AssetGlyph";

interface PlayablePuzzle {
  equations: Equation[];
  target: string;
  answer: number;
  explanation: string;
}

interface Props {
  puzzle: PlayablePuzzle;
  attempts: number[];
  solved: boolean;
  failed: boolean;
  onAttempt: (num: number) => void;
  gameOverActions?: React.ReactNode;
}

export function PuzzleGame({ puzzle, attempts, solved, failed, onAttempt, gameOverActions }: Props) {
  const [input, setInput] = useState("");
  const [shakeInput, setShakeInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isGameOver = solved || failed;
  const attemptsLeft = MAX_ATTEMPTS - attempts.length;

  const handleSubmit = () => {
    if (isGameOver) return;
    const num = parseInt(input, 10);
    if (isNaN(num)) {
      setShakeInput(true);
      setTimeout(() => setShakeInput(false), 400);
      return;
    }
    onAttempt(num);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="flex flex-col items-center flex-1 pt-8 pb-4 px-4 gap-6">
      <div className="w-full max-w-sm rounded-2xl bg-[hsl(var(--primary))] p-6 flex flex-col items-center gap-5 animate-bounce-in shadow-lg">
        {puzzle.equations.map((eq, i) => (
          <div key={i} className="flex items-center gap-4 text-3xl sm:text-4xl">
            <AssetGlyph name={eq.left} />
            <span className="font-heading font-bold text-primary-foreground text-2xl sm:text-3xl">{eq.operator}</span>
            <AssetGlyph name={eq.right} />
            <span className="font-heading font-bold text-primary-foreground text-2xl sm:text-3xl">=</span>
            <span className="font-heading font-bold text-primary-foreground text-3xl sm:text-4xl">{eq.result}</span>
          </div>
        ))}

        <div className="flex items-center gap-4 text-3xl sm:text-4xl mt-1 border-t border-primary-foreground/20 pt-4 w-full justify-center">
          <AssetGlyph name={puzzle.target} />
          <span className="font-heading font-bold text-primary-foreground text-2xl sm:text-3xl">=</span>
          {isGameOver ? (
            <span className={`font-heading font-bold text-3xl sm:text-4xl ${solved ? "text-primary-foreground" : "text-primary-foreground/70"}`}>
              {puzzle.answer}
            </span>
          ) : (
            <span className="font-heading font-bold text-primary-foreground/60 text-3xl sm:text-4xl">?</span>
          )}
        </div>
      </div>

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

          <div className="flex items-center gap-2">
            {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => {
              const attempt = attempts[i];
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

          {attempts.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {attempts.map((a, i) => (
                <span key={i} className="text-sm px-2 py-1 rounded-md bg-destructive/10 text-destructive font-semibold line-through">
                  {a}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {isGameOver && (
        <div className="flex flex-col items-center gap-4 animate-bounce-in">
          <div className="text-center">
            <h2 className="text-2xl font-heading font-bold">
              {solved ? "🎉 Brilliant!" : "😔 Not this time"}
            </h2>
            <p className="text-muted-foreground mt-1">
              {solved
                ? `Solved in ${attempts.length}/${MAX_ATTEMPTS} ${attempts.length === 1 ? "try" : "tries"}`
                : `The answer was ${puzzle.answer}`}
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl px-4 py-3 max-w-sm text-center">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Solution: </span>
              {puzzle.explanation}
            </p>
          </div>

          {gameOverActions}
        </div>
      )}
    </div>
  );
}
