import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BarChart3, HelpCircle, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopBarProps {
  streak: number;
  onToggleTheme: () => void;
  isDark: boolean;
}

export function TopBar({ streak, onToggleTheme, isDark }: TopBarProps) {
  const location = useLocation();

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-1.5">
        <span className="text-xl font-heading font-bold tracking-tight text-foreground">
          Kwizicle
        </span>
      </Link>

      <div className="flex items-center gap-2">
        {streak > 0 && (
          <span className="flex items-center gap-1 text-sm font-semibold text-accent px-2 py-1 rounded-full bg-accent/10">
            🔥 {streak}
          </span>
        )}
        <Link
          to="/emoji-math-puzzle"
          className={cn(
            "p-2 rounded-lg transition-colors hover:bg-muted",
            location.pathname === "/emoji-math-puzzle" && "bg-muted"
          )}
        >
          <HelpCircle className="w-5 h-5 text-muted-foreground" />
        </Link>
        <Link
          to="/stats"
          className={cn(
            "p-2 rounded-lg transition-colors hover:bg-muted",
            location.pathname === "/stats" && "bg-muted"
          )}
        >
          <BarChart3 className="w-5 h-5 text-muted-foreground" />
        </Link>
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-lg transition-colors hover:bg-muted"
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-muted-foreground" />
          ) : (
            <Moon className="w-5 h-5 text-muted-foreground" />
          )}
        </button>
      </div>
    </header>
  );
}
