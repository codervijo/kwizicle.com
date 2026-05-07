export interface AssetEntry {
  emoji: string;
  png?: string;
  render?: "emoji" | "png";
}

export const assets: Record<string, AssetEntry> = {
  kiwi:   { emoji: "🥝" },
  carrot: { emoji: "🥕" },
  cat:    { emoji: "🐱" },
  dog:    { emoji: "🐶" },
  pizza:  { emoji: "🍕" },
  burger: { emoji: "🍔" },
  earth:  { emoji: "🌍" },
  moon:   { emoji: "🌙" },
  guitar: { emoji: "🎸" },
  drum:   { emoji: "🥁" },
};

export function getEmoji(name: string): string {
  return assets[name]?.emoji ?? name;
}
