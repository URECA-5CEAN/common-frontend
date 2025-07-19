import type { LatLng } from '../KakaoMapContainer';

export const getDistance = (from: LatLng, to: LatLng): number => {
  const R = 6371; // 지구 반지름

  // 1. 위도/경도 차이를 라디안으로 변환
  const dLat = ((to.lat - from.lat) * Math.PI) / 180;
  const dLng = ((to.lng - from.lng) * Math.PI) / 180;

  // 2. Haversine 공식의 a 값 계산
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((from.lat * Math.PI) / 180) *
      Math.cos((to.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;

  // 3. 두 점 사이의 중앙각
  const centralAngle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // 4. 최종 거리 = 지구 반지름 · 중앙각
  return R * centralAngle;
};
