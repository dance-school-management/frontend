import { TicketList } from "@/components/tickets/ticket-list";

import { fetchTickets } from "@/lib/api/enroll";
import { headers } from "next/headers";

export default async function Page() {
  const cookie = (await headers()).get('cookie') ?? "";
  const { data, error } = await fetchTickets(cookie);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const { tickets } = data;

  const futureTickets = tickets.filter((ticket) => new Date(ticket.endDate).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0));

  return <TicketList tickets={futureTickets} />;
}
