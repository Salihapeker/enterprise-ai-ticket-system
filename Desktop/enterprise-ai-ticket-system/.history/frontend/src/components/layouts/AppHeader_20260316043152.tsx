import { useTheme } from "../../hooks/useTheme";
import { THEMES } from "../../theme/themes";
import type { ThemeId } from "../../theme/themes";

export default function AppHeader() {
  const { themeId, setThemeId } = useTheme();

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--stroke)] bg-black/20 p-4 backdrop-blur">
      <div>
        <div className="text-sm text-[var(--muted)]">Talep Takip Platformu</div>
        <div className="text-base font-semibold tracking-tight text-[var(--text)]">
          Control Center
        </div>
      </div>

      <div className="flex items-center gap-2">
        <select
          value={themeId}
          onChange={(e) => setThemeId(e.target.value as ThemeId)}
          className="rounded-lg border border-[var(--stroke)] bg-white/5 px-3 py-2 text-sm text-[var(--text)] outline-none focus:ring-2 focus:ring-[var(--primary)]"
          title="Theme"
        >
          {THEMES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>

        <input
          className="hidden w-72 rounded-lg border border-[var(--stroke)] bg-white/5 px-3 py-2 text-sm text-[var(--text)] outline-none placeholder:text-white/40 focus:ring-2 focus:ring-[var(--primary)] md:block"
          placeholder="Search tickets..."
        />

        <div
          className="h-9 w-9 rounded-full shadow-sm"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, var(--accent2), var(--accent))",
          }}
        />
      </div>
    </header>
  );
}
