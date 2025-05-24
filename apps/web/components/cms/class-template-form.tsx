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
import { CurrencySelect } from "@/components/forms/currency-select";
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

type ClassTemplateFormValues = z.infer<typeof classTemplateFormSchema>;

interface ClassTemplateFormProps {
  template: ClassTemplate;
  courseId: number;
  onSuccess?: () => void;
  danceCategories: DanceCategory[];
  advancementLevels: AdvancementLevel[];
}

export function ClassTemplateForm({ template, courseId, onSuccess, danceCategories, advancementLevels }: ClassTemplateFormProps) {
  const form = useForm<ClassTemplateFormValues>({
    resolver: zodResolver(classTemplateFormSchema),
    defaultValues: {
      name: template.name,
      description: template.description,
      price: Number(template.price),
      currency: template.currency,
      classType: template.classType,
      scheduleTileColor: "blue", //template.scheduleTileColor,
      danceCategoryId: template.danceCategoryId,
      advancementLevelId: template.advancementLevelId,
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
    <Card className="gap-2">
      <CardHeader>
        <CardTitle>Class Template</CardTitle>
        <CardDescription>Edit the class template information</CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
} 