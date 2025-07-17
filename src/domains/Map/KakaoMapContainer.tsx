import {
  CustomOverlayMap,
  Map,
  MapMarker,
  useKakaoLoader,
} from 'react-kakao-maps-sdk';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import rankingIcon from '@/assets/icons/ranking_icon.png';
import missionsIcon from '@/assets/icons/missions_icon.png';
import StoreOverlay from './StoreOverlay';

export interface MarkerProps {
  id: number;
  lat: number;
  lng: number;
  imageUrl: string;
}

interface LatLng {
  lat: number;
  lng: number;
}

interface KakaoMapContainerProps {
  lat?: number;
  lng?: number;
  Level?: number;
  onMapCreate?: (map: kakao.maps.Map) => void;
  onNearbyMarkersChange?: (markers: MarkerProps[]) => void;
  onCenterChanged?: (center: LatLng) => void;
  hoveredMarkerId?: number | null;
  setHoveredMarkerId?: (id: number | null) => void;
}

const markerList: MarkerProps[] = [
  {
    id: 1,
    lat: 38.450702,
    lng: 127.70668,
    imageUrl: rankingIcon,
  },
  {
    id: 2,
    lat: 38.455001,
    lng: 127.90669,
    imageUrl: missionsIcon,
  },
  {
    id: 3,
    lat: 37.455001,
    lng: 126.75669,
    imageUrl: missionsIcon,
  },
  {
    id: 4,
    lat: 37.455005,
    lng: 126.68069,
    imageUrl: missionsIcon,
  },
];

const getDistance = (from: LatLng, to: LatLng): number => {
  const R = 6371; // km
  const dLat = ((to.lat - from.lat) * Math.PI) / 180;
  const dLng = ((to.lng - from.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((from.lat * Math.PI) / 180) *
      Math.cos((to.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const KakaoMapContainer = ({
  lat = 37.450701,
  lng = 126.70667,
  Level = 3,
  onMapCreate,
  onNearbyMarkersChange,
  onCenterChanged,
  hoveredMarkerId,
  setHoveredMarkerId,
}: KakaoMapContainerProps) => {
  const [loading, error] = useKakaoLoader({
    appkey: '8d8c95c000044686b1c98de7e08ae5c1',
  });
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [center, setCenter] = useState<LatLng>({ lat, lng });
  const radiusKm = 3;
  // hover-out 딜레이용 ref
  const hoverOutTimeout = useRef<number>();
  const [nearbyMarkers, farMarkers] = useMemo(() => {
    const near: MarkerProps[] = [];
    const far: MarkerProps[] = [];
    markerList.forEach((m) => {
      const d = getDistance(center, { lat: m.lat, lng: m.lng });
      if (d <= radiusKm) near.push(m);
      else far.push(m);
    });
    return [near, far];
  }, [center]);

  useEffect(() => {
    onNearbyMarkersChange?.(nearbyMarkers);
  }, [nearbyMarkers]);

  if (loading) return '지도를 불러오는 중...';
  if (error) return '지도를 불러올 수 없습니다.';

  return (
    <Map
      center={center}
      level={Level}
      onCreate={(m) => {
        setMap(m);
        onMapCreate?.(m);
      }}
      onCenterChanged={(m) => {
        const nc = { lat: m.getCenter().getLat(), lng: m.getCenter().getLng() };
        setCenter(nc);
        onCenterChanged?.(nc);
      }}
      style={{ width: '100%', height: '100%' }}
    >
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
              // hover 아웃 타이머 취소
              if (hoverOutTimeout.current)
                clearTimeout(hoverOutTimeout.current);
              setHoveredMarkerId?.(m.id);
            }}
            onMouseOut={() => {
              if (hoverOutTimeout.current)
                clearTimeout(hoverOutTimeout.current);
              hoverOutTimeout.current = window.setTimeout(() => {
                setHoveredMarkerId?.(null);
              }, 300);
            }}
          />

          {hoveredMarkerId != null &&
            (() => {
              // hoveredMarkerId 에 대응하는 마커 찾기
              const mk = [...nearbyMarkers, ...farMarkers].find(
                (x) => x.id === hoveredMarkerId,
              );
              if (!mk) return null;

              return (
                <CustomOverlayMap
                  position={{ lat: mk.lat, lng: mk.lng }}
                  yAnchor={1.2}
                >
                  <div
                    className="pointer-events-auto"
                    onMouseEnter={() => {
                      if (hoverOutTimeout.current)
                        clearTimeout(hoverOutTimeout.current);
                      setHoveredMarkerId?.(mk.id);
                    }}
                    onMouseLeave={() => {
                      if (hoverOutTimeout.current)
                        clearTimeout(hoverOutTimeout.current);
                      hoverOutTimeout.current = window.setTimeout(
                        () => setHoveredMarkerId?.(null),
                        200,
                      );
                    }}
                  >
                    <StoreOverlay />
                  </div>
                </CustomOverlayMap>
              );
            })()}
        </React.Fragment>
      ))}
    </Map>
  );
};

export default KakaoMapContainer;
