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

  // 1) 2D 마커만 렌더
  const allMarkers = [...nearbyMarkers, ...farMarkers];
  const render2DMarkers = farMarkers.map((m) => {
    const imageName = m.imageUrl.split('/').pop()!;
    const markerSrc = `/s3-bucket/${imageName}`;
    return (
      <MapMarker
        key={m.id}
        position={{ lat: m.lat, lng: m.lng }}
        image={{
          src: markerSrc,
          size: { width: 40, height: 40 },
          options: { offset: { x: 20, y: 40 } },
        }}
        zIndex={1}
        onMouseOver={() => {
          if (hoverOutRef.current) clearTimeout(hoverOutRef.current);
          setHoveredMarkerId?.(m.id);
        }}
        onMouseOut={() => {
          if (hoverOutRef.current) clearTimeout(hoverOutRef.current);
          hoverOutRef.current = window.setTimeout(
            () => setHoveredMarkerId?.(null),
            300,
          );
        }}
      />
    );
  });

  // 2) hoveredMarkerId에 대응하는 오버레이
  const hoverOverlay = (() => {
    if (!hoveredMarkerId) return null;
    const mk = allMarkers.find((x) => x.id === hoveredMarkerId);
    const store = stores.find((s) => s.id === hoveredMarkerId);
    if (!mk || !store) return null;

    return (
      <CustomOverlayMap
        key={mk.id}
        position={{ lat: mk.lat, lng: mk.lng }}
        yAnchor={1.3}
        zIndex={999}
      >
        <div
          className="pointer-events-auto z-50"
          onMouseEnter={() => {
            if (hoverOutRef.current) clearTimeout(hoverOutRef.current);
            setHoveredMarkerId?.(mk.id);
          }}
          onMouseLeave={() => {
            if (hoverOutRef.current) clearTimeout(hoverOutRef.current);
            hoverOutRef.current = window.setTimeout(
              () => setHoveredMarkerId?.(null),
              200,
            );
          }}
        >
          <StoreOverlay lat={mk.lat} lng={mk.lng} store={store} />
        </div>
      </CustomOverlayMap>
    );
  })();

  return (
    <>
      {render2DMarkers}
      {hoverOverlay}
    </>
  );
}
