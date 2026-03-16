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
      "--bg": "#F7FAFF",
      "--card": "#FFFFFF",
      "--text": "#0F172A",
      "--muted": "#64748B",
      "--border": "rgba(15, 23, 42, 0.10)",
    },
  },
  {
    id: "turktelekom",
    label: "Türk Telekom",
    vars: {
      "--brand": "#00A0DF",
      "--brand-2": "#001A72",
      "--bg": "#F6FBFF",
      "--card": "#FFFFFF",
      "--text": "#0F172A",
      "--muted": "#64748B",
      "--border": "rgba(15, 23, 42, 0.10)",
    },
  },
  {
    id: "vodafone",
    label: "Vodafone",
    vars: {
      "--brand": "#E60000",
      "--brand-2": "#111827",
      "--bg": "#FFF7F7",
      "--card": "#FFFFFF",
      "--text": "#111827",
      "--muted": "#6B7280",
      "--border": "rgba(17, 24, 39, 0.12)",
    },
  },
];

export function getTheme(id: ThemeId): Theme {
  const t = THEMES.find((x) => x.id === id);
  return t ?? THEMES[0];
}
