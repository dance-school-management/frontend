import { DayPicker } from "@repo/ui/day-picker";
import { ScrollArea } from "@repo/ui/scroll-area";
import { format, parseISO } from "date-fns";

import { CalendarTimeline } from "@/modules/calendar/components/week-and-day-view/calendar-time-line";
import { DayViewMultiDayEventsRow } from "@/modules/calendar/components/week-and-day-view/day-view-multi-day-events-row";
import { RenderGroupedEvents } from "@/modules/calendar/components/week-and-day-view/render-grouped-events";
import { useCalendar } from "@/modules/calendar/contexts/calendar-context";
import { groupEvents, isEventInHourRange } from "@/modules/calendar/helpers";
import type { IEvent } from "@/modules/calendar/types";

interface IProps {
  singleDayEvents: IEvent[];
  multiDayEvents: IEvent[];
}

export function CalendarDayView({ singleDayEvents, multiDayEvents }: IProps) {
  const { selectedDate, setSelectedDate, startHour, endHour } = useCalendar();
  const hours = Array.from({ length: endHour - startHour }, (_, i) => startHour + i);

  const dayEvents = singleDayEvents.filter((event) => {
    const eventDate = parseISO(event.startDate);
    return (
      eventDate.getDate() === selectedDate.getDate() &&
      eventDate.getMonth() === selectedDate.getMonth() &&
      eventDate.getFullYear() === selectedDate.getFullYear() &&
      isEventInHourRange(event, selectedDate, startHour, endHour)
    );
  });

  const groupedEvents = groupEvents(dayEvents);

  return (
    <div className="flex">
      <div className="flex flex-1 flex-col">
        <div>
          <DayViewMultiDayEventsRow selectedDate={selectedDate} multiDayEvents={multiDayEvents} />

          {/* Day header */}
          <div className="relative z-20 flex border-b">
            <div className="w-18"></div>
            <span className="flex-1 border-l py-2 text-center text-xs font-medium text-t-quaternary">
              {format(selectedDate, "EE")}{" "}
              <span className="font-semibold text-t-secondary">{format(selectedDate, "d")}</span>
            </span>
          </div>
        </div>

        <ScrollArea className="h-[800px]" type="always">
          <div className="flex">
            {/* Hours column */}
            <div className="relative w-18">
              {hours.map((hour, index) => (
                <div key={hour} className="relative" style={{ height: "96px" }}>
                  <div className="absolute -top-3 right-2 flex h-6 items-center">
                    {index !== 0 && (
                      <span className="text-xs text-t-quaternary">
                        {format(new Date().setHours(hour, 0, 0, 0), "HH:00")}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Day grid */}
            <div className="relative flex-1 border-l">
              <div className="relative">
                {hours.map((hour, index) => (
                  <div key={hour} className="relative" style={{ height: "96px" }}>
                    {index !== 0 && <div className="pointer-events-none absolute inset-x-0 top-0 border-b"></div>}
                    <div className="absolute inset-x-0 top-0 h-[48px] transition-colors hover:bg-bg-primary-hover" />
                    <div className="pointer-events-none absolute inset-x-0 top-1/2 border-b border-dashed border-b-tertiary"></div>
                    <div className="absolute inset-x-0 top-[48px] h-[48px] transition-colors hover:bg-bg-primary-hover" />
                  </div>
                ))}

                <RenderGroupedEvents
                  groupedEvents={groupedEvents}
                  day={selectedDate}
                  startHour={startHour}
                  endHour={endHour}
                />
              </div>

              <CalendarTimeline />
            </div>
          </div>
        </ScrollArea>
      </div>

      <div className="hidden w-72 divide-y border-l md:block">
        <DayPicker
          className="mx-auto w-fit"
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
          initialFocus
        />
        <div></div>
      </div>
    </div>
  );
}
