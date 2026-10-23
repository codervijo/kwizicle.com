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

  // v0.D vocabulary — single-codepoint emoji (Unicode ≤ 10, no variation
  // selectors) so they render consistently across platforms.
  apple:      { emoji: "🍎" },
  banana:     { emoji: "🍌" },
  cherries:   { emoji: "🍒" },
  grapes:     { emoji: "🍇" },
  lemon:      { emoji: "🍋" },
  strawberry: { emoji: "🍓" },
  watermelon: { emoji: "🍉" },
  pineapple:  { emoji: "🍍" },
  avocado:    { emoji: "🥑" },
  corn:       { emoji: "🌽" },
  donut:      { emoji: "🍩" },
  cookie:     { emoji: "🍪" },
  cake:       { emoji: "🍰" },
  taco:       { emoji: "🌮" },
  ice_cream:  { emoji: "🍦" },
  rabbit:     { emoji: "🐰" },
  fox:        { emoji: "🦊" },
  frog:       { emoji: "🐸" },
  owl:        { emoji: "🦉" },
  penguin:    { emoji: "🐧" },
  panda:      { emoji: "🐼" },
  lion:       { emoji: "🦁" },
  monkey:     { emoji: "🐵" },
  unicorn:    { emoji: "🦄" },
  bee:        { emoji: "🐝" },
  octopus:    { emoji: "🐙" },
  turtle:     { emoji: "🐢" },
  cactus:     { emoji: "🌵" },
  mushroom:   { emoji: "🍄" },
  rocket:     { emoji: "🚀" },
  soccer:     { emoji: "⚽" },
  basketball: { emoji: "🏀" },
  trophy:     { emoji: "🏆" },
  balloon:    { emoji: "🎈" },
  gift:       { emoji: "🎁" },
  crown:      { emoji: "👑" },
  gem:        { emoji: "💎" },
  bell:       { emoji: "🔔" },
  car:        { emoji: "🚗" },
  bike:       { emoji: "🚲" },
};

export function getEmoji(name: string): string {
  return assets[name]?.emoji ?? name;
}
