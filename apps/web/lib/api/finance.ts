import { AggregationPeriod, CourseData, RevenueData } from "../model/finance";
import { ApiResult, fetcher } from "./axios";

export async function getRevenue(start?: string, end?: string, period?: AggregationPeriod, cookie?: string): Promise<ApiResult<RevenueData>> {
  const params = new URLSearchParams();
  if (start) params.set("startDate", start);
  if (end) params.set("endDate", end);
  if (period) params.set("period", period);
  return await fetcher<RevenueData>(`/enroll/admin/metrics/revenue?${params.toString()}`, "GET", undefined, { cookie });
}

export async function getBestPerformingCourses(start?: string, end?: string, limit?: number, cookie?: string): Promise<ApiResult<CourseData>> {
  const params = new URLSearchParams();
  if (start) params.set("startDate", start);
  if (end) params.set("endDate", end);
  if (limit) params.set("limit", limit.toString());
  return await fetcher<CourseData>(`/enroll/admin/metrics/courses/top?${params.toString()}`, "GET", undefined, { cookie });
}