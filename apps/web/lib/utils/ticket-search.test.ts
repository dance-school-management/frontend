import { Ticket } from '@/lib/model/enroll';
import { describe, expect, test } from 'vitest';
import { searchAndSortTickets } from './ticket-search';

describe('searchAndSortTickets', () => {
  const tickets = [
    { name: 'Ballet Fundamentals', endDate: '2021-01-01T00:00:00.000Z' },
    { name: 'Jazz Intermediate', endDate: '2021-01-02T00:00:00.000Z' },
    { name: 'Hip Hop Advanced', endDate: '2021-01-03T00:00:00.000Z' },
    { name: 'Contemporary Basics', endDate: '2021-01-04T00:00:00.000Z' },
    { name: 'Tap Dance Workshop', endDate: '2021-01-05T00:00:00.000Z' },
  ] as Ticket[];

  describe('empty search query', () => {
    test('returns all tickets when search query is empty string', () => {
      const result = searchAndSortTickets(tickets, '');
      expect(result).toHaveLength(5);
      expect(result[0]?.name).toBe('Ballet Fundamentals');
      expect(result[4]?.name).toBe('Tap Dance Workshop');
    });

    test('returns all tickets when search query is only whitespace', () => {
      const result = searchAndSortTickets(tickets, '   ');
      expect(result).toHaveLength(5);
      expect(result[0]?.name).toBe('Ballet Fundamentals');
    });

    test('sorts tickets by endDate in ascending order when query is empty', () => {
      const shuffled = [...tickets].reverse();
      const result = searchAndSortTickets(shuffled, '');

      expect(result[0]?.endDate).toBe('2021-01-01T00:00:00.000Z');
      expect(result[1]?.endDate).toBe('2021-01-02T00:00:00.000Z');
      expect(result[2]?.endDate).toBe('2021-01-03T00:00:00.000Z');
      expect(result[3]?.endDate).toBe('2021-01-04T00:00:00.000Z');
      expect(result[4]?.endDate).toBe('2021-01-05T00:00:00.000Z');
    });
  });

  describe('search with matches', () => {
    test('filters tickets that match the search query', () => {
      const result = searchAndSortTickets(tickets, 'Jazz');
      expect(result).toHaveLength(1);
      expect(result[0]?.name).toBe('Jazz Intermediate');
    });

    test('filters tickets with partial matches', () => {
      const result = searchAndSortTickets(tickets, 'Fund');
      expect(result).toHaveLength(1);
      expect(result[0]?.name).toBe('Ballet Fundamentals');
    });

    test('filters tickets by partial class name', () => {
      const result = searchAndSortTickets(tickets, 'Dance');
      expect(result).toHaveLength(1);
      expect(result[0]?.name).toBe('Tap Dance Workshop');
    });

    test('is case insensitive', () => {
      const result1 = searchAndSortTickets(tickets, 'jazz');
      const result2 = searchAndSortTickets(tickets, 'JAZZ');
      const result3 = searchAndSortTickets(tickets, 'Jazz');

      expect(result1).toEqual(result2);
      expect(result2).toEqual(result3);
      expect(result1[0]?.name).toBe('Jazz Intermediate');
    });

    test('handles multi-word search queries', () => {
      const result = searchAndSortTickets(tickets, 'Ballet Fundamentals');
      expect(result).toHaveLength(1);
      expect(result[0]?.name).toBe('Ballet Fundamentals');
    });

    test('searches across multiple words in class names', () => {
      const result = searchAndSortTickets(tickets, 'Tap Dance');
      expect(result).toHaveLength(1);
      expect(result[0]?.name).toBe('Tap Dance Workshop');
    });
  });

  describe('sorting by similarity', () => {
    test('sorts by similarity score (higher similarity first)', () => {
      const testTickets: Ticket[] = [
        { name: 'Ballet Fundamentals', endDate: '2021-01-01T00:00:00.000Z' },
        { name: 'Advanced Ballet Techniques', endDate: '2021-01-02T00:00:00.000Z' },
      ] as Ticket[];

      const result = searchAndSortTickets(testTickets, 'Ballet Fundamentals');

      expect(result).toHaveLength(2);
      expect(result[0]?.name).toBe('Ballet Fundamentals'); // Higher similarity (2.0)
      expect(result[1]?.name).toBe('Advanced Ballet Techniques'); // Lower similarity (1.0)
    });

    test('sorts by similarity when multiple partial matches exist', () => {
      // Search for "Ballet" - exact match for "Ballet Fundamentals"
      const result = searchAndSortTickets(tickets, 'Ballet');

      expect(result).toHaveLength(1);
      expect(result[0]?.name).toBe('Ballet Fundamentals');
    });

    test('sorts by endDate when similarity scores are equal', () => {
      const ticketsWithSameSimilarity: Ticket[] = [
        { name: 'Advanced Technique', endDate: '2021-01-03T00:00:00.000Z' },
        { name: 'Advanced Ballet', endDate: '2021-01-01T00:00:00.000Z' },
        { name: 'Advanced Jazz', endDate: '2021-01-02T00:00:00.000Z' },
      ] as Ticket[];

      const result = searchAndSortTickets(ticketsWithSameSimilarity, 'Advanced');

      expect(result).toHaveLength(3);
      expect(result[0]?.name).toBe('Advanced Ballet'); // Earliest date
      expect(result[1]?.name).toBe('Advanced Jazz');
      expect(result[2]?.name).toBe('Advanced Technique'); // Latest date
    });
  });

  describe('no matches', () => {
    test('returns empty array when no tickets match', () => {
      const result = searchAndSortTickets(tickets, 'XYZ');
      expect(result).toHaveLength(0);
    });

    test('returns empty array for non-matching query', () => {
      const result = searchAndSortTickets(tickets, 'NonExistentName');
      expect(result).toHaveLength(0);
    });
  });

  describe('edge cases', () => {
    test('handles empty ticket array', () => {
      const result = searchAndSortTickets([], 'Ballet');
      expect(result).toHaveLength(0);
    });

    test('handles empty ticket array with empty query', () => {
      const result = searchAndSortTickets([], '');
      expect(result).toHaveLength(0);
    });

    test('handles single ticket', () => {
      const singleTicket = [tickets[0]!];
      const result = searchAndSortTickets(singleTicket, 'Ballet');
      expect(result).toHaveLength(1);
      expect(result[0]?.name).toBe('Ballet Fundamentals');
    });

    test('handles tickets with same end date', () => {
      const sameDateTickets = [
        { name: 'Class A', endDate: '2021-01-01T00:00:00.000Z' },
        { name: 'Class B', endDate: '2021-01-01T00:00:00.000Z' },
      ] as Ticket[];

      const result = searchAndSortTickets(sameDateTickets, 'Class');
      expect(result).toHaveLength(2);
      // When dates are equal and similarity is equal, order should be stable
      expect(result.map(t => t.name)).toEqual(['Class A', 'Class B']);
    });

    test('handles extra whitespace in search query', () => {
      const result1 = searchAndSortTickets(tickets, '  Ballet  ');
      const result2 = searchAndSortTickets(tickets, 'Ballet');

      expect(result1).toEqual(result2);
    });
  });
});