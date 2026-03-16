import axios from "axios";

export type Ticket = {
  id: string;
  title: string;
  description: string;
  urgencyScore: number;
  tag: string;
  createdAt: string;
};

const api = axios.create({
  baseURL: "http://localhost:8082",
  headers: { "Content-Type": "application/json; charset=utf-8" },
});

export async function listTickets(): Promise<Ticket[]> {
  const res = await api.get<Ticket[]>("/tickets");
  return res.data;
}

export async function createTicket(input: {
  title: string;
  description: string;
}): Promise<Ticket> {
  const res = await api.post<Ticket>("/tickets", input);
  return res.data;
}
