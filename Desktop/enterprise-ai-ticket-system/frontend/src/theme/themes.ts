export type ThemeId = "turkcell" | "turktelekom" | "vodafone";

export type Theme = {
  id: ThemeId;
  label: string;
  vars: Record<string, string>;
};

const base = {
  "--bg": "#05060a",
  "--bg2": "#0b1020",
  "--card": "rgba(15, 23, 42, 0.72)",
  "--card2": "rgba(15, 23, 42, 0.86)",
  "--text": "#EAF0FF",
  "--muted": "rgba(234,240,255,0.72)",
  "--stroke": "rgba(255,255,255,0.10)",
};

export const THEMES: Theme[] = [
  {
    id: "turkcell",
    label: "Turkcell",
    vars: {
      ...base,
      "--primary": "#FFD100", // sarı
      "--primary-text": "#111827", // sarıda siyah yazı daha okunur
      "--accent": "#0057B8", // mavi glow
      "--accent2": "#FFD100",
    },
  },
  {
    id: "turktelekom",
    label: "Türk Telekom",
    vars: {
      ...base,
      "--primary": "#00A0DF", // TT mavi (cyan)
      "--primary-text": "#FFFFFF",
      "--accent": "#001A72",
      "--accent2": "#00A0DF",
    },
  },
  {
    id: "vodafone",
    label: "Vodafone",
    vars: {
      ...base,
      "--primary": "#E60000", // kırmızı
      "--primary-text": "#FFFFFF",
      "--accent": "#FF4D4D",
      "--accent2": "#E60000",
    },
  },
];

export function getTheme(id: ThemeId): Theme {
  return THEMES.find((x) => x.id === id) ?? THEMES[0];
}
