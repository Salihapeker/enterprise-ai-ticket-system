import React, { createContext, useEffect, useMemo, useState } from "react";
import { getTheme, type ThemeId, THEMES } from "./themes";

type ThemeCtx = {
  themeId: ThemeId;
  setThemeId: (id: ThemeId) => void;
};

export const ThemeContext = createContext<ThemeCtx | null>(null);

const KEY = "enterprise-theme";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [themeId, setThemeIdState] = useState<ThemeId>(() => {
    const saved = localStorage.getItem(KEY) as ThemeId | null;
    return saved ?? "turkcell";
  });

  const value = useMemo(
    () => ({
      themeId,
      setThemeId: (id: ThemeId) => {
        setThemeIdState(id);
        localStorage.setItem(KEY, id);
      },
    }),
    [themeId],
  );

  useEffect(() => {
    const theme = getTheme(themeId);
    const root = document.documentElement;
    for (const [k, v] of Object.entries(theme.vars))
      root.style.setProperty(k, v);
    // helpful attribute (for debugging)
    root.setAttribute("data-theme", theme.id);
  }, [themeId]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export { THEMES };
