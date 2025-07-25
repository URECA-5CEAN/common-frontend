import {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
  type ChangeEvent,
  Suspense,
  lazy,
} from 'react';
import KakaoMapContainer from '../KakaoMapContainer';
import FilterMarker from '../components/FilterMarker';
import MapSidebar, {
  type MenuType,
  type Panel,
} from '../components/sidebar/MapSidebar';
import { Search } from 'lucide-react';
import type { MarkerProps, LatLng } from '../KakaoMapContainer';
import { getDistance } from '../utils/getDistance';
import {
  createBookmark,
  deleteBookmark,
  fetchBookmark,
  fetchStores,
  type StoreInfo,
} from '../api/store';
import BenefitModal from '../components/BenefitModal';
import type { BottomSheetHandle } from '../components/sidebar/BottomSheet';
import DebouncedInput from '../components/DebouncedInput';
import { useDebounce } from 'react-use';
import CategorySlider from '../components/CategorySlider';
import DeskTopBtns from '../components/DeskTopBtns';
import MyLocationBtn from '../components/MyLocationBtn';
import SearchHereBtn from '../components/SearchHearBtn';
const ThreeJmdarker = lazy(() => import('../components/ThreeJsMarker'));
//bounds 타입에러 방지
interface InternalBounds extends kakao.maps.LatLngBounds {
  pa: number;
  qa: number;
  oa: number;
  ha: number;
}

type CategoryType =
  | '음식점'
  | '카페'
  | '편의점'
  | '대형마트'
  | '문화시설'
  | '렌터카';
const Category: CategoryType[] = [
  '음식점',
  '카페',
  '편의점',
  '대형마트',
  '문화시설',
  '렌터카',
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
  const [panel, setPanel] = useState<Panel>({
    type: 'menu',
    menu: '지도',
  });

  // MarkerClusterer 참조
  const clustererRef = useRef<kakao.maps.MarkerClusterer | null>(null);
  //검색 디바운스
  const [isCategory, SetIsCategory] = useState<string>('');

  //출발지
  const [startValue, setStartValue] = useState<string>('');
  //선택지
  const [endValue, setEndValue] = useState<string>('');

  //즐겨찾기
  const [bookmarks, setBookmarks] = useState<StoreInfo[]>([]);

  //3d마커
  const [lod3DMarkers, setLod3DMarkers] = useState<MarkerProps[]>([]);
  //2d마커
  const [lod2DMarkers, setLod2DMarkers] = useState<MarkerProps[]>([]);

  //혜택인증 파일
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // 바텀시트 Y 위치
  const [sheetY, setSheetY] = useState<number>(0);
  //바텀시트 인스턴스
  const sheetRef = useRef<BottomSheetHandle | null>(null);
  const sheetDetail = useRef<BottomSheetHandle | null>(null);
  //이 위치 검색버튼 상태
  const [showSearchBtn, setShowSearchBtn] = useState(false);

  // bounds 변경 시마다 시간 업데이트
  const hideTimeoutRef = useRef<number>(0);

  // peek 상태 바텀시트 높이
  const peekHeight = 30;

  const [idleCount, setIdleCount] = useState(0);

  // 초기 바텀시트 위치 계산
  useEffect(() => {
    const sheetHeight = window.innerHeight * 0.75;
    setSheetY(sheetHeight - peekHeight);
  }, []);

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
  }, [map, debouncedKeyword, isCategory]);

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

  // bounds 변경 시마다 필터링 + 검색 버튼 토글
  useDebounce(
    () => {
      // 3초동안 추가 idle 이벤트 없으면 여기가 실행
      filterStoresInView();
      setShowSearchBtn(true);

      // 5초 뒤 버튼 숨기기
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = window.setTimeout(() => {
        setShowSearchBtn(false);
      }, 5000);
    },
    300,
    [idleCount], // 줌 드래그 할 시 값 변경
  );

  // idle 이벤트에서는 카운터만 올려 주기
  useEffect(() => {
    if (!map) return;
    // 마운트 시 제휴처 보여줌
    filterStoresInView();

    const handleIdle = () => {
      setIdleCount((c) => c + 1);
    };
    kakao.maps.event.addListener(map, 'idle', handleIdle);
    return () => {
      kakao.maps.event.removeListener(map, 'idle', handleIdle);
      clearTimeout(hideTimeoutRef.current);
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

  //해당 매장 위치로 이동
  const goToStore = useCallback(
    (store: StoreInfo) => {
      if (!map) return;
      const loc = new kakao.maps.LatLng(store.latitude, store.longitude);
      map.panTo(loc);
      setCenter({ lat: store.latitude, lng: store.longitude });
      openMenu('지도');
      searchHere();
    },
    [map, searchHere],
  );

  //즐겨찾기 사이드바 클릭 시 즐겨찾기만 보이도록
  const displayedStores = useMemo<StoreInfo[]>(() => {
    return panel.menu === '즐겨찾기' ? bookmarks : filteredStores;
  }, [panel.menu, bookmarks, filteredStores]);

  // 거리 기준으로 2D / 3D 마커 분리 RADIUS_JN = 거리
  const RADIUS_KM = 0.5;
  const [nearbyMarkers, farMarkers] = useMemo(() => {
    const near: MarkerProps[] = [];
    const far: MarkerProps[] = [];
    displayedStores.forEach((store) => {
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
  }, [displayedStores, center]);

  useEffect(() => {
    if (!map) return;
    // idle 콜백 함수 정의
    const handleIdle = () => {
      const level = map.getLevel!();
      //3d마커 개수 제한
      const max3D = level <= 2 ? 30 : level <= 4 ? 20 : level <= 6 ? 10 : 5;
      const enriched = nearbyMarkers
        .map((m) => ({
          marker: m,
          distance: getDistance(center, m as LatLng),
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, max3D)
        .map((item) => item.marker); // marker만 추출

      setLod3DMarkers(enriched);

      // 2D마커 개수 제한
      const max2D = level <= 2 ? 40 : level <= 4 ? 30 : level <= 6 ? 20 : 10;
      const enriched2D = farMarkers
        .map((m) => ({
          marker: m,
          distance: getDistance(center, m as LatLng),
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, max2D)
        .map((item) => item.marker);

      setLod2DMarkers(enriched2D);
    };

    // idle 이벤트 등록
    kakao.maps.event.addListener(map, 'idle', handleIdle);
    handleIdle();
    // 클린업
    return () => {
      kakao.maps.event.removeListener(map, 'idle', handleIdle);
    };
  }, [map, nearbyMarkers, farMarkers, center]);

  // 3d 클러스터
  useEffect(() => {
    if (!map) return;
    const clusterer = new kakao.maps.MarkerClusterer({
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
    clustererRef.current = clusterer;
    return () => {
      clusterer.setMap(null); // 클러스터러 제거
      clusterer.clear(); // 내부 마커 모두 해제
    };
  }, [map]);

  // 사이드바 메뉴 Open
  const openMenu = (menu: MenuType) => {
    setPanel({ type: 'menu', menu });
  };

  //매장 선택 시 상세열기
  const openDetail = useCallback(
    (store: StoreInfo) => {
      setPanel({ type: 'detail', menu: panel.menu, item: store });
    },
    [panel.menu],
  );

  //상세 닫기
  const closePanel = useCallback(() => {
    setPanel({ type: 'menu', menu: panel.menu });
  }, [panel.menu]);

  //키워드 변경 시 카테고리 초기화
  const changeKeyword = (e: ChangeEvent<HTMLInputElement>) => {
    SetKeyword(e.target.value);
    SetIsCategory('');
  };
  //카테고리 변경 시 키워드 변경
  const changeCategory = (category: string) => {
    SetIsCategory(category);
    SetKeyword(category);
    openMenu('지도');
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
  //마운트 시 즐겨찾기 조회
  useEffect(() => {
    let imdounted = true;

    async function loadBookmarks() {
      try {
        const data = await fetchBookmark();
        if (imdounted) setBookmarks(data);
      } catch (err) {
        console.error('즐겨찾기 불러오기 실패', err);
      }
    }
    loadBookmarks();
    return () => {
      imdounted = false;
    };
  }, []);

  const toggleBookmark = async (store: StoreInfo) => {
    try {
      if (bookmarks.some((bookmark) => bookmark.id === store.id)) {
        await deleteBookmark(store.id);
        setBookmarks((prev) =>
          prev.filter((bookmark) => bookmark.id !== store.id),
        );
      } else {
        await createBookmark(store.id);
        setBookmarks((prev) => [...prev, store]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  //즐겨찾기 구분
  const bookmarkIds: Set<string> = useMemo(
    () => new Set(bookmarks.map((b) => b.id)),
    [bookmarks],
  );

  //혜택인증 영수증 파일 선택
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
  };

  console.log(sheetY);

  return (
    <div className="flex h-screen flex-col-reverse md:flex-row overflow-y-hidden ">
      {/* 사이드바 */}
      <aside className="relative top-[62px] md:top-[86px] mr-6 md:m-0  left-0 bottom-0 md:w-[420px] z-20 flex-shrink-0">
        <MapSidebar
          stores={displayedStores}
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
          bookmarks={bookmarks}
          toggleBookmark={toggleBookmark}
          bookmarkIds={bookmarkIds}
          goToStore={goToStore}
          sheetRef={sheetRef}
          sheetDetail={sheetDetail}
          onSheetPositionChange={(y) => setSheetY(y)}
          onDetailSheetPositionChange={(y) => setSheetY(y)}
        />
        {/* 내 위치 버튼 */}
        {map && myLocation && (
          <MyLocationBtn
            map={map}
            myLocation={myLocation}
            goToMyLocation={goToMyLocation}
            sheetY={sheetY}
          />
        )}
        {map && myLocation && (
          <SearchHereBtn
            map={map}
            myLocation={myLocation}
            show={showSearchBtn}
            sheetY={sheetY}
            onClick={searchHere}
          />
        )}
      </aside>

      {/* 지도 영역 */}
      <div className="flex-1 relative overflow-x-hidden">
        <div ref={containerRef} className="absolute inset-0 ">
          <KakaoMapContainer
            center={myLocation ?? center}
            level={5}
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
              stores={displayedStores}
              openDetail={openDetail}
              onStartChange={onStartChange}
              onEndChange={onEndChange}
              toggleBookmark={toggleBookmark}
              bookmarkIds={bookmarkIds}
            />

            {/* 3D 마커 */}
            {map && (
              <Suspense fallback={null}>
                <ThreeJmdarker
                  markers={lod3DMarkers}
                  map={map}
                  setHoveredMarkerId={setHoveredId}
                  container={containerRef.current!}
                  openDetail={openDetail}
                  stores={displayedStores}
                />
              </Suspense>
            )}

            <div className="absolute  w-full md:ml-10 ml-6 top-28 md:top-24 z-2  overflow-x-auto">
              <CategorySlider
                Category={Category}
                isCategory={isCategory}
                changeCategory={changeCategory}
              />
              <DeskTopBtns
                Category={Category}
                isCategory={isCategory}
                changeCategory={changeCategory}
              />
            </div>

            <div className="flex md:hidden  absolute top-[68px] left-6 right-6   bg-white z-2 items-center border border-gray-200 rounded-xl px-2 py-1 ">
              <Search />
              <DebouncedInput
                value={keyword}
                onChange={changeKeyword}
                debounceTime={300}
                placeholder="검색"
              />
            </div>

            <BenefitModal
              panel={panel}
              openmenu={openMenu}
              handleFileSelect={handleFileSelect}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
            />
          </KakaoMapContainer>
        </div>
      </div>
    </div>
  );
}
