import { useEffect, useMemo, useState } from "react";
import { createTicket, listTickets, type Ticket } from "../services/tickets";

type Tag = "NORMAL" | "ACIL" | "KRITIK_ACIL";

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

function tagBadge(tag: string) {
  switch (tag) {
    case "KRITIK_ACIL":
      return "bg-red-600 text-white border-red-600";
    case "ACIL":
      return "bg-orange-500 text-white border-orange-500";
    default:
      return "bg-slate-100 text-slate-800 border-slate-200";
  }
}

function scoreColor(score: number) {
  if (score >= 0.75) return "bg-red-600";
  if (score >= 0.5) return "bg-orange-500";
  return "bg-slate-900";
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : d.toLocaleString();
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [tagFilter, setTagFilter] = useState<Tag | "ALL">("ALL");
  const [minUrgency, setMinUrgency] = useState<number>(0);

  // Modal state
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
    const normal = tickets.filter((t) => t.tag === "NORMAL").length;
    const avg =
      total === 0
        ? 0
        : tickets.reduce((a, t) => a + Number(t.urgencyScore || 0), 0) / total;
    return { total, krit, acil, normal, avg };
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
      {/* Header + KPIs */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Tickets</h2>
          <p className="text-sm text-slate-600">
            AI (NLP) ile otomatik önceliklendirme: tag + urgencyScore
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refresh().catch((e) => setError(String(e)))}
            className="rounded-lg border px-3 py-2 text-sm hover:bg-slate-50"
          >
            Yenile
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="rounded-lg bg-indigo-600 px-3 py-2 text-sm text-white hover:bg-indigo-500 shadow-sm"
          >
            + Yeni Ticket
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <KpiCard label="Toplam" value={String(stats.total)} />
        <KpiCard label="KRITIK" value={String(stats.krit)} />
        <KpiCard label="ACIL" value={String(stats.acil)} />
        <KpiCard label="Ortalama Skor" value={stats.avg.toFixed(2)} />
      </div>

      {/* Filters */}
      <div className="rounded-2xl border bg-white p-4">
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
            <div className="text-sm text-slate-600">
              Min urgency: {minUrgency.toFixed(2)}
            </div>
            <input
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
        <pre className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800 whitespace-pre-wrap">
          {error}
        </pre>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-[var(--stroke)] bg-[var(--card2)] shadow-sm">
        <div className="border-b px-4 py-3 text-sm text-slate-600">
          Gösterilen:{" "}
          <span className="font-semibold text-slate-900">
            {filtered.length}
          </span>{" "}
          / {tickets.length}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-600">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Tag</th>
                <th className="px-4 py-3">Urgency</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filtered.map((t) => {
                const score = clamp01(Number(t.urgencyScore || 0));
                return (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">
                        {t.title}
                      </div>
                      <div className="mt-1 line-clamp-2 max-w-[680px] text-xs text-slate-600">
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
                        <div className="w-32 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-2 ${scoreColor(score)}`}
                            style={{ width: `${Math.round(score * 100)}%` }}
                          />
                        </div>
                        <span className="font-semibold tabular-nums">
                          {score.toFixed(2)}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-slate-600">
                      {formatDate(t.createdAt)}
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-slate-600" colSpan={4}>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-4">
              <div className="text-base font-semibold">Yeni Ticket</div>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg border px-2 py-1 text-sm hover:bg-slate-50"
              >
                Kapat
              </button>
            </div>

            <form onSubmit={onCreate} className="grid gap-3 p-4">
              <input
                className="rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Başlık"
                required
                maxLength={120}
              />
              <textarea
                className="rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
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
                  className="rounded-lg border px-4 py-2 text-sm hover:bg-slate-50"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white disabled:opacity-60"
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
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 text-3xl font-semibold tracking-tight">{value}</div>
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
          ? "bg-indigo-600 text-white border-indigo-600"
          : "bg-white text-slate-700 hover:bg-slate-50",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
