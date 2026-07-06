import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TopBar } from "@/components/TopBar";
import { loadStats } from "@/lib/puzzle";

const queryClient = new QueryClient();

// Root layout for every route (data-router root element). Providers live here
// so they wrap all child routes via <Outlet/>. Theme + streak are read from
// localStorage AFTER mount so the prerendered (SSG) HTML and the first client
// render match — see docs/prd.md §7 (prerender seam).
export default function Layout() {
  const [isDark, setIsDark] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setStreak(loadStats().streak);
    const saved = localStorage.getItem("kwizicle-theme");
    setIsDark(saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("kwizicle-theme", isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <div className="flex flex-col min-h-[100dvh] bg-background">
          <TopBar
            streak={streak}
            onToggleTheme={() => setIsDark(d => !d)}
            isDark={isDark}
          />
          <main className="flex flex-col flex-1 min-h-0">
            <Outlet />
          </main>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
