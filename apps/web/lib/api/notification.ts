import { Paginated } from "@/lib/model";
import { Notification } from "@/lib/model/notification";

import { ApiResult, fetcher } from "@/lib/api/axios";

export async function fetchNewNotifications(dateFrom?: string, limit = 50): Promise<ApiResult<Paginated<Notification>>> {
  const params = new URLSearchParams();
  if (dateFrom) params.set('dateFrom', dateFrom);
  params.set('page', '1');
  params.set('limit', String(limit));
  return await fetcher<Paginated<Notification>>(`/notification/notification?${params.toString()}`, "GET");
}