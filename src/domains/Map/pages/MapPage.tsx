// src/pages/MapPage.tsx
import React, { useRef, useState, useEffect, useMemo } from 'react';
import KakaoMapContainer from '../KakaoMapContainer';
import ThreeJsMarker from '../components/ThreeJsMarker';
import FilterMarker from '../components/FilterMarker';
import MapSidebar from '../components/MapSidebar';
import DetailSection from '../components/DetailSection';
import { LocateFixed } from 'lucide-react';
import type { MarkerProps, LatLng } from '../KakaoMapContainer';
import { getDistance } from '../utils/getDistance';
import { fetchStores } from '../api/store';

export interface MockInfo {
  id: number;
  name: string;
  lat: number;
  lng: number;
  logoUrl: string;
  address: string;
}

export const mockStores: MockInfo[] = [
  {
    id: 1,
    name: '달콤 카페',
    lat: 37.4512,
    lng: 126.6953,
    logoUrl: 'https://via.placeholder.com/60?text=CAFE',
    address: '서울특별시 서초구 서초동 123-4',
  },
  {
    id: 2,
    name: '참외 빵집',
    lat: 37.4556,
    lng: 126.7021,
    logoUrl: 'https://via.placeholder.com/60?text=BREAD',
    address: '서울특별시 서초구 반포동 56-7',
  },
  {
    id: 3,
    name: '포장마차 곱창',
    lat: 37.4478,
    lng: 126.7105,
    logoUrl: 'https://via.placeholder.com/60?text=FOOD',
    address: '서울특별시 서초구 잠원동 88-22',
  },
  {
    id: 4,
    name: '별빛 술집',
    lat: 37.46,
    lng: 126.69,
    logoUrl: 'https://via.placeholder.com/60?text=BAR',
    address: '서울특별시 서초구 반포동 12-3',
  },
];

export default function MapPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Kakao Map 인스턴스
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  // 지도 중심 좌표
  const [center, setCenter] = useState<LatLng>({ lat: 37.45, lng: 126.7 });
  // 내 위치 (Geolocation)
  const [myLocation, setMyLocation] = useState<LatLng | null>(null);

  // API로 불러온 매장 리스트
  const [stores, setStores] = useState<StoreInfo[]>([]);
  // 사이드바에서 선택한 매장 (상세보기)
  const [selectedStore, setSelectedStore] = useState<StoreInfo | null>(null);

  const [hoveredId, setHoveredId] = useState<number | null>(null);

  // 1) 페이지 마운트, center 변경 시 매장 목록 호출
  /*useEffect(() => {
    async function loadStores() {
      try {
        console.log(center);
        const data = await fetchStores({
          keyword: '',
          category: '',
          latMin: 37.0,
          latMax: 38.0,
          lngMin: 126.0,
          lngMax: 127.0,
          centerLat: 37.5,
          centerLng: 126.8,
          zoomLevel: map?.getLevel(),
        });
        console.log(data);
        setStores(data);
      } catch (err) {
        console.error('매장 호출 실패', err);
      }
    }
    loadStores();
  }, [center]);*/

  // 2) Geolocation API로 내 위치 가져오기
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) =>
        setMyLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      (err) => console.log('위치 권한 없음', err),
      { enableHighAccuracy: true },
    );
  }, []);

  // 3) 내 위치가 생기면 지도 중심으로 이동
  useEffect(() => {
    if (map && myLocation) {
      const ll = new kakao.maps.LatLng(myLocation.lat, myLocation.lng);
      map.panTo(ll);
      setCenter(myLocation);
    }
  }, [map, myLocation]);

  // 4) 매장 데이터를 MarkerProps 형태로 변환 & 반경 내/외 분리
  const RADIUS_KM = 3;
  const [nearbyMarkers, farMarkers] = useMemo(() => {
    const near: MarkerProps[] = [];
    const far: MarkerProps[] = [];
    mockStores.forEach((store) => {
      const d = getDistance(center, { lat: store.lat, lng: store.lng });
      const marker: MarkerProps = {
        id: store.id,
        lat: store.lat,
        lng: store.lng,
        imageUrl: store.logoUrl ?? '',
      };
      if (d <= RADIUS_KM) near.push(marker);
      else far.push(marker);
    });
    return [near, far];
  }, [mockStores, center]);

  // 5) ‘내 위치’ 버튼 핸들러
  const goToMyLocation = () => {
    if (map && myLocation) {
      const ll = new kakao.maps.LatLng(myLocation.lat, myLocation.lng);
      map.panTo(ll);
      setCenter(myLocation);
    }
  };

  // 6) 사이드바에서 매장 선택
  const openDetail = (store: StoreInfo) => {
    setSelectedStore(store);
  };

  // 7) 상세 닫기
  const closeDetail = () => {
    setSelectedStore(null);
  };

  return (
    <>
      {/* 사이드바 */}
      <div className="fixed top-[62px] md:top-[86px] left-0 bottom-0 w-64 z-20">
        <MapSidebar stores={mockStores} openDetail={openDetail} />
      </div>

      {/* 지도 영역 */}
      <div className="h-dvh pt-[62px] md:pt-[86px] relative">
        <div ref={containerRef} className="absolute inset-0">
          <KakaoMapContainer
            center={center}
            level={3}
            onMapCreate={setMap}
            onCenterChanged={setCenter}
          >
            {/* 2D 마커/오버레이 */}
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

      {/* 상세 패널 */}
      {selectedStore && (
        <DetailSection store={selectedStore} onClose={closeDetail} />
      )}
    </>
  );
}
