import { Ticket } from "../model/enroll";

export function filterTickets(tickets: Ticket[]) {
  const today = new Date().setHours(0, 0, 0, 0);

  const pastTickets: Ticket[] = [];
  const paymentPendingTickets: Ticket[] = [];
  const restTickets: Ticket[] = [];

  for (const ticket of tickets) {
    const isPast = new Date(ticket.endDate).setHours(0, 0, 0, 0) < today;
    const isPaymentPending = ticket.paymentStatus === "PENDING";

    if (isPaymentPending) {
      paymentPendingTickets.push(ticket);
    } else if (isPast) {
      pastTickets.push(ticket);
    } else {
      restTickets.push(ticket);
    }
  }

  return { pastTickets, paymentPendingTickets, restTickets };
}