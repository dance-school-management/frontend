"use client";
import { useState } from "react";

import { Ticket } from "@/lib/model/enroll";
import { TicketPreview } from "@/components/tickets/ticket";
import { searchAndSortTickets } from "@/lib/utils/ticket-search";

import { Input } from "@repo/ui/input";

interface TicketListProps {
  tickets: Ticket[];
  variant?: "current" | "past";
}

export function TicketList({ tickets, variant = "current" }: TicketListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAndSortedTickets = searchAndSortTickets(tickets, searchQuery);

  return (
    <div className="flex flex-col items-center gap-4 grid-flow-row h-full p-4">
      <div className="w-full max-w-xl">
        <Input
          type="text"
          placeholder="Search tickets by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>
      {filteredAndSortedTickets.length === 0 ? (
        <EmptyState />
      ) : (
        filteredAndSortedTickets.map((ticket) => (
          <TicketPreview key={ticket.qrCodeUUID} ticket={ticket} variant={variant} />
        ))
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 grid-flow-row h-full p-4">
      <p className="text-muted-foreground">No tickets found</p>
    </div>
  );
}
