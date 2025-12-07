import { NewsSearch } from "@/components/blog/news-search";
import { PublicPreview } from "@/components/blog/public-preview";
import { PaginationControls } from "@/components/utility/pagination";
import { getPublishedPosts } from "@/lib/api/blog";

export const revalidate = 60;

interface PageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;

  const page = params.page ? parseInt(params.page, 10) : 1;
  const limit = 10 as const;
  const query = params.q;

  const { data, error } = await getPublishedPosts({
    page,
    limit,
    q: query,
  });

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const { data: posts, pagination } = data;
  const { page: currentPage, total, totalPages } = pagination;

  const getPageUrl = (pageNum: number) => {
    const searchParams = new URLSearchParams();
    searchParams.set("page", pageNum.toString());
    if (query) searchParams.set("q", query);
    return `?${searchParams.toString()}`;
  };

  return (
    <div className="flex h-full p-4 flex-col">
      <div className="flex justify-center mb-4">
        <NewsSearch initialQuery={query} />
      </div>

      {posts.length === 0 ?
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <p className="text-lg text-muted-foreground">
              {query ? `No news found for "${query}"` : "No news posts found"}
            </p>
          </div>
        </div>
      : <div className="flex flex-col items-center flex-1 min-h-0">
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            {posts.map((post) => (
              <PublicPreview key={post.id} post={post} />
            ))}
          </div>

          <div className="mt-auto">
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              getPageUrl={getPageUrl}
              showResultsCounter={true}
              currentLimit={limit}
              total={total}
            />
          </div>
        </div>
      }
    </div>
  );
}
