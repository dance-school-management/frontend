"use client";

import { isSameDay, parseISO } from "date-fns";

import { AgendaEvents } from "@/modules/calendar/components/agenda-view/agenda-events";
import { CalendarHeader } from "@/modules/calendar/components/header/calendar-header";
import { CalendarDayView } from "@/modules/calendar/components/week-and-day-view/calendar-day-view";
import { CalendarWeekView } from "@/modules/calendar/components/week-and-day-view/calendar-week-view";
import { useCalendar } from "@/modules/calendar/contexts/calendar-context";

export function ClientContainer() {
  const { selectedDate, view, isAgendaMode, events } = useCalendar();

  const filteredEvents = events.filter((event) => {
    const itemStartDate = new Date(event.startDate);
    const itemEndDate = new Date(event.endDate);

    const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const monthEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);

    const isInSelectedMonth = itemStartDate <= monthEnd && itemEndDate >= monthStart;
    return isInSelectedMonth;
  });

  const singleDayEvents = filteredEvents.filter((event) => {
    const startDate = parseISO(event.startDate);
    const endDate = parseISO(event.endDate);
    return isSameDay(startDate, endDate);
  });

  const multiDayEvents = filteredEvents.filter((event) => {
    const startDate = parseISO(event.startDate);
    const endDate = parseISO(event.endDate);
    return !isSameDay(startDate, endDate);
  });

  return (
    <div className="w-full border-b">
      <CalendarHeader events={filteredEvents} />
      {isAgendaMode ?
        <div key="agenda">
          <AgendaEvents />
        </div>
      : <div key={view}>
          {view === "week" && <CalendarWeekView singleDayEvents={singleDayEvents} multiDayEvents={multiDayEvents} />}
          {view === "day" && <CalendarDayView singleDayEvents={singleDayEvents} multiDayEvents={multiDayEvents} />}
        </div>
      }
    </div>
  );
}
