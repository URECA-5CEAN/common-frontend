// src/pages/MapPage.tsx
import { useRef, useState, useEffect } from 'react';
import KakaoMapContainer, { type MarkerProps } from '../KakaoMapContainer';
import ThreeJsMarker from '../ThreeJsMarker';
import { LocateFixed } from 'lucide-react';

export default function MapPage() {
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [center, setCenter] = useState({ lat: 37.45, lng: 126.7 });
  const [nearbyMarkers, setNearbyMarkers] = useState<MarkerProps[]>([]);
  const [hoveredMarkerId, setHoveredMarkerId] = useState<number | null>(null);
  const [myLocation, setMyLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 1) 마운트 시 Geolocation으로 내 위치 가져오기
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMyLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        console.warn('내 위치를 가져올 수 없습니다.', err);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
    );
  }, []);

  // 2) 버튼 클릭 핸들러
  const goToMyLocation = () => {
    if (map && myLocation) {
      const latLng = new kakao.maps.LatLng(myLocation.lat, myLocation.lng);
      // 부드럽게 이동하려면 panTo, 즉시 이동하려면 setCenter
      map.panTo(latLng);
      // 필요하다면 center state도 갱신
      setCenter({ lat: myLocation.lat, lng: myLocation.lng });
    }
  };

  return (
    <div className="h-dvh pt-[62px] md:pt-[86px] relative">
      <div ref={containerRef} className="absolute inset-0">
        <KakaoMapContainer
          lat={center.lat}
          lng={center.lng}
          onMapCreate={setMap}
          onNearbyMarkersChange={setNearbyMarkers}
          onCenterChanged={setCenter}
          hoveredMarkerId={hoveredMarkerId}
          setHoveredMarkerId={setHoveredMarkerId}
        />
        {map && (
          <ThreeJsMarker
            markers={nearbyMarkers}
            map={map}
            setHoveredMarkerId={setHoveredMarkerId}
            container={containerRef.current!}
          />
        )}

        {/* 3) 내 위치로 돌아가기 버튼 */}
        {myLocation && map && (
          <button
            onClick={goToMyLocation}
            className="
              absolute
              bottom-12 right-12
              bg-white p-2 rounded-full shadow-lg
              hover:bg-gray-100
              focus:outline-none
              z-20
            "
          >
            <LocateFixed size={30} />
          </button>
        )}
      </div>
    </div>
  );
}
