import { type PropsWithChildren } from 'react';
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
        onCenterChanged(c);
      }}
    >
      {start && (
        <CustomOverlayMap position={start} xAnchor={0.5} yAnchor={1.0}>
          <div
            style={{
              position: 'relative',
              width: 30,
              height: 42,
              pointerEvents: 'auto',
            }}
          >
            {/* 꼬리 */}
            <div
              style={{
                position: 'absolute',
                top: 28,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '7px solid transparent',
                borderRight: '7px solid transparent',
                borderTop: '12px solid #34c759', // 꼬리 색상 (마커와 맞춤)
                zIndex: 1,
              }}
            />
            {/* 동그란 마커 */}
            <div
              style={{
                width: 30,
                height: 30,
                background: '#34c759',
                color: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 12,
                boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
                zIndex: 2,
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            >
              출발
            </div>
          </div>
        </CustomOverlayMap>
      )}
      {waypoints &&
        waypoints.map((point, idx) => (
          <CustomOverlayMap
            key={idx}
            position={{ lat: point.lat, lng: point.lng }}
            xAnchor={0.5}
            yAnchor={1.0}
          >
            <div style={{ position: 'relative', width: 30, height: 42 }}>
              {/* 꼬리 */}
              <div
                style={{
                  position: 'absolute',
                  top: 26,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: '10px solid transparent',
                  borderRight: '10px solid transparent',
                  borderTop: '16px solid #007aff',
                  zIndex: 1,
                }}
              />
              {/* 동그란 마커 */}
              <div
                style={{
                  width: 30,
                  height: 30,
                  background: '#007aff',
                  color: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 10,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
                  zIndex: 2,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
              >
                {`경유${idx + 1}`}
              </div>
            </div>
          </CustomOverlayMap>
        ))}
      {end && (
        <CustomOverlayMap position={end} xAnchor={0.5} yAnchor={1.0}>
          <div style={{ position: 'relative', width: 30, height: 42 }}>
            {/* 꼬리 */}
            <div
              style={{
                position: 'absolute',
                top: 28,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '7px solid transparent',
                borderRight: '7px solid transparent',
                borderTop: '12px solid #ff3b30', // 도착색
                zIndex: 1,
              }}
            />
            <div
              style={{
                width: 30,
                height: 30,
                background: '#ff3b30',
                color: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 10,
                boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
                zIndex: 2,
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            >
              도착
            </div>
          </div>
        </CustomOverlayMap>
      )}
      {selectedRoute && <PolyLineRender route={selectedRoute} />}
      {children} {/* Map 내부에 2D/3D 마커, 오버레이, 버튼 등을 렌더링 */}
    </Map>
  );
}
