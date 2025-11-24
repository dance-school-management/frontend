"use client";

import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { Edit, Eye, EyeOff, MoreVertical,Pin, PinOff, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { LightweightBlogPost } from "@/lib/model/blog";

import { DeletePostDialog } from "./delete-post-dialog";
import { PinPostDialog } from "./pin-post-dialog";
import { PublishPostDialog } from "./publish-post-dialog";
import { useBlogPostActions } from "./use-blog-post-actions";

interface BlogPreviewActionsProps {
  post: LightweightBlogPost;
}

export function BlogPreviewActions({ post }: BlogPreviewActionsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [isPinDialogOpen, setIsPinDialogOpen] = useState(false);
  const { isLoading, handlePublish, handleUnpublish, handlePin, handleUnpin, handleDelete } =
    useBlogPostActions(post.id);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            disabled={isLoading}
          >
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link
              href={`/coordinator/blog/${post.id}`}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {post.status === "published" ? (
            <DropdownMenuItem
              onClick={handleUnpublish}
              disabled={isLoading}
              className="cursor-pointer"
            >
              <EyeOff className="h-4 w-4 mr-2" />
              Unpublish
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => setIsPublishDialogOpen(true)}
              disabled={isLoading}
              className="cursor-pointer"
            >
              <Eye className="h-4 w-4 mr-2" />
              Publish
            </DropdownMenuItem>
          )}
          {post.isPinned ? (
            <DropdownMenuItem
              onClick={handleUnpin}
              disabled={isLoading}
              className="cursor-pointer"
            >
              <PinOff className="h-4 w-4 mr-2" />
              Unpin
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => setIsPinDialogOpen(true)}
              disabled={isLoading}
              className="cursor-pointer"
            >
              <Pin className="h-4 w-4 mr-2" />
              Pin
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={isLoading}
            className="text-destructive cursor-pointer focus:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeletePostDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        postTitle={post.title}
        onConfirm={handleDelete}
        isLoading={isLoading}
      />

      <PublishPostDialog
        open={isPublishDialogOpen}
        onOpenChange={setIsPublishDialogOpen}
        onPublishNow={async () => {
          await handlePublish();
          setIsPublishDialogOpen(false);
        }}
        onSchedule={async (publishedAt) => {
          await handlePublish(publishedAt);
          setIsPublishDialogOpen(false);
        }}
        isLoading={isLoading}
      />

      <PinPostDialog
        open={isPinDialogOpen}
        onOpenChange={setIsPinDialogOpen}
        onPin={async (pinnedUntil) => {
          await handlePin(pinnedUntil);
          setIsPinDialogOpen(false);
        }}
        isLoading={isLoading}
      />
    </>
  );
}
