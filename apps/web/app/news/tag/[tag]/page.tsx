import { PublicPreview } from "@/components/blog/public-preview";
import { PaginationControls } from "@/components/utility/pagination";
import { getPublishedPosts } from "@/lib/api/blog";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ tag: string; }>;
  searchParams: Promise<{ page?: string; }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { tag } = await params;
  const searchParamsResolved = await searchParams;

  const page = searchParamsResolved.page ? parseInt(searchParamsResolved.page, 10) : 1;
  const limit = 10 as const;
  const decodedTag = decodeURIComponent(tag);

  const { data, error } = await getPublishedPosts({
    page,
    limit,
    tag: decodedTag,
  });

  if (error) {
    console.log(error);
    return <div>Error: {error.message}</div>;
  }

  const { data: posts, pagination } = data;
  const { page: currentPage, total, totalPages } = pagination;

  const getPageUrl = (pageNum: number) => {
    const searchParams = new URLSearchParams();
    searchParams.set("page", pageNum.toString());
    return `?${searchParams.toString()}`;
  };

  return (
    <div className="flex h-full p-4 flex-col">
      <div className="flex justify-center mb-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">
            News tagged with &quot;{decodedTag}&quot;
          </h1>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <p className="text-lg text-muted-foreground">
              No news found for tag &quot;{decodedTag}&quot;
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center flex-1 min-h-0">
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
      )}
    </div>
  );
}