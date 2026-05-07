import { assets } from "./assets";

export type RenderMode = "emoji" | "png";

const GLOBAL_DEFAULT: RenderMode = "emoji";

export function resolveRenderMode(name: string): RenderMode {
  return assets[name]?.render ?? GLOBAL_DEFAULT;
}
