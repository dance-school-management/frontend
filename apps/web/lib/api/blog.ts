import {
  BlogPost,
  BlogPostStatus,
  CreatePostRequest,
  LightweightBlogPost,
  PaginatedResponse,
  PinPostRequest,
  PublishPostRequest,
  UpdatePostRequest,
} from "@/lib/model/blog";
import { ApiResult, fetcher } from "./axios";

// Authenticated routes

export async function createPost(
  data: CreatePostRequest,
  cookie?: string
): Promise<ApiResult<BlogPost>> {
  return await fetcher("/blog/posts", "POST", data, { cookie });
}

export async function getAllPosts(
  params?: {
    page?: number;
    limit?: number;
    status?: BlogPostStatus;
    q?: string;
    expand?: string;
  },
  cookie?: string
): Promise<ApiResult<PaginatedResponse<LightweightBlogPost>>> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.status) queryParams.append("status", params.status);
  if (params?.q) queryParams.append("q", params.q);
  if (params?.expand) queryParams.append("expand", params.expand);

  const url = `/blog/posts${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  return await fetcher(url, "GET", undefined, { cookie });
}

export async function getPostByIdOrSlug(
  idOrSlug: string,
  cookie?: string
): Promise<ApiResult<BlogPost>> {
  return await fetcher(`/blog/posts/${idOrSlug}`, "GET", undefined, { cookie });
}

export async function updatePost(
  idOrSlug: string,
  data: UpdatePostRequest,
  cookie?: string
): Promise<ApiResult<BlogPost>> {
  return await fetcher(`/blog/posts/${idOrSlug}`, "PATCH", data, { cookie });
}

export async function deletePost(
  idOrSlug: string,
  cookie?: string
): Promise<ApiResult<void>> {
  return await fetcher(`/blog/posts/${idOrSlug}`, "DELETE", undefined, { cookie });
}

export async function publishPost(
  idOrSlug: string,
  data?: PublishPostRequest,
  cookie?: string
): Promise<ApiResult<void>> {
  return await fetcher(`/blog/posts/${idOrSlug}/publish`, "PATCH", data, { cookie });
}

export async function unpublishPost(
  idOrSlug: string,
  cookie?: string
): Promise<ApiResult<void>> {
  return await fetcher(`/blog/posts/${idOrSlug}/unpublish`, "PATCH", undefined, { cookie });
}

export async function pinPost(
  idOrSlug: string,
  data: PinPostRequest,
  cookie?: string
): Promise<ApiResult<void>> {
  return await fetcher(`/blog/posts/${idOrSlug}/pin`, "PATCH", data, { cookie });
}

export async function unpinPost(
  idOrSlug: string,
  cookie?: string
): Promise<ApiResult<void>> {
  return await fetcher(`/blog/posts/${idOrSlug}/unpin`, "PATCH", undefined, { cookie });
}

// Public routes

export async function getPublishedPosts(params?: {
  page?: number;
  limit?: number;
  q?: string;
  tag?: string;
}): Promise<ApiResult<PaginatedResponse<LightweightBlogPost>>> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.q) queryParams.append("q", params.q);
  if (params?.tag) queryParams.append("tag", params.tag);

  const url = `/blog/public/posts${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  return await fetcher(url, "GET");
}

export async function getPublishedPostByIdOrSlug(
  idOrSlug: string
): Promise<ApiResult<BlogPost>> {
  return await fetcher(`/blog/public/posts/${idOrSlug}`, "GET");
}
