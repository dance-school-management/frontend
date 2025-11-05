import { getPublishedPostByIdOrSlug, getPublishedPosts } from "@/lib/api/blog";
import { notFound } from "next/navigation";
import type { ComponentPropsWithoutRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
  if (error || !post) {
    notFound();
  }

  return (
    <div className="w-full p-2 md:p-4 space-y-6">
      <div className="w-full p-4 flex items-center justify-center">
        <article className="max-w-3xl w-full space-y-6">
          <header>
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          </header>
          <div className="markdown-content prose prose-slate dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[[remarkGfm]]}
              components={{
                h1: (props: ComponentPropsWithoutRef<"h1">) => <h1 className="text-4xl font-bold mt-8 mb-4" {...props} />,
                h2: (props: ComponentPropsWithoutRef<"h2">) => <h2 className="text-3xl font-semibold mt-6 mb-3" {...props} />,
                h3: (props: ComponentPropsWithoutRef<"h3">) => <h3 className="text-2xl font-semibold mt-5 mb-2" {...props} />,
                h4: (props: ComponentPropsWithoutRef<"h4">) => <h4 className="text-xl font-semibold mt-4 mb-2" {...props} />,
                p: (props: ComponentPropsWithoutRef<"p">) => <p className="mb-4 leading-7" {...props} />,
                ul: (props: ComponentPropsWithoutRef<"ul">) => <ul className="list-disc list-inside mb-4 space-y-2" {...props} />,
                ol: (props: ComponentPropsWithoutRef<"ol">) => <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />,
                li: (props: ComponentPropsWithoutRef<"li">) => <li className="ml-4" {...props} />,
                blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
                  <blockquote className="border-l-4 border-muted-foreground pl-4 italic my-4" {...props} />
                ),
                code: (props: ComponentPropsWithoutRef<"code">) => (
                  <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
                ),
                pre: (props: ComponentPropsWithoutRef<"pre">) => (
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4" {...props} />
                ),
                a: (props: ComponentPropsWithoutRef<"a">) => (
                  <a className="text-primary underline hover:text-primary/80" {...props} />
                ),
                table: (props: ComponentPropsWithoutRef<"table">) => (
                  <div className="overflow-x-auto my-4">
                    <table className="min-w-full border-collapse border border-border" {...props} />
                  </div>
                ),
                th: (props: ComponentPropsWithoutRef<"th">) => (
                  <th className="border border-border px-4 py-2 bg-muted font-semibold text-left" {...props} />
                ),
                td: (props: ComponentPropsWithoutRef<"td">) => (
                  <td className="border border-border px-4 py-2" {...props} />
                ),
                hr: (props: ComponentPropsWithoutRef<"hr">) => (
                  <hr className="my-6 border-t border-border" {...props} />
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    </div>
  );
}