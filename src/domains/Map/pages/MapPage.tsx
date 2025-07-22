import {
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
} from '../components/sidebar/MapSidebar';
import { LocateFixed, RotateCcw } from 'lucide-react';
import type { MarkerProps, LatLng } from '../KakaoMapContainer';
import { getDistance } from '../utils/getDistance';
import { fetchStores, type StoreInfo } from '../api/store';
import { Button } from '@/components/Button';

//bounds 타입에러 방지
interface InternalBounds extends kakao.maps.LatLngBounds {
  pa: number;
  qa: number;
  oa: number;
  ha: number;
}

type CategoryType = '음식점' | '카페' | '편의점' | '대형마트' | '문화시설';
const Category: CategoryType[] = [
  '음식점',
  '카페',
  '편의점',
  '대형마트',
  '문화시설',
];
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
  //const [selectedStore, setSelectedStore] = useState<StoreInfo | null>(null);
  // 호버 오버레이 할 ID
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  //검색 keyword
  const [keyword, SetKeyword] = useState<string>('');

  // 디바운스 키워드(한글 검색 시 자꾸 바로 검색 => 에러)
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>(keyword);

  // 사이드바 menu 현재 상태
  const [panel, setPanel] = useState<Panel>({ type: 'menu', menu: '지도' });

  // MarkerClusterer 참조
  const clustererRef = useRef<kakao.maps.MarkerClusterer | null>(null);
  //검색 디바운스
  const [isCategory, SetIsCategory] = useState<string>('');

  //출발지
  const [startValue, setStartValue] = useState('');
  //선택지
  const [endValue, setEndValue] = useState('');

  useEffect(() => {
    const handler = window.setTimeout(() => setDebouncedKeyword(keyword), 300);
    return () => clearTimeout(handler);
  }, [keyword]);

  // 제휴처 목록 조회 함수
  const searchHere = useCallback(async () => {
    if (!map) return;
    const bpunds = map.getBounds() as InternalBounds;
    if (!bpunds) return;
    const { pa: latMax, qa: latMin, oa: lngMax, ha: lngMin } = bpunds;
    try {
      const data = await fetchStores({
        keyword: debouncedKeyword || isCategory,
        category: isCategory,
        latMin,
        latMax,
        lngMin,
        lngMax,
        centerLat: center.lat,
        centerLng: center.lng,
      });
      setStores(data);
    } catch {
      setStores([]);
    }
  }, [map, debouncedKeyword, center, isCategory]);

  useEffect(() => {
    searchHere();
  }, [searchHere]);
  //화면 내 매장만 filter해 sidebar 및 marker적용
  const filterStoresInView = useCallback(() => {
    if (!map) return;
    const bounds = map.getBounds() as InternalBounds;
    if (!bounds) return;
    const list = Array.isArray(stores) ? stores : []; //제휴처 있는지 확인 후 없으면 빈 배열 (filter부분 에러 해결)
    // pa: north, qa: south, oa: east, ha: west
    const inView = list.filter((store) => {
      const { latitude: lat, longitude: lng } = store;
      return (
        lat <= bounds.pa &&
        lat >= bounds.qa &&
        lng <= bounds.oa &&
        lng >= bounds.ha
      );
    });
    setFilteredStores(inView);
  }, [map, stores]);

  // bounds 변경 시마다 필터링
  useEffect(() => {
    if (!map) return;

    // 처음 렌더링 시
    filterStoresInView();
    kakao.maps.event.addListener(map, 'idle', filterStoresInView);
    return () => {
      kakao.maps.event.removeListener(map, 'idle', filterStoresInView);
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
  const RADIUS_KM = 0.5;
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

  // ★ LOD: 줌 레벨별로 3D 마커 개수 제한
  const lod3DMarkers = useMemo(() => {
    if (!map) return nearbyMarkers;

    const level = map.getLevel!(); // 카카오맵: 레벨 작을수록 확대
    let maxCount: number;
    if (level <= 2) {
      maxCount = 30; // 아주 확대됐을 땐 최대 200개
    } else if (level <= 4) {
      maxCount = 20; // 중간 확대
    } else if (level <= 6) {
      maxCount = 10; // 다소 축소
    } else {
      maxCount = 5; // 많이 축소됐을 땐 20개만
    }
    // 중요도 순(예: 거리 오름차순)으로 정렬한 뒤 slice
    return nearbyMarkers
      .sort((a, b) => {
        const da = getDistance(center, { lat: a.lat, lng: a.lng });
        const db = getDistance(center, { lat: b.lat, lng: b.lng });
        return da - db;
      })
      .slice(0, maxCount);
  }, [map, nearbyMarkers, center]);

  const lod2DMarkers = useMemo(() => {
    if (!map) return farMarkers;

    const level = map.getLevel!();
    let max2D: number;
    if (level <= 2) {
      max2D = 60; // 매우 확대: 100개
    } else if (level <= 4) {
      max2D = 40; // 중간 확대: 50개
    } else if (level <= 6) {
      max2D = 30; // 중간 축소: 20개
    } else {
      max2D = 5; // 많이 축소: 5개
    }

    // 거리에 따라 가까운 것 우선
    return farMarkers
      .sort((a, b) => {
        const da = getDistance(center, { lat: a.lat, lng: a.lng });
        const db = getDistance(center, { lat: b.lat, lng: b.lng });
        return da - db;
      })
      .slice(0, max2D);
  }, [map, farMarkers, center]);
  useEffect(() => {
    if (!map) return;
    clustererRef.current = new kakao.maps.MarkerClusterer({
      map,
      averageCenter: true,
      gridSize: 50,
      minLevel: 3,
      styles: [
        {
          width: '53px',
          height: '52px',
          color: '#fff',
          backgroundColor: '#0ef81a',
          border: '2px solid #fff',
          borderRadius: '50%',
          textAlign: 'center',
          lineHeight: '52px',
          boxShadow: '0 2px 2px rgba(0,0,0,0.2)',
        },
      ],
    });
    return () => clustererRef.current?.remove();
  }, [map]);

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

  //키워드 변경 시 카테고리 초기화
  const changeKeyword = (e: ChangeEvent<HTMLInputElement>) => {
    SetKeyword(e.target.value);
    SetIsCategory('');
  };
  //카테고리 변경 시 키워드 변경
  const changeCategory = (category: string) => {
    SetIsCategory(category);
    SetKeyword(category);
  };

  // 출발 도착 change
  const onStartChange = (v: string) => {
    setStartValue(v);
    openMenu('길찾기');
  };

  // 도착지 변경
  const onEndChange = (v: string) => {
    setEndValue(v);
    openMenu('길찾기');
  };

  const onSwap = () => {
    // 출발/도착 교환
    setStartValue((prev) => {
      setEndValue(prev);
      return endValue;
    });
  };
  // 출발지 도착지 리셋
  const onReset = () => {
    setStartValue('');
    setEndValue('');
  };
  //길찾기
  const onNavigate = () => {
    console.log('길찾기 실행:', { from: startValue, to: endValue });
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
          startValue={startValue}
          endValue={endValue}
          onStartChange={onStartChange}
          onEndChange={onEndChange}
          onSwap={onSwap}
          onReset={onReset}
          onNavigate={onNavigate}
        />
      </div>

      {/* 지도 영역 */}
      <div className="h-screen pt-[62px] md:pt-[86px] ml-[24%] relative">
        <div ref={containerRef} className="absolute inset-0 ">
          <KakaoMapContainer
            center={center}
            level={3}
            onMapCreate={setMap}
            onCenterChanged={setCenter}
          >
            {/* 2D 마커/오버레이 */}
            <FilterMarker
              nearbyMarkers={lod3DMarkers}
              farMarkers={lod2DMarkers}
              hoveredMarkerId={hoveredId}
              setHoveredMarkerId={setHoveredId}
              map={map}
              containerRef={containerRef}
              stores={filteredStores}
              openDetail={openDetail}
              onStartChange={onStartChange}
              onEndChange={onEndChange}
            />

            {/* 3D 마커 */}
            {map && (
              <ThreeJsMarker
                markers={lod3DMarkers}
                map={map}
                setHoveredMarkerId={setHoveredId}
                container={containerRef.current!}
                openDetail={openDetail}
                stores={filteredStores}
              />
            )}
            <div className=" fixed left-96 ml-16 top-24 z-20 flex justify-start space-x-2">
              {Category.map((cate) => (
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-6 text-xs hover:text-primaryGreen"
                  onClick={() => changeCategory(cate)}
                  key={cate}
                >
                  {cate}
                </Button>
              ))}
            </div>
            {/* 이 위치에서 검색 버튼 */}
            <div className="absolute bottom-8 left-[53%]">
              {map && myLocation && (
                <Button
                  onClick={searchHere}
                  variant="primary"
                  size="md"
                  className="flex justify-center self-center"
                >
                  <RotateCcw size={16} className="mt-[3px]" />
                  <p className="ml-1">이 위치에서 검색</p>
                </Button>
              )}
            </div>

            {/* 내 위치 버튼 */}
            <div className="absolute bottom-8 right-8">
              {map && myLocation && (
                <Button
                  onClick={goToMyLocation}
                  variant="ghost"
                  size="sm"
                  className="rounded-full"
                >
                  <LocateFixed size={30} />
                </Button>
              )}
            </div>
          </KakaoMapContainer>
        </div>
      </div>
    </>
  );
}
