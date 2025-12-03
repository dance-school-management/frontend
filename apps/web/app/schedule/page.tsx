"use client";
import { useState } from "react";

import { useScheduleEvents } from "@/lib/api/tanstack";
import { ClientContainer } from "@/modules/calendar/components/client-container";
import { CalendarProvider } from "@/modules/calendar/contexts/calendar-context";

export default function Page() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<"day" | "week">("week");
  const { data, error } = useScheduleEvents(selectedDate);

  if (error) {
    return (
      <div className="flex max-w-screen-2xl flex-col gap-4 m-2">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">Error loading schedule: {error.message}</div>
        </div>
      </div>
    );
  }

  return (
    <CalendarProvider
      events={data ?? []}
      initialSelectedDate={selectedDate}
      initialView={view}
      onDateChange={setSelectedDate}
      onViewChange={setView}
    >
      <div className="flex max-w-screen-2xl flex-col gap-4 m-2">
        <ClientContainer />
      </div>
    </CalendarProvider>
  );
}
