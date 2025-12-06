import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { ButtonGroup } from "@repo/ui/button-group";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover";
import { Toggle } from "@repo/ui/toggle";
import { motion } from "framer-motion";
import { CalendarRange, Columns, Filter, LayoutList, List } from "lucide-react";

import { buttonHover, slideFromLeft, slideFromRight, transition } from "@/modules/calendar/animations";
import { ScheduleFilters } from "@/modules/calendar/components/filters/schedule-filters";
import { DateNavigator } from "@/modules/calendar/components/header/date-navigator";
import { TodayButton } from "@/modules/calendar/components/header/today-button";
import { useCalendar } from "@/modules/calendar/contexts/calendar-context";
import type { IEvent } from "@/modules/calendar/types";

const MotionButton = motion.create(Button);

interface CalendarHeaderProps {
  events: IEvent[];
}

export function CalendarHeader({ events }: CalendarHeaderProps) {
  const { view, setView, isAgendaMode, toggleAgendaMode, filters } = useCalendar();

  const activeFilterCount = [
    filters.danceCategory,
    filters.advancementLevel,
    filters.instructorId,
    filters.priceMin !== undefined || filters.priceMax !== undefined,
  ].filter(Boolean).length;

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
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="relative">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filters</span>
                {activeFilterCount > 0 && (
                  <Badge className="absolute -top-1.5 -right-1.5 size-4 px-1 tabular-nums">{activeFilterCount}</Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4 mx-2" align="center">
              <ScheduleFilters />
            </PopoverContent>
          </Popover>
          <MotionButton
            variant="outline"
            onClick={() => toggleAgendaMode(!isAgendaMode)}
            asChild
            variants={buttonHover}
            whileHover="hover"
            whileTap="tap"
          >
            <Toggle>
              {isAgendaMode ?
                <CalendarRange />
              : <LayoutList />}
            </Toggle>
          </MotionButton>
          <ButtonGroup className="flex">
            <MotionButton
              variant={view === "day" ? "default" : "outline"}
              aria-label="View by day"
              onClick={() => {
                setView("day");
              }}
              variants={buttonHover}
              whileHover="hover"
              whileTap="tap"
            >
              <List className="h-4 w-4" />
            </MotionButton>

            <MotionButton
              variant={view === "week" ? "default" : "outline"}
              aria-label="View by week"
              onClick={() => setView("week")}
              variants={buttonHover}
              whileHover="hover"
              whileTap="tap"
            >
              <Columns className="h-4 w-4" />
            </MotionButton>
          </ButtonGroup>
        </div>
      </motion.div>
    </div>
  );
}
