import { compareAsc } from "date-fns";

import { Ticket } from "@/lib/model/enroll";
import { calculateNameSimilarity } from "@/lib/utils/text";


export function searchAndSortTickets(tickets: Ticket[], searchQuery: string): Ticket[] {
  if (!searchQuery.trim()) {
    // If no search query, return all tickets sorted by date only
    return [...tickets].sort((a, b) =>
      compareAsc(a.endDate, b.endDate)
    );
  }

  // Filter tickets that have at least one matching word (partial or full)
  const filteredTickets = tickets.filter(ticket =>
    calculateNameSimilarity(ticket.name, searchQuery) > 0
  );

  // Sort by similarity score, then by end date
  return filteredTickets.sort((a, b) => {
    const similarityA = calculateNameSimilarity(a.name, searchQuery);
    const similarityB = calculateNameSimilarity(b.name, searchQuery);

    if (similarityA !== similarityB) {
      return similarityB - similarityA; // Higher similarity first
    }

    // If similarity is equal, sort by end date (newer first)
    return compareAsc(a.endDate, b.endDate);
  });
}
