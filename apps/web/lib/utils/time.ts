import {
  differenceInDays,
  differenceInMinutes,
  endOfMonth,
  format,
  isEqual,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfYear,
  subDays,
  subMonths
} from "date-fns";

import { PredefinedTimePeriod } from "@/lib/model/finance";

export function fmtTime(time: string) {
  return format(parseISO(time), 'HH:mm');
}

export function fmtDate(date: string) {
  return format(parseISO(date), 'yyyy-MM-dd');
}

export function getDateRange(period: PredefinedTimePeriod): { start: string; end: string; } {
  const today = new Date();
  let start: Date;
  let end: Date = today;

  switch (period) {
    case "7d":
      start = subDays(today, 7);
      break;
    case "30d":
      start = subDays(today, 30);
      break;
    case "90d":
      start = subDays(today, 90);
      break;
    case "this-month":
      start = startOfMonth(today);
      break;
    case "last-month":
      {
        const lastMonth = subMonths(today, 1);
        start = startOfMonth(lastMonth);
        end = endOfMonth(lastMonth);
        break;
      }
    case "this-year":
      start = startOfYear(today);
      break;
  }

  return {
    start: format(start, 'yyyy-MM-dd'),
    end: format(end, 'yyyy-MM-dd'),
  };
}

export function getPeriodFromDates(start: string | null, end: string | null): PredefinedTimePeriod {
  if (!start || !end) return "30d";

  const startDate = startOfDay(new Date(start));
  const endDate = startOfDay(new Date(end));
  const today = startOfDay(new Date());

  const diffDays = differenceInDays(endDate, startDate);

  const jan1 = startOfYear(today);
  if (isEqual(startDate, jan1) && isEqual(endDate, today)) {
    return "this-year";
  }

  if (
    isEqual(startDate, startOfMonth(today)) &&
    isEqual(endDate, today) &&
    startDate.getMonth() === today.getMonth() &&
    startDate.getFullYear() === today.getFullYear()
  ) {
    return "this-month";
  }

  const lastMonth = startOfMonth(subMonths(today, 1));
  const lastDayOfLastMonth = endOfMonth(subMonths(today, 1));
  if (isEqual(startDate, lastMonth) && isEqual(endDate, lastDayOfLastMonth)) {
    return "last-month";
  }

  if (diffDays >= 89 && diffDays <= 91) return "90d";
  if (diffDays >= 29 && diffDays <= 31) return "30d";
  if (diffDays >= 6 && diffDays <= 8) return "7d";

  return "30d";
}

export function formatDateTime(value?: string) {
  if (!value) return undefined;
  try {
    return format(parseISO(value), "d MMM yyyy, HH:mm");
  } catch {
    return value;
  }
}

export function formatDurationLabel(start?: string, end?: string) {
  if (!start || !end) return undefined;
  try {
    const startDate = parseISO(start);
    const endDate = parseISO(end);

    const totalMinutes = differenceInMinutes(endDate, startDate);

    if (totalMinutes <= 0) return undefined;

    if (totalMinutes >= 24 * 60) {
      const days = differenceInDays(endDate, startDate);
      return `~${days} day${days === 1 ? "" : "s"}`;
    }
    if (totalMinutes >= 90) {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return minutes ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    return `${totalMinutes}m`;
  } catch {
    return undefined;
  }
}