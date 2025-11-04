import { notFound } from "next/navigation";
import { getPublishedPostByIdOrSlug, getPublishedPosts } from "@/lib/api/blog";

export const revalidate = 3600;

export async function generateStaticParams() {
  const { data, error } = await getPublishedPosts();
  if (error) {
    return [];
  }

  const ids = data.data.map((post) => post.id);
  const slugs = data.data.map((post) => post.slug);
  return [...ids, ...slugs].map((idOrSlug) => ({
    id: idOrSlug.toString(),
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; }>;
}) {
  const { id } = await params;
  const { data: post, error } = await getPublishedPostByIdOrSlug(id);
  if (error) {
    notFound();
  }

  return (
    <main>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </main>
  );
}