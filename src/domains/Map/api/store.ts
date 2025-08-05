import axios from 'axios';
import type { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

// axios 인스턴스 설정
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/map',
  headers: { 'Content-Type': 'application/json' },
});

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
  isRecommended?: string;
}

export interface FetchStoresParams {
  keyword?: string;
  category?: string;
  benefit?: string;
  latMin?: number;
  latMax?: number;
  lngMin?: number;
  lngMax?: number;
  centerLat?: number;
  centerLng?: number;
}

export interface FetchSearchParams {
  keyword?: string;
  category?: string;
  benefit?: string;
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

interface FetchBrandsProps {
  keyword?: string;
  sortBy?: string;
}

export interface BrandProps {
  id: string;
  name: string;
  image_url: string;
}

export interface BenefitProps {
  id: string;
  name: string;
  category: string;
  description: string;
}

interface FetchBrandsResponse {
  statusCode: number;
  message: string;
  data: BrandProps[];
}

export interface BenefitData {
  storeName: string;
  category: string;
  address: string;
  visitedAt: string;
  totalAmount: number;
  benefitAmount: number;
}

interface SaveBenefitDataResponse {
  statusCode: number;
  message: string;
  data: {
    statusCode: number;
    statusCodeName: string;
    detailMessage: string;
  };
}

//브랜드 조회
export const fetchBrands = async (
  params: FetchBrandsProps = {},
): Promise<BrandProps[]> => {
  try {
    const response: AxiosResponse<FetchBrandsResponse> = await apiClient.get(
      '/brand',
      {
        params: {
          keyword: params.keyword ?? '',
          sortBy: params.sortBy ?? '',
        },
      },
    );

    return response.data.data;
  } catch (error: unknown) {
    const axiosErr = error as AxiosError<{ message: string }>;
    const message =
      axiosErr.response?.data?.message ??
      axiosErr.message ??
      '브랜드  조회 중 알 수 없는 오류가 발생했습니다.';
    throw new Error(`브랜드 조회 실패: ${message}`);
  }
};

// 기존에 추가하신 fetchBenefits
export const fetchBenefits = async (
  brandId: string,
): Promise<BenefitProps[]> => {
  try {
    const response: AxiosResponse<{ data: BenefitProps[] }> =
      await apiClient.get(`/benefit/${brandId}`);
    return response.data.data;
  } catch (error: unknown) {
    const axiosErr = error as AxiosError<{ message: string }>;
    const message =
      axiosErr.response?.data?.message ??
      axiosErr.message ??
      '브랜드 혜택  조회 중 알 수 없는 오류가 발생했습니다.';
    throw new Error(`브랜드 혜택 조회 실패: ${message}`);
  }
};

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
          benefit: params.benefit ?? '',
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

//제휴처 목록 조회
export const fetchSearchStores = async (
  params: FetchSearchParams,
): Promise<StoreInfo[]> => {
  try {
    const response: AxiosResponse<FetchStoresResponse> = await apiClient.get(
      '/stores',
      {
        params: {
          keyword: params.keyword ?? '',
          category: params.category ?? '',
          benefit: params.benefit ?? '',
        },
      },
    );

    return response.data.data;
  } catch (error: unknown) {
    const axiosErr = error as AxiosError<{ message: string }>;
    const message =
      axiosErr.response?.data?.message ??
      axiosErr.message ??
      '제휴처 목록 검색 중 알 수 없는 오류가 발생했습니다.';
    throw new Error(`제휴처 목록 검색 실패: ${message}`);
  }
};

//즐겨찾기 조회
export async function fetchBookmark(category?: string): Promise<StoreInfo[]> {
  const token = localStorage.getItem('authToken');
  if (!token) return [];
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
  const token = localStorage.getItem('authToken');
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
  const token = localStorage.getItem('authToken');
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

export async function uploadReceiptImage(
  file: File,
  userEmail: string,
): Promise<BenefitData> {
  const formData = new FormData();
  formData.append('imageFile', file);
  try {
    const token = localStorage.getItem('authToken');
    const response: AxiosResponse<{ data: BenefitData }> = await apiClient.post(
      '/ocr',
      formData,
      {
        headers: {
          Authorization: token,
          'Content-Type': 'multipart/form-data',
          'X-User-email': userEmail,
        },
      },
    );
    return response.data.data;
  } catch (error: unknown) {
    const axiosErr = error as AxiosError<{ message: string }>;
    const message =
      axiosErr.response?.data?.message ??
      axiosErr.message ??
      'OCR 업로드 중 알 수 없는 오류가 발생했습니다.';
    throw new Error(`OCR 업로드 실패: ${message}`);
  }
}

export async function saveBenefitData(
  data: BenefitData,
  benefitAmount: number,
  userEmail: string,
): Promise<SaveBenefitDataResponse> {
  try {
    const token = localStorage.getItem('authToken');
    const response: AxiosResponse<SaveBenefitDataResponse> =
      await apiClient.post(`/ocr/save?benefitAmount=${benefitAmount}`, data, {
        headers: {
          Authorization: token,
          'X-User-email': userEmail,
        },
      });

    return response.data;
  } catch (error: unknown) {
    const axiosErr = error as AxiosError<{ message: string }>;
    const message =
      axiosErr.response?.data?.message ??
      axiosErr.message ??
      'OCR 인증저장 중 알 수 없는 오류가 발생했습니다.';
    throw new Error(`OCR 인증저장 실패: ${message}`);
  }
}
