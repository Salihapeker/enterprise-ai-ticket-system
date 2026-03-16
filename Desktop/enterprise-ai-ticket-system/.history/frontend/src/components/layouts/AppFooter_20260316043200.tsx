function StatusDot({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[var(--stroke)] bg-white/5 px-3 py-1">
      <span className="h-2 w-2 rounded-full bg-emerald-400" />
      {label}
    </span>
  );
}

export default function AppFooter() {
  return (
    <footer className="mt-6 rounded-2xl border border-[var(--stroke)] bg-[var(--card2)] p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-sm font-semibold text-[var(--text)]">About</div>
          <div className="mt-1 text-xs text-[var(--muted)]">
            Telekom operatörleri için uçtan uca talep takip platformu •
            Microservices (Spring Boot + FastAPI) • React UI • JWT/RBAC • NLP
            tabanlı önceliklendirme
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--muted)]">
          <StatusDot label="ticket-service" />
          <StatusDot label="ai-service" />
          <span className="opacity-80">v0.1</span>
        </div>
      </div>
    </footer>
  );
}
