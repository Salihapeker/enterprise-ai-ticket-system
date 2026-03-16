export default function DashboardPage() {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card title="Open Tickets" value="—" />
        <Card title="Avg Urgency" value="—" />
        <Card title="SLA Risk" value="—" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Activity">Son aktiviteler burada görünecek.</Panel>
        <Panel title="AI Insights">Sentiment / tag dağılımı burada.</Panel>
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--card2)] p-4 shadow-sm">
      <div className="text-xs text-[var(--muted)]">{title}</div>
      <div className="mt-1 text-2xl font-semibold text-[var(--text)]">
        {value}
      </div>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--card2)] p-4">
      <div className="text-sm font-semibold text-[var(--text)]">{title}</div>
      <div className="mt-2 text-sm text-[var(--muted)]">{children}</div>
    </div>
  );
}
