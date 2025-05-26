import React, { useState, useEffect, useMemo } from "react";
import { FormLabel } from "@repo/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { cn } from "@repo/ui/lib/utils";

const generateTimeOptions = (step: number) => {
  const options: string[] = [];
  for (let hour = 8; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += step) {
      const time = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      options.push(time);
    }
  }
  return options;
};

export interface TimeRangePickerProps {
  initialStartTime?: string;
  initialEndTime?: string;
  onTimeRangeChange?: (timeRange: string) => void;
  sort?: boolean;
  startTimeLabel?: string;
  startTimePlaceholder?: string;
  endTimeLabel?: string;
  endTimePlaceholder?: string;
  layout?: "row" | "column";
  step?: number;
  labelClassName?: string;
}

export const TimeRangePicker: React.FC<TimeRangePickerProps> = ({
  initialStartTime = "00:00",
  initialEndTime = "23:30",
  onTimeRangeChange,
  sort = false,
  startTimeLabel = "Start Time",
  startTimePlaceholder = "Select start time",
  endTimeLabel = "End Time",
  endTimePlaceholder = "Select end time",
  step = 30,
  labelClassName,
}) => {
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialEndTime);

  const timeOptions = useMemo(() => generateTimeOptions(step), [step]);

  const sortTimes = (start: string, end: string): [string, string] => {
    return start <= end ? [start, end] : [end, start];
  };

  const formatTimeRange = (start: string, end: string): string =>
    `${start}-${end}`;

  const handleTimeChange = (newStartTime: string, newEndTime: string) => {
    const [sortedStart, sortedEnd] = sort
      ? sortTimes(newStartTime, newEndTime)
      : [newStartTime, newEndTime];

    setStartTime(sortedStart);
    setEndTime(sortedEnd);

    onTimeRangeChange?.(formatTimeRange(sortedStart, sortedEnd));
  };

  useEffect(() => {
    if (sort) {
      const [sortedStart, sortedEnd] = sortTimes(startTime, endTime);
      setStartTime(sortedStart);
      setEndTime(sortedEnd);

      onTimeRangeChange?.(formatTimeRange(sortedStart, sortedEnd));
    }
  }, [sort, startTime, endTime, onTimeRangeChange]);

  return (
    <div className="flex flex-col">
      <div className="space-y-2">
        <div className="flex flex-col space-y-2">
          {startTimeLabel && (
            <FormLabel htmlFor="start-time" className={labelClassName}>
              {startTimeLabel}
            </FormLabel>
          )}
          <Select
            value={startTime}
            onValueChange={(value) => handleTimeChange(value, endTime)}
          >
            <SelectTrigger id="start-time" className="w-full">
              <SelectValue placeholder={startTimePlaceholder} />
            </SelectTrigger>
            <SelectContent className="max-h-[200px] overflow-y-auto">
              {timeOptions.map((time) => (
                <SelectItem key={`start-${time}`} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col space-y-2">
          {endTimeLabel && (
            <FormLabel htmlFor="end-time" className={labelClassName}>
              {endTimeLabel}
            </FormLabel>
          )}
          <Select
            value={endTime}
            onValueChange={(value) => handleTimeChange(startTime, value)}
          >
            <SelectTrigger id="end-time" className="w-full mb-0">
              <SelectValue placeholder={endTimePlaceholder} />
            </SelectTrigger>
            <SelectContent className="max-h-[200px] overflow-y-auto">
              {timeOptions.map((time) => (
                <SelectItem key={`end-${time}`} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default TimeRangePicker;