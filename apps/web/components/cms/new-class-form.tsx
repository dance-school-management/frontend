import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@repo/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/form";
import { Input } from "@repo/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { ClassTemplate } from "@/lib/model/product";
import { useAdditionalProductData, useInstructors } from "@/lib/api/tanstack";
import { MultiSelect } from "@repo/ui/multi-select";
import { TimeRangePicker } from "@repo/ui/time-range";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/components/popover";
import { cn } from "@repo/ui/lib/utils";
import { Calendar } from "@repo/ui/calendar";

const newClassFormSchema = z.object({
  groupNumber: z.number().min(1, "Group number is required"),
  date: z.string().min(1, "Start date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  peopleLimit: z.number().min(1, "People limit is required"),
  classRoomId: z.number().min(1, "Class room is required"),
  instructorIds: z.array(z.string()).min(1, "At least one instructor is required"),
});

type NewClassFormValues = z.infer<typeof newClassFormSchema>;

interface NewClassFormProps {
  classTemplate: ClassTemplate;
  onSuccess?: () => void;
}

export function NewClassForm({ classTemplate, onSuccess }: NewClassFormProps) {
  const { data: instructorsData, isLoading, error } = useInstructors();
  const { data, isLoading: isClassRoomsLoading, error: classRoomsError } = useAdditionalProductData();

  const form = useForm<NewClassFormValues>({
    resolver: zodResolver(newClassFormSchema),
    defaultValues: {
      groupNumber: undefined,
      peopleLimit: undefined,
      classRoomId: undefined,
      instructorIds: [],
      date: "",
      startTime: "",
      endTime: "",
    },
  });

  if (isLoading || !instructorsData || isClassRoomsLoading || !data) {
    return;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (classRoomsError) {
    return <div>Error: {classRoomsError.message}</div>;
  }

  const onSubmit = async (data: NewClassFormValues) => {
    console.log(data, classTemplate.id);
    // TODO: Implement API call to create new class
    onSuccess?.();
  };

  return (
    <div className="space-y-6 p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="groupNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Group Number</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={e => field.onChange(Number(e.target.value))}
                    placeholder="Enter group number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon />
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      className="flex w-auto flex-col space-y-2 p-2"
                    >
                      <Select
                        onValueChange={(value) =>
                          field.onChange(addDays(new Date(), parseInt(value)))
                        }
                      >
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
          <TimeRangePicker
            initialStartTime={form.getValues("startTime")}
            initialEndTime={form.getValues("endTime")}
            onTimeRangeChange={(timeRange) => {
              form.setValue("startTime", timeRange.split("-")[0]!);
              form.setValue("endTime", timeRange.split("-")[1]!);
            }}
            step={15}
            layout="column"
          />
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
                    onChange={e => field.onChange(Number(e.target.value))}
                    placeholder="Enter people limit"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="classRoomId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class Room</FormLabel>
                <Select onValueChange={(value) => field.onChange(Number(value))}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a class room" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {data.classRooms.map((room) => (
                      <SelectItem key={room.id} value={String(room.id)}>
                        {room.name} (Limit: {room.peopleLimit})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="instructorIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instructors</FormLabel>
                <MultiSelect onValueChange={field.onChange} value={field.value} options={instructorsData.instructors.map((instructor) => ({
                  label: instructor.name + " " + instructor.surname,
                  value: instructor.id,
                }))}
                  placeholder="Select instructors"
                />
                <FormMessage />
              </FormItem>
            )}
          />
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