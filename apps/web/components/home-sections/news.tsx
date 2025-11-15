import { PublicPreview } from "@/components/blog/public-preview";
import { LightweightBlogPost } from "@/lib/model/blog";
import { Button } from "@repo/ui/components/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface LatestNewsSectionProps {
  posts: LightweightBlogPost[];
}

export function LatestNewsSection({ posts }: LatestNewsSectionProps) {
  return (
    <section className="flex flex-col gap-4 px-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold">
            Latest News
          </h2>
          <p className="text-muted-foreground">
            Stay updated with the latest news and announcements
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/news">
            View All News
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <PublicPreview key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
