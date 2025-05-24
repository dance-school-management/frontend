import axios from "axios";
import { FormEvent } from "react";
import { toast } from "sonner";

import { Course, AdditionalProductData } from "@/lib/model/product";
import { api, ApiResult, fetcher } from "./axios";

export async function createCourse(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const data = Object.fromEntries(formData);

  const reqData = {
    name: data.name,
    isConfirmation: data.confirmation === "on",
  };

  try {
    const res = await api.post("/product/cms/course/new", reqData);
    if (res.status !== 201) {
      toast.error("Failed to create course");
      return;
    }

    const { id } = res.data;
    toast.success("Course created successfully! Redirecting...");
    setTimeout(() => {
      window.location.href = `/admin/courses/${id}`;
    }, 2000);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.data) {
        const status = error.response.status;
        const { message } = error.response.data;
        if (status === 400 || status === 409) {
          toast.error(message);
        } else {
          toast.error("An unexpected error occurred");
        }
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  }
}

export async function fetchCourse(
  id: number,
): Promise<ApiResult<Course>> {
  return await fetcher<Course>(`/product/cms/course/${id}`);
}

export async function fetchCourses(): Promise<ApiResult<Course[]>> {
  return await fetcher<Course[]>("/product/cms/course");
}

export async function fetchAdditionalProductData(): Promise<ApiResult<AdditionalProductData>> {
  return await fetcher<AdditionalProductData>("/product/cms/aggregations/class-template-creation-data");
}