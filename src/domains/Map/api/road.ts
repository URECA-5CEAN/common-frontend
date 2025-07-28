import axios from 'axios';
import type { AxiosError, AxiosInstance } from 'axios';

// axios 인스턴스 설정
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/map',
  headers: { 'Content-Type': 'application/json' },
});

interface Coordinate {
  x: number;
  y: number;
  angle?: number;
}

interface Waypoint {
  name: string;
  x: number;
  y: number;
}

interface DirectionRequestBody {
  origin: Coordinate;
  destination: Coordinate;
  waypoints?: Waypoint[];
  priority: 'RECOMMEND' | 'FASTEST' | 'SHORTEST';
  car_fuel?: 'GASOLINE' | 'DIESEL' | 'EV' | 'HYBRID';
  car_hipass?: boolean;
  alternatives?: boolean;
  road_details?: boolean;
  summary?: boolean;
}

export interface DirectionResponse {
  statusCode: number;
  message: string;
  data: {
    trans_id: string;
    routes: Route[];
  };
}

export interface Route {
  result_code: number;
  result_msg: string;
  summary: RouteSummary;
  sections: RouteSection[];
}

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

export interface Road {
  name: string;
  distance: number;
  duration: number;
  traffic_speed: number;
  traffic_state: number; // 0~3 등급
  vertexes: number[]; // [x1, y1, x2, y2, ...]
}

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

export async function findDirectionPath(
  body: DirectionRequestBody,
  token: string,
): Promise<DirectionResponse> {
  try {
    const response = await apiClient.post<DirectionResponse>(
      '/map/direction/path',
      body,
      {
        headers: {
          Authorization: token,
        },
      },
    );
    console.log(response);
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
