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

interface MarkNotificationAsReadResponse {
  userId: string;
  notificationId: number;
  hasBeenRead: boolean;
};

export async function markNotificationAsRead(id: number, cookie?: string): Promise<ApiResult<MarkNotificationAsReadResponse>> {
  return await fetcher<MarkNotificationAsReadResponse>(`/notification/notification/status/${id}`, "PUT", { hasBeenRead: true }, { cookie });
}

interface RegisterForNotificationsResponse {
  message: string;
}

export async function registerForNotifications(cookie?: string): Promise<ApiResult<RegisterForNotificationsResponse>> {
  return await fetcher<RegisterForNotificationsResponse>(`/notification/notification/register`, "POST", { cookie });
}

interface ToggleNotificationsResponse {
  notificationsEnabilityStatus: boolean;
}

export async function toggleNotifications(enable: boolean, cookie?: string): Promise<ApiResult<ToggleNotificationsResponse>> {
  return await fetcher<ToggleNotificationsResponse>(`/notification/notification/toggle`, "POST", { enable }, { cookie });
}

export interface NotificationsStatusResponse {
  isRegistered: boolean;
  isRegisteredForPushNotifications: boolean;
  hasEnabledNotifications: boolean | undefined;
}

export async function getNotificationsStatus(cookie?: string): Promise<ApiResult<NotificationsStatusResponse>> {
  return await fetcher<NotificationsStatusResponse>(`/notification/notification/status`, "GET", undefined, { cookie });
}