import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  subDays,
  subMonths,
  subWeeks,
  subYears,
  isSameWeek,
  isSameDay,
  isSameMonth,
  isSameYear,
  startOfWeek,
  startOfMonth,
  startOfYear,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  parseISO,
  differenceInMinutes,
  eachDayOfInterval,
  startOfDay,
  differenceInDays,
  isValid,
} from "date-fns";

import { TCalendarView, TEventColor } from "@/modules/calendar/types";
import type { ICalendarCell, IEvent } from "@/modules/calendar/types";
import { useCalendar } from "@/modules/calendar/contexts/calendar-context";



export function rangeText(view: TCalendarView, date: Date) {
  const formatString = "d MMM yyyy";
  let start: Date;
  let end: Date;

  switch (view) {
    case "month":
      start = startOfMonth(date);
      end = endOfMonth(date);
      break;
    case "week":
      start = startOfWeek(date);
      end = endOfWeek(date);
      break;
    case "day":
      return format(date, formatString);
    case "year":
      start = startOfYear(date);
      end = endOfYear(date);
      break;
    default:
      return "Error while formatting ";
  }

  return `${format(start, formatString)} - ${format(end, formatString)}`;
}

export function navigateDate(date: Date, view: TCalendarView, direction: "previous" | "next"): Date {
  const operations = {
    month: direction === "next" ? addMonths : subMonths,
    week: direction === "next" ? addWeeks : subWeeks,
    day: direction === "next" ? addDays : subDays,
    year: direction === "next" ? addYears : subYears,
  };

  return operations[view](date, 1);
}

export function getEventsCount(events: IEvent[], date: Date, view: TCalendarView): number {
  const compareFns = {
    day: isSameDay,
    week: isSameWeek,
    month: isSameMonth,
    year: isSameYear,
  };

  return events.filter(event => (compareFns[view](new Date(event.startDate), date) || compareFns[view](new Date(event.endDate), date))).length;
}

export function groupEvents(dayEvents: IEvent[]) {
  const sortedEvents = dayEvents.sort((a, b) => parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime());
  const groups: IEvent[][] = [];

  for (const event of sortedEvents) {
    const eventStart = parseISO(event.startDate);

    let placed = false;
    for (const group of groups) {
      const lastEventInGroup = group[group.length - 1];
      const lastEventEnd = parseISO(lastEventInGroup?.endDate ?? event.startDate);

      if (eventStart >= lastEventEnd) {
        group.push(event);
        placed = true;
        break;
      }
    }

    if (!placed) groups.push([event]);
  }

  return groups;
}

export function getEventBlockStyle(event: IEvent, day: Date, groupIndex: number, groupSize: number) {
  const startDate = parseISO(event.startDate);
  const dayStart = new Date(day.setHours(0, 0, 0, 0));
  const eventStart = startDate < dayStart ? dayStart : startDate;
  const startMinutes = differenceInMinutes(eventStart, dayStart);

  const top = (startMinutes / 1440) * 100;
  const width = 100 / groupSize;
  const left = groupIndex * width;

  return { top: `${top}%`, width: `${width}%`, left: `${left}%` };
}

// ================ Month view helper functions ================ //

export function getCalendarCells(selectedDate: Date): ICalendarCell[] {
  const currentYear = selectedDate.getFullYear();
  const currentMonth = selectedDate.getMonth();

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
  const daysInPrevMonth = getDaysInMonth(currentYear, currentMonth - 1);
  const totalDays = firstDayOfMonth + daysInMonth;

  const prevMonthCells = Array.from({ length: firstDayOfMonth }, (_, i) => ({
    day: daysInPrevMonth - firstDayOfMonth + i + 1,
    currentMonth: false,
    date: new Date(currentYear, currentMonth - 1, daysInPrevMonth - firstDayOfMonth + i + 1),
  }));

  const currentMonthCells = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    currentMonth: true,
    date: new Date(currentYear, currentMonth, i + 1),
  }));

  const nextMonthCells = Array.from({ length: (7 - (totalDays % 7)) % 7 }, (_, i) => ({
    day: i + 1,
    currentMonth: false,
    date: new Date(currentYear, currentMonth + 1, i + 1),
  }));

  return [...prevMonthCells, ...currentMonthCells, ...nextMonthCells];
}

export function calculateMonthEventPositions(multiDayEvents: IEvent[], singleDayEvents: IEvent[], selectedDate: Date) {
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);

  const eventPositions: { [key: string]: number; } = {};
  const occupiedPositions: { [key: string]: boolean[]; } = {};

  eachDayOfInterval({ start: monthStart, end: monthEnd }).forEach(day => {
    occupiedPositions[day.toISOString()] = [false, false, false];
  });

  const sortedEvents = [
    ...multiDayEvents.sort((a, b) => {
      const aDuration = differenceInDays(parseISO(a.endDate), parseISO(a.startDate));
      const bDuration = differenceInDays(parseISO(b.endDate), parseISO(b.startDate));
      return bDuration - aDuration || parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime();
    }),
    ...singleDayEvents.sort((a, b) => parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime()),
  ];

  sortedEvents.forEach(event => {
    const eventStart = parseISO(event.startDate);
    const eventEnd = parseISO(event.endDate);
    const eventDays = eachDayOfInterval({
      start: eventStart < monthStart ? monthStart : eventStart,
      end: eventEnd > monthEnd ? monthEnd : eventEnd,
    });

    let position = -1;

    for (let i = 0; i < 3; i++) {
      if (
        eventDays.every(day => {
          const dayPositions = occupiedPositions[startOfDay(day).toISOString()];
          return dayPositions && !dayPositions[i];
        })
      ) {
        position = i;
        break;
      }
    }

    if (position !== -1) {
      eventDays.forEach(day => {
        const dayKey = startOfDay(day).toISOString();
        const dayPositions = occupiedPositions[dayKey];
        if (!dayPositions) return;
        dayPositions[position] = true;
      });
      eventPositions[event.id] = position;
    }
  });

  return eventPositions;
}

export function getMonthCellEvents(date: Date, events: IEvent[], eventPositions: Record<string, number>) {
  const eventsForDate = events.filter(event => {
    const eventStart = parseISO(event.startDate);
    const eventEnd = parseISO(event.endDate);
    return (date >= eventStart && date <= eventEnd) || isSameDay(date, eventStart) || isSameDay(date, eventEnd);
  });

  return eventsForDate
    .map(event => ({
      ...event,
      position: eventPositions[event.id] ?? -1,
      isMultiDay: event.startDate !== event.endDate,
    }))
    .sort((a, b) => {
      if (a.isMultiDay && !b.isMultiDay) return -1;
      if (!a.isMultiDay && b.isMultiDay) return 1;
      return a.position - b.position;
    });
}


export function formatTime(date: Date | string) {
  if (typeof date === 'string') {
    date = parseISO(date);
  }

  if (!isValid(date)) return '';

  return format(date, "HH:mm");
}

export const getFirstLetters = (str: string): string => {
  if (!str) return '';

  const words = str.split(" ");

  const firstWord = words[0] ?? '';
  const secondWord = words[1] ?? '';

  if (words.length === 1) {
    return firstWord.charAt(0).toUpperCase();
  }

  const firstLetterFirstWord = firstWord.charAt(0).toUpperCase();
  const firstLetterSecondWord = secondWord.charAt(0).toUpperCase();

  return `${firstLetterFirstWord}${firstLetterSecondWord}`;
};

export const getEventsForDay = (events: IEvent[], date: Date, isWeek = false): IEvent[] => {
  return events.filter((event) => {
    const startOfDayForEventStartDate = startOfDay(event.startDate);
    const startOfDayForEventEndDate = startOfDay(event.endDate);
    const targetDate = startOfDay(date);

    if (isWeek) return (event.startDate !== event.endDate) && (startOfDayForEventStartDate <= targetDate && startOfDayForEventEndDate >= targetDate);
    else return startOfDayForEventStartDate <= targetDate && startOfDayForEventEndDate >= targetDate;
  }).map((event) => {
    let point = undefined;

    if (isSameDay(new Date(event.startDate).setHours(0, 0, 0, 0), new Date(event.endDate).setHours(0, 0, 0, 0))) {
      point = 'none';
    } else if (isSameDay(new Date(event.startDate).setHours(0, 0, 0, 0), new Date(date))) {
      point = 'start';
    } else if (isSameDay(new Date(event.endDate).setHours(0, 0, 0, 0), new Date(date))) {
      point = 'end';
    }

    return {
      ...event,
      point,
    };
  }) as IEvent[];
};

export const getWeekDates = (date: Date): Date[] => {
  const startDate = startOfWeek(date, { weekStartsOn: 0 });
  const weekDates: Date[] = [];

  for (let i = 0; i < 7; i++) {
    weekDates.push(addDays(startDate, i));
  }

  return weekDates;
};

export const getEventsForWeek = (events: IEvent[], date: Date): IEvent[] => {
  const weekDates = getWeekDates(date);
  const startOfWeek = weekDates[0] ?? new Date();
  const endOfWeek = weekDates[6] ?? new Date();

  return events.filter((event) => {
    return new Date(event.startDate) <= endOfWeek && new Date(event.endDate) >= startOfWeek;
  });
};

export const getEventsForMonth = (events: IEvent[], date: Date): IEvent[] => {
  const startOfMonthDate = startOfMonth(date);
  const endOfMonthDate = endOfMonth(date);

  return events.filter((event) => {
    return new Date(event.startDate) < endOfMonthDate && new Date(event.endDate) > startOfMonthDate;
  });
};

export const getEventsForYear = (events: IEvent[], date: Date): IEvent[] => {
  if (!events || !Array.isArray(events) || !isValid(date)) {
    return [];
  }

  const year = date.getFullYear();
  const startOfYearDate = startOfYear(new Date(year, 0, 1));
  const endOfYearDate = endOfYear(new Date(year, 0, 1));

  return events.filter((event) => {
    const eventStart = parseISO(event.startDate);
    const eventEnd = parseISO(event.endDate);

    if (!isValid(eventStart) || !isValid(eventEnd)) {
      return false;
    }

    return eventStart <= endOfYearDate && eventEnd >= startOfYearDate;
  });
};

export const getColorClass = (color: string): string => {
  const colorClasses: Record<TEventColor, string> = {
    red: 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300',
    yellow: 'border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-300',
    green: 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300',
    blue: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300',
    orange: 'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-300',
    purple: 'border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300',
  };
  return colorClasses[color as TEventColor] || '';
};

export const getBgColor = (color: string): string => {
  const colorClasses: Record<TEventColor, string> = {
    red: 'bg-red-400 dark:bg-red-600',
    yellow: 'bg-yellow-400 dark:bg-yellow-600',
    green: 'bg-green-400 dark:bg-green-600',
    blue: 'bg-blue-400 dark:bg-blue-600',
    orange: 'bg-orange-400 dark:bg-orange-600',
    purple: 'bg-purple-400 dark:bg-purple-600',
  };
  return colorClasses[color as TEventColor] || '';
};

export const useGetEventsByMode = (events: IEvent[]) => {
  const { view, selectedDate } = useCalendar();

  switch (view) {
    case 'day': {
      return getEventsForDay(events, selectedDate);
    }
    case 'week': {
      return getEventsForWeek(events, selectedDate);
    }
    case 'month': {
      return getEventsForMonth(events, selectedDate);
    }
    case 'year': {
      return getEventsForYear(events, selectedDate);
    }
    default: {
      return [];
    }
  }
};
