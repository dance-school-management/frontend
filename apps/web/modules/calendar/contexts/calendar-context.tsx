"use client";

import { createContext, useContext, useState } from "react";

import type { IEvent, IUser } from "@/modules/calendar/interfaces";
import { TCalendarView } from "@/modules/calendar/types";

interface ICalendarContext {
    selectedDate: Date;
    view: TCalendarView;
    setView: (view: TCalendarView) => void;
    isAgendaMode: boolean;
    toggleAgendaMode: (isAgenda?: boolean) => void;
    setSelectedDate: (date: Date | undefined) => void;
    badgeVariant: "dot" | "colored";
    users: IUser[];
    events: IEvent[];
}

const CalendarContext = createContext({} as ICalendarContext);

export function CalendarProvider({
    children,
    users,
    events,
    badge = "colored",
    view = "day",
}: {
    children: React.ReactNode;
    users: IUser[];
    events: IEvent[];
    view?: TCalendarView;
    badge?: "dot" | "colored";
}) {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentView, setCurrentView] = useState(view);
    const [isAgendaMode, setAgendaMode] = useState(false);

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
    };

    const setView = (view: TCalendarView) => {
        setCurrentView(view);
    };

    const value = {
        selectedDate,
        setSelectedDate: handleSelectDate,
        badgeVariant: badge,
        users,
        events,
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
