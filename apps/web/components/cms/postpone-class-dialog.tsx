"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/button";
import { Calendar } from "@repo/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@repo/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/form";
import { Input } from "@repo/ui/input";
import { cn } from "@repo/ui/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover";
import { addMilliseconds, format, isBefore, isFuture, set, startOfDay } from "date-fns";
import { CalendarIcon, Clock8Icon } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { fmtDateTimes } from "@/lib/utils/time";

interface PostponeClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (date: Date, time: string, reason: string) => void;
  originalDuration: number;
  currentSchedule: { startDate: string; endDate: string };
}

function createDateTime(date: Date, time: string): Date | null {
  if (!time) return null;
  const timeParts = time.split(":");
  const hours = Number(timeParts[0]);
  const minutes = Number(timeParts[1] ?? 0);
  if (isNaN(hours) || isNaN(minutes)) return null;
  return set(date, { hours, minutes, seconds: 0, milliseconds: 0 });
}

const formSchema = z
  .object({
    date: z.date({ required_error: "Date is required" }).optional(),
    time: z.string().min(1, "Time is required"),
    reason: z.string().min(1, "Reason is required"),
  })
  .refine((data) => data.date !== undefined, {
    message: "Date is required",
    path: ["date"],
  })
  .refine(
    (data) => {
      if (!data.date) return false;
      const dateTime = createDateTime(data.date, data.time);
      if (!dateTime) return false;
      return isFuture(dateTime);
    },
    {
      message: "New date and time must be in the future",
      path: ["time"],
    },
  );

type FormValues = z.infer<typeof formSchema>;

export function PostponeClassDialog({
  open,
  onOpenChange,
  onConfirm,
  originalDuration,
  currentSchedule,
}: PostponeClassDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: undefined,
      time: "",
      reason: "",
    },
  });

  const date = form.watch("date");
  const time = form.watch("time");

  const newStartDateTime = useMemo(() => {
    if (!date || !time) return null;
    return createDateTime(date, time);
  }, [date, time]);

  const newEndDate = useMemo(() => {
    if (!newStartDateTime) return null;
    return addMilliseconds(newStartDateTime, originalDuration);
  }, [newStartDateTime, originalDuration]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset();
    }
    onOpenChange(newOpen);
  };

  const onSubmit = (values: FormValues) => {
    if (!values.date) return;
    onConfirm(values.date, values.time, values.reason);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Postpone Class</DialogTitle>
          <DialogDescription>Select a new date and time for this class.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <p className="font-medium text-sm">Current schedule:</p>
                <p className="text-sm text-muted-foreground">
                  {fmtDateTimes(new Date(currentSchedule.startDate), new Date(currentSchedule.endDate))}
                </p>
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        New Date<span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              type="button"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => isBefore(date, startOfDay(new Date()))}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50">
                            <Clock8Icon className="size-4" />
                            <span className="sr-only">Time</span>
                          </div>
                          <Input
                            type="time"
                            {...field}
                            disabled={!date}
                            className="peer bg-background appearance-none pl-9 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {newStartDateTime && newEndDate && (
                  <div className="space-y-1 pt-2">
                    <p className="font-medium text-sm">New schedule:</p>
                    <p className="text-sm text-muted-foreground">{fmtDateTimes(newStartDateTime, newEndDate)}</p>
                  </div>
                )}
              </div>
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Reason <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter reason for postponement" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button type="submit" className="w-full sm:w-auto">
                Confirm
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
