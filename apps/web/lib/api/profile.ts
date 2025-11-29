
import { GetProfileResponse, InstructorsResponse, InstructorWithDetails, ProfileData } from "@/lib/model/profile";

import { ApiResult, fetcher } from "./axios";

export async function fetchInstructors(cookie?: string): Promise<ApiResult<InstructorsResponse>> {
  return await fetcher("/profile/public/instructors", "GET", undefined, { cookie });
}

export async function fetchInstructor(id: number, cookie: string): Promise<ApiResult<InstructorWithDetails>> {
  return await fetcher(`/profile/public/instructors/${id}`, "GET", undefined, { cookie });
}

export async function fetchUserProfile(cookie?: string): Promise<ApiResult<GetProfileResponse>> {
  return await fetcher("/profile/user/profile", "GET", undefined, { cookie });
}

export async function updateUserProfile(
  formData: FormData,
  cookie?: string
): Promise<ApiResult<ProfileData>> {
  return await fetcher<ProfileData>("/profile/user/profile", "PUT", formData, { cookie });
}

export async function searchUsers(query: string, cookie?: string): Promise<ApiResult<ProfileData[]>> {
  return await fetcher<ProfileData[]>(`/profile/search?q=${query}`, "GET", undefined, { cookie });
}