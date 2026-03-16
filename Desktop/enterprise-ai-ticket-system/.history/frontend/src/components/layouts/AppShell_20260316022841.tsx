import { NavLink, Outlet } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import { THEMES } from "../../theme/themes";
import type { ThemeId } from "../../theme/themes";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition",
    isActive
      ? "bg-[var(--brand-2)] text-white"
      : "text-slate-700 hover:bg-slate-100",
  ].join(" ");

export default function AppShell() {
  const { themeId, setThemeId } = useTheme();

  return (
    <div className="min-h-screen text-slate-900">
      <div className="w-full p-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr]">
          <aside className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500">Enterprise</div>
                <div className="text-lg font-semibold">Request Platform</div>
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

            <div className="mt-6 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
              Spring Boot + FastAPI + React
              <br />
              JWT / RBAC + NLP Prioritization
            </div>
          </aside>

          <main className="rounded-2xl border border-slate-200/70 bg-white shadow-sm">
            <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200/70 bg-white/70 p-4 backdrop-blur">
              <div>
                <div className="text-sm text-slate-500">
                  Talep Takip Platformu
                </div>
                <div className="text-base font-semibold">Control Center</div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={themeId}
                  onChange={(e) => setThemeId(e.target.value as ThemeId)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                  title="Theme"
                >
                  {THEMES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>

                <input
                  className="hidden w-72 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300 md:block"
                  placeholder="Search tickets..."
                />

                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[var(--brand-2)] to-[var(--brand)] shadow-sm" />
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
