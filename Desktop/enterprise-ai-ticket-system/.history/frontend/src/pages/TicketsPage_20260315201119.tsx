import { useEffect, useState } from "react";
import { createTicket, listTickets, type Ticket } from "../services/tickets";

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1>Enterprise AI Ticket System</h1>

      <form
        onSubmit={onSubmit}
        style={{ display: "grid", gap: 12, marginTop: 16 }}
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Başlık"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Açıklama"
          rows={4}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Oluşturuluyor..." : "Ticket Oluştur"}
        </button>
      </form>

      {error && (
        <pre
          style={{ marginTop: 12, color: "crimson", whiteSpace: "pre-wrap" }}
        >
          {error}
        </pre>
      )}

      <h2 style={{ marginTop: 24 }}>Tickets</h2>

      <div style={{ display: "grid", gap: 12 }}>
        {tickets.map((t) => (
          <div
            key={t.id}
            style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <strong>{t.title}</strong>
              <span>
                {t.tag} | {Number(t.urgencyScore).toFixed(2)}
              </span>
            </div>
            <div style={{ marginTop: 6 }}>{t.description}</div>
            <div style={{ marginTop: 6, fontSize: 12, opacity: 0.7 }}>
              {new Date(t.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
