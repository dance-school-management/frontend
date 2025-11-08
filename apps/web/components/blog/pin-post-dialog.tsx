"use client";

import { useState } from "react";
import { CalendarIcon, Clock8Icon } from "lucide-react";
import { Button } from "@repo/ui/button";
import { Calendar } from "@repo/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/popover";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/components/label";
import { cn } from "@repo/ui/lib/utils";
import { format } from "date-fns";

interface PinPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPin: (pinnedUntil: string) => Promise<void>;
  isLoading: boolean;
}

export function PinPostDialog({
  open,
  onOpenChange,
  onPin,
  isLoading,
}: PinPostDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");

  const handlePin = async () => {
    if (!selectedDate || !selectedTime) {
      return;
    }

    // Combine date and time
    const [hours, minutes] = selectedTime.split(":").map(Number);
    const pinnedUntilDate = new Date(selectedDate);
    pinnedUntilDate.setHours(hours ?? 0, minutes, 0, 0);

    // Validate that pinnedUntil date is in the future
    if (pinnedUntilDate <= new Date()) {
      return;
    }

    await onPin(pinnedUntilDate.toISOString());
    // Reset form on success
    setSelectedDate(undefined);
    setSelectedTime("");
  };

  const isPinValid =
    selectedDate &&
    selectedTime &&
    (() => {
      const [hours, minutes] = selectedTime.split(":").map(Number);
      const pinnedUntilDate = new Date(selectedDate);
      pinnedUntilDate.setHours(hours ?? 0, minutes, 0, 0);
      return pinnedUntilDate > new Date();
    })();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pin Post</DialogTitle>
          <DialogDescription>
            Pin the post until a specific date and time.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>
              Pin until <span className="text-destructive">*</span>
            </Label>
            <div className="flex flex-col gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={{ before: new Date() }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <div className="relative">
                <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50">
                  <Clock8Icon className="size-4" />
                  <span className="sr-only">Time</span>
                </div>
                <Input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  disabled={!selectedDate}
                  className="peer bg-background appearance-none pl-9 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  required
                />
              </div>
            </div>
            {selectedDate && selectedTime && !isPinValid && (
              <p className="text-sm text-destructive">
                Pinned until time must be in the future
              </p>
            )}
            {(!selectedDate || !selectedTime) && (
              <p className="text-sm text-muted-foreground">
                Both date and time are required
              </p>
            )}
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handlePin}
            disabled={isLoading || !isPinValid}
            className="w-full sm:w-auto"
          >
            {isLoading ? "Pinning..." : "Pin"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
