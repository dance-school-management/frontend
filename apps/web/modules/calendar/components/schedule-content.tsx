import { parse } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { useScheduleEvents } from "@/lib/api/tanstack";
import { ClientContainer } from "@/modules/calendar/components/client-container";
import { CalendarProvider } from "@/modules/calendar/contexts/calendar-context";
import { applyFilters, buildScheduleURLParams } from "@/modules/calendar/helpers/filters";
import { IScheduleFilters, TScheduleType } from "@/modules/calendar/types";

export function ScheduleContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const dateParam = searchParams.get("date");
  const viewParam = searchParams.get("view") as "day" | "week" | null;
  const typeParam = searchParams.get("type");
  const initialScheduleType: TScheduleType = typeParam === "personal" || typeParam === "full" ? typeParam : "full";

  const [selectedDate, setSelectedDate] = useState(() => {
    try {
      return dateParam ? parse(dateParam, "yyyy-MM-dd", new Date()) : new Date();
    } catch {
      return new Date();
    }
  });

  const [view, setView] = useState<"day" | "week">(viewParam ?? "week");
  const [scheduleType, setScheduleType] = useState<TScheduleType>(initialScheduleType);

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
    const typedEvents = scheduleType === "personal" ? (data ?? []).filter((event) => event.owned) : (data ?? []);

    return applyFilters(typedEvents, filters);
  }, [data, filters, scheduleType]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    const params = buildScheduleURLParams(date, view, filters, scheduleType);
    router.replace(`/schedule?${params}`, { scroll: false });
  };

  const handleViewChange = (newView: "day" | "week") => {
    setView(newView);
    const params = buildScheduleURLParams(selectedDate, newView, filters, scheduleType);
    router.replace(`/schedule?${params}`, { scroll: false });
  };

  const handleFiltersChange = (newFilters: IScheduleFilters) => {
    setFilters(newFilters);
    const params = buildScheduleURLParams(selectedDate, view, newFilters, scheduleType);
    router.replace(`/schedule?${params}`, { scroll: false });
  };

  const handleScheduleTypeChange = (newType: TScheduleType) => {
    setScheduleType(newType);
    const params = buildScheduleURLParams(selectedDate, view, filters, newType);
    router.replace(`/schedule?${params}`, { scroll: false });
  };

  if (error) {
    return (
      <div className="flex flex-col">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">Error loading schedule: {error.message}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <CalendarProvider
        events={filteredEvents}
        initialSelectedDate={selectedDate}
        initialView={view}
        initialFilters={filters}
        initialScheduleType={scheduleType}
        onDateChange={handleDateChange}
        onViewChange={handleViewChange}
        onFiltersChange={handleFiltersChange}
        onScheduleTypeChange={handleScheduleTypeChange}
      >
        <ClientContainer />
      </CalendarProvider>
    </div>
  );
}
