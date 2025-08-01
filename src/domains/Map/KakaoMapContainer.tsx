import type { PropsWithChildren } from 'react';
import { CustomOverlayMap, Map, useKakaoLoader } from 'react-kakao-maps-sdk';
import type { RouteItem } from './components/sidebar/RoadSection';
import PolyLineRender from './components/PolyLineRender';

interface Props {
  center: LatLng;
  level: number;
  onMapCreate: (map: kakao.maps.Map) => void;
  onCenterChanged: (center: LatLng) => void;
  selectedRoute?: RouteItem | null;
  start?: LatLng;
  end?: LatLng;
  waypoints?: LatLng[];
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
  start,
  end,
  waypoints,
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
      {start && (
        <CustomOverlayMap position={start} xAnchor={0.2} yAnchor={1.0}>
          <div
            style={{
              background: '#34c759',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '16px',
              fontSize: '10px',
              fontWeight: 600,
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              transform: 'translate(-50%, -100%)',
            }}
          >
            출발
          </div>
        </CustomOverlayMap>
      )}
      {waypoints &&
        waypoints.map((point, idx) => (
          <CustomOverlayMap
            key={idx}
            position={{ lat: point.lat, lng: point.lng }}
            xAnchor={0.2}
            yAnchor={1.0}
          >
            <div
              style={{
                background: '#007aff',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '16px',
                fontSize: '10px',
                fontWeight: 600,
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                transform: 'translate(-50%, -100%)',
              }}
            >
              경유지 {idx + 1}
            </div>
          </CustomOverlayMap>
        ))}
      {end && (
        <CustomOverlayMap position={end} xAnchor={0.2} yAnchor={1.0}>
          <div
            style={{
              background: '#ff3b30',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '16px',
              fontSize: '10px',
              fontWeight: 600,
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              transform: 'translate(-50%, -100%)',
            }}
          >
            도착
          </div>
        </CustomOverlayMap>
      )}
      {selectedRoute && <PolyLineRender route={selectedRoute} />}
      {children} {/* Map 내부에 2D/3D 마커, 오버레이, 버튼 등을 렌더링 */}
    </Map>
  );
}
