"use client";

import { Button } from "@repo/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/dialog";
import { ScrollArea } from "@repo/ui/scroll-area";
import { useState } from "react";
import { toast } from "sonner";

import { BlogPostForm } from "@/components/forms/blog-post-form";
import { createPost } from "@/lib/api/blog";
import { CreatePostRequest, UpdatePostRequest } from "@/lib/model/blog";

interface NewPostDialogProps {
  children: React.ReactNode;
}

export function NewPostDialog({ children }: NewPostDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: CreatePostRequest | UpdatePostRequest) => {
    try {
      setIsSubmitting(true);
      const payload: CreatePostRequest = {
        ...(values as CreatePostRequest),
        status: "draft" as const,
      };

      const { error } = await createPost(payload);

      if (error) {
        toast.error(error.message ?? "Failed to create blog post");
        return;
      }

      toast.success("Blog post created successfully!");
      setOpen(false);
    } catch (err) {
      toast.error("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex h-[min(960px,90vh)] max-h-[min(960px,90vh)] flex-col gap-0 p-0 sm:max-w-4xl overflow-hidden">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="px-6 pt-4 text-xl shrink-0">
            Create New Blog Post
          </DialogTitle>
          <DialogDescription className="px-6 py-2 text-sm text-muted-foreground border-b shrink-0">
            Fill in the details below to create a new blog post. The post will be saved as a draft.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 min-h-0 overflow-hidden">
          <div className="px-6 py-4">
            <BlogPostForm
              mode="create"
              onSubmit={handleSubmit}
              showActions={false}
              isSubmitting={isSubmitting}
              formId="blog-post-form"
            />
          </div>
        </ScrollArea>
        <DialogFooter className="flex-row items-center justify-end border-t px-6 py-4 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="blog-post-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Post"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
