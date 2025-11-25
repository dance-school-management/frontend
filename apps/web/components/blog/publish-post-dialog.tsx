"use client";

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
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { cn } from "@repo/ui/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Clock8Icon } from "lucide-react";
import { useState } from "react";

interface PublishPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPublishNow: () => Promise<void>;
  onSchedule: (publishedAt: string) => Promise<void>;
  isLoading: boolean;
}

export function PublishPostDialog({
  open,
  onOpenChange,
  onPublishNow,
  onSchedule,
  isLoading,
}: PublishPostDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");

  const handleSchedule = async () => {
    if (!selectedDate || !selectedTime) {
      return;
    }

    // Combine date and time
    const [hours, minutes] = selectedTime.split(":").map(Number);
    const scheduledDate = new Date(selectedDate);
    scheduledDate.setHours(hours ?? 0, minutes, 0, 0);

    // Validate that scheduled date is in the future
    if (scheduledDate <= new Date()) {
      return;
    }

    await onSchedule(scheduledDate.toISOString());
    // Reset form on success
    setSelectedDate(undefined);
    setSelectedTime("");
  };

  const handlePublishNow = async () => {
    await onPublishNow();
  };

  const isScheduleValid =
    selectedDate &&
    selectedTime &&
    (() => {
      const [hours, minutes] = selectedTime.split(":").map(Number);
      const scheduledDate = new Date(selectedDate);
      scheduledDate.setHours(hours ?? 0, minutes, 0, 0);
      return scheduledDate > new Date();
    })();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Publish Post</DialogTitle>
          <DialogDescription>
            Publish the post now or schedule it for later.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Schedule for (optional)</Label>
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
              <div className='relative'>
                <div className='text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50'>
                  <Clock8Icon className='size-4' />
                  <span className='sr-only'>Time</span>
                </div>
                <Input
                  type='time'
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  disabled={!selectedDate}
                  className='peer bg-background appearance-none pl-9 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
                />
              </div>
            </div>
            {selectedDate && selectedTime && !isScheduleValid && (
              <p className="text-sm text-destructive">
                Scheduled time must be in the future
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
          {isScheduleValid && (
            <Button
              onClick={handleSchedule}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? "Scheduling..." : "Schedule"}
            </Button>
          )}
          <Button
            onClick={handlePublishNow}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? "Publishing..." : "Publish Now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
