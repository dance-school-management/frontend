"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { TagsInput } from "@/components/forms/tags-input";
import { BlogPost, CreatePostRequest, UpdatePostRequest } from "@/lib/model/blog";

const createBlogPostFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  tags: z.array(z.string()).optional(),
});

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
  originalValues?: Partial<BlogPost>;
  onSubmit: (
    values: CreatePostRequest | UpdatePostRequest
  ) => Promise<void> | void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
  showActions?: boolean;
  formId?: string;
  onFormChange?: (field: keyof BlogPost, value: string | string[] | undefined) => void;
}

export function BlogPostForm({
  mode = "create",
  initialValues,
  originalValues,
  onSubmit,
  onCancel,
  submitLabel,
  cancelLabel,
  isSubmitting = false,
  showActions = true,
  formId,
  onFormChange,
}: BlogPostFormProps) {
  const schema = mode === "create" ? createBlogPostFormSchema : updateBlogPostFormSchema;

  const defaultValues = useMemo(() => ({
    title: initialValues?.title ?? "",
    content: initialValues?.content ?? "",
    excerpt: initialValues?.excerpt ?? "",
    tags: initialValues?.tags ?? [],
  }), [initialValues?.title, initialValues?.content, initialValues?.excerpt, initialValues?.tags]);

  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const originalValuesRef = useRef<Partial<BlogPost> | undefined>(
    originalValues ? { ...originalValues } : (initialValues ? { ...initialValues } : undefined)
  );

  const watchedTitle = form.watch("title");
  const watchedContent = form.watch("content");
  const watchedExcerpt = form.watch("excerpt");
  const watchedTags = form.watch("tags");

  const onFormChangeRef = useRef(onFormChange);
  useEffect(() => {
    onFormChangeRef.current = onFormChange;
  }, [onFormChange]);

  useEffect(() => {
    if (onFormChangeRef.current) {
      onFormChangeRef.current("title", watchedTitle);
    }
  }, [watchedTitle]);

  useEffect(() => {
    if (onFormChangeRef.current) {
      onFormChangeRef.current("content", watchedContent);
    }
  }, [watchedContent]);

  useEffect(() => {
    if (onFormChangeRef.current) {
      onFormChangeRef.current("excerpt", watchedExcerpt);
    }
  }, [watchedExcerpt]);

  useEffect(() => {
    if (onFormChangeRef.current) {
      onFormChangeRef.current("tags", watchedTags);
    }
  }, [watchedTags]);

  const handleSubmit = async (values: BlogPostFormValues) => {
    if (mode === "update") {
      const originalValues = originalValuesRef.current ?? initialValues;
      const updatePayload: UpdatePostRequest = {};

      if (values.title !== undefined && values.title !== originalValues?.title && values.title.trim() !== "") {
        updatePayload.title = values.title;
      }
      if (values.content !== undefined && values.content !== originalValues?.content && values.content.trim() !== "") {
        updatePayload.content = values.content;
      }
      if (values.excerpt !== undefined && values.excerpt !== originalValues?.excerpt && values.excerpt.trim() !== "") {
        updatePayload.excerpt = values.excerpt;
      }
      if (values.tags !== undefined) {
        const initialTags = originalValues?.tags ?? [];
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
        id={formId}
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

        {showActions && (
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
        )}
      </form>
    </Form>
  );
}

