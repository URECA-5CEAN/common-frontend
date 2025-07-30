import type { PropsWithChildren } from 'react';
import { Map, Polyline, useKakaoLoader } from 'react-kakao-maps-sdk';
import type { RouteItem } from './components/sidebar/RoadSection';
import { getTrafficInfo } from './components/getTrafficInfo';

interface Props {
  center: LatLng;
  level: number;
  onMapCreate: (map: kakao.maps.Map) => void;
  onCenterChanged: (center: LatLng) => void;
  selectedRoute?: RouteItem | null;
}

export interface MarkerProps {
  id: string;
  lat: number;
  lng: number;
  imageUrl: string;
  isRecommended?: string;
}

// 경도 위도
export interface LatLng {
  lat: number;
  lng: number;
}

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
      path: fullPath.slice(currentIdx, targetIdx),
      traffic_state: r.traffic_state,
    };
    currentIdx = targetIdx;
    return segment;
  });
}

export default function KakaoMapContainer({
  center,
  level,
  onMapCreate,
  onCenterChanged,
  children,
  selectedRoute,
}: PropsWithChildren<Props>) {
  // Kakao Maps SDK 비동기 로딩 훅
  const [loading, error] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_API,
    libraries: ['services', 'clusterer'],
  });

  if (loading) return <div>지도를 불러오는 중...</div>;
  if (error) return <div>지도를 불러올 수 없습니다.</div>;

  return (
    <Map
      center={center}
      level={level} //
      style={{ width: '100%', height: '100%' }}
      onCreate={onMapCreate} //맵 생성 인스턴스 콜백
      onCenterChanged={(m) => {
        // 사용자가 드래그/줌으로 중심 변경 시 중심좌표 변경
        const c = {
          lat: m.getCenter().getLat(),
          lng: m.getCenter().getLng(),
        };
        onCenterChanged(c); // 부모로 콜백
      }}
    >
      {selectedRoute &&
        splitPathByRoad(selectedRoute.path, selectedRoute.road).map(
          (segment, idx) => {
            const traffic = getTrafficInfo(segment.traffic_state);
            return (
              <Polyline
                key={idx}
                path={segment.path}
                strokeWeight={8}
                strokeColor={traffic.color}
                strokeOpacity={0.8}
                strokeStyle="solid"
              />
            );
          },
        )}
      {children} {/* Map 내부에 2D/3D 마커, 오버레이, 버튼 등을 렌더링 */}
    </Map>
  );
}
