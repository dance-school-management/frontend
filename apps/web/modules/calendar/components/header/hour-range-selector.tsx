"use client";

import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { RadioGroup, RadioGroupItem } from "@repo/ui/radio-group";
import { useState } from "react";

import { useCalendar } from "@/modules/calendar/contexts/calendar-context";

type HourRangePreset = "full" | "business" | "afternoon" | "evening" | "morning" | "custom";

interface PresetOption {
  id: HourRangePreset;
  label: string;
  startHour: number;
  endHour: number;
}

const PRESETS: PresetOption[] = [
  { id: "business", label: "Business Hours (12-22)", startHour: 12, endHour: 22 },
  { id: "morning", label: "Morning Hours (6-12)", startHour: 6, endHour: 12 },
  { id: "afternoon", label: "Afternoon Hours (12-18)", startHour: 12, endHour: 18 },
  { id: "evening", label: "Evening Hours (18-22)", startHour: 18, endHour: 22 },
];

export function HourRangeSelector() {
  const { startHour, endHour, setHourRange } = useCalendar();
  const [selectedPreset, setSelectedPreset] = useState<HourRangePreset>(() => {
    const matchingPreset = PRESETS.find((preset) => preset.startHour === startHour && preset.endHour === endHour);
    return matchingPreset?.id || "custom";
  });
  const [customStart, setCustomStart] = useState(startHour.toString());
  const [customEnd, setCustomEnd] = useState(endHour.toString());

  const handlePresetChange = (value: HourRangePreset) => {
    setSelectedPreset(value);
    if (value !== "custom") {
      const preset = PRESETS.find((p) => p.id === value);
      if (preset) {
        setHourRange(preset.startHour, preset.endHour);
        setCustomStart(preset.startHour.toString());
        setCustomEnd(preset.endHour.toString());
      }
    }
  };

  const handleCustomApply = () => {
    const start = parseInt(customStart, 10);
    const end = parseInt(customEnd, 10);

    if (isNaN(start) || isNaN(end)) {
      return;
    }

    if (start < 0 || start > 23 || end < 1 || end > 24 || start >= end) {
      return;
    }

    setHourRange(start, end);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 font-medium">Display Hours</div>

      <RadioGroup value={selectedPreset} onValueChange={handlePresetChange}>
        <div className="flex flex-col gap-3">
          {PRESETS.map((preset) => (
            <div key={preset.id} className="flex items-center space-x-2">
              <RadioGroupItem value={preset.id} id={preset.id} />
              <Label htmlFor={preset.id} className="cursor-pointer font-normal">
                {preset.label}
              </Label>
            </div>
          ))}

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="custom" id="custom" />
            <Label htmlFor="custom" className="cursor-pointer font-normal">
              Custom Range
            </Label>
          </div>
        </div>
      </RadioGroup>

      {selectedPreset === "custom" && (
        <div className="flex flex-col gap-3 rounded-md border p-3">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Label htmlFor="customStart" className="text-xs text-muted-foreground">
                Start Hour
              </Label>
              <Input
                id="customStart"
                type="number"
                min="0"
                max="23"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="customEnd" className="text-xs text-muted-foreground">
                End Hour
              </Label>
              <Input
                id="customEnd"
                type="number"
                min="1"
                max="24"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <Button onClick={handleCustomApply} size="sm">
            Apply
          </Button>
        </div>
      )}
    </div>
  );
}
