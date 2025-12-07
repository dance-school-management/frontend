import { format } from "date-fns";
import { useEffect, useState } from "react";

import { useCalendar } from "@/modules/calendar/contexts/calendar-context";

export function CalendarTimeline() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { startHour, endHour } = useCalendar();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  const getCurrentTimePosition = () => {
    const minutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    const startMinutes = startHour * 60;
    const totalMinutes = (endHour - startHour) * 60;
    return ((minutes - startMinutes) / totalMinutes) * 100;
  };

  const formatCurrentTime = () => {
    return format(currentTime, "HH:mm");
  };

  const isWithinRange = () => {
    const currentHour = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();
    const currentTotalMinutes = currentHour * 60 + currentMinutes;
    const startMinutes = startHour * 60;
    const endMinutes = endHour * 60;
    return currentTotalMinutes >= startMinutes && currentTotalMinutes < endMinutes;
  };

  if (!isWithinRange()) {
    return null;
  }

  return (
    <div
      className="pointer-events-none absolute inset-x-0 z-50 border-t border-primary"
      style={{ top: `${getCurrentTimePosition()}%` }}
    >
      <div className="absolute -left-1.5 -top-1.5 size-3 rounded-full bg-primary"></div>

      <div className="absolute -left-18 flex w-16 -translate-y-1/2 justify-end bg-background pr-1 text-xs font-medium text-primary">
        {formatCurrentTime()}
      </div>
    </div>
  );
}
