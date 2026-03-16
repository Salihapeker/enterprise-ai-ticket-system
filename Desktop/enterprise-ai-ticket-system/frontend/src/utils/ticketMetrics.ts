import type { Ticket } from "../services/tickets";

export function computeTicketMetrics(tickets: Ticket[]) {
  const total = tickets.length;
  const krit = tickets.filter((t) => t.tag === "KRITIK_ACIL").length;
  const acil = tickets.filter((t) => t.tag === "ACIL").length;
  const normal = tickets.filter((t) => t.tag === "NORMAL").length;

  const avgUrgency =
    total === 0
      ? 0
      : tickets.reduce((a, t) => a + Number(t.urgencyScore || 0), 0) / total;

  // basit SLA risk heuristiği (demo için):
  // yüksek urgency'li ticket oranı
  const risk =
    total === 0
      ? 0
      : tickets.filter((t) => Number(t.urgencyScore || 0) >= 0.7).length /
        total;

  return { total, krit, acil, normal, avgUrgency, risk };
}
