import { Paginated } from '@/lib/model';
import { Notification } from '@/lib/model/notification';
import { AdditionalProductData, DanceCategory } from '@/lib/model/product';
import { InstructorsResponse, GetProfileResponse } from '@/lib/model/profile';
import { IApiScheduleResponse, IEvent } from '@/modules/calendar/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { ApiError } from './axios';


import { fetchNewNotifications, getNotificationsStatus, NotificationsStatusResponse } from '@/lib/api/notification';
import { fetchAdditionalProductData, fetchDanceCategories, fetchSchedule } from '@/lib/api/product';
import { fetchInstructors, fetchUserProfile } from '@/lib/api/profile';
import { transformScheduleToEvents } from '@/modules/calendar/helpers';
import { useUserStore } from '../store';

export function useAdditionalProductData() {
  return useQuery<AdditionalProductData, ApiError>({
    queryKey: ['additionalProductData'],
    queryFn: async () => {
      const result = await fetchAdditionalProductData();
      if (result.error) throw result.error;
      return result.data!;
    },
    staleTime: 15 * 60 * 1000,
  });
}

export function useInstructors() {
  return useQuery<InstructorsResponse, ApiError>({
    queryKey: ['instructors'],
    queryFn: async () => {
      const result = await fetchInstructors();
      if (result.error) throw result.error;
      return result.data!;
    },
  });
}

export function useDanceCategories() {
  return useQuery<DanceCategory[], ApiError>({
    queryKey: ['danceCategories'],
    queryFn: async () => {
      const result = await fetchDanceCategories();
      if (result.error) throw result.error;
      return result.data!;
    },
  });
}

export function useUserProfile() {
  return useQuery<GetProfileResponse, ApiError>({
    queryKey: ['user:profile'],
    queryFn: async () => {
      const result = await fetchUserProfile(typeof document !== 'undefined' ? document.cookie : undefined);
      if (result.error) throw result.error;
      return result.data!;
    },
  });
}

export function useScheduleEvents(selectedDate: Date) {
  const dateFrom = new Date(selectedDate);
  const dateTo = new Date(selectedDate);

  dateFrom.setDate(selectedDate.getDate() - 14);
  dateTo.setDate(selectedDate.getDate() + 14);

  const dateFromStr = dateFrom.toISOString().split('T')[0]!;
  const dateToStr = dateTo.toISOString().split('T')[0]!;

  return useQuery<IEvent[], ApiError>({
    queryKey: ['schedule', dateFromStr, dateToStr],
    queryFn: async () => {
      const result = await fetchSchedule(dateFromStr, dateToStr);
      if (result.error) throw result.error;
      if (!result.data) throw new Error('No data received from schedule API');

      return transformScheduleToEvents(result.data as IApiScheduleResponse);
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function useNotificationsStatus() {
  return useQuery<NotificationsStatusResponse, ApiError>({
    queryKey: ['notifications:status'],
    queryFn: async () => {
      const result = await getNotificationsStatus(typeof document !== 'undefined' ? document.cookie : undefined);
      if (result.error) throw result.error;
      return result.data!;
    },
  });
}

export function useNotificationsPolling(limit = 50) {
  const { user } = useUserStore();
  const queryClient = useQueryClient();
  const lastSeenRef = useRef<string | undefined>(undefined);

  const enabled = user !== null;

  const pollQuery = useQuery<Paginated<Notification>, ApiError>({
    queryKey: ['notifications:poll'],
    queryFn: async () => {
      const result = await fetchNewNotifications(lastSeenRef.current, limit);
      if (result.error) throw result.error;
      if (!result.data) throw new Error('No data received from notifications API');
      return result.data;
    },
    refetchInterval: 60 * 1000, // 1 minute
    refetchIntervalInBackground: true,
    enabled: enabled,
  });

  useEffect(() => {
    const cached = queryClient.getQueryData<Notification[]>(['notifications:all']);
    if (!cached && pollQuery.data?.data?.length) {
      const sorted = [...pollQuery.data.data].sort(
        (a, b) => new Date(b.sendDate).getTime() - new Date(a.sendDate).getTime()
      );
      queryClient.setQueryData(['notifications:all'], sorted);
    }
  }, [pollQuery.data, queryClient]);

  useEffect(() => {
    const resp = pollQuery.data;
    if (!resp?.data?.length) return;

    const newest = resp.data.reduce((a, b) =>
      new Date(a.sendDate).getTime() > new Date(b.sendDate).getTime() ? a : b
    ).sendDate;

    lastSeenRef.current = newest;

    const old = queryClient.getQueryData<Notification[]>(['notifications:all']) ?? [];
    const mergedMap = new Map<number, Notification>();
    old.forEach((n) => mergedMap.set(n.id, n));
    resp.data.forEach((n) => mergedMap.set(n.id, n));

    const mergedArr = Array.from(mergedMap.values()).sort(
      (a, b) => new Date(b.sendDate).getTime() - new Date(a.sendDate).getTime()
    );

    queryClient.setQueryData(['notifications:all'], mergedArr);
  }, [pollQuery.data, queryClient]);

  const cachedData = queryClient.getQueryData<Notification[]>(['notifications:all']);
  const notificationsQuery = useQuery<Notification[], ApiError>({
    queryKey: ['notifications:all'],
    queryFn: async () => {
      return cachedData ?? [];
    },
    enabled: true,
    initialData: cachedData ?? pollQuery.data?.data ?? [],
    placeholderData: pollQuery.data?.data ?? [],
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const notifications = notificationsQuery.data ?? [];

  const markAsRead = (ids: number[]) => {
    queryClient.setQueryData<Notification[]>(['notifications:all'], (old = []) => {
      return old.map((notification) =>
        ids.includes(notification.id)
          ? { ...notification, hasBeenRead: true }
          : notification
      );
    });
  };

  return {
    ...pollQuery,
    notifications,
    refresh: () => queryClient.invalidateQueries({ queryKey: ['notifications:poll'] }),
    markAsRead,
    lengthUnread: notifications.filter((notification) => !notification.hasBeenRead).length,
    removeAll: () => {
      queryClient.removeQueries({ queryKey: ['notifications:all'] });
      queryClient.removeQueries({ queryKey: ['notifications:poll'] });
      queryClient.removeQueries({ queryKey: ['notifications:status'] });
    },
  };
}