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
import { Clock, Pin } from "lucide-react";
import Link from "next/link";

import { LightweightBlogPost } from "@/lib/model/blog";

interface PublicPreviewProps {
  post: LightweightBlogPost;
}

export function PublicPreview({ post }: PublicPreviewProps) {
  const displayDate = post.publishedAt || post.createdAt;
  const formattedDate = new Date(displayDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Link href={`/news/${post.slug}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer gap-2">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <CardTitle className="line-clamp-2 mb-2">
                {post.title}
              </CardTitle>
              <CardDescription className="line-clamp-2">
                {post.excerpt}
              </CardDescription>
            </div>
            <CardAction>
              <div className="flex flex-col items-end gap-2">
                {post.isPinned && (<Pin className="size-4 text-primary" />)}
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
              <span>{post.readingTime} min read</span >
            </div>
            <div className="h-4 w-px bg-muted" />
            <span>{formattedDate}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
