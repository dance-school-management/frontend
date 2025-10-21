
import { ApiResult, fetcher } from "./axios";
import { InstructorResponse } from "@/lib/model/profile";

export async function fetchInstructors(cookie: string): Promise<ApiResult<InstructorResponse>> {
  return await fetcher("/profile/instructors", "GET", undefined, { cookie });
}

export async function fetchInstructor(id: number, cookie: string): Promise<ApiResult<InstructorResponse>> {
  return await fetcher(`/profile/instructors/${id}`, "GET", undefined, { cookie });
}