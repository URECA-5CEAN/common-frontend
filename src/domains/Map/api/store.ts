// src/api/store.ts
import axios from 'axios';
import type { AxiosInstance } from 'axios';

/**
 * 매장 정보 타입
 */
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

/**
 * 브랜드 정보 타입
 */
export interface BrandInfo {
  id: string;
  name: string;
  logoUrl?: string;
  // 필요한 추가 필드...
}

export type SortOrder = 'asc' | 'desc';

/**
 * 매장 조회 파라미터
 */
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

/**
 * 브랜드 조회 파라미터
 */
export interface FetchBrandsParams {
  keyword?: string;
  sortBy?: SortOrder;
}

// axios 인스턴스 설정
const apiClient: AxiosInstance = axios.create({
  baseURL: 'http://15.164.81.45/api/map',
  headers: { 'Content-Type': 'application/json' },
});

/**
 * 매장 목록을 조회합니다.
 * @param params 검색 및 필터링 파라미터
 */

export async function fetchStores(
  params: FetchStoresParams,
): Promise<StoreInfo[]> {
  try {
    const response = await apiClient.get<StoreInfo[]>('/store', {
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
    });
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      '매장 조회 중 알 수 없는 오류가 발생했습니다.';
    throw new Error(`매장 조회 실패: ${message}`);
  }
}

/**
 * 브랜드 목록을 조회합니다.
 * @param params.keyword 검색어. 생략 시 전체 조회
 * @param params.sortBy 정렬 순서. 'asc' | 'desc'
 */
export async function fetchStoreBrands(
  params: FetchBrandsParams = {},
): Promise<BrandInfo[]> {
  try {
    const response = await apiClient.get<BrandInfo[]>('/brand', {
      params: {
        keyword: params.keyword ?? '',
        sortBy: params.sortBy ?? '',
      },
    });
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      '브랜드 조회 중 알 수 없는 오류가 발생했습니다.';
    throw new Error(`브랜드 조회 실패: ${message}`);
  }
}
