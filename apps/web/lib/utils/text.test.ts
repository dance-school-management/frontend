import { describe, expect, test } from 'vitest';

import { calculateNameSimilarity, getInitials, truncateAtWordBoundary } from './text';

describe('getInitials', () => {
  test('returns initials for standard name/surname', () => {
    expect(getInitials('John', 'Doe')).toBe('JD');
    expect(getInitials('alice', 'cooper')).toBe('AC');
    expect(getInitials('André', 'Éclair')).toBe('AÉ');
    expect(getInitials('Al', 'Bert')).toBe('AB');
    expect(getInitials('a', 'b')).toBe('AB');
  });

  test('returns empty string if both inputs are empty', () => {
    expect(getInitials('', '')).toBe('');
  });

  test('returns only surname initial if name is empty', () => {
    expect(getInitials('', 'Doe')).toBe('D');
    expect(getInitials('', 'smith')).toBe('S');
  });

  test('returns only name initial if surname is empty', () => {
    expect(getInitials('John', '')).toBe('J');
    expect(getInitials('alice', '')).toBe('A');
  });

  test('returns empty string if both name and surname are single spaces', () => {
    expect(getInitials(' ', ' ')).toBe('  ');
  });

  test('returns initial for single-letter names', () => {
    expect(getInitials('A', 'B')).toBe('AB');
    expect(getInitials('C', '')).toBe('C');
    expect(getInitials('', 'D')).toBe('D');
  });
});

describe('truncateAtWordBoundary', () => {
  test('returns text unchanged if it is shorter than maxLength', () => {
    expect(truncateAtWordBoundary('Short text', 50)).toBe('Short text');
    expect(truncateAtWordBoundary('Hello', 10)).toBe('Hello');
    expect(truncateAtWordBoundary('', 10)).toBe('');
  });

  test('returns text unchanged if it equals maxLength', () => {
    expect(truncateAtWordBoundary('Hello World', 11)).toBe('Hello World');
    expect(truncateAtWordBoundary('Test', 4)).toBe('Test');
  });

  test('truncates at word boundary when text exceeds maxLength', () => {
    expect(truncateAtWordBoundary('Hello World', 8)).toBe('Hello...');
    expect(truncateAtWordBoundary('This is a long sentence', 10)).toBe('This is a...');
    expect(truncateAtWordBoundary('One Two Three', 7)).toBe('One...');
  });

  test('truncates at maxLength with ellipsis when no space is found', () => {
    expect(truncateAtWordBoundary('Verylongword', 10)).toBe('Verylongwo...');
    expect(truncateAtWordBoundary('NoSpacesHere', 5)).toBe('NoSpa...');
  });

  test('removes trailing punctuation before adding ellipsis', () => {
    expect(truncateAtWordBoundary('Hello, World!', 10)).toBe('Hello...');
    expect(truncateAtWordBoundary('Test. This works?', 8)).toBe('Test...');
    expect(truncateAtWordBoundary('Hey; there:', 6)).toBe('Hey...');
  });

  test('handles multiple punctuation marks', () => {
    expect(truncateAtWordBoundary('Hello!!! World', 10)).toBe('Hello...');
    expect(truncateAtWordBoundary('Test... Works', 8)).toBe('Test...');
  });

  test('handles edge cases with single word', () => {
    expect(truncateAtWordBoundary('Word', 3)).toBe('Wor...');
    expect(truncateAtWordBoundary('A', 0)).toBe('...');
  });

  test('handles text with multiple spaces', () => {
    expect(truncateAtWordBoundary('Hello   World   Test', 12)).toBe('Hello  ...');
    expect(truncateAtWordBoundary('One  Two  Three', 8)).toBe('One ...');
  });
});

describe('calculateNameSimilarity', () => {
  test('returns 0 for empty search query', () => {
    expect(calculateNameSimilarity('John Doe', '')).toBe(0);
    expect(calculateNameSimilarity('John Doe', '   ')).toBe(0);
  });

  test('returns 1.0 for exact single word match', () => {
    expect(calculateNameSimilarity('John Doe', 'John')).toBe(1.0);
    expect(calculateNameSimilarity('John Doe', 'Doe')).toBe(1.0);
    expect(calculateNameSimilarity('Alice Cooper', 'Alice')).toBe(1.0);
  });

  test('returns 2.0 for exact two word match', () => {
    expect(calculateNameSimilarity('John Doe', 'John Doe')).toBe(2.0);
    expect(calculateNameSimilarity('Alice Cooper', 'Alice Cooper')).toBe(2.0);
  });

  test('returns 0.5 for partial match', () => {
    expect(calculateNameSimilarity('John Doe', 'Joh')).toBe(0.5);
    expect(calculateNameSimilarity('John Doe', 'Do')).toBe(0.5);
    expect(calculateNameSimilarity('Alice', 'Ali')).toBe(0.5);
  });

  test('handles partial match when search word is longer', () => {
    expect(calculateNameSimilarity('John', 'Johnson')).toBe(0.5);
    expect(calculateNameSimilarity('Al', 'Alice')).toBe(0.5);
  });

  test('is case insensitive', () => {
    expect(calculateNameSimilarity('John Doe', 'JOHN')).toBe(1.0);
    expect(calculateNameSimilarity('JOHN DOE', 'john')).toBe(1.0);
    expect(calculateNameSimilarity('John Doe', 'john doe')).toBe(2.0);
  });

  test('handles names with hyphens', () => {
    expect(calculateNameSimilarity('Mary-Jane Watson', 'Mary')).toBe(1.0);
    expect(calculateNameSimilarity('Mary-Jane Watson', 'Mary-Jane')).toBe(0.5); // "mary-jane" matches partially with "mary"
    expect(calculateNameSimilarity('Mary-Jane Watson', 'Mary Jane')).toBe(2.0);
  });

  test('handles names with commas', () => {
    expect(calculateNameSimilarity('Smith, John', 'Smith')).toBe(1.0);
    expect(calculateNameSimilarity('Smith, John', 'John')).toBe(1.0);
    expect(calculateNameSimilarity('Smith, John', 'Smith John')).toBe(2.0);
  });

  test('handles names with en-dash and em-dash', () => {
    expect(calculateNameSimilarity('Jean–Paul', 'Jean')).toBe(1.0);
    expect(calculateNameSimilarity('Jean–Paul', 'Paul')).toBe(1.0);
    expect(calculateNameSimilarity('Jean—Paul', 'Jean Paul')).toBe(2.0);
  });

  test('handles multiple word search queries', () => {
    expect(calculateNameSimilarity('John Michael Doe', 'John Doe')).toBe(2.0);
    expect(calculateNameSimilarity('Alice Cooper', 'Alice Smith')).toBe(1.0);
    expect(calculateNameSimilarity('John Doe', 'Jane Doe')).toBe(1.0);
  });

  test('handles partial matches in multi-word searches', () => {
    expect(calculateNameSimilarity('John Doe', 'Joh Do')).toBe(1.0);
    expect(calculateNameSimilarity('Alice Cooper', 'Ali Co')).toBe(1.0);
  });

  test('returns highest score for best match among multiple words', () => {
    expect(calculateNameSimilarity('John Smith', 'John')).toBe(1.0);
    expect(calculateNameSimilarity('John Smith', 'John Smith Junior')).toBe(2.0);
  });

  test('handles no matches', () => {
    expect(calculateNameSimilarity('John Doe', 'XYZ')).toBe(0);
    expect(calculateNameSimilarity('Alice', 'Bob Charlie')).toBe(0);
  });

  test('handles extra whitespace in search query', () => {
    expect(calculateNameSimilarity('John Doe', '  John  Doe  ')).toBe(2.0);
    expect(calculateNameSimilarity('Alice Cooper', 'Alice   Cooper')).toBe(2.0);
  });
});
