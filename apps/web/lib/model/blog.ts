export type BlogPostStatus = 'draft' | 'published';

export type BlogPost = {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: BlogPostStatus;
  authorId: string;
  readingTime: number;
  isPinned: boolean;
  pinnedUntil: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
};

export type LightweightBlogPost = Omit<BlogPost, 'content'>;

export type CreatePostRequest = {
  title: string;
  content: string;
  excerpt: string;
  tags?: string[];
  status?: BlogPostStatus;
};

export type UpdatePostRequest = {
  title?: string;
  content?: string;
  excerpt?: string;
  tags?: string[];
  status?: BlogPostStatus;
};

export type PublishPostRequest = {
  publishedAt?: string;
};

export type PinPostRequest = {
  pinnedUntil: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

