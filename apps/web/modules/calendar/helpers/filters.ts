import { format } from "date-fns";

import { IEvent, IScheduleFilters } from "@/modules/calendar/types";

export function applyFilters(
  events: IEvent[],
  filters: IScheduleFilters
): IEvent[] {
  return events.filter((event) => {
    if (
      filters.danceCategory &&
      event.danceCategory.toLowerCase() !== filters.danceCategory.toLowerCase()
    ) {
      return false;
    }

    if (
      filters.advancementLevel &&
      event.advancementLevel.toLowerCase() !==
      filters.advancementLevel.toLowerCase()
    ) {
      return false;
    }

    if (filters.instructorId) {
      const hasInstructor = event.instructors.some(
        (instructor) => instructor.url === filters.instructorId
      );
      if (!hasInstructor) {
        return false;
      }
    }

    if (filters.priceMin !== undefined && event.price < filters.priceMin) {
      return false;
    }

    if (filters.priceMax !== undefined && event.price > filters.priceMax) {
      return false;
    }

    return true;
  });
}

export function getPriceRange(events: IEvent[]): {
  min: number;
  max: number;
} {
  if (events.length === 0) {
    return { min: 0, max: 100 };
  }

  const prices = events.map((event) => event.price);
  return {
    min: Math.floor(Math.min(...prices)),
    max: Math.ceil(Math.max(...prices)),
  };
}

export function buildScheduleURLParams(
  date: Date,
  view: "day" | "week",
  filters: IScheduleFilters = {}
): string {
  const params = new URLSearchParams();
  params.set("date", format(date, "yyyy-MM-dd"));
  params.set("view", view);

  if (filters.danceCategory) {
    params.set("category", filters.danceCategory);
  }
  if (filters.advancementLevel) {
    params.set("level", filters.advancementLevel);
  }
  if (filters.instructorId) {
    params.set("instructor", filters.instructorId);
  }
  if (filters.priceMin !== undefined) {
    params.set("priceMin", filters.priceMin.toString());
  }
  if (filters.priceMax !== undefined) {
    params.set("priceMax", filters.priceMax.toString());
  }

  return params.toString();
}
