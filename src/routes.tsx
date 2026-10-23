import { Navigate } from "react-router-dom";
import type { RouteRecord } from "vite-react-ssg";
import Layout from "@/App";
import HomePage from "@/pages/HomePage";
import EmojiMathPuzzlePage from "@/pages/EmojiMathPuzzlePage";
import BlogEmojiPuzzlesWithAnswers from "@/pages/BlogEmojiPuzzlesWithAnswers";
import StatsPage from "@/pages/StatsPage";
import ExtrasPage from "@/pages/ExtrasPage";
import NotFound from "@/pages/NotFound";
import { ArchivePage, PuzzleByDatePage, AnswerByDatePage } from "@/pages/ArchivePages";

// Route table for vite-react-ssg (data router). The content pages, /archive
// and /answer/<date> for past days are prerendered at build time — see
// vite.config.ts `ssgOptions.includedRoutes`. Every other route stays
// client-side-rendered and is served via Cloudflare's SPA fallback.
export const routes: RouteRecord[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "emoji-math-puzzle", element: <EmojiMathPuzzlePage /> },
      { path: "blog/emoji-puzzles-with-answers", element: <BlogEmojiPuzzlesWithAnswers /> },

      // Legacy paths → their replacements (the daily game moved to the
      // homepage; how-to-play merged into /emoji-math-puzzle).
      { path: "today", element: <Navigate to="/" replace /> },
      { path: "how-to-play", element: <Navigate to="/emoji-math-puzzle" replace /> },

      { path: "extras", element: <ExtrasPage /> },
      { path: "stats", element: <StatsPage /> },

      // Archive (see src/pages/ArchivePages.tsx). /puzzle/:date is client-only.
      { path: "archive", element: <ArchivePage /> },
      { path: "puzzle/:date", element: <PuzzleByDatePage /> },
      { path: "answer/:date", element: <AnswerByDatePage /> },

      { path: "*", element: <NotFound /> },
    ],
  },
];
