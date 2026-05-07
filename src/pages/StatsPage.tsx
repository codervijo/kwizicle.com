import React from "react";
import { loadStats } from "@/lib/puzzle";
import { getSolvedExtras } from "@/lib/extras";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function StatsPage() {
  const stats = loadStats();
  const successRate = stats.played ? Math.round((stats.solved / stats.played) * 100) : 0;
  const avgAttempts = stats.solved ? (stats.totalAttempts / stats.solved).toFixed(1) : "—";
  const extrasSolved = getSolvedExtras().size;

  return (
    <div className="flex flex-col items-center flex-1 px-4 py-6 max-w-md mx-auto">
      <div className="w-full flex items-center mb-6">
        <Link to="/today" className="p-2 -ml-2 rounded-lg hover:bg-muted">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-heading font-bold mx-auto pr-9">Statistics</h1>
      </div>

      <div className="grid grid-cols-4 gap-4 w-full mb-8">
        {[
          { label: "Played", value: stats.played },
          { label: "Solved %", value: successRate },
          { label: "Streak", value: stats.streak },
          { label: "Max Streak", value: stats.maxStreak },
        ].map(({ label, value }) => (
          <div key={label} className="flex flex-col items-center">
            <span className="text-3xl font-heading font-bold">{value}</span>
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      <div className="w-full bg-card border border-border rounded-xl px-4 py-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Avg. Attempts</span>
          <span className="text-lg font-heading font-bold">{avgAttempts}</span>
        </div>
      </div>

      <Link
        to="/extras"
        className="w-full bg-card border border-border rounded-xl px-4 py-3 mb-8 flex justify-between items-center hover:bg-muted transition-colors"
      >
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="w-4 h-4 text-accent" />
          Extras solved
        </span>
        <span className="text-lg font-heading font-bold">{extrasSolved}</span>
      </Link>

      <div className="mt-4 text-center text-sm text-muted-foreground max-w-sm">
        <p>Kwizicle is a daily emoji equation puzzle. Solve the equations, figure out what each emoji equals, and answer before your 3 tries run out!</p>
      </div>
    </div>
  );
}
