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
      "--glow": "#FFD100",
      "--glow2": "#0057B8",
      "--bg": "#05060a",
      "--bg2": "#0b1020",
      "--card": "rgba(255,255,255,0.06)",
      "--card2": "rgba(255,255,255,0.10)",
      "--text": "#EAF0FF",
      "--muted": "rgba(234,240,255,0.70)",
      "--stroke": "rgba(255,255,255,0.10)",
    },
  },
  {
    id: "turktelekom",
    label: "Türk Telekom",
    vars: {
      "--glow": "#00A0DF",
      "--glow2": "#001A72",
      "--bg": "#05060a",
      "--bg2": "#0b1020",
      "--card": "rgba(255,255,255,0.06)",
      "--card2": "rgba(255,255,255,0.10)",
      "--text": "#EAF0FF",
      "--muted": "rgba(234,240,255,0.70)",
      "--stroke": "rgba(255,255,255,0.10)",
    },
  },
  {
    id: "vodafone",
    label: "Vodafone",
    vars: {
      "--glow": "#E60000",
      "--glow2": "#FF4D4D",
      "--bg": "#05060a",
      "--bg2": "#0b1020",
      "--card": "rgba(255,255,255,0.06)",
      "--card2": "rgba(255,255,255,0.10)",
      "--text": "#FFF1F1",
      "--muted": "rgba(255,241,241,0.70)",
      "--stroke": "rgba(255,255,255,0.10)",
    },
  },
];

export function getTheme(id: ThemeId): Theme {
  return THEMES.find((x) => x.id === id) ?? THEMES[0];
}
