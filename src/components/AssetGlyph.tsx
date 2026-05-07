import { assets } from "@/lib/assets";
import { resolveRenderMode } from "@/lib/renderMode";

interface Props {
  name: string;
  className?: string;
}

export function AssetGlyph({ name, className }: Props) {
  const entry = assets[name];
  if (!entry) return <span className={className}>{name}</span>;

  const mode = resolveRenderMode(name);
  if (mode === "png" && entry.png) {
    return <img src={entry.png} alt={name} className={className} />;
  }
  return <span className={className}>{entry.emoji}</span>;
}
