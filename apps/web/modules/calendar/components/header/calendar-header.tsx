import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/select";
import { motion } from "framer-motion";
import { Calendar, Clock, Filter, Info, List, UserRound, UsersRound } from "lucide-react";

import { useUserStore } from "@/lib/store";
import { slideFromLeft, slideFromRight, transition } from "@/modules/calendar/animations";
import { colorLegend, colorSwatchClasses } from "@/modules/calendar/colors";
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
  const { view, setView, isAgendaMode, toggleAgendaMode, filters, scheduleType, toggleScheduleType } = useCalendar();
  const { user } = useUserStore();

  const activeFilterCount = [
    filters.danceCategory,
    filters.advancementLevel,
    filters.instructorId,
    filters.priceMin !== undefined || filters.priceMax !== undefined,
  ].filter(Boolean).length;

  const currentAgendaMode = isAgendaMode ? "agenda" : "calendar";
  const currentAgendaLabel = MODE_OPTIONS.find((opt) => opt.value === currentAgendaMode)?.label ?? "Calendar";
  const currentViewLabel = VIEW_OPTIONS.find((opt) => opt.value === view)?.displayLabel ?? "Day View";
  const currentMobileViewLabel = VIEW_OPTIONS.find((opt) => opt.value === view)?.label ?? "Day";

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
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="relative rounded-none">
                  <Info className="size-4" />
                  <span className="sr-only">Color legend</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4 mx-2" align="center">
                <div className="space-y-3">
                  <p className="font-medium">Schedule colors</p>
                  <div className="space-y-2">
                    {colorLegend.map((item) => (
                      <div key={item.color} className="flex items-center gap-2">
                        <span className={`size-3 rounded-full border ${colorSwatchClasses[item.color] ?? ""}`} />
                        <span className="text-sm">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            {user && (
              <Button variant="outline" className="rounded-none" onClick={toggleScheduleType}>
                {scheduleType === "full" ?
                  <UsersRound className="h-4 w-4" />
                : <UserRound className="h-4 w-4" />}
                <span className="sr-only">
                  {scheduleType === "full" ? "Switch to Personal Schedule" : "Switch to Full Schedule"}
                </span>
              </Button>
            )}
            <Select value={currentAgendaMode} onValueChange={(value) => toggleAgendaMode(value === "agenda")}>
              <SelectTrigger className="hidden md:flex rounded-none border-l-0 h-9 px-3">
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
            <Button variant="outline" className="block md:hidden rounded-none" onClick={() => toggleAgendaMode()}>
              {currentAgendaMode === "calendar" ?
                <Calendar className="size-4" />
              : <List className="size-4" />}
              <span className="sr-only">
                {currentAgendaMode === "calendar"
                  ? "Switch to Agenda View"
                  : "Switch to Calendar View"}
              </span>
            </Button>
            <Select value={view} onValueChange={(value) => setView(value as "day" | "week")}>
              <SelectTrigger className="rounded-none rounded-r-md border-l-0 h-9 px-3">
                <span className="hidden md:block">{currentViewLabel}</span>
                <span className="block md:hidden">{currentMobileViewLabel}</span>
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
