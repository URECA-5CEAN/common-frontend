import type { Road } from '../api/road';
import { getTrafficInfo } from './getTrafficInfo';

interface MajorRoad {
  name: string;
  distanceKm: string;
  traffic?: {
    label: string;
    color: string;
  };
}

export function MajorLoads(roads: Road[] = [], maxCount = 3): MajorRoad[] {
  const namedRoads = roads.filter((road) => road.name?.trim());

  // 이름별로 distance + traffic_state 집계
  const roadStats = new Map<string, { distance: number; states: number[] }>();

  for (const road of namedRoads) {
    const existing = roadStats.get(road.name);
    if (existing) {
      existing.distance += road.distance || 0;
      if (road.traffic_state !== undefined) {
        existing.states.push(road.traffic_state);
      }
    } else {
      roadStats.set(road.name, {
        distance: road.distance || 0,
        states: road.traffic_state !== undefined ? [road.traffic_state] : [],
      });
    }
  }

  return [...roadStats.entries()]
    .sort((a, b) => b[1].distance - a[1].distance)
    .slice(0, maxCount)
    .map(([name, { distance, states }]) => {
      // 가장 높은 혼잡도를 대표값으로 선택 (최댓값 기준)
      const trafficState = states.length > 0 ? Math.max(...states) : undefined;
      const traffic =
        trafficState !== undefined ? getTrafficInfo(trafficState) : undefined;

      return {
        name,
        distanceKm: `${(distance / 1000).toFixed(1)}km`,
        traffic,
      };
    });
}
