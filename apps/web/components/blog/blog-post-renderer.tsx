import { BlogPost } from "@/lib/model/blog";
import { Badge } from "@repo/ui/components/badge";
import { format } from "date-fns";
import { Clock } from "lucide-react";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface BlogPostRendererProps {
  post: BlogPost;
}

export function BlogPostRenderer({ post }: BlogPostRendererProps) {
  const displayDate = post.publishedAt || post.createdAt;
  const formattedDate = format(new Date(displayDate), "PPP");

  return (
    <article className="max-w-3xl w-full space-y-6">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold">{post.title || "Untitled"}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="size-4" />
            <span>{post.readingTime} min read</span>
          </div>
          <span>{formattedDate}</span>
        </div>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {post.tags.map((tag) => (
              <Link key={tag} href={`/news/tag/${tag}`}>
                <Badge variant="outline" className="text-xs hover:bg-muted hover:text-foreground transition-colors">
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
        )}
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
  );
}