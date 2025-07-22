// src/api/store.ts
import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';

export interface StoreInfo {
  id: string;
  name: string;
  address: string;
  category?: string;
  keyword?: string;
  latitude: number;
  longitude: number;
  brandName: string;
  brandImageUrl?: string;
}

export interface FetchStoresParams {
  keyword?: string;
  category?: string;
  latMin: number;
  latMax: number;
  lngMin: number;
  lngMax: number;
  centerLat: number;
  centerLng: number;
}

// axios 인스턴스 설정
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api/map',
  headers: { 'Content-Type': 'application/json' },
});

interface FetchStoresResponse {
  statusCode: number;
  message: string;
  data: StoreInfo[];
}

//제휴처 목록 조회
export const fetchStores = async (
  params: FetchStoresParams,
): Promise<StoreInfo[]> => {
  try {
    const response: AxiosResponse<FetchStoresResponse> = await apiClient.get(
      '/store',
      {
        params: {
          keyword: params.keyword ?? '',
          category: params.category ?? '',
          latMin: params.latMin,
          latMax: params.latMax,
          lngMin: params.lngMin,
          lngMax: params.lngMax,
          centerLat: params.centerLat,
          centerLng: params.centerLng,
        },
      },
    );

    return response.data.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ??
      error.message ??
      '매장 조회 중 알 수 없는 오류가 발생했습니다.';
    throw new Error(`매장 조회 실패: ${message}`);
  }
};
