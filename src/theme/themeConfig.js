export const THEME_OPTIONS = [
  { id: "default", label: "Classic", emoji: "💠" },
  { id: "sunrise", label: "Sunrise", emoji: "🌅" },
  { id: "aurora", label: "Aurora", emoji: "🌌" },
  { id: "emerald", label: "Emerald", emoji: "🌿" },
  { id: "midnight", label: "Midnight", emoji: "🌙" },
];

export const isValidTheme = (themeId) => THEME_OPTIONS.some((theme) => theme.id === themeId);
