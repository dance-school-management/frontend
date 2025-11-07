"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Textarea } from "@repo/ui/textarea";
import { TagsInput } from "@/components/forms/tags-input";
import { BlogPost, CreatePostRequest, UpdatePostRequest } from "@/lib/model/blog";

// Schema for creating (all fields required except tags)
const createBlogPostFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  tags: z.array(z.string()).optional(),
});

// Schema for updating (all fields optional, but if provided must meet requirements)
const updateBlogPostFormSchema = z.object({
  title: z.union([z.string().min(1, "Title is required"), z.literal("")]).optional(),
  content: z.union([z.string().min(1, "Content is required"), z.literal("")]).optional(),
  excerpt: z.union([z.string().min(1, "Excerpt is required"), z.literal("")]).optional(),
  tags: z.array(z.string()).optional(),
});

type CreateBlogPostFormValues = z.infer<typeof createBlogPostFormSchema>;
type UpdateBlogPostFormValues = z.infer<typeof updateBlogPostFormSchema>;
type BlogPostFormValues = CreateBlogPostFormValues | UpdateBlogPostFormValues;

interface BlogPostFormProps {
  mode?: "create" | "update";
  initialValues?: Partial<BlogPost>;
  onSubmit: (
    values: CreatePostRequest | UpdatePostRequest
  ) => Promise<void> | void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
}

export function BlogPostForm({
  mode = "create",
  initialValues,
  onSubmit,
  onCancel,
  submitLabel,
  cancelLabel,
  isSubmitting = false,
}: BlogPostFormProps) {
  const schema = mode === "create" ? createBlogPostFormSchema : updateBlogPostFormSchema;

  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialValues?.title ?? "",
      content: initialValues?.content ?? "",
      excerpt: initialValues?.excerpt ?? "",
      tags: initialValues?.tags ?? [],
    },
  });

  const handleSubmit = async (values: BlogPostFormValues) => {
    // For update mode, only include fields that have been changed
    if (mode === "update") {
      const updatePayload: UpdatePostRequest = {};

      // Only include title if it's changed and not empty
      if (values.title !== undefined && values.title !== initialValues?.title && values.title.trim() !== "") {
        updatePayload.title = values.title;
      }
      // Only include content if it's changed and not empty
      if (values.content !== undefined && values.content !== initialValues?.content && values.content.trim() !== "") {
        updatePayload.content = values.content;
      }
      // Only include excerpt if it's changed and not empty
      if (values.excerpt !== undefined && values.excerpt !== initialValues?.excerpt && values.excerpt.trim() !== "") {
        updatePayload.excerpt = values.excerpt;
      }
      // Check if tags array has changed
      if (values.tags !== undefined) {
        const initialTags = initialValues?.tags ?? [];
        const currentTags = values.tags ?? [];
        const tagsChanged =
          initialTags.length !== currentTags.length ||
          initialTags.some((tag) => !currentTags.includes(tag)) ||
          currentTags.some((tag) => !initialTags.includes(tag));

        if (tagsChanged) {
          updatePayload.tags = currentTags.length > 0 ? currentTags : undefined;
        }
      }

      await onSubmit(updatePayload);
    } else {
      // For create mode, include all required fields
      const createPayload: CreatePostRequest = {
        title: values.title ?? "",
        content: values.content ?? "",
        excerpt: values.excerpt ?? "",
        tags: values.tags && values.tags.length > 0 ? values.tags : undefined,
      };

      await onSubmit(createPayload);
    }
  };

  const defaultSubmitLabel = mode === "create" ? "Create Post" : "Update Post";
  const defaultCancelLabel = "Cancel";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter blog post title"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excerpt</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write a brief summary of your blog post"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write your blog post content (markdown)"
                  className="min-h-[400px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <TagsInput
          form={form}
          name="tags"
          label="Tags"
          placeholder="Select or add tags"
        />

        <div className="flex justify-end gap-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              {cancelLabel ?? defaultCancelLabel}
            </Button>
          )}
          <Button
            type="submit"
            disabled={isSubmitting || form.formState.isSubmitting}
          >
            {isSubmitting || form.formState.isSubmitting
              ? mode === "create"
                ? "Creating..."
                : "Updating..."
              : submitLabel ?? defaultSubmitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}

