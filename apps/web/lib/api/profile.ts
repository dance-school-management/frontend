
import { ApiResult, fetcher } from "./axios";
import { InstructorsResponse, InstructorWithDetails } from "@/lib/model/profile";

export async function fetchInstructors(cookie: string): Promise<ApiResult<InstructorsResponse>> {
  return await fetcher("/profile/instructors", "GET", undefined, { cookie });
}

export async function fetchInstructor(id: number, cookie: string): Promise<ApiResult<InstructorWithDetails>> {
  return await fetcher(`/profile/instructors/${id}`, "GET", undefined, { cookie });
}