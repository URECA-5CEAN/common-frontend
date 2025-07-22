import type { PropsWithChildren } from 'react';
import { Map, useKakaoLoader } from 'react-kakao-maps-sdk';

interface Props {
  center: LatLng;
  level: number;
  onMapCreate: (map: kakao.maps.Map) => void;
  onCenterChanged: (center: LatLng) => void;
}

export interface MarkerProps {
  id: string;
  lat: number;
  lng: number;
  imageUrl: string;
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
}: PropsWithChildren<Props>) {
  // Kakao Maps SDK 비동기 로딩 훅
  const [loading, error] = useKakaoLoader({
    appkey: '8d8c95c000044686b1c98de7e08ae5c1',
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
      {children} {/* Map 내부에 2D/3D 마커, 오버레이, 버튼 등을 렌더링 */}
    </Map>
  );
}
