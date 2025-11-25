"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import {
  deletePost,
  pinPost,
  publishPost,
  unpinPost,
  unpublishPost,
} from "@/lib/api/blog";

export function useBlogPostActions(postId: number) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handlePublish = async (publishedAt?: string) => {
    setIsLoading(true);
    try {
      const { error } = await publishPost(
        postId.toString(),
        publishedAt ? { publishedAt } : undefined
      );
      if (error) {
        toast.error(error.message ?? "Failed to publish post");
        return;
      }
      toast.success(
        publishedAt
          ? "Post scheduled successfully"
          : "Post published successfully"
      );
      router.refresh();
    } catch (err) {
      toast.error("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnpublish = async () => {
    setIsLoading(true);
    try {
      const { error } = await unpublishPost(postId.toString());
      if (error) {
        toast.error(error.message ?? "Failed to unpublish post");
        return;
      }
      toast.success("Post unpublished successfully");
      router.refresh();
    } catch (err) {
      toast.error("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePin = async (pinnedUntil: string) => {
    setIsLoading(true);
    try {
      const { error } = await pinPost(postId.toString(), {
        pinnedUntil,
      });
      if (error) {
        toast.error(error.message ?? "Failed to pin post");
        return;
      }
      toast.success("Post pinned successfully");
      router.refresh();
    } catch (err) {
      toast.error("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnpin = async () => {
    setIsLoading(true);
    try {
      const { error } = await unpinPost(postId.toString());
      if (error) {
        toast.error(error.message ?? "Failed to unpin post");
        return;
      }
      toast.success("Post unpinned successfully");
      router.refresh();
    } catch (err) {
      toast.error("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const { error } = await deletePost(postId.toString());
      if (error) {
        toast.error(error.message ?? "Failed to delete post");
        return;
      }
      toast.success("Post deleted successfully");
      router.refresh();
      return true;
    } catch (err) {
      toast.error("An unexpected error occurred");
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handlePublish,
    handleUnpublish,
    handlePin,
    handleUnpin,
    handleDelete,
  };
}
