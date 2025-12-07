"use client";

import { Suspense } from "react";

import { ScheduleContent } from "@/modules/calendar/components/schedule-content";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex max-w-screen-2xl flex-col gap-4 m-2">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading schedule...</div>
          </div>
        </div>
      }
    >
      <ScheduleContent />
    </Suspense>
  );
}
