import React, { useRef, useState, useEffect, useMemo } from 'react';
import { MapMarker } from 'react-kakao-maps-sdk';
import StoreOverlay from './StoreOverlay';
import type { MarkerProps } from '../KakaoMapContainer';
import type { StoreInfo } from '../api/store';
import { MarkerClusterer } from 'react-kakao-maps-sdk';
interface Props {
  nearbyMarkers: MarkerProps[];
  farMarkers: MarkerProps[];
  hoveredMarkerId?: string | null;
  setHoveredMarkerId: (id: string | null) => void;
  stores: StoreInfo[];
  map?: kakao.maps.Map | null;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

export default function FilterMarker({
  nearbyMarkers,
  farMarkers,
  hoveredMarkerId,
  setHoveredMarkerId,
  stores,
  map,
  containerRef,
}: Props) {
  const hoverOutRef = useRef<number | null>(null);
  const [overlay, setOverlay] = useState<{
    x: number;
    y: number;
    store: StoreInfo;
  } | null>(null);

  // allMarkers를 useMemo로 묶어서, nearbyMarkers/farMarkers가 바뀔 때만 재계산
  const allMarkers = useMemo(
    () => [...nearbyMarkers, ...farMarkers],
    [nearbyMarkers, farMarkers],
  );

  // hoveredMarkerId가 바뀔 때만 실행
  useEffect(() => {
    if (!hoveredMarkerId || !map) {
      setOverlay(null);
      return;
    }
    const m = allMarkers.find((x) => x.id === hoveredMarkerId);
    const store = stores.find((s) => s.id === hoveredMarkerId);
    const container = containerRef?.current;
    if (!m || !store || !container) {
      setOverlay(null);
      return;
    }
    const proj = map.getProjection();
    const pt = proj.containerPointFromCoords(
      new kakao.maps.LatLng(m.lat, m.lng),
    );
    const rect = container.getBoundingClientRect();
    setOverlay({
      x: pt.x + rect.left,
      y: pt.y + rect.top,
      store,
    });
  }, [
    hoveredMarkerId,
    allMarkers, // stable thanks to useMemo
    stores, // 실제 stores가 바뀔 때만
    map,
    containerRef,
  ]);
  const shouldCluster = farMarkers.length > 20;
  return (
    <>
      {shouldCluster ? (
        <MarkerClusterer
          averageCenter={true}
          minLevel={5} // 줌 레벨 5 이상에서만 풀림
          gridSize={60} // 클러스터 반경(px)
          styles={[
            {
              width: '53px',
              height: '52px',
              color: '#ffffff',
              backgroundColor: '#6FC3D1',
              border: '3px solid #ffffff',
              borderRadius: '50%',
              textAlign: 'center',
              lineHeight: '52px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              zIndex: 10,
            },
          ]}
        >
          {farMarkers.map((m) => (
            <MapMarker
              key={m.id}
              position={{ lat: m.lat, lng: m.lng }}
              image={{
                src: `/s3-bucket/${m.imageUrl.split('/').pop()!}`,
                size: { width: 40, height: 40 },
                options: { offset: { x: 20, y: 40 } },
              }}
              zIndex={1}
              onMouseOver={() => {
                if (hoverOutRef.current) clearTimeout(hoverOutRef.current);
                setHoveredMarkerId(m.id);
              }}
              onMouseOut={() => {
                if (hoverOutRef.current) clearTimeout(hoverOutRef.current);
                hoverOutRef.current = window.setTimeout(
                  () => setHoveredMarkerId(null),
                  300,
                );
              }}
            />
          ))}
        </MarkerClusterer>
      ) : (
        farMarkers.map((m) => (
          <MapMarker
            key={m.id}
            position={{ lat: m.lat, lng: m.lng }}
            image={{
              src: m.imageUrl,
              size: { width: 40, height: 40 },
              options: { offset: { x: 20, y: 40 } },
            }}
            zIndex={1}
            onMouseOver={() => {
              if (hoverOutRef.current) clearTimeout(hoverOutRef.current);
              setHoveredMarkerId(m.id);
            }}
            onMouseOut={() => {
              if (hoverOutRef.current) clearTimeout(hoverOutRef.current);
              hoverOutRef.current = window.setTimeout(
                () => setHoveredMarkerId(null),
                300,
              );
            }}
          />
        ))
      )}
      {overlay && (
        <div
          style={{
            position: 'absolute',
            left: overlay.x,
            top: overlay.y,
            transform: 'translate(-50%, -100%)',
            pointerEvents: 'auto',
            zIndex: 9999,
          }}
          onMouseEnter={() => {
            if (hoverOutRef.current) clearTimeout(hoverOutRef.current);
          }}
          onMouseLeave={() => {
            if (hoverOutRef.current) clearTimeout(hoverOutRef.current);
            hoverOutRef.current = window.setTimeout(
              () => setHoveredMarkerId(null),
              200,
            );
          }}
        >
          <StoreOverlay
            lat={overlay.store.latitude}
            lng={overlay.store.longitude}
            store={overlay.store}
          />
        </div>
      )}
    </>
  );
}
