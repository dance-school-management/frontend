"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";
import { SaveIcon } from "lucide-react";

import { Button } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/form";
import { Input } from "@repo/ui/input";
import { Textarea } from "@repo/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { MoneyInput } from "@/components/forms/money-input";
import { Course } from "@/lib/model/product";

const courseFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  courseStatus: z.enum(["HIDDEN", "SALE", "ONGOING", "FINISHED"]),
  customPrice: z.number().optional(),
});

type CourseFormValues = z.infer<typeof courseFormSchema>;

interface CourseDetailsFormProps {
  course: Course;
  onSuccess?: () => void;
}

export function CourseDetailsForm({ course, onSuccess }: CourseDetailsFormProps) {
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      name: course.name,
      description: course.description,
      courseStatus: course.courseStatus,
      customPrice: course.customPrice ? Number(course.customPrice) : undefined,
    },
  });

  const onSubmit = async (data: CourseFormValues) => {
    try {
      await axios.put(`/api/courses/${course.id}`, data);
    } catch {
      toast.error("Failed to update course");
    }
    toast.success("Course updated successfully");
    onSuccess?.();
  };

  return (
    <Card className="gap-2">
      <CardHeader>
        <CardTitle>Course Details</CardTitle>
        <CardDescription>Edit the course information</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="courseStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="HIDDEN">Hidden</SelectItem>
                      <SelectItem value="SALE">Sale</SelectItem>
                      <SelectItem value="ONGOING">Ongoing</SelectItem>
                      <SelectItem value="FINISHED">Finished</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customPrice"
              render={() => (
                <MoneyInput
                  form={form}
                  name="customPrice"
                  label="Course Price"
                />
              )}
            />
            <div className="w-full">
              <Button type="submit" className="cursor-pointer">
                <SaveIcon />
                Save Course Details
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 