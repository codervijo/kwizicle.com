import { ViteReactSSG } from "vite-react-ssg";
import { routes } from "./routes";
import "./index.css";

// ViteReactSSG owns both the build-time prerender and the client-side hydration
// (it auto-mounts to #root in the browser). No manual createRoot(...).render().
export const createRoot = ViteReactSSG({ routes });
