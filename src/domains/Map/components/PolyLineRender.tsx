// components/PolylineRenderer.tsx
import { memo } from 'react';
import { Polyline } from 'react-kakao-maps-sdk';
import { getTrafficInfo } from './getTrafficInfo';
import type { RouteItem } from './sidebar/RoadSection';
import type { LatLng } from '../KakaoMapContainer';

function splitPathByRoad(
  fullPath: LatLng[],
  roadList: { distance: number; traffic_state: number }[],
): { path: LatLng[]; traffic_state: number }[] {
  const totalDistance = roadList.reduce((sum, r) => sum + r.distance, 0);
  const totalPoints = fullPath.length;
  let currentIdx = 0;
  let accumulated = 0;

  return roadList.map((r) => {
    accumulated += r.distance;
    const targetIdx = Math.round((accumulated / totalDistance) * totalPoints);
    const segment = {
      path: fullPath.slice(currentIdx, Math.max(targetIdx, currentIdx + 2)),
      traffic_state: r.traffic_state,
    };
    currentIdx = targetIdx;
    return segment;
  });
}

function PolylineRenderer({ route }: { route: RouteItem }) {
  return (
    <>
      {splitPathByRoad(route.path, route.road).map((segment, idx) => {
        const traffic = getTrafficInfo(segment.traffic_state);
        return (
          <Polyline
            key={`${route.directionid}-${idx}`}
            path={segment.path}
            strokeWeight={10}
            strokeColor={traffic.color}
            strokeOpacity={0.8}
            strokeStyle="solid"
          />
        );
      })}
    </>
  );
}

export default memo(PolylineRenderer);
