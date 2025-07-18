import { useRef, useState, useEffect, useMemo } from 'react';
import KakaoMapContainer from '../KakaoMapContainer';
import ThreeJsMarker from '../ThreeJsMarker';
import { LocateFixed } from 'lucide-react';
import type { MarkerProps, LatLng } from '../KakaoMapContainer';
import { getDistance } from '../getDistance';
import rankingIcon from '@/assets/icons/ranking_icon.png';
import missionsIcon from '@/assets/icons/missions_icon.png';
import FilterMarker from '../FilterMarker';

const markerList: MarkerProps[] = [
  { id: 1, lat: 38.450702, lng: 127.70668, imageUrl: rankingIcon },
  { id: 2, lat: 38.455001, lng: 127.90669, imageUrl: missionsIcon },
  { id: 3, lat: 37.455001, lng: 126.75669, imageUrl: missionsIcon },
  { id: 4, lat: 37.455005, lng: 126.68069, imageUrl: missionsIcon },
];

export default function MapPage() {
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [center, setCenter] = useState<LatLng>({ lat: 37.45, lng: 126.7 });
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [myLocation, setMyLocation] = useState<LatLng | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  //마운트 시 Geolocation API로 내 위치 가져오기
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) =>
        setMyLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => console.log('위치 권한 없음', err),
      { enableHighAccuracy: true },
    );
  }, []);

  // map과 myLocation 준비되면 지도 중심을 내 위치로 이동
  useEffect(() => {
    if (map && myLocation) {
      const ll = new kakao.maps.LatLng(myLocation.lat, myLocation.lng);
      map.panTo(ll);
      setCenter(myLocation);
    }
  }, [map, myLocation]);

  // 중심 좌표 변경 시, markerList를 반경 내/외로 분리
  const Radius = 3;
  const [nearbyMarkers, farMarkers] = useMemo(() => {
    const near: MarkerProps[] = [];
    const far: MarkerProps[] = [];
    markerList.forEach((m) => {
      const d = getDistance(center, { lat: m.lat, lng: m.lng }); // 두 좌표간 거리 계산
      (d <= Radius ? near : far).push(m); // 내 외 구분
    });
    return [near, far];
  }, [center]);

  // 버튼 클릭 시 내 위치로
  const goToMyLocation = () => {
    if (map && myLocation) {
      const ll = new kakao.maps.LatLng(myLocation.lat, myLocation.lng);
      map.panTo(ll);
      setCenter(myLocation);
    }
  };

  return (
    <div className="h-dvh pt-[62px] md:pt-[86px] relative">
      <div ref={containerRef} className="absolute inset-0">
        {/*맵 로딩 */}
        <KakaoMapContainer
          center={center}
          level={3}
          onMapCreate={setMap}
          onCenterChanged={setCenter}
        >
          {/* 2D 마커 + 오버레이 */}
          <FilterMarker
            nearbyMarkers={nearbyMarkers}
            farMarkers={farMarkers}
            hoveredMarkerId={hoveredId}
            setHoveredMarkerId={setHoveredId}
          />

          {/* 3D 마커 */}
          {map && (
            <ThreeJsMarker
              markers={nearbyMarkers}
              map={map}
              setHoveredMarkerId={setHoveredId}
              container={containerRef.current!}
            />
          )}

          {/* 내 위치 버튼 */}
          {map && myLocation && (
            <button
              onClick={goToMyLocation}
              className="absolute bottom-12 right-12 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 z-20"
            >
              <LocateFixed size={30} />
            </button>
          )}
        </KakaoMapContainer>
      </div>
    </div>
  );
}
