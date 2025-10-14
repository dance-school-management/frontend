import { TicketPreview } from "@/components/ticket";

// import { tickets } from "./mocks";
import { fetchTickets } from "@/lib/api/enroll";
import { headers } from "next/headers";

export default async function Page() {
  const cookie = (await headers()).get('cookie') ?? "";
  const { data, error } = await fetchTickets(cookie);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const { tickets } = data;

  return (
    <div className="flex flex-col items-center gap-4 grid-flow-row h-full p-4">
      {tickets
        .filter((ticket) => new Date(ticket.endDate).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0))
        .map((ticket) => (
          <TicketPreview key={ticket.qrCodeUUID} ticket={ticket} />
        ))}
    </div>
  );
}
