import { useEffect, useMemo, useState } from "react";
import { createTicket, listTickets, type Ticket } from "../services/tickets";

type Tag = "NORMAL" | "ACIL" | "KRITIK_ACIL";

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

function tagBadge(tag: string) {
  switch (tag) {
    case "KRITIK_ACIL":
      return "bg-red-600/20 text-red-200 border-red-500/30";
    case "ACIL":
      return "bg-orange-500/20 text-orange-200 border-orange-400/30";
    default:
      return "bg-white/10 text-[var(--text)] border-[var(--stroke)]";
  }
}

function scoreColor(score: number) {
  if (score >= 0.75) return "bg-red-500";
  if (score >= 0.5) return "bg-orange-400";
  return "bg-[var(--glow2)]";
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : d.toLocaleString();
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [tagFilter, setTagFilter] = useState<Tag | "ALL">("ALL");
  const [minUrgency, setMinUrgency] = useState<number>(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function refresh() {
    const data = await listTickets();
    setTickets(data);
  }

  useEffect(() => {
    refresh().catch((e) => setError(String(e)));
  }, []);

  const filtered = useMemo(() => {
    return tickets.filter((t) => {
      const okTag = tagFilter === "ALL" ? true : t.tag === tagFilter;
      const okUrgency = Number(t.urgencyScore || 0) >= minUrgency;
      return okTag && okUrgency;
    });
  }, [tickets, tagFilter, minUrgency]);

  const stats = useMemo(() => {
    const total = tickets.length;
    const krit = tickets.filter((t) => t.tag === "KRITIK_ACIL").length;
    const acil = tickets.filter((t) => t.tag === "ACIL").length;
    const avg =
      total === 0
        ? 0
        : tickets.reduce((a, t) => a + Number(t.urgencyScore || 0), 0) / total;
    return { total, krit, acil, avg };
  }, [tickets]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createTicket({ title, description });
      setTitle("");
      setDescription("");
      setModalOpen(false);
      await refresh();
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-4">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-[var(--text)]">
            Tickets
          </h2>
          <p className="text-sm text-[var(--muted)]">
            AI (NLP) ile otomatik önceliklendirme: tag + urgencyScore
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refresh().catch((e) => setError(String(e)))}
            className="rounded-lg border border-[var(--stroke)] bg-white/5 px-3 py-2 text-sm text-[var(--text)] hover:bg-white/10"
          >
            Yenile
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="rounded-lg bg-[var(--glow2)] px-3 py-2 text-sm text-white hover:brightness-110 shadow-[0_10px_30px_-18px_color-mix(in_oklab,var(--glow2)_60%,transparent)]"
          >
            + Yeni Ticket
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <KpiCard label="Toplam" value={String(stats.total)} />
        <KpiCard label="KRITIK" value={String(stats.krit)} />
        <KpiCard label="ACIL" value={String(stats.acil)} />
        <KpiCard label="Ortalama Skor" value={stats.avg.toFixed(2)} />
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--card2)] p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Chip
              active={tagFilter === "ALL"}
              onClick={() => setTagFilter("ALL")}
            >
              ALL
            </Chip>
            <Chip
              active={tagFilter === "NORMAL"}
              onClick={() => setTagFilter("NORMAL")}
            >
              NORMAL
            </Chip>
            <Chip
              active={tagFilter === "ACIL"}
              onClick={() => setTagFilter("ACIL")}
            >
              ACIL
            </Chip>
            <Chip
              active={tagFilter === "KRITIK_ACIL"}
              onClick={() => setTagFilter("KRITIK_ACIL")}
            >
              KRITIK
            </Chip>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-[var(--muted)]">
              Min urgency: {minUrgency.toFixed(2)}
            </div>
            <input
              className="accent-[var(--glow2)]"
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={minUrgency}
              onChange={(e) => setMinUrgency(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <pre className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200 whitespace-pre-wrap">
          {error}
        </pre>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-[var(--stroke)] bg-[var(--card2)] shadow-sm">
        <div className="border-b border-[var(--stroke)] px-4 py-3 text-sm text-[var(--muted)]">
          Gösterilen:{" "}
          <span className="font-semibold text-[var(--text)]">
            {filtered.length}
          </span>{" "}
          / {tickets.length}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/5 text-xs uppercase text-[var(--muted)]">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Tag</th>
                <th className="px-4 py-3">Urgency</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {filtered.map((t) => {
                const score = clamp01(Number(t.urgencyScore || 0));
                return (
                  <tr key={t.id} className="hover:bg-white/5">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-[var(--text)]">
                        {t.title}
                      </div>
                      <div className="mt-1 line-clamp-2 max-w-[680px] text-xs text-[var(--muted)]">
                        {t.description}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${tagBadge(t.tag)}`}
                      >
                        {t.tag}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-32 overflow-hidden rounded-full bg-white/10">
                          <div
                            className={`h-2 ${scoreColor(score)}`}
                            style={{ width: `${Math.round(score * 100)}%` }}
                          />
                        </div>
                        <span className="font-semibold tabular-nums text-[var(--text)]">
                          {score.toFixed(2)}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-[var(--muted)]">
                      {formatDate(t.createdAt)}
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-[var(--muted)]" colSpan={4}>
                    Sonuç yok. Filtreleri azalt veya yeni ticket oluştur.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-xl rounded-2xl border border-[var(--stroke)] bg-[var(--card2)] shadow-[0_30px_90px_-40px_rgba(0,0,0,0.9)] backdrop-blur">
            <div className="flex items-center justify-between border-b border-[var(--stroke)] p-4">
              <div className="text-base font-semibold text-[var(--text)]">
                Yeni Ticket
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg border border-[var(--stroke)] bg-white/5 px-2 py-1 text-sm text-[var(--text)] hover:bg-white/10"
              >
                Kapat
              </button>
            </div>

            <form onSubmit={onCreate} className="grid gap-3 p-4">
              <input
                className="rounded-lg border border-[var(--stroke)] bg-white/5 px-3 py-2 text-[var(--text)] outline-none placeholder:text-white/40 focus:ring-2 focus:ring-[var(--glow2)]"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Başlık"
                required
                maxLength={120}
              />
              <textarea
                className="rounded-lg border border-[var(--stroke)] bg-white/5 px-3 py-2 text-[var(--text)] outline-none placeholder:text-white/40 focus:ring-2 focus:ring-[var(--glow2)]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Açıklama"
                required
                maxLength={4000}
                rows={5}
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-[var(--stroke)] bg-white/5 px-4 py-2 text-sm text-[var(--text)] hover:bg-white/10"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-[var(--glow2)] px-4 py-2 text-sm text-white hover:brightness-110 disabled:opacity-60"
                >
                  {loading ? "Oluşturuluyor..." : "Oluştur"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--card2)] p-4 shadow-sm">
      <div className="text-xs text-[var(--muted)]">{label}</div>
      <div className="mt-1 text-3xl font-semibold tracking-tight text-[var(--text)]">
        {value}
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "rounded-full border px-3 py-1 text-xs font-semibold transition",
        active
          ? "border-white/10 bg-[var(--glow2)] text-white shadow-[0_10px_30px_-18px_color-mix(in_oklab,var(--glow2)_60%,transparent)]"
          : "border-[var(--stroke)] bg-white/5 text-[var(--text)] hover:bg-white/10",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
