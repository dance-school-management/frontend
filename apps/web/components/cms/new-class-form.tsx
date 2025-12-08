import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/button";
import { Calendar } from "@repo/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/form";
import { Input } from "@repo/ui/input";
import { cn } from "@repo/ui/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/select";
import { TimeRangePicker } from "@repo/ui/time-range";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { ClassRoomSelect, InstructorsSelect } from "@/components/forms/select";
import { createClass } from "@/lib/api/product";
import { ClassTemplate } from "@/lib/model/product";

import { PeopleLimitConfirmation } from "../forms/checkbox";

const newClassFormSchema = z.object({
  date: z.date({ required_error: "Start date is required" }),
  timeRange: z.string().min(1, "Time range is required"),
  peopleLimit: z.coerce.number().min(1, "People limit is required"),
  classRoomId: z.number().min(1, "Class room is required"),
  instructorIds: z.array(z.string()).min(1, "At least one instructor is required"),
  isConfirmation: z.boolean().optional(),
});

type NewClassFormValues = z.infer<typeof newClassFormSchema>;

interface NewClassFormProps {
  classTemplate: ClassTemplate;
  onSuccess?: () => void;
}

function getTime(time: string) {
  const [hours, minutes] = time.split(":");
  return {
    hours: parseInt(hours!),
    minutes: parseInt(minutes!),
  };
}

export function NewClassForm({ classTemplate }: NewClassFormProps) {
  const form = useForm<NewClassFormValues>({
    resolver: zodResolver(newClassFormSchema),
    defaultValues: {
      peopleLimit: 1,
      classRoomId: undefined,
      instructorIds: [],
      date: new Date(),
      timeRange: "16:00-17:00",
      isConfirmation: false,
    },
  });

  const onSubmit = async (data: NewClassFormValues) => {
    const [startTime, endTime] = data.timeRange.split("-")!;
    const startDate = new Date(data.date);
    const { hours: startHours, minutes: startMinutes } = getTime(startTime!);
    startDate.setHours(startHours, startMinutes, 0, 0);
    const endDate = new Date(data.date);
    const { hours: endHours, minutes: endMinutes } = getTime(endTime!);
    endDate.setHours(endHours, endMinutes, 0, 0);

    const payload = {
      classTemplateId: classTemplate.id,
      peopleLimit: data.peopleLimit,
      classRoomId: data.classRoomId,
      instructorIds: data.instructorIds,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      isConfirmation: data.isConfirmation ?? false,
      classStatus: "HIDDEN",
    };

    const { error } = await createClass(payload);
    if (error) {
      toast.error(error.message || "Failed to create class");
      return;
    }
    toast.success("Class created successfully");
    // TODO: Trigger a refetch instead of reloading the page
    window.location.reload();
  };

  return (
    <div className="space-y-6 p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon />
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="flex w-auto flex-col space-y-2 p-2">
                      <Select onValueChange={(value) => field.onChange(addDays(new Date(), parseInt(value)))}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <SelectItem value="0">Today</SelectItem>
                          <SelectItem value="1">Tomorrow</SelectItem>
                          <SelectItem value="3">In 3 days</SelectItem>
                          <SelectItem value="7">In a week</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="rounded-md border">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={field.onChange}
                          disabled={{ before: new Date() }}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="timeRange"
            render={({ field }) => {
              const [startTime, endTime] = field.value.split("-");
              return (
                <FormItem>
                  <FormControl>
                    <TimeRangePicker
                      initialStartTime={startTime}
                      initialEndTime={endTime}
                      onTimeRangeChange={(timeRange) => {
                        form.setValue("timeRange", timeRange);
                      }}
                      step={15}
                      layout="column"
                      sort={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <ClassRoomSelect form={form} name="classRoomId" label="Classroom" placeholder="Select classroom" />
          <FormField
            control={form.control}
            name="peopleLimit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>People Limit</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    placeholder="Enter people limit"
                    min={1}
                    value={field.value ?? undefined}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <PeopleLimitConfirmation
            classRoomId={form.watch("classRoomId")}
            peopleLimit={form.watch("peopleLimit")}
            form={form}
            name="isConfirmation"
            label="Confirmation needed"
            message="People limit is greater than the classroom capacity"
          />
          <InstructorsSelect form={form} name="instructorIds" label="Instructors" placeholder="Select instructors" />
          <div className="w-full">
            <Button type="submit" className="cursor-pointer">
              Create Class
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
