import { ClassPaymentCard } from "@/components/tickets/payment";
import { Ticket } from "@/lib/model/enroll";

interface PaymentListProps {
  tickets: Ticket[];
}

export function PaymentList({ tickets }: PaymentListProps) {

  if (tickets.length === 0) {
    return (
      <EmptyState />
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 grid-flow-row h-full p-4">
      {tickets.map((ticket) => (
        <ClassPaymentCard key={ticket.qrCodeUUID} ticket={ticket} />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 grid-flow-row h-full p-4">
      <p className="text-muted-foreground">No pending payments found</p>
    </div>
  );
}