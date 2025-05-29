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
      {tickets.map((ticket, id) => (
        <TicketPreview key={id} ticket={ticket} />
      ))}
    </div>
  );
}
