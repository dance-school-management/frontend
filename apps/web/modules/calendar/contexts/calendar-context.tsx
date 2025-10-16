"use client";

import { createContext, useContext, useState, useEffect } from "react";

import type { IEvent } from "@/modules/calendar/types";
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
}

const CalendarContext = createContext({} as ICalendarContext);

interface CalendarProviderProps {
    children: React.ReactNode;
    events: IEvent[];
    view?: TCalendarView;
    badge?: "dot" | "colored";
    initialSelectedDate?: Date;
    initialView?: TCalendarView;
    onDateChange?: (date: Date) => void;
    onViewChange?: (view: TCalendarView) => void;
}

export function CalendarProvider({
    children,
    events,
    badge = "colored",
    view = "day",
    initialSelectedDate,
    initialView,
    onDateChange,
    onViewChange,
}: CalendarProviderProps) {
    const [selectedDate, setSelectedDate] = useState(initialSelectedDate || new Date());
    const [currentView, setCurrentView] = useState(initialView || view);
    const [isAgendaMode, setAgendaMode] = useState(false);
    const [currentEvents, setCurrentEvents] = useState(events);

    // Sync internal state with parent state changes
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

    // Update events when props change
    useEffect(() => {
        setCurrentEvents(events);
    }, [events]);

    const toggleAgendaMode = (isAgenda?: boolean) => {
        const newMode = isAgenda ?? !isAgendaMode;
        if (!newMode) {
            setCurrentView(view);
        }
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
    };

    return (
        <CalendarContext.Provider value={value}>
            {children}
        </CalendarContext.Provider>
    );
}

export function useCalendar(): ICalendarContext {
    const context = useContext(CalendarContext);
    if (!context)
        throw new Error("useCalendar must be used within a CalendarProvider.");
    return context;
}
