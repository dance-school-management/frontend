"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useHookFormMask } from "use-mask-input";
import { CloudUpload, Paperclip } from "lucide-react";

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
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@repo/ui/file-upload";
import { DanceCategoriesMultiSelect } from "./select";
import { ProfileData } from "@/lib/model/profile";

const formSchema = z.object({
  email: z.string().email("Invalid email address").nullable().optional().or(z.literal("")),
  phone: z.string().nullable().optional().or(z.literal("")),
  description: z.string().nullable().optional().or(z.literal("")),
  photo: z.instanceof(File).nullable().optional(),
  favouriteDanceCategories: z.array(z.number()).optional(),
});

export type ProfileFormValues = z.infer<typeof formSchema>;

export interface ProfileFormProps {
  initialValues?: Partial<ProfileFormValues & { name?: string; surname?: string; photoPath?: string | null }>;
  onSubmit: (values: ProfileFormValues) => void | Promise<void>;
  profileData?: ProfileData;
}

const defaultValues: ProfileFormValues = {
  email: null,
  phone: null,
  description: null,
  photo: null,
  favouriteDanceCategories: [],
};

const dropZoneConfig = {
  maxFiles: 1,
  maxSize: 1024 * 1024 * 4, // 4MB
  multiple: false,
  accept: {
    "image/*": [".jpg", ".jpeg", ".png", ".webp"],
  },
};

export function ProfileForm({
  initialValues,
  onSubmit,
  profileData,
}: ProfileFormProps) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...defaultValues,
      email: initialValues?.email ?? null,
      phone: initialValues?.phone ?? null,
      description: initialValues?.description ?? null,
      photo: null,
      favouriteDanceCategories: initialValues?.favouriteDanceCategories ?? [],
    },
  });

  const registerWithMask = useHookFormMask(form.register);

  useEffect(() => {
    if (initialValues !== undefined) {
      form.reset({
        ...defaultValues,
        email: initialValues.email ?? null,
        phone: initialValues.phone ?? null,
        description: initialValues.description ?? null,
        photo: null,
        favouriteDanceCategories: initialValues.favouriteDanceCategories ?? [],
      });
    }
  }, [initialValues, form]);

  const handleSubmit = form.handleSubmit(onSubmit);

  const photoFile = form.watch("photo");

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <FormLabel>Name and Surname</FormLabel>
          <Input
            value={
              profileData
                ? `${profileData?.name} ${profileData?.surname}`
                : ""
            }
            readOnly
            disabled
            className="bg-muted"
          />
        </div>

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="example@email.com"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value || null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="+48 XXX XXX XXX"
                  {...registerWithMask(field.name, "+48 999 999 999", {prefix: "+48", showMaskOnHover: false, placeholder: "_"})}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about yourself..."
                  className="resize-none"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value || null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Photo Upload */}
        <FormField
          control={form.control}
          name="photo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Photo</FormLabel>
              {profileData?.photoPath && !photoFile && (
                <div className="mb-2 text-sm text-muted-foreground">
                  Current photo: {profileData.photoPath}
                </div>
              )}
              <FormControl>
                <FileUploader
                  value={photoFile ? [photoFile] : null}
                  onValueChange={(files) => field.onChange(files?.[0] ?? null)}
                  dropzoneOptions={dropZoneConfig}
                  className="relative bg-background rounded-lg p-2"
                >
                  <FileInput id="photoInput" className="outline-dashed outline-1 outline-slate-500">
                    <div className="flex items-center justify-center flex-col p-8 w-full">
                      <CloudUpload className="text-gray-500 w-10 h-10" />
                      <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        JPG, JPEG, PNG, WEBP up to 4MB
                      </p>
                    </div>
                  </FileInput>
                  <FileUploaderContent>
                    {photoFile && (
                      <FileUploaderItem index={0}>
                        <Paperclip className="h-4 w-4 stroke-current" />
                        <span>{photoFile.name}</span>
                      </FileUploaderItem>
                    )}
                  </FileUploaderContent>
                </FileUploader>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Favourite Dance Categories */}
        <DanceCategoriesMultiSelect
          form={form}
          name="favouriteDanceCategories"
          label="Favourite Dance Categories"
          placeholder="Select your favourite dance categories"
        />

        {/* Submit button */}
        <div>
          <Button
            type="submit"
            disabled={!form.formState.isDirty}
            className="bg-foreground text-background hover:bg-foreground/90"
          >
            Update profile
          </Button>
        </div>
      </form>
    </Form>
  );
}

