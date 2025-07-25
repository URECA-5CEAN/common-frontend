import { useQuery } from '@tanstack/react-query';
import type { FetchStoresParams, StoreInfo } from '../api/store';
import { fetchAiRecommendedStore } from '../api/ai';

export function useAiRecommend(
  params?: FetchStoresParams,
  enabled: boolean = true,
) {
  return useQuery<StoreInfo>({
    queryKey: ['airecommendedstore', params],
    queryFn: () => fetchAiRecommendedStore(params),
    enabled: !!params,
    staleTime: 1000 * 60 * 1,
    refetchOnWindowFocus: false,
    retry: false,
  });
}
