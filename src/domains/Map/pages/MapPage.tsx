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
import MapSidebar, {
  type MenuType,
  type Panel,
} from '../components/MapSidebar';
import DetailSection from '../components/DetailSection';
import { LocateFixed } from 'lucide-react';
import type { MarkerProps, LatLng } from '../KakaoMapContainer';
import { getDistance } from '../utils/getDistance';
import { fetchStores, type StoreInfo } from '../api/store';

export default function MapPage() {
  //도 + 3D 캔버스 감쌀 div
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

  // 사이드바 menu 현재 상태
  const [panel, setPanel] = useState<Panel>({ type: 'menu', menu: '지도' });

  //검색 디바운스
  useEffect(() => {
    const handler = window.setTimeout(() => setDebouncedKeyword(keyword), 300);
    return () => clearTimeout(handler);
  }, [keyword]);

  // 줌 레벨
  const level = map?.getLevel();

  // 제휴처 목록 조회 함수
  useEffect(() => {
    if (!level) return;
    const loadStores = async () => {
      try {
        const data = await fetchStores({
          keyword: debouncedKeyword || '',
          category: '',
          latMin: center.lat - 0.01 * level,
          latMax: center.lat + 0.01 * level,
          lngMin: center.lng - 0.01 * level,
          lngMax: center.lng + 0.01 * level,
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
  }, [debouncedKeyword, level, center]);

  //화면 내 매장만 filter해 sidebar 및 marker적용
  const filterStoresInView = useCallback(() => {
    if (!map) return;
    const b = map.getBounds() as any;
    // pa: north, qa: south, oa: east, ha: west
    const inView = stores.filter((s) => {
      const { latitude: lat, longitude: lng } = s;
      return lat <= b.pa && lat >= b.qa && lng <= b.oa && lng >= b.ha;
    });
    setFilteredStores(inView);
  }, [map, stores]);

  // bounds 변경 시마다 필터링
  useEffect(() => {
    if (!map) return;

    // 처음 렌더링 시
    filterStoresInView();
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

  // Geolocation API로 내 위치 가져오기
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

  // 내 위치가 생기면 지도 중심으로 이동
  useEffect(() => {
    if (map && myLocation) {
      const mylocate = new kakao.maps.LatLng(myLocation.lat, myLocation.lng);
      map.panTo(mylocate);
      setCenter(myLocation);
    }
  }, [map, myLocation]);

  // 내 위치로 돌아가는 함수
  const goToMyLocation = useCallback(() => {
    if (!map || !myLocation) return;
    const mylocate = new kakao.maps.LatLng(myLocation.lat, myLocation.lng);
    map.panTo(mylocate);
    setCenter(myLocation);
  }, [map, myLocation, setCenter]);

  // 거리 기준으로 2D / 3D 마커 분리 RADIUS_JN = 거리
  const RADIUS_KM = 1;
  const [nearbyMarkers, farMarkers] = useMemo(() => {
    const near: MarkerProps[] = [];
    const far: MarkerProps[] = [];
    filteredStores.forEach((store) => {
      //중심과 제휴처 거리
      const distance = getDistance(center, {
        lat: store.latitude,
        lng: store.longitude,
      });
      const marker: MarkerProps = {
        id: store.id,
        lat: store.latitude,
        lng: store.longitude,
        imageUrl: store.brandImageUrl ?? '',
      };
      //설정 거리기준 가까운 제휴처 먼 제휴처 나눔
      if (distance <= RADIUS_KM) near.push(marker);
      else far.push(marker);
    });
    return [near, far];
  }, [filteredStores, center]);

  // 사이드바 메뉴 Open
  const openMenu = (menu: MenuType) => {
    setPanel({ type: 'menu', menu });
  };

  //매장 선택 시 상세열기
  const openDetail = useCallback((store: StoreInfo) => {
    setPanel({ type: 'detail', menu: '지도', item: store });
  }, []);

  //상세 닫기
  const closePanel = useCallback(() => {
    setPanel({ type: 'menu', menu: '지도' });
  }, []);

  //keyword 변경
  const changeKeyword = (e: ChangeEvent<HTMLInputElement>) => {
    SetKeyword(e.target.value);
  };

  return (
    <>
      {/* 사이드바 */}
      <div className="fixed top-[62px] md:top-[86px] left-0 bottom-0 w-20 z-20">
        <MapSidebar
          stores={filteredStores}
          panel={panel}
          openMenu={openMenu}
          openDetail={openDetail}
          onClose={closePanel}
          changeKeyword={changeKeyword}
          keyword={keyword}
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
              map={map}
              containerRef={containerRef}
              stores={filteredStores}
              openDetail={openDetail}
            />

            {/* 3D 마커 */}
            {map && (
              <ThreeJsMarker
                markers={nearbyMarkers}
                map={map}
                setHoveredMarkerId={setHoveredId}
                container={containerRef.current!}
                openDetail={openDetail}
                stores={filteredStores}
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
      {selectedStore && <DetailSection store={selectedStore} />}
    </>
  );
}
