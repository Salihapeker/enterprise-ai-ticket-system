import { NavLink, Outlet } from "react-router-dom";
import AppFooter from "./AppFooter";
import AppHeader from "./AppHeader";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition",
    isActive
      ? "bg-[var(--primary)] text-[var(--primary-text)] shadow-[0_10px_30px_-18px_color-mix(in_oklab,var(--primary)_55%,transparent)]"
      : "text-[var(--text)]/80 hover:bg-white/5",
  ].join(" ");

export default function AppShell() {
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
            <AppHeader />

            <div className="p-4">
              <Outlet />
              <AppFooter />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
