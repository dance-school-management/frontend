"use client";

import { Card, CardContent } from "@repo/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";
import { Edit2, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { BlogPostRenderer } from "@/components/blog/blog-post-renderer";
import { BlogPostForm } from "@/components/forms/blog-post-form";
import { updatePost } from "@/lib/api/blog";
import { BlogPost, UpdatePostRequest } from "@/lib/model/blog";

interface EditBlogPostPageProps {
  post: BlogPost;
}

export function EditBlogPostPage({ post }: EditBlogPostPageProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: post.title,
    content: post.content,
    excerpt: post.excerpt,
    tags: post.tags,
  });

  const handleSubmit = async (values: UpdatePostRequest) => {
    try {
      setIsSubmitting(true);
      console.log("values", values);
      const { error } = await updatePost(post.id.toString(), values);

      if (error) {
        toast.error(error.message ?? "Failed to update blog post");
        return;
      }

      toast.success("Blog post updated successfully!");
      router.refresh();
    } catch (err) {
      toast.error("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormChange = useCallback((field: keyof BlogPost, value: string | string[] | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Merge form data with original post for preview
  const previewPost: BlogPost = useMemo(() => ({
    ...post,
    ...formData,
  }), [post, formData]);

  // Merge form data with original post for form initialization
  // This ensures form state is restored if component remounts
  const formInitialValues: Partial<BlogPost> = useMemo(() => ({
    ...post,
    ...formData,
  }), [post, formData]);

  return (
    <div className="flex h-full flex-col p-4">
      <div className="mb-4">
        <h1 className="text-4xl font-bold">Edit Blog Post</h1>
        <p className="text-muted-foreground mt-2">
          Make changes to your blog post and preview how it will look when published.
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "edit" | "preview")}
        className="flex-1 flex flex-col min-h-0"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="edit" className="gap-2">
            <Edit2 className="h-4 w-4" />
            Edit
          </TabsTrigger>
          <TabsTrigger value="preview" className="gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="flex-1 min-h-0 overflow-auto">
          <Card className="h-full">
            <CardContent className="pt-6">
              <BlogPostForm
                mode="update"
                initialValues={formInitialValues}
                originalValues={post}
                onSubmit={handleSubmit}
                onCancel={() => router.back()}
                isSubmitting={isSubmitting}
                onFormChange={handleFormChange}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="flex-1 min-h-0 overflow-auto">
          <Card className="h-full">
            <CardContent className="pt-6">
              <BlogPostRenderer post={previewPost} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
