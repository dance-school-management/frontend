import { areIntervalsOverlapping, parseISO } from "date-fns";

import { EventBlock } from "@/modules/calendar/components/week-and-day-view/event-block";
import { getEventBlockStyle } from "@/modules/calendar/helpers";
import { IEvent } from "@/modules/calendar/types";

interface RenderGroupedEventsProps {
  groupedEvents: IEvent[][];
  day: Date;
  startHour?: number;
  endHour?: number;
}

export function RenderGroupedEvents({ groupedEvents, day, startHour = 0, endHour = 24 }: RenderGroupedEventsProps) {
  return groupedEvents.map((group, groupIndex) =>
    group.map((event) => {
      let style = getEventBlockStyle(event, day, groupIndex, groupedEvents.length, startHour, endHour);
      const hasOverlap = groupedEvents.some(
        (otherGroup, otherIndex) =>
          otherIndex !== groupIndex &&
          otherGroup.some((otherEvent) =>
            areIntervalsOverlapping(
              { start: parseISO(event.startDate), end: parseISO(event.endDate) },
              { start: parseISO(otherEvent.startDate), end: parseISO(otherEvent.endDate) },
            ),
          ),
      );

      if (!hasOverlap) style = { ...style, width: "100%", left: "0%" };

      return (
        <div key={event.id} className="absolute p-1" style={style}>
          <EventBlock event={event} />
        </div>
      );
    }),
  );
}
