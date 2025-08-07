import axios from 'axios';
import type { AxiosError, AxiosInstance } from 'axios';
import type { FetchStoresParams, StoreInfo } from './store';

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/ai',
  headers: { 'Content-Type': 'application/json' },
});

// const token = localStorage.getItem('authToken');
export interface AiRecommendResult {
  reason: string;
  store: StoreInfo;
}

export async function fetchAiRecommendedStore(
  params: FetchStoresParams,
): Promise<AiRecommendResult | null> {
  const token = localStorage.getItem('authToken');
  if (!token) {
    return null;
  }
  try {
    const { data } = await apiClient.post<{ data: AiRecommendResult }>(
      '/recommend/store',
      params,
      {
        headers: {
          Authorization: token,
        },
      },
    );

    return data.data;
  } catch (error: unknown) {
    const axiosErr = error as AxiosError<{ message: string }>;
    const message =
      axiosErr.response?.data?.message ??
      axiosErr.message ??
      'AI 제휴처 추천  조회 중 알 수 없는 오류가 발생했습니다.';
    throw new Error(`AI 제휴처 추천  조회 실패: ${message}`);
  }
}
