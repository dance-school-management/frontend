import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { EditBlogPostPage } from "@/components/blog/edit-blog-post-page";
import { getPostByIdOrSlug } from "@/lib/api/blog";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; }>;
}) {
  const { id } = await params;
  const cookie = (await headers()).get("cookie") ?? "";

  const result = await getPostByIdOrSlug(id, cookie);

  if (result.error || !result.data) {
    notFound();
  }

  return <EditBlogPostPage post={result.data} />;
}
