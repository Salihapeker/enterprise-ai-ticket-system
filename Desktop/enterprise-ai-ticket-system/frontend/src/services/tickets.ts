export type Ticket = {
  id: string;
  title: string;
  description: string;
  urgencyScore: number;
  tag: string;
  createdAt: string;
};

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8082";

export async function listTickets(): Promise<Ticket[]> {
  const res = await fetch(`${BASE_URL}/tickets`);
  if (!res.ok) throw new Error(`listTickets failed: ${res.status}`);
  return res.json();
}

export async function createTicket(input: {
  title: string;
  description: string;
}): Promise<Ticket> {
  const res = await fetch(`${BASE_URL}/tickets`, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`createTicket failed: ${res.status} ${text}`);
  }
  return res.json();
}
