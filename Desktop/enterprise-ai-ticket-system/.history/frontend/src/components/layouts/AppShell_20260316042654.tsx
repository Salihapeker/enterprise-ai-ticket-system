import { NavLink, Outlet } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import { THEMES } from "../../theme/themes";
import type { ThemeId } from "../../theme/themes";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition",
    isActive
      ? "bg-[var(--primary)] text-[var(--primary-text)] shadow-[0_10px_30px_-18px_color-mix(in_oklab,var(--primary)_55%,transparent)]"
      : "text-[var(--text)]/80 hover:bg-white/5",
  ].join(" ");

export default function AppShell() {
  const { themeId, setThemeId } = useTheme();

  return (
    <div className="min-h-screen text-[var(--text)]">
      <div className="w-full p-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr]">
          <aside className="rounded-2xl border border-[var(--stroke)] bg-[var(--card)] p-4 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.75)] backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-[var(--muted)]">Enterprise</div>
                <div className="text-lg font-semibold tracking-tight text-[var(--text)]">
                  Request Platform
                </div>
              </div>
            </div>

            <nav className="mt-4 grid gap-1">
              <NavLink to="/" end className={navLinkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/tickets" className={navLinkClass}>
                Tickets
              </NavLink>
              <NavLink to="/analytics" className={navLinkClass}>
                Analytics
              </NavLink>
              <NavLink to="/admin" className={navLinkClass}>
                Admin
              </NavLink>
            </nav>

            <div className="mt-6 rounded-xl border border-[var(--stroke)] bg-white/5 p-3 text-xs text-[var(--muted)]">
              Spring Boot + FastAPI + React
              <br />
              JWT / RBAC + NLP Prioritization
            </div>
          </aside>

          <main className="rounded-2xl border border-[var(--stroke)] bg-[var(--card)] shadow-[0_20px_60px_-30px_rgba(0,0,0,0.75)] backdrop-blur">
            <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--stroke)] bg-black/20 p-4 backdrop-blur">
              <div>
                <div className="text-sm text-[var(--muted)]">
                  Talep Takip Platformu
                </div>
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

            <div className="p-4">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
