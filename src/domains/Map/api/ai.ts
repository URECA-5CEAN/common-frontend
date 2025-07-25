import axios from 'axios';
import type { AxiosError, AxiosInstance } from 'axios';
import type { FetchStoresParams, StoreInfo } from './store';

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/ai',
  headers: { 'Content-Type': 'application/json' },
});

const token = import.meta.env.VITE_AUTH_TOKEN;

export async function fetchAiRecommendedStore(
  params: FetchStoresParams,
): Promise<StoreInfo> {
  try {
    const response = await apiClient.post<StoreInfo>(
      '/recommend/store',
      params,
      {
        headers: {
          Authorization: token,
        },
      },
    );

    return response.data;
  } catch (error: unknown) {
    const axiosErr = error as AxiosError<{ message: string }>;
    const message =
      axiosErr.response?.data?.message ??
      axiosErr.message ??
      'AI 제휴처 추천  조회 중 알 수 없는 오류가 발생했습니다.';
    throw new Error(`AI 제휴처 추천  조회 실패: ${message}`);
  }
}
