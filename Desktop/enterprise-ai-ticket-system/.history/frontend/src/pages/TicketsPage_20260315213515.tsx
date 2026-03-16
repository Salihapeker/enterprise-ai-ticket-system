import { useEffect, useMemo, useState } from "react";
import { createTicket, listTickets, type Ticket } from "../services/tickets";

function tagColor(tag: string) {
  switch (tag) {
    case "KRITIK_ACIL":
      return "bg-red-600 text-white";
    case "ACIL":
      return "bg-orange-500 text-white";
    default:
      return "bg-slate-200 text-slate-900";
  }
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const avgUrgency = useMemo(() => {
    if (tickets.length === 0) return 0;
    return (
      tickets.reduce((a, t) => a + Number(t.urgencyScore || 0), 0) /
      tickets.length
    );
  }, [tickets]);

  async function refresh() {
    const data = await listTickets();
    setTickets(data);
  }

  useEffect(() => {
    refresh().catch((e) => setError(String(e)));
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createTicket({ title, description });
      setTitle("");
      setDescription("");
      await refresh();
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-5xl p-6">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">
              Enterprise AI Ticket System
            </h1>
            <p className="text-sm text-slate-600">
              AI tag + urgencyScore ile otomatik önceliklendirme (FastAPI +
              Spring Boot)
            </p>
          </div>

          <div className="rounded-lg border bg-white px-4 py-3">
            <div className="text-xs text-slate-500">Avg urgency</div>
            <div className="text-lg font-semibold">{avgUrgency.toFixed(2)}</div>
          </div>
        </header>

        <section className="mt-6 rounded-xl border bg-white p-4">
          <h2 className="text-lg font-semibold">Yeni Ticket</h2>

          <form onSubmit={onSubmit} className="mt-3 grid gap-3">
            <input
              className="rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-400"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Başlık"
              required
              maxLength={120}
            />
            <textarea
              className="rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-400"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Açıklama"
              required
              maxLength={4000}
              rows={4}
            />
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-slate-900 px-4 py-2 text-white disabled:opacity-60"
              >
                {loading ? "Oluşturuluyor..." : "Ticket Oluştur"}
              </button>

              <button
                type="button"
                onClick={() => refresh().catch((e) => setError(String(e)))}
                className="rounded-lg border px-4 py-2"
              >
                Yenile
              </button>
            </div>
          </form>

          {error && (
            <pre className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 whitespace-pre-wrap">
              {error}
            </pre>
          )}
        </section>

        <section className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Tickets</h2>
            <div className="text-sm text-slate-600">{tickets.length} kayıt</div>
          </div>

          <div className="mt-3 grid gap-3">
            {tickets.map((t) => (
              <div key={t.id} className="rounded-xl border bg-white p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="text-base font-semibold">{t.title}</div>
                    <div className="mt-1 text-sm text-slate-700">
                      {t.description}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${tagColor(t.tag)}`}
                    >
                      {t.tag}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">
                      {Number(t.urgencyScore).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="mt-3 text-xs text-slate-500">
                  {new Date(t.createdAt).toLocaleString()}
                </div>

                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full bg-slate-900"
                    style={{
                      width: `${Math.round(Math.min(1, Math.max(0, Number(t.urgencyScore))) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}

            {tickets.length === 0 && (
              <div className="rounded-xl border bg-white p-4 text-slate-600">
                Henüz ticket yok.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
