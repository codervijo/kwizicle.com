import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TopBar } from "@/components/TopBar";
import { loadStats } from "@/lib/puzzle";
import TodayPage from "@/pages/TodayPage";
import StatsPage from "@/pages/StatsPage";
import HowToPlayPage from "@/pages/HowToPlayPage";
import ExtrasPage from "@/pages/ExtrasPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function AppLayout() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("kwizicle-theme");
      if (saved) return saved === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("kwizicle-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const stats = loadStats();

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <TopBar
        streak={stats.streak}
        onToggleTheme={() => setIsDark(d => !d)}
        isDark={isDark}
      />
      <main className="flex flex-col flex-1 min-h-0">
        <Routes>
          <Route path="/" element={<Navigate to="/today" replace />} />
          <Route path="/today" element={<TodayPage />} />
          <Route path="/extras" element={<ExtrasPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/how-to-play" element={<HowToPlayPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
