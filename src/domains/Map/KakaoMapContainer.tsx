import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk';
import ThreeJsMarker from './ThreeJsMarker';
import { useEffect, useMemo, useState } from 'react';
import rankingIcon from '@/assets/icons/ranking_icon.png';
import missionsIcon from '@/assets/icons/missions_icon.png';

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
    imageUrl: rankingIcon,
  },
  {
    id: 4,
    lat: 37.455005,
    lng: 126.68069,
    imageUrl: rankingIcon,
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
}: KakaoMapContainerProps) => {
  const [loading, error] = useKakaoLoader({
    appkey: '8d8c95c000044686b1c98de7e08ae5c1',
  });

  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [center, setCenter] = useState<LatLng>({ lat, lng });

  const radiusKm = 3;
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
      onCreate={(map) => {
        setMap(map);
        onMapCreate?.(map);
      }}
      onCenterChanged={(map) => {
        const newCenter = map.getCenter();
        const latLng = {
          lat: newCenter.getLat(),
          lng: newCenter.getLng(),
        };
        setCenter(latLng);
        onCenterChanged?.(latLng);
      }}
      style={{ width: '100%', height: '100%' }}
    >
      <MapMarker position={center}>
        <div style={{ padding: '5px' }}>내위치</div>
      </MapMarker>

      {farMarkers.map((m) => (
        <MapMarker
          key={m.id}
          position={{ lat: m.lat, lng: m.lng }}
          image={{
            src: m.imageUrl,
            size: { width: 40, height: 40 },
            options: { offset: { x: 20, y: 40 } },
          }}
          zIndex={1}
        />
      ))}
    </Map>
  );
};

export default KakaoMapContainer;
