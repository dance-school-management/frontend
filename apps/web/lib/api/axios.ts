import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  withCredentials: true,
});

export type ApiError = {
  status: number;
  message: string;
};

export type ApiResult<T> =
  | { data: T; error?: undefined; }
  | { data?: undefined; error: ApiError; };

type FetcherOpts = { cookie?: string; };

export async function fetcher<T>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: unknown,
  opts?: FetcherOpts
): Promise<ApiResult<T>> {
  try {
    if (opts?.cookie && typeof window === 'undefined') {
      api.defaults.headers.Cookie = opts.cookie;
    }

    const response = await api.request<T>({ url, method, data: body });
    return { data: response.data };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status ?? 500;
      const message = err.response?.data?.message ?? err.message;
      return { error: { status, message } };
    }
    return { error: { status: 500, message: 'Unknown error' } };
  }
}