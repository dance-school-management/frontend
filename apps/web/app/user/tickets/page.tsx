"use client";

import { TicketPreview } from "@/components/ticket";

import { tickets } from "./mocks";

export default function Page() {
  return (
    <div className="flex flex-col items-center gap-4 grid-flow-row h-full p-4">
      {tickets.map((ticket, id) => (
        <TicketPreview key={id} ticket={ticket} />
      ))}
    </div>
  );
}
