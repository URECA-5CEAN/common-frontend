import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk'; // 이 부분이 중요!
import ThreeJsMarker from './ThreeJsMarker';
import { useMemo, useState } from 'react';
import rankingIcon from '@/assets/icons/ranking_icon.png';
import missionsIcon from '@/assets/icons/missions_icon.png';
export interface MarkerProps {
  id: number;
  lat: number;
  lng: number;
  imageUrl: string;
}

interface KakaoMapContainerProps {
  lat?: number;
  lng?: number;
  Level?: number;
}

interface LatLng {
  lat: number;
  lng: number;
}

const KakaoMapContainer = ({
  lat = 37.450701,
  lng = 126.70667,
  Level = 3,
}: KakaoMapContainerProps) => {
  const [loading, error] = useKakaoLoader({
    appkey: '8d8c95c000044686b1c98de7e08ae5c1',
  });

  const [map, setMap] = useState<kakao.maps.Map | null>(null);
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
  ];

  // 반경 구하기
  const getDistance = (from: LatLng, to: LatLng): number => {
    const R = 6371;
    const dLat = ((to.lat - from.lat) * Math.PI) / 180;
    const dLng = ((to.lng - from.lng) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((from.lat * Math.PI) / 180) *
        Math.cos((to.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const radiusKm = 3;
  const [nearbyMarkers, farMarkers] = useMemo(() => {
    const near: MarkerProps[] = [];
    const far: MarkerProps[] = [];

    markerList.forEach((m) => {
      const d = getDistance({ lat, lng }, { lat: m.lat, lng: m.lng });
      if (d <= radiusKm) near.push(m);
      else far.push(m);
    });

    return [near, far];
  }, [lat, lng, markerList]);

  if (loading) return '지도를 불러오는중...';
  if (error) return '지도를 불러올 수 없습니다.';
  return (
    <Map
      center={{ lat: lat, lng: lng }}
      style={{
        width: '100%',
        height: '100%',
      }}
      level={Level}
      onCreate={setMap}
    >
      {/* ✅ 기본 마커 */}
      <MapMarker position={{ lat, lng }}>
        <div style={{ padding: '5px' }}>중심</div>
      </MapMarker>

      {/* ✅ 2D 마커: 3km 밖 */}
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

      {/* ✅ 3D 마커 대상은 따로 div 위에 Three.js로 렌더링 */}
      {map && <ThreeJsMarker markers={nearbyMarkers} map={map} />}
    </Map>
  );
};

export default KakaoMapContainer;
