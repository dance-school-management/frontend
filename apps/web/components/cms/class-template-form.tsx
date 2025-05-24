"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";
import { SaveIcon } from "lucide-react";

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
import { Textarea } from "@repo/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { MoneyInput } from "@/components/forms/input";
import { CurrencySelect } from "@/components/forms/select";
import { AdvancementLevel, ClassTemplate, DanceCategory } from "@/lib/model/product";

const classTemplateFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  price: z.number().min(0, "Price must be positive"),
  currency: z.string().min(1, "Currency is required"),
  classType: z.enum(["GROUP_CLASS", "PRIVATE_CLASS", "THEME_PARTY"]),
  scheduleTileColor: z.string().optional(),
  danceCategoryId: z.number().min(1, "Dance category is required"),
  advancementLevelId: z.number().min(1, "Advancement level is required"),
});

const nonCourseClassTemplateFormSchema = classTemplateFormSchema.extend({
  classType: z.enum(["PRIVATE_CLASS", "THEME_PARTY"]),
});

type ClassTemplateFormValues = z.infer<typeof classTemplateFormSchema>;
type NonCourseClassTemplateFormValues = z.infer<typeof nonCourseClassTemplateFormSchema>;

interface ClassTemplateFormProps {
  template: ClassTemplate | null;
  courseId: number;
  onSuccess?: () => void;
  danceCategories: DanceCategory[];
  advancementLevels: AdvancementLevel[];
}

export function CourseClassTemplateForm({ template, onSuccess, danceCategories, advancementLevels, courseId }: ClassTemplateFormProps) {
  const form = useForm<ClassTemplateFormValues>({
    resolver: zodResolver(classTemplateFormSchema),
    defaultValues: {
      name: template?.name ?? "",
      description: template?.description ?? "",
      price: Number(template?.price ?? 0),
      currency: template?.currency ?? "USD",
      classType: template?.classType ?? "GROUP_CLASS",
      scheduleTileColor: "blue",
      danceCategoryId: template?.danceCategoryId ?? 0,
      advancementLevelId: template?.advancementLevelId ?? 0,
    },
  });

  const onSubmit = async (data: ClassTemplateFormValues) => {
    console.log(data);
    try {
      await axios.put(`/api/courses/${courseId}/template`, data);
    } catch {
      toast.error("Failed to update class template");
      return;
    }
    toast.success("Class template updated successfully");
    onSuccess?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          name="classType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select class type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="GROUP_CLASS">Group Class</SelectItem>
                  <SelectItem value="PRIVATE_CLASS">Private Class</SelectItem>
                  <SelectItem value="THEME_PARTY">Theme Party</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <CurrencySelect
          form={form}
          name="currency"
          label="Currency"
        />
        <MoneyInput
          form={form}
          name="price"
          label="Price"
          currency={form.watch("currency")}
        />
        <FormField
          control={form.control}
          name="danceCategoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dance Category</FormLabel>
              <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={String(field.value)}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select dance category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {danceCategories.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.name}
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
          name="advancementLevelId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Advancement Level</FormLabel>
              <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={String(field.value)}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select advancement level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {advancementLevels.map((level) => (
                    <SelectItem key={level.id} value={String(level.id)}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full">
          <Button type="submit" className="cursor-pointer">
            <SaveIcon />
            Save Class Template
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function NonCourseClassTemplateForm({ template, onSuccess, danceCategories, advancementLevels }: Omit<ClassTemplateFormProps, "courseId">) {
  const form = useForm<NonCourseClassTemplateFormValues>({
    resolver: zodResolver(nonCourseClassTemplateFormSchema),
    defaultValues: {
      name: template?.name ?? "",
      description: template?.description ?? "",
      price: Number(template?.price ?? 0),
      currency: template?.currency ?? "USD",
      classType: (template?.classType === "PRIVATE_CLASS" || template?.classType === "THEME_PARTY")
        ? template.classType
        : "PRIVATE_CLASS",
      scheduleTileColor: "blue",
      danceCategoryId: template?.danceCategoryId ?? 0,
      advancementLevelId: template?.advancementLevelId ?? 0,
    },
  });

  const onSubmit = async (data: NonCourseClassTemplateFormValues) => {
    console.log(data);
    onSuccess?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          name="classType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select class type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="PRIVATE_CLASS">Private Class</SelectItem>
                  <SelectItem value="THEME_PARTY">Theme Party</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <CurrencySelect
          form={form}
          name="currency"
          label="Currency"
        />
        <MoneyInput
          form={form}
          name="price"
          label="Price"
          currency={form.watch("currency")}
        />
        <FormField
          control={form.control}
          name="danceCategoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dance Category</FormLabel>
              <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={String(field.value)}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select dance category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {danceCategories.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.name}
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
          name="advancementLevelId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Advancement Level</FormLabel>
              <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={String(field.value)}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select advancement level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {advancementLevels.map((level) => (
                    <SelectItem key={level.id} value={String(level.id)}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full">
          <Button type="submit" className="cursor-pointer">
            <SaveIcon />
            Save Class Template
          </Button>
        </div>
      </form>
    </Form>
  );
} 