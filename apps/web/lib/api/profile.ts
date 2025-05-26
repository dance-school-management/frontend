
import { ApiResult, fetcher } from "./axios";
import { InstructorResponse } from "@/lib/model/profile";

export async function fetchInstructors(): Promise<ApiResult<InstructorResponse>> {
  return await fetcher("/profile/unprotected/instructors");
}