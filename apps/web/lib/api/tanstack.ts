import { useQuery } from '@tanstack/react-query';
import { ApiError } from './axios';
import { AdditionalProductData } from '@/lib/model/product';
import { InstructorResponse } from '@/lib/model/profile';

import { fetchAdditionalProductData } from '@/lib/api/product';
import { fetchInstructors } from '@/lib/api/profile';

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