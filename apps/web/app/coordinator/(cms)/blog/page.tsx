import { BlogFilters } from "@/components/blog/blog-filters";
import { BlogPreview } from "@/components/blog/blog-preview";
import { NewPostDialog } from "@/components/blog/new-post-dialog";
import { PaginationControls } from "@/components/utility/pagination";
import { getAllPosts } from "@/lib/api/blog";
import { Button } from "@repo/ui/button";
import { Plus } from "lucide-react";
import { headers } from "next/headers";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    status?: string;
    q?: string;
  }>;
}

export default async function BlogPage({ searchParams }: PageProps) {
  const cookie = (await headers()).get("cookie") ?? "";
  const params = await searchParams;

  const page = params.page ? parseInt(params.page, 10) : 1;
  const limit = params.limit ? parseInt(params.limit, 10) : 12;
  const status = params.status as "draft" | "published" | undefined;
  const query = params.q;

  const result = await getAllPosts(
    {
      page,
      limit,
      status,
      q: query,
    },
    cookie
  );

  if (result.error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Error loading blog posts</h1>
          <p className="text-muted-foreground">{result.error.message}</p>
        </div>
      </div>
    );
  }

  const { data, pagination } = result.data;
  const { page: currentPage, limit: currentLimit, total, totalPages } = pagination;

  const getPageUrl = (pageNum: number) => {
    const searchParams = new URLSearchParams();
    searchParams.set("page", pageNum.toString());
    if (currentLimit !== 12) searchParams.set("limit", currentLimit.toString());
    if (status) searchParams.set("status", status);
    if (query) searchParams.set("q", query);
    return `?${searchParams.toString()}`;
  };

  return (
    <div className="flex h-full p-4 flex-col">
      <h1 className="text-4xl font-bold mb-4">Blog Posts</h1>
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <NewPostDialog>
          <Button variant="outline">
            <Plus className="h-4 w-4" />
            New Post
          </Button>
        </NewPostDialog>
        <BlogFilters initialStatus={status} initialQuery={query} />
      </div>

      {data.length === 0 ? (
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <p className="text-lg text-muted-foreground">No blog posts found</p>
            <NewPostDialog>
              <Button className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Create your first post
              </Button>
            </NewPostDialog>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center flex-1 min-h-0">
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            {data.map((post) => (
              <BlogPreview key={post.id} post={post} />
            ))}
          </div>

          <div className="mt-auto">
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              getPageUrl={getPageUrl}
              showResultsCounter={true}
              currentLimit={currentLimit}
              total={total}
            />
          </div>
        </div>
      )}
    </div>
  );
}
