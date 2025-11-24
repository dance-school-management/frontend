"use client";

import { Badge } from "@repo/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/ui/tooltip";
import { format } from "date-fns";
import { Clock, Pin } from "lucide-react";
import Link from "next/link";

import { LightweightBlogPost } from "@/lib/model/blog";

import { BlogPreviewActions } from "./blog-preview-actions";

interface BlogPreviewProps {
  post: LightweightBlogPost;
}

export function BlogPreview({ post }: BlogPreviewProps) {
  const displayDate = post.publishedAt || post.createdAt;
  const formattedDate = new Date(displayDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const href = post.status === "published" ? `/news/${post.slug}` : `/coordinator/blog/${post.id}`;

  // Check if post is scheduled (published status with future publishedAt)
  const isScheduled =
    post.status === "published" &&
    post.publishedAt &&
    new Date(post.publishedAt) > new Date();

  const scheduledDateFormatted = isScheduled && post.publishedAt
    ? format(new Date(post.publishedAt), "PPP 'at' p")
    : null;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="line-clamp-2 mb-2">
              <Link
                href={href}
                className="hover:text-primary transition-colors"
              >
                {post.title}
              </Link>
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {post.excerpt}
            </CardDescription>
          </div>
          <CardAction>
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-end gap-2">
                {post.isPinned && post.pinnedUntil && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="gap-1">
                        <Pin className="size-3" />
                        Pinned
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Pinned until {format(new Date(post.pinnedUntil), "PPP 'at' p")}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                {post.isPinned && !post.pinnedUntil && (
                  <Badge variant="outline" className="gap-1">
                    <Pin className="size-3" />
                    Pinned
                  </Badge>
                )}
                {isScheduled && scheduledDateFormatted ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline">
                        Scheduled
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Scheduled at {scheduledDateFormatted}</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Badge
                    variant={post.status === "published" ? "default" : "secondary"}
                  >
                    {post.status}
                  </Badge>
                )}
              </div>
              <BlogPreviewActions post={post} />
            </div>
          </CardAction>
        </div>
      </CardHeader>
      <CardContent>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Clock className="size-4" />
            <span>{post.readingTime} min read</span>
          </div>
          <span>{formattedDate}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
