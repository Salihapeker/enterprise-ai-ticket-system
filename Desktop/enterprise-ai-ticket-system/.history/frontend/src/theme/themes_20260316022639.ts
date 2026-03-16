export type ThemeId = "turkcell" | "turktelekom" | "vodafone";

export type Theme = {
  id: ThemeId;
  label: string;
  vars: Record<string, string>;
};

export const THEMES: Theme[] = [
  {
    id: "turkcell",
    label: "Turkcell",
    vars: {
      "--brand": "#FFD100",
      "--brand-2": "#0057B8",
      "--bg": "#FFD100", // full background base (Turkcell yellow)
      "--bg-2": "#FFF3B0", // lighter for gradient
      "--card": "#FFFFFF",
      "--text": "#0F172A",
      "--muted": "#475569",
      "--border": "rgba(15, 23, 42, 0.12)",
    },
  },
  {
    id: "turktelekom",
    label: "Türk Telekom",
    vars: {
      "--brand": "#00A0DF",
      "--brand-2": "#001A72",
      "--bg": "#005AAE", // TT blue base
      "--bg-2": "#2AA7FF", // lighter for gradient
      "--card": "#FFFFFF",
      "--text": "#0F172A",
      "--muted": "#475569",
      "--border": "rgba(15, 23, 42, 0.12)",
    },
  },
  {
    id: "vodafone",
    label: "Vodafone",
    vars: {
      "--brand": "#E60000",
      "--brand-2": "#111827",
      "--bg": "#E60000", // Vodafone red base
      "--bg-2": "#FF6B6B", // lighter for gradient
      "--card": "#FFFFFF",
      "--text": "#0F172A",
      "--muted": "#475569",
      "--border": "rgba(15, 23, 42, 0.12)",
    },
  },
];

export function getTheme(id: ThemeId): Theme {
  return THEMES.find((x) => x.id === id) ?? THEMES[0];
}
