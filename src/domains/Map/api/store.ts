// src/api/store.ts
import axios from 'axios';
import type { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

// axios 인스턴스 설정
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/map',
  headers: { 'Content-Type': 'application/json' },
});

const token = import.meta.env.VITE_AUTH_TOKEN;
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

interface FetchStoresResponse {
  statusCode: number;
  message: string;
  data: StoreInfo[];
}

interface CreateDeleteStoresResponse {
  statusCode: number;
  message: string;
  data: string;
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
  } catch (error: unknown) {
    const axiosErr = error as AxiosError<{ message: string }>;
    const message =
      axiosErr.response?.data?.message ??
      axiosErr.message ??
      '제휴처 목록 조회 중 알 수 없는 오류가 발생했습니다.';
    throw new Error(`제휴처 목록 조회 실패: ${message}`);
  }
};

//즐겨찾기 조회
export async function fetchBookmark(category?: string): Promise<StoreInfo[]> {
  try {
    const response: AxiosResponse<FetchStoresResponse> = await apiClient.get(
      '/bookmark',
      {
        headers: {
          Authorization: token,
        },
        params: {
          ...(category ? { category } : {}),
        },
      },
    );

    return response.data.data;
  } catch (error: unknown) {
    const axiosErr = error as AxiosError<{ message: string }>;
    const message =
      axiosErr.response?.data?.message ??
      axiosErr.message ??
      '즐겨찾기 목록 조회 중 알 수 없는 오류가 발생했습니다.';
    throw new Error(`즐겨찾기 조회 실패: ${message}`);
  }
}

/** 즐겨찾기 등록 */
export async function createBookmark(storeId: string): Promise<string> {
  try {
    const response = await apiClient.post<CreateDeleteStoresResponse>(
      `/bookmark/${storeId}`, // URL에 storeId 추가
      {}, // body가 필요 없으면 빈 객체
      {
        headers: { Authorization: token },
      },
    );

    return response.data.data;
  } catch (error: unknown) {
    const axiosErr = error as AxiosError<{ message: string }>;
    const message =
      axiosErr.response?.data?.message ??
      axiosErr.message ??
      '즐겨찾기 등록 중 알 수 없는 오류가 발생했습니다.';
    throw new Error(`즐겨찾기 등록 실패: ${message}`);
  }
}

/** 즐겨찾기 삭제 */
export async function deleteBookmark(storeId: string): Promise<string> {
  try {
    const response = await apiClient.delete<CreateDeleteStoresResponse>(
      `/bookmark/${storeId}`, // URL에 storeId 추가
      {
        headers: { Authorization: token },
      },
    );
    return response.data.data;
  } catch (error: unknown) {
    const axiosErr = error as AxiosError<{ message: string }>;
    const message =
      axiosErr.response?.data?.message ??
      axiosErr.message ??
      '즐겨찾기 삭제 중 알 수 없는 오류가 발생했습니다.';
    throw new Error(`즐겨찾기 삭제 실패: ${message}`);
  }
}
