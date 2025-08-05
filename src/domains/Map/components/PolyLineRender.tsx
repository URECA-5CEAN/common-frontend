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
  const segments = [];

  for (let i = 0; i < roadList.length; i++) {
    const r = roadList[i];
    accumulated += r.distance;
    const targetIdx =
      i === roadList.length - 1
        ? totalPoints
        : Math.round((accumulated / totalDistance) * totalPoints);
    // 첫 구간: 그대로
    // 이후 구간: 앞 segment의 마지막 점과 현재 구간의 첫 점을 겹치게
    let segmentPath;
    if (i === 0) {
      segmentPath = fullPath.slice(currentIdx, targetIdx);
    } else {
      segmentPath = fullPath.slice(currentIdx - 1, targetIdx);
    }

    segments.push({
      path: segmentPath,
      traffic_state: r.traffic_state,
    });
    currentIdx = targetIdx;
  }
  return segments;
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
