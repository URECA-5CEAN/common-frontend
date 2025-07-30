import type { PropsWithChildren } from 'react';
import { Map, Polyline, useKakaoLoader } from 'react-kakao-maps-sdk';
import type { RouteItem } from './components/sidebar/RoadSection';

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

  console.log(selectedRoute);
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
      {selectedRoute && (
        <Polyline
          path={selectedRoute.path}
          strokeWeight={4}
          strokeColor="#007aff"
          strokeOpacity={0.8}
          strokeStyle="solid"
        />
      )}
      {children} {/* Map 내부에 2D/3D 마커, 오버레이, 버튼 등을 렌더링 */}
    </Map>
  );
}
