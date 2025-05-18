import axios from "axios";
import { useUserStore } from "@/lib/store";
import { redirect, RedirectType } from "next/navigation";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        useUserStore.getState().setUser(null);
        redirect('/login', RedirectType.replace);
      }
    }
    return Promise.reject(error);
  }
);

export type ApiError = {
  status: number;
  message: string;
};

export type ApiResult<T> =
  | { data: T; error?: undefined; }
  | { data?: undefined; error: ApiError; };

export async function fetcher<T>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: unknown
): Promise<ApiResult<T>> {
  try {
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