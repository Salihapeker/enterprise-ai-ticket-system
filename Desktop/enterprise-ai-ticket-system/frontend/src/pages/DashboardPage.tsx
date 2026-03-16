import { useEffect, useMemo, useState } from "react";
import { listTickets, type Ticket } from "../services/tickets";
import { computeTicketMetrics } from "../utils/ticketMetrics";

function fmt(n: number) {
  return Number.isFinite(n) ? n.toFixed(2) : "—";
}

export default function DashboardPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listTickets()
      .then(setTickets)
      .catch((e) => setError(String(e)));
  }, []);

  const metrics = useMemo(() => computeTicketMetrics(tickets), [tickets]);

  const recent = useMemo(() => {
    return [...tickets]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 6);
  }, [tickets]);

  return (
    <div className="grid gap-4">
      {error && (
        <pre className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200 whitespace-pre-wrap">
          {error}
        </pre>
      )}

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <KpiCard
          title="Open Tickets"
          value={String(metrics.total)}
          sub={`${metrics.krit} kritik • ${metrics.acil} acil`}
        />
        <KpiCard
          title="Avg Urgency"
          value={fmt(metrics.avgUrgency)}
          sub={`Normal: ${metrics.normal}`}
        />
        <KpiCard
          title="SLA Risk"
          value={`${Math.round(metrics.risk * 100)}%`}
          sub="(demo heuristic)"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Recent */}
        <Panel title="Recent Activity" right={`${recent.length} item`}>
          <div className="grid gap-2">
            {recent.map((t) => (
              <div
                key={t.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-[var(--stroke)] bg-white/5 p-3 hover:bg-white/10"
              >
                <div className="min-w-0">
                  <div className="truncate font-semibold text-[var(--text)]">
                    {t.title}
                  </div>
                  <div className="mt-0.5 line-clamp-1 text-xs text-[var(--muted)]">
                    {t.description}
                  </div>
                  <div className="mt-1 text-[10px] text-[var(--muted)]">
                    {new Date(t.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="rounded-full border border-[var(--stroke)] bg-white/5 px-2 py-1 text-[10px] font-semibold text-[var(--text)]">
                    {t.tag}
                  </span>
                  <span className="text-xs font-semibold text-[var(--text)]">
                    {Number(t.urgencyScore).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}

            {recent.length === 0 && (
              <div className="rounded-xl border border-[var(--stroke)] bg-white/5 p-3 text-sm text-[var(--muted)]">
                Henüz ticket yok. Tickets ekranından yeni kayıt oluştur.
              </div>
            )}
          </div>
        </Panel>

        {/* AI insights */}
        <Panel title="AI Insights" right="NLP">
          <div className="grid gap-3">
            <InsightRow
              label="Kritik Oranı"
              value={`${metrics.total ? Math.round((metrics.krit / metrics.total) * 100) : 0}%`}
            />
            <InsightRow
              label="Acil Oranı"
              value={`${metrics.total ? Math.round((metrics.acil / metrics.total) * 100) : 0}%`}
            />
            <InsightRow
              label="Ortalama Urgency"
              value={fmt(metrics.avgUrgency)}
            />
            <div className="rounded-xl border border-[var(--stroke)] bg-white/5 p-3 text-xs text-[var(--muted)]">
              Bu panel, FastAPI sentiment/priority servisinden gelen metriklerle
              genişletilecek (sentiment trend, tag dağılımı, vb.).
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function KpiCard({
  title,
  value,
  sub,
}: {
  title: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--card2)] p-4 shadow-sm">
      <div className="text-xs text-[var(--muted)]">{title}</div>
      <div className="mt-1 text-3xl font-semibold tracking-tight text-[var(--text)]">
        {value}
      </div>
      <div className="mt-1 text-xs text-[var(--muted)]">{sub}</div>
    </div>
  );
}

function Panel({
  title,
  right,
  children,
}: {
  title: string;
  right?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--card2)] p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-[var(--text)]">{title}</div>
        {right && <div className="text-xs text-[var(--muted)]">{right}</div>}
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function InsightRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[var(--stroke)] bg-white/5 p-3">
      <div className="text-xs text-[var(--muted)]">{label}</div>
      <div className="text-sm font-semibold text-[var(--text)]">{value}</div>
    </div>
  );
}
