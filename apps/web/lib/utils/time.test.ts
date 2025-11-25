import { describe, expect, test } from 'vitest';

import { fmtDate, fmtTime } from './time';

describe('fmtTime', () => {
  test('extracts time in HH:MM format from ISO datetime string', () => {
    expect(fmtTime('2024-01-01T14:30:45.123Z')).toBe('14:30');
    expect(fmtTime('2024-12-31T09:15:30.000Z')).toBe('09:15');
    expect(fmtTime('2024-06-15T23:59:59.999Z')).toBe('23:59');
    expect(fmtTime('2024-03-20T00:00:00.000Z')).toBe('00:00');
  });

  test('handles time without milliseconds', () => {
    expect(fmtTime('2024-01-01T14:30:45Z')).toBe('14:30');
    expect(fmtTime('2024-12-31T09:15:30Z')).toBe('09:15');
  });

  test('handles single digit hours and minutes', () => {
    expect(fmtTime('2024-01-01T05:03:45.123Z')).toBe('05:03');
    expect(fmtTime('2024-01-01T01:09:45.123Z')).toBe('01:09');
  });

  test('removes seconds and milliseconds', () => {
    expect(fmtTime('2024-01-01T14:30:45.123Z')).toBe('14:30');
    expect(fmtTime('2024-01-01T14:30:45.999999Z')).toBe('14:30');
    expect(fmtTime('2024-01-01T14:30:59.123Z')).toBe('14:30');
  });
});

describe('fmtDate', () => {
  test('extracts date in YYYY-MM-DD format from ISO datetime string', () => {
    expect(fmtDate('2024-01-01T14:30:45.123Z')).toBe('2024-01-01');
    expect(fmtDate('2024-12-31T09:15:30.000Z')).toBe('2024-12-31');
    expect(fmtDate('2024-06-15T23:59:59.999Z')).toBe('2024-06-15');
  });

  test('handles dates at midnight', () => {
    expect(fmtDate('2024-03-20T00:00:00.000Z')).toBe('2024-03-20');
    expect(fmtDate('2024-03-20T00:00:00Z')).toBe('2024-03-20');
  });

  test('handles dates with different times', () => {
    expect(fmtDate('2024-01-01T14:30:45.123Z')).toBe('2024-01-01');
    expect(fmtDate('2024-01-01T23:59:59.999Z')).toBe('2024-01-01');
    expect(fmtDate('2024-01-01T00:00:00.000Z')).toBe('2024-01-01');
  });

  test('works with leap year dates', () => {
    expect(fmtDate('2024-02-29T14:30:45.123Z')).toBe('2024-02-29');
    expect(fmtDate('2024-02-29T00:00:00.000Z')).toBe('2024-02-29');
  });
});
