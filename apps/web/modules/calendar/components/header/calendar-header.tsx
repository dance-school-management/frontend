import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/select";
import { motion } from "framer-motion";
import { Clock, Filter } from "lucide-react";

import { slideFromLeft, slideFromRight, transition } from "@/modules/calendar/animations";
import { DateNavigator } from "@/modules/calendar/components/header/date-navigator";
import { HourRangeSelector } from "@/modules/calendar/components/header/hour-range-selector";
import { ScheduleFilters } from "@/modules/calendar/components/header/schedule-filters";
import { TodayButton } from "@/modules/calendar/components/header/today-button";
import { useCalendar } from "@/modules/calendar/contexts/calendar-context";
import type { IEvent } from "@/modules/calendar/types";

interface CalendarHeaderProps {
  events: IEvent[];
}

const MODE_OPTIONS = [
  { value: "calendar", label: "Calendar" },
  { value: "agenda", label: "Agenda" },
] as const;

const VIEW_OPTIONS = [
  { value: "day", label: "Day", displayLabel: "Day View" },
  { value: "week", label: "Week", displayLabel: "Week View" },
] as const;

export function CalendarHeader({ events }: CalendarHeaderProps) {
  const { view, setView, isAgendaMode, toggleAgendaMode, filters } = useCalendar();

  const activeFilterCount = [
    filters.danceCategory,
    filters.advancementLevel,
    filters.instructorId,
    filters.priceMin !== undefined || filters.priceMax !== undefined,
  ].filter(Boolean).length;

  const currentAgendaMode = isAgendaMode ? "agenda" : "calendar";
  const currentAgendaLabel = MODE_OPTIONS.find((opt) => opt.value === currentAgendaMode)?.label ?? "Calendar";
  const currentViewLabel = VIEW_OPTIONS.find((opt) => opt.value === view)?.displayLabel ?? "Day View";

  return (
    <div className="flex flex-col gap-4 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
      <motion.div
        className="flex items-center gap-3"
        variants={slideFromLeft}
        initial="initial"
        animate="animate"
        transition={transition}
      >
        <TodayButton />
        <DateNavigator view={view} events={events} />
      </motion.div>

      <motion.div
        className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-1.5"
        variants={slideFromRight}
        initial="initial"
        animate="animate"
        transition={transition}
      >
        <div className="options flex-wrap flex items-center gap-4 md:gap-2">
          <div className="inline-flex w-fit -space-x-px rounded-md shadow-xs rtl:space-x-reverse">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="relative rounded-none rounded-l-md">
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">Filters</span>
                  {activeFilterCount > 0 && (
                    <Badge className="absolute -top-1.5 -right-1.5 size-4 px-1 tabular-nums z-10">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4 mx-2" align="center">
                <ScheduleFilters />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="relative rounded-none">
                  <Clock className="h-4 w-4" />
                  <span className="sr-only">Display Hours</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4 mx-2" align="center">
                <HourRangeSelector />
              </PopoverContent>
            </Popover>
            <Select value={currentAgendaMode} onValueChange={(value) => toggleAgendaMode(value === "agenda")}>
              <SelectTrigger className="rounded-none border-l-0 h-9 px-3">
                <SelectValue>{currentAgendaLabel}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {MODE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={view} onValueChange={(value) => setView(value as "day" | "week")}>
              <SelectTrigger className="rounded-none rounded-r-md border-l-0 h-9 px-3">
                <SelectValue>{currentViewLabel}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {VIEW_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1"></div>
        </div>
      </motion.div>
    </div>
  );
}
