import React, { useRef } from 'react';
import { MapMarker, CustomOverlayMap } from 'react-kakao-maps-sdk';
import StoreOverlay from './StoreOverlay';
import type { MarkerProps } from '../KakaoMapContainer';
import type { StoreInfo } from '../api/store';

interface Props {
  nearbyMarkers: MarkerProps[];
  farMarkers: MarkerProps[];
  hoveredMarkerId?: string | null;
  setHoveredMarkerId?: (id: string | null) => void;
  stores: StoreInfo[];
}

export default function FilterMarker({
  nearbyMarkers,
  farMarkers,
  hoveredMarkerId,
  setHoveredMarkerId,
  stores,
}: Props) {
  const hoverOutRef = useRef<number | null>(null);

  // 2D 마커 렌더링 + hover 처리
  return (
    <>
      {/* 반경 외 마커만 2D마커로 */}
      {farMarkers.map((m) => (
        <React.Fragment key={m.id}>
          <MapMarker
            position={{ lat: m.lat, lng: m.lng }}
            image={{
              src: m.imageUrl,
              size: { width: 40, height: 40 },
              options: { offset: { x: 20, y: 40 } },
            }}
            zIndex={1}
            onMouseOver={() => {
              // hover 상태 진입 시 기존 타이머 취소하고 ID 설정
              if (hoverOutRef.current) clearTimeout(hoverOutRef.current);
              setHoveredMarkerId?.(m.id);
            }}
            onMouseOut={() => {
              // hover 벗어나면 300ms 후 오버레이 안보이게
              if (hoverOutRef.current) clearTimeout(hoverOutRef.current);
              hoverOutRef.current = window.setTimeout(() => {
                setHoveredMarkerId?.(null);
              }, 300);
            }}
          />
          {/* hover 중인 마커에 대해 오버레이 표시 */}
          {hoveredMarkerId != null &&
            (() => {
              // hoveredMarkerId 에 대응하는 마커 찾기
              const mk = [...nearbyMarkers, ...farMarkers].find(
                (x) => x.id === hoveredMarkerId,
              );
              if (!mk) return null;

              // StoreInfo 배열에서 같은 id 가진 객체 찾기
              const store = stores.find((s) => s.id === hoveredMarkerId);
              if (!store) return null;
              return (
                <>
                  <CustomOverlayMap
                    position={{ lat: mk.lat, lng: mk.lng }}
                    yAnchor={1.2}
                  >
                    <div
                      className="pointer-events-auto"
                      onMouseEnter={() => {
                        if (hoverOutRef.current)
                          clearTimeout(hoverOutRef.current);
                        setHoveredMarkerId?.(mk.id);
                      }}
                      onMouseLeave={() => {
                        if (hoverOutRef.current)
                          clearTimeout(hoverOutRef.current);
                        hoverOutRef.current = window.setTimeout(
                          () => setHoveredMarkerId?.(null),
                          200,
                        );
                      }}
                    >
                      <StoreOverlay lat={mk.lat} lng={mk.lng} store={store} />
                    </div>
                  </CustomOverlayMap>
                </>
              );
            })()}
        </React.Fragment>
      ))}
    </>
  );
}
