import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
  type ChangeEvent,
} from 'react';
import KakaoMapContainer from '../KakaoMapContainer';
import ThreeJsMarker from '../components/ThreeJsMarker';
import FilterMarker from '../components/FilterMarker';
import MapSidebar from '../components/MapSidebar';
import DetailSection from '../components/DetailSection';
import { LocateFixed } from 'lucide-react';
import type { MarkerProps, LatLng } from '../KakaoMapContainer';
import { getDistance } from '../utils/getDistance';
import { fetchStores, type StoreInfo } from '../api/store';

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
  // 화면 내 매장
  const [filteredStores, setFilteredStores] = useState<StoreInfo[]>([]);
  // 사이드바에서 선택한 매장 (상세보기)
  const [selectedStore, setSelectedStore] = useState<StoreInfo | null>(null);
  // 호버 오버레이 할 ID
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  //검색 keyword
  const [keyword, SetKeyword] = useState<string>('');

  // 디바운스 키워드(한글 검색 시 자꾸 바로 검색 => 에러)
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>(keyword);

  // 1) keyword가 바뀔 때마다 디바운스 타이머 재설정
  useEffect(() => {
    const handler = window.setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [keyword]);

  // 1) 페이지 마운트, center,keyword 변경 시 매장 목록 호출
  useEffect(() => {
    const loadStores = async () => {
      try {
        const data = await fetchStores({
          keyword: debouncedKeyword,
          category: '',
          latMin: center.lat - 0.05,
          latMax: center.lat + 0.05,
          lngMin: center.lng - 0.05,
          lngMax: center.lng + 0.05,
          centerLat: center.lat,
          centerLng: center.lng,
        });
        setStores(data);
      } catch (err) {
        console.error('매장 호출 실패', err);
        setStores([]);
      }
    };
    loadStores();
  }, [center, debouncedKeyword]);

  // 2) 화면 내 매장 필터링
  const filterStoresInView = useCallback(() => {
    if (!map) return;
    const bounds = map.getBounds();
    if (!bounds) return;
    // pa: north, qa: south, oa: east, ha: west
    const b = map.getBounds() as any;
    const north = b.pa;
    const south = b.qa;
    const east = b.oa;
    const west = b.ha;
    const inView = stores.filter((store) => {
      const { latitude: lat, longitude: lng } = store;
      return lat <= north && lat >= south && lng <= east && lng >= west;
    });
    setFilteredStores(inView);
  }, [map, stores]);

  // 3) bounds 변경 시마다 필터링
  useEffect(() => {
    if (!map) return;
    // 처음 렌더링 시
    filterStoresInView();

    // 바운드 변경 이벤트 등록
    kakao.maps.event.addListener(map, 'bounds_changed', filterStoresInView);
    // clean up
    return () => {
      kakao.maps.event.removeListener(
        map,
        'bounds_changed',
        filterStoresInView,
      );
    };
  }, [map, filterStoresInView]);

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

  // 5) ‘내 위치’ 버튼 핸들러
  const goToMyLocation = useCallback(() => {
    if (!map || !myLocation) return;
    const ll = new kakao.maps.LatLng(myLocation.lat, myLocation.lng);
    map.panTo(ll);
    setCenter(myLocation);
  }, [map, myLocation, setCenter]);

  // 4) 매장 데이터를 MarkerProps 형태로 변환 & 반경 내/외 분리
  const RADIUS_KM = 1;
  const [nearbyMarkers, farMarkers] = useMemo(() => {
    const near: MarkerProps[] = [];
    const far: MarkerProps[] = [];
    filteredStores.forEach((store) => {
      const d = getDistance(center, {
        lat: store.latitude,
        lng: store.longitude,
      });
      const marker: MarkerProps = {
        id: store.id,
        lat: store.latitude,
        lng: store.longitude,
        imageUrl: store.brandImageUrl ?? '',
      };
      if (d <= RADIUS_KM) near.push(marker);
      else far.push(marker);
    });
    return [near, far];
  }, [filteredStores, center]);

  // 5) 맵 생성 핸들러
  const handleMapCreate = useCallback((mapInstance: kakao.maps.Map) => {
    setMap(mapInstance);
  }, []);

  // 6) 사이드바에서 매장 선택
  const openDetail = useCallback((store: StoreInfo) => {
    setSelectedStore(store);
  }, []);

  // 7) 상세 닫기
  const closeDetail = useCallback(() => setSelectedStore(null), []);

  //keyword 변경
  const changeKeyword = (e: ChangeEvent<HTMLInputElement>) => {
    SetKeyword(e.target.value);
  };

  return (
    <>
      {/* 사이드바 */}
      <div className="fixed top-[62px] md:top-[86px] left-0 bottom-0 w-64 z-20">
        <MapSidebar
          stores={filteredStores}
          onStoreSelect={openDetail}
          changeKeyword={changeKeyword}
        />
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
              stores={filteredStores}
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
