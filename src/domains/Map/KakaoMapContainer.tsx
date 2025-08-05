import React, { useRef, useState, type PropsWithChildren } from 'react';
import { CustomOverlayMap, Map, useKakaoLoader } from 'react-kakao-maps-sdk';
import type { RouteItem } from './components/sidebar/RoadSection';
import PolyLineRender from './components/PolyLineRender';
import type { Panel } from './components/sidebar/MapSidebar';

interface Props {
  center: LatLng;
  level: number;
  onMapCreate: (map: kakao.maps.Map) => void;
  selectedRoute?: RouteItem | null;
  start?: LatLng;
  end?: LatLng;
  waypoints?: LatLng[];
  panel: Panel;
  onMapDrag: () => void;
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
  recommendReason?: string;
}

function KakaoMapContainer({
  center,
  level,
  onMapCreate,
  children,
  selectedRoute,
  start,
  end,
  waypoints,
  panel,
  onMapDrag,
}: PropsWithChildren<Props>) {
  // Kakao Maps SDK 비동기 로딩 훅
  const [loading, error] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_API,
    libraries: ['services', 'clusterer'],
  });
  const [openWaypointIdx, setOpenWaypointIdx] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const ClickedRecommend = (idx: number) => {
    setOpenWaypointIdx(idx);

    // 기존 타이머 있으면 클리어
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setOpenWaypointIdx(null);
      timerRef.current = null;
    }, 3000);
  };

  if (loading) return <div>지도를 불러오는 중...</div>;
  if (error) return <div>지도를 불러올 수 없습니다.</div>;

  return (
    <Map
      center={center}
      level={level} //
      style={{ width: '100%', height: '100%' }}
      onClick={onMapDrag}
      onDrag={onMapDrag}
      onCreate={onMapCreate} //맵 생성 인스턴스 콜백
    >
      {start && panel.menu === '길찾기' && (
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
        panel.menu === '길찾기' &&
        waypoints.map((point, idx) => (
          <CustomOverlayMap
            key={idx}
            position={{ lat: point.lat, lng: point.lng }}
            xAnchor={0.5}
            yAnchor={1.0}
          >
            <div style={{ position: 'relative', width: 30, height: 54 }}>
              {/* 추천이면 뱃지 */}
              {point.recommendReason && (
                <div
                  style={{
                    position: 'absolute',
                    top: -13,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'gold',
                    color: '#333',
                    fontWeight: 700,
                    borderRadius: 8,
                    fontSize: 10,
                    padding: '2px 8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                    zIndex: 5,
                    cursor: 'pointer',
                  }}
                  className="shadow hover:shadow-xl transition-shadow hover:scale-110"
                  onClick={() =>
                    point.recommendReason ? ClickedRecommend(idx) : undefined
                  }
                >
                  추천이유
                </div>
              )}
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
                  borderTop: point.recommendReason
                    ? '16px solid #007aff '
                    : '16px solid  #1cd44a',
                  zIndex: 1,
                }}
              />
              {/* 동그란 마커 */}
              <div
                style={{
                  width: 30,
                  height: 30,
                  background: point.recommendReason ? ' #007aff' : '#1cd44a',
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
                  border: point.recommendReason ? '2px solid gold' : undefined,
                  cursor: point.recommendReason ? 'pointer' : 'default',
                  transition: 'box-shadow 0.2s',
                }}
                onClick={() =>
                  point.recommendReason ? ClickedRecommend(idx) : undefined
                }
              >
                {`경유${idx + 1}`}
              </div>
              {/* 추천 이유 말풍선 */}
              {point.recommendReason && openWaypointIdx === idx && (
                <div
                  style={{
                    position: 'absolute',
                    left: '50%',
                    bottom: 75, // 마커 위로 띄우기
                    transform: 'translateX(-50%)',
                    background: '#fff',
                    color: '#333',
                    borderRadius: 8,
                    padding: '10px 16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                    fontSize: 12,
                    zIndex: 10,
                    width: 220,
                    minWidth: 180,
                    maxWidth: 300,
                    wordBreak: 'keep-all',
                    whiteSpace: 'normal',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {point.recommendReason}
                  {/* 꼬리: 아래로 */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%', // 풍선 바로 아래
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 0,
                      height: 0,
                      borderLeft: '8px solid transparent',
                      borderRight: '8px solid transparent',
                      borderTop: '8px solid #fff', // 아래로 향하는 꼬리
                    }}
                  />
                </div>
              )}
            </div>
          </CustomOverlayMap>
        ))}
      {end && panel.menu === '길찾기' && (
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

export default React.memo(KakaoMapContainer);
