import { parse } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { useScheduleEvents } from "@/lib/api/tanstack";
import { ClientContainer } from "@/modules/calendar/components/client-container";
import { CalendarProvider } from "@/modules/calendar/contexts/calendar-context";
import { applyFilters, buildScheduleURLParams } from "@/modules/calendar/helpers/filters";
import { IScheduleFilters } from "@/modules/calendar/types";

export function ScheduleContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const dateParam = searchParams.get("date");
  const viewParam = searchParams.get("view") as "day" | "week" | null;

  const [selectedDate, setSelectedDate] = useState(() => {
    try {
      return dateParam ? parse(dateParam, "yyyy-MM-dd", new Date()) : new Date();
    } catch {
      return new Date();
    }
  });

  const [view, setView] = useState<"day" | "week">(viewParam ?? "week");

  const [filters, setFilters] = useState<IScheduleFilters>(() => {
    const initialFilters: IScheduleFilters = {};

    const category = searchParams.get("category");
    const level = searchParams.get("level");
    const instructor = searchParams.get("instructor");
    const priceMin = searchParams.get("priceMin");
    const priceMax = searchParams.get("priceMax");

    if (category) initialFilters.danceCategory = category;
    if (level) initialFilters.advancementLevel = level;
    if (instructor) initialFilters.instructorId = instructor;
    if (priceMin) initialFilters.priceMin = parseFloat(priceMin);
    if (priceMax) initialFilters.priceMax = parseFloat(priceMax);

    return initialFilters;
  });

  const { data, error } = useScheduleEvents(selectedDate);

  const filteredEvents = useMemo(() => {
    return applyFilters(data ?? [], filters);
  }, [data, filters]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    const params = buildScheduleURLParams(date, view, filters);
    router.replace(`/schedule?${params}`, { scroll: false });
  };

  const handleViewChange = (newView: "day" | "week") => {
    setView(newView);
    const params = buildScheduleURLParams(selectedDate, newView, filters);
    router.replace(`/schedule?${params}`, { scroll: false });
  };

  const handleFiltersChange = (newFilters: IScheduleFilters) => {
    setFilters(newFilters);
    const params = buildScheduleURLParams(selectedDate, view, newFilters);
    router.replace(`/schedule?${params}`, { scroll: false });
  };

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
    <div className="flex max-w-screen-2xl flex-col gap-4 m-2">
      <CalendarProvider
        events={filteredEvents}
        initialSelectedDate={selectedDate}
        initialView={view}
        initialFilters={filters}
        onDateChange={handleDateChange}
        onViewChange={handleViewChange}
        onFiltersChange={handleFiltersChange}
      >
        <ClientContainer />
      </CalendarProvider>
    </div>
  );
}
