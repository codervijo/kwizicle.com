import React from "react";
import { loadStats } from "@/lib/puzzle";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function StatsPage() {
  const stats = loadStats();
  const successRate = stats.played ? Math.round((stats.solved / stats.played) * 100) : 0;
  const avgAttempts = stats.solved ? (stats.totalAttempts / stats.solved).toFixed(1) : "—";

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

      <div className="w-full bg-card border border-border rounded-xl px-4 py-3 mb-8">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Avg. Attempts</span>
          <span className="text-lg font-heading font-bold">{avgAttempts}</span>
        </div>
      </div>

      <div className="mt-4 text-center text-sm text-muted-foreground max-w-sm">
        <p>Kwizicle is a daily emoji equation puzzle. Solve the equations, figure out what each emoji equals, and answer before your 3 tries run out!</p>
      </div>
    </div>
  );
}
