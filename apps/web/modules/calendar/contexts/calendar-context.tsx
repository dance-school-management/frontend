"use client";

import { createContext, useContext, useEffect, useState } from "react";

import type { IEvent, IScheduleFilters } from "@/modules/calendar/types";
import { TCalendarView } from "@/modules/calendar/types";

interface ICalendarContext {
  selectedDate: Date;
  view: TCalendarView;
  setView: (view: TCalendarView) => void;
  isAgendaMode: boolean;
  toggleAgendaMode: (isAgenda?: boolean) => void;
  setSelectedDate: (date: Date | undefined) => void;
  badgeVariant: "dot" | "colored";
  events: IEvent[];
  setEvents: (events: IEvent[]) => void;
  filters: IScheduleFilters;
  setFilters: (filters: IScheduleFilters) => void;
  priceRange: { min: number; max: number };
}

const CalendarContext = createContext({} as ICalendarContext);

interface CalendarProviderProps {
  children: React.ReactNode;
  events: IEvent[];
  view?: TCalendarView;
  badge?: "dot" | "colored";
  initialSelectedDate?: Date;
  initialView?: TCalendarView;
  initialFilters?: IScheduleFilters;
  onDateChange?: (date: Date) => void;
  onViewChange?: (view: TCalendarView) => void;
  onFiltersChange?: (filters: IScheduleFilters) => void;
}

export function CalendarProvider({
  children,
  events,
  badge = "colored",
  view = "day",
  initialSelectedDate,
  initialView,
  initialFilters = {},
  onDateChange,
  onViewChange,
  onFiltersChange,
}: CalendarProviderProps) {
  const [selectedDate, setSelectedDate] = useState(initialSelectedDate || new Date());
  const [currentView, setCurrentView] = useState(initialView || view);
  const [isAgendaMode, setAgendaMode] = useState(false);
  const [currentEvents, setCurrentEvents] = useState(events);
  const [currentFilters, setCurrentFilters] = useState<IScheduleFilters>(initialFilters);

  useEffect(() => {
    if (initialSelectedDate) {
      setSelectedDate(initialSelectedDate);
    }
  }, [initialSelectedDate]);

  useEffect(() => {
    if (initialView) {
      setCurrentView(initialView);
    }
  }, [initialView]);

  useEffect(() => {
    setCurrentFilters(initialFilters);
  }, [initialFilters]);

  useEffect(() => {
    setCurrentEvents(events);
  }, [events]);

  const toggleAgendaMode = (isAgenda?: boolean) => {
    const newMode = isAgenda ?? !isAgendaMode;
    setAgendaMode(newMode);
  };

  const handleSelectDate = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    onDateChange?.(date);
  };

  const setView = (view: TCalendarView) => {
    setCurrentView(view);
    onViewChange?.(view);
  };

  const handleFiltersChange = (filters: IScheduleFilters) => {
    setCurrentFilters(filters);
    onFiltersChange?.(filters);
  };

  const value = {
    selectedDate,
    setSelectedDate: handleSelectDate,
    badgeVariant: badge,
    events: currentEvents,
    setEvents: setCurrentEvents,
    view: currentView,
    setView,
    isAgendaMode,
    toggleAgendaMode,
    filters: currentFilters,
    setFilters: handleFiltersChange,
    priceRange: { min: 0, max: 300 },
  };

  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>;
}

export function useCalendar(): ICalendarContext {
  const context = useContext(CalendarContext);
  if (!context) throw new Error("useCalendar must be used within a CalendarProvider.");
  return context;
}
