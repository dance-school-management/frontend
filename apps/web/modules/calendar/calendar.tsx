"use client";

import { CalendarProvider } from "@/modules/calendar/contexts/calendar-context";
import { ClientContainer } from "@/modules/calendar/components/client-container";
import { useScheduleEvents } from "@/lib/api/tanstack";
import { useState } from "react";

export default function Calendar() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [view, setView] = useState<'day' | 'week'>('week');
    const { data: events = [], error } = useScheduleEvents(selectedDate);

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
            events={events}
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