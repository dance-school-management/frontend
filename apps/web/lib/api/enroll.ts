import {
  CourseAttendanceRateResponse,
  DanceCategoryStatsResponse,
  InstructorStatsResponse,
  MasteredDanceCategoriesResponse,
  OrderResponse,
  TicketResponse
} from "@/lib/model/enroll";

import { ApiResult, fetcher } from "./axios";

export async function fetchTickets(cookie?: string): Promise<ApiResult<TicketResponse>> {
  return await fetcher("/enroll/ticket/retrieve", "GET", undefined, { cookie });
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

export async function checkTicketValidity(qrCodeUUID: string, cookie?: string): Promise<ApiResult<unknown>> {
  return await fetcher(`/enroll/ticket/scan?qrCodeUUID=${qrCodeUUID}`, "GET", undefined, { cookie });
}

export async function markTicketAsUsed(qrCodeUUID: string, cookie?: string): Promise<ApiResult<unknown>> {
  return await fetcher(`/enroll/ticket/scan`, "PUT", { qrCodeUUID }, { cookie });
}

export async function createCourseOrder(courseId: number, cookie?: string) {
  return await fetcher<OrderResponse>(`/enroll/order/course`, "POST", { courseId }, { cookie });
}

export async function createClassOrder(classId: number, cookie?: string) {
  return await fetcher<OrderResponse>(`/enroll/order/class`, "POST", { classId }, { cookie });
}