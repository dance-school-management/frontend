"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SaveIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { MoneyInput } from "@/components/forms/input";
import { AdvancementLevelSelect, CurrencySelect, DanceCategorySelect } from "@/components/forms/select";
import { ClassTemplate } from "@/lib/model/product";
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
import { Textarea } from "@repo/ui/textarea";
import { createClassTemplate, updateClassTemplate } from "@/lib/api/product";
import { useRouter } from "next/navigation";
import { IsConfirmationCheckbox } from "../forms/checkbox";

const classTemplateFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  price: z.number().min(0, "Price must be positive"),
  currency: z.string().min(1, "Currency is required"),
  danceCategoryId: z.number().min(1, "Dance category is required"),
  advancementLevelId: z.number().min(1, "Advancement level is required"),
});

const nonCourseClassTemplateFormSchema = classTemplateFormSchema.extend({
  classType: z.enum(["PRIVATE_CLASS", "THEME_PARTY"]),
});

const newClassTemplateFormSchema = nonCourseClassTemplateFormSchema.extend({
  isConfirmation: z.boolean().optional(),
});

type ClassTemplateFormValues = z.infer<typeof classTemplateFormSchema>;
type NonCourseClassTemplateFormValues = z.infer<typeof nonCourseClassTemplateFormSchema>;
type NewClassTemplateFormValues = z.infer<typeof newClassTemplateFormSchema>;

interface ClassTemplateFormProps {
  template: ClassTemplate;
  courseId: number;
}

export function CourseClassTemplateForm({ template, courseId }: ClassTemplateFormProps) {
  const form = useForm<ClassTemplateFormValues>({
    resolver: zodResolver(classTemplateFormSchema),
    defaultValues: {
      name: template?.name ?? "",
      description: template?.description ?? "",
      price: Number(template?.price ?? 0),
      currency: template?.currency ?? "PLN",
      danceCategoryId: template?.danceCategoryId,
      advancementLevelId: template?.advancementLevelId,
    },
  });

  const onSubmit = async (values: ClassTemplateFormValues) => {
    const payload = {
      courseId: courseId,
      name: values.name,
      description: values.description,
      price: values.price,
      currency: values.currency,
      classType: "GROUP_CLASS",
      scheduleTileColor: "blue",
      danceCategoryId: values.danceCategoryId,
      advancementLevelId: values.advancementLevelId,
    };

    const { error } = await updateClassTemplate(template.id, payload);
    if (error) {
      toast.error(error.message ?? "Failed to update class template");
      return;
    }
    toast.success("Class template updated successfully");
    form.reset(values);
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
            Save Template
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function NonCourseClassTemplateForm({ template }: Omit<ClassTemplateFormProps, "courseId">) {
  const form = useForm<NonCourseClassTemplateFormValues>({
    resolver: zodResolver(nonCourseClassTemplateFormSchema),
    defaultValues: {
      name: template?.name ?? "",
      description: template?.description,
      price: Number(template?.price),
      currency: template?.currency ?? "PLN",
      classType: (template?.classType === "PRIVATE_CLASS" || template?.classType === "THEME_PARTY")
        ? template.classType
        : "PRIVATE_CLASS",
      danceCategoryId: template?.danceCategoryId,
      advancementLevelId: template?.advancementLevelId,
    },
  });

  const onSubmit = async (data: NonCourseClassTemplateFormValues) => {
    const payload = {
      courseId: null,
      name: data.name,
      description: data.description,
      price: data.price,
      currency: data.currency,
      classType: data.classType,
      scheduleTileColor: "blue",
      danceCategoryId: data.danceCategoryId,
      advancementLevelId: data.advancementLevelId,
    };

    const { error } = await updateClassTemplate(template.id, payload);
    if (error) {
      toast.error(error.message ?? "Failed to update class template");
      return;
    }
    toast.success("Class template updated successfully");
    form.reset(data);
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
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function NewClassTemplateForm() {
  const router = useRouter();
  const form = useForm<NewClassTemplateFormValues>({
    resolver: zodResolver(newClassTemplateFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      currency: "PLN",
      classType: "PRIVATE_CLASS",
      danceCategoryId: undefined,
      advancementLevelId: undefined,
      isConfirmation: false,
    },
  });

  const onSubmit = async (values: NewClassTemplateFormValues) => {
    const payload = {
      courseId: null,
      name: values.name,
      description: values.description,
      price: values.price,
      currency: values.currency,
      classType: values.classType,
      scheduleTileColor: "blue",
      danceCategoryId: values.danceCategoryId,
      advancementLevelId: values.advancementLevelId,
      isConfirmation: values.isConfirmation ?? false,
    };

    const { data, error } = await createClassTemplate(payload);
    if (error) {
      toast.error(error.message ?? "Failed to create class template");
      return;
    }
    const { id } = data;
    toast.success("Class template created successfully! Redirecting...");
    setTimeout(() => {
      router.push(`/coordinator/classes/${id}`);
    }, 2000);
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
        <IsConfirmationCheckbox form={form} name="isConfirmation" />
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
          <Button type="submit" className="cursor-pointer">
            <SaveIcon />
            Create
          </Button>
        </div>
      </form>
    </Form>
  );
} 