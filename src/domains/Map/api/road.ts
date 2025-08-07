import axios from 'axios';
import type { AxiosError, AxiosInstance } from 'axios';
import type { LatLng } from '../KakaoMapContainer';

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/map',
  headers: { 'Content-Type': 'application/json' },
});

//도착, 출발지
interface Coordinate {
  name: string;
  x: number;
  y: number;
  angle?: number;
}

//경유지
interface Waypoint {
  name: string;
  x: number;
  y: number;
}

// 길찾기 요청값
export interface DirectionRequestBody {
  origin: Coordinate;
  destination: Coordinate;
  waypoints?: Waypoint[];
  priority?: 'RECOMMEND' | 'FASTEST' | 'SHORTEST'; // 추천,최소,최단 경로
  car_fuel?: 'GASOLINE' | 'DIESEL' | 'EV' | 'HYBRID'; // 차 종류
  car_hipass?: boolean;
  alternatives?: boolean;
  road_details?: boolean;
  summary?: boolean;
}

// 응답 값
export interface DirectionResponse {
  statusCode: number;
  message: string;
  data: {
    id: string;
    trans_id: string;
    routes: RouteAI[];
  };
  bookmark?: boolean;
  scenario?: string;
}

//루트 별 코드 및 메세지
export interface Route {
  result_code: number;
  result_msg: string;
  summary: RouteSummary;
  sections: RouteSection[];
}

//길찾기 모든 값
export interface RouteSummary {
  origin: CoordPoint;
  destination: CoordPoint;
  waypoints: CoordPoint[];
  priority: string;
  bound: BoundBox;
  fare: {
    taxi: number;
    toll: number;
  };
  distance: number; // meters
  duration: number; // seconds
}

export interface CoordPoint {
  name: string;
  x: number;
  y: number;
}

export interface BoundBox {
  min_x: number;
  min_y: number;
  max_x: number;
  max_y: number;
}

export interface RouteSection {
  distance: number;
  duration: number;
  bound: BoundBox;
  roads: Road[];
  guides: Guide[];
}

//도로별 정보
export interface Road {
  name: string;
  distance: number;
  duration: number;
  traffic_speed?: number;
  traffic_state: number; // 원할 , 서행, 정체
  vertexes?: number[];
  path?: LatLng[];
}

//구간(도로)별 가이드
export interface Guide {
  name: string;
  x: number;
  y: number;
  distance: number;
  duration: number;
  type: number;
  guidance: string;
  road_index: number;
}

// const token = localStorage.getItem('authToken');

export async function findDirectionPath(
  body: DirectionRequestBody,
): Promise<DirectionAIResponse> {
  try {
    const token = localStorage.getItem('authToken');
    const response = await apiClient.post<DirectionAIResponse>(
      '/direction/path',
      body,
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
      '경로 탐색 요청 중 오류가 발생했습니다.';
    throw new Error(`경로 요청 실패: ${message}`);
  }
}

export async function getDirectionPath(): Promise<DirectionBookmarkResponse> {
  try {
    const token = localStorage.getItem('authToken');
    const response = await apiClient.get<DirectionBookmarkResponse>(
      '/direction',
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
      '경로 탐색 요청 중 오류가 발생했습니다.';
    throw new Error(`경로 요청 실패: ${message}`);
  }
}

export interface DirectionBookmark {
  id: string;
  trans_id: string;
  routes: RouteAI[];
  userId: string;
  bookmark: boolean;
}

export interface DirectionBookmarkResponse {
  statusCode: number;
  message: string;
  data: DirectionBookmark[];
}

export async function fetchDirectionBookmarks(): Promise<DirectionBookmark[]> {
  try {
    const token = localStorage.getItem('authToken');
    const response = await apiClient.get<DirectionBookmarkResponse>(
      '/direction/bookmark',
      {
        headers: {
          Authorization: token,
        },
      },
    );

    return response.data.data;
  } catch (error: unknown) {
    const axiosErr = error as AxiosError<{ message: string }>;
    const message =
      axiosErr.response?.data?.message ??
      axiosErr.message ??
      '즐겨찾기 목록을 불러오는 중 오류가 발생했습니다.';
    throw new Error(`즐겨찾기 조회 실패: ${message}`);
  }
}

export async function updateBookmarkStatus(
  id: string,
  bookmark: boolean,
): Promise<DirectionBookmarkResponse> {
  try {
    const token = localStorage.getItem('authToken');
    const res = await apiClient.put<DirectionBookmarkResponse>(
      `/direction`,
      {},
      {
        headers: {
          Authorization: token,
        },
        params: { id, bookmark },
      },
    );
    return res.data;
  } catch (error) {
    const axiosErr = error as AxiosError<{ message: string }>;
    const message =
      axiosErr.response?.data?.message ??
      axiosErr.message ??
      '즐겨찾기 수정 중 오류가 발생했습니다.';
    throw new Error(`즐겨찾기 수정 실패: ${message}`);
  }
}

export async function deleteDirectionPath(id: string): Promise<void> {
  try {
    const token = localStorage.getItem('authToken');
    await apiClient.delete(`/direction/${id}`, {
      headers: {
        Authorization: token,
      },
    });
  } catch (error) {
    const axiosErr = error as AxiosError<{ message: string }>;
    const message =
      axiosErr.response?.data?.message ??
      axiosErr.message ??
      '즐겨찾기 수정 중 오류가 발생했습니다.';
    throw new Error(`즐겨찾기 수정 실패: ${message}`);
  }
}

export function convertBookmarkToDirectionResponse(
  bookmark: DirectionBookmark,
): DirectionResponse {
  return {
    statusCode: 200,
    message: 'OK',
    data: {
      id: bookmark.id,
      trans_id: bookmark.trans_id,
      routes: bookmark.routes,
    },
    bookmark: bookmark.bookmark,
  };
}

export interface DirectionAIResponse {
  statusCode: number;
  message: string;
  data: {
    id: string;
    trans_id: string;
    routes: RouteAI[];
    scenario: string;
    bookmark?: boolean;
  };
}

export interface RouteAI {
  result_code: number;
  result_msg: string;
  summary: RouteAISummary;
  sections: RouteSection[];
  scenario?: string;
  bookmark?: boolean;
}

export interface WaypointAI {
  name: string;
  x: number;
  y: number;
  recommendReason?: string;
}

export interface RouteAISummary {
  origin: CoordPoint;
  destination: CoordPoint;
  waypoints: WaypointAI[];
  priority: string;
  bound: BoundBox;
  fare: {
    taxi: number;
    toll: number;
  };
  distance: number; // meters
  duration: number; // seconds
}

export async function findDirectionPathAI(
  body: DirectionRequestBody,
): Promise<DirectionAIResponse> {
  try {
    const token = localStorage.getItem('authToken');
    const response = await apiClient.post<DirectionAIResponse>(
      '/direction/pathByLLM',
      body,
      {
        headers: {
          Authorization: token,
        },
      },
    );
    return response.data;
  } catch (error: unknown) {
    const axiosErr = error as AxiosError<{ message: string }>;
    console.error(error);
    const message =
      axiosErr.response?.data?.message ??
      axiosErr.message ??
      '경로 탐색 요청 중 오류가 발생했습니다.';
    throw new Error(`경로 요청 실패: ${message}`);
  }
}
