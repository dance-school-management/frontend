"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { SaveIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { MoneyInput } from "@/components/forms/input";
import { AdvancementLevelSelect, /*CurrencySelect,*/ DanceCategorySelect } from "@/components/forms/select";
import { updateCourse } from "@/lib/api/product";
import { Course } from "@/lib/model/product";

const courseFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  customPrice: z.number().optional(),
  currency: z.string().optional(),
  danceCategoryId: z.number().optional(),
  advancementLevelId: z.number().optional(),
});

type CourseFormValues = z.infer<typeof courseFormSchema>;

interface CourseDetailsFormProps {
  course: Course;
  onSuccess?: () => void;
}

export function CourseDetailsForm({ course }: CourseDetailsFormProps) {
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      name: course.name,
      description: course.description,
      customPrice: course.customPrice ? Number(course.customPrice) : undefined,
      currency: course.currency,
      danceCategoryId: course.danceCategoryId,
      advancementLevelId: course.advancementLevelId,
    },
  });

  const onSubmit = async (values: CourseFormValues) => {
    const payload = {
      ...values,
      id: course.id,
      courseStatus: "HIDDEN",
      description: values.description ?? null,
      customPrice: values.customPrice ?? null,
      currency: values.currency ?? null,
      danceCategoryId: values.danceCategoryId ?? null,
      advancementLevelId: values.advancementLevelId ?? null,
    };

    const { error } = await updateCourse(payload);
    if (error) {
      toast.error(error.message ?? "Failed to update course");
      return;
    }
    form.reset(values);
    toast.success("Course updated successfully");
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
            {/* <CurrencySelect
              form={form}
              name="currency"
              label="Currency"
            /> */}
            <MoneyInput
              form={form}
              name="customPrice"
              label="Course Price"
              currency={form.watch("currency")}
            />
            <DanceCategorySelect
              form={form}
              name="danceCategoryId"
              label="Dance Category"
              placeholder="Select dance category"
            />
            <AdvancementLevelSelect
              form={form}
              name="advancementLevelId"
              label="Advancement Level"
              placeholder="Select advancement level"
            />
            <div className="w-full">
              <Button type="submit" className="cursor-pointer" disabled={!form.formState.isDirty}>
                <SaveIcon />
                Save Details
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 