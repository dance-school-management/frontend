import { ApiResult, fetcher } from "./axios";
import {
  CourseAttendanceRateResponse,
  DanceCategoryStatsResponse,
  InstructorStatsResponse,
  MasteredDanceCategoriesResponse,
  TicketResponse
} from "@/lib/model/enroll";

export async function fetchTickets(cookie?: string): Promise<ApiResult<TicketResponse>> {
  return await fetcher("/enroll/ticket/student", "GET", undefined, { cookie });
}

export async function fetchMasteredDanceCategories(cookie?: string): Promise<ApiResult<MasteredDanceCategoriesResponse>> {
  return await fetcher("/enroll/progress/learnt-dance-categories", "GET", undefined, { cookie });
}

export async function fetchDanceCategoryStats(cookie?: string): Promise<ApiResult<DanceCategoryStatsResponse>> {
  return await fetcher("/enroll/progress/hours-spent/dance-categories", "GET", undefined, { cookie });
}

export async function fetchInstructorStats(cookie?: string): Promise<ApiResult<InstructorStatsResponse>> {
  return await fetcher("/enroll/progress/hours-spent/instructors", "GET", undefined, { cookie });
}

export async function fetchCourseAttendanceRate(cookie?: string): Promise<ApiResult<CourseAttendanceRateResponse>> {
  return await fetcher("/enroll/progress/courses-attendance-rates", "GET", undefined, { cookie });
}