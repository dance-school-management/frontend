import { useQuery } from '@tanstack/react-query';
import { ApiError } from './axios';
import { AdditionalProductData } from '@/lib/model/product';
import { InstructorResponse } from '@/lib/model/profile';
import { IEvent, IApiScheduleResponse } from '@/modules/calendar/types';

import { fetchAdditionalProductData, fetchSchedule } from '@/lib/api/product';
import { fetchInstructors } from '@/lib/api/profile';
import { transformScheduleToEvents } from '@/modules/calendar/helpers';

import { fetchAdditionalProductData as fetchAdditionalProductDataMock } from '@/mocks/product';
import { fetchInstructors as fetchInstructorsMock } from '@/mocks/profile';

export function useAdditionalProductData() {
  return useQuery<AdditionalProductData, ApiError>({
    queryKey: ['additionalProductData'],
    queryFn: async () => {
      const result = process.env.NEXT_PUBLIC_USE_MOCKS === 'true' ? await fetchAdditionalProductDataMock() : await fetchAdditionalProductData();
      if (result.error) throw result.error;
      return result.data!;
    },
    staleTime: 15 * 60 * 1000,
  });
}

export function useInstructors() {
  return useQuery<InstructorResponse, ApiError>({
    queryKey: ['instructors'],
    queryFn: async () => {
      const result = process.env.NEXT_PUBLIC_USE_MOCKS === 'true' ? await fetchInstructorsMock() : await fetchInstructors();
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