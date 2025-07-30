import {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
  type ChangeEvent,
} from 'react';
import KakaoMapContainer from '../KakaoMapContainer';
import FilterMarker from '../components/FilterMarker';
import MapSidebar, {
  type MenuType,
  type Panel,
} from '../components/sidebar/MapSidebar';
import { Search } from 'lucide-react';
import type { LatLng } from '../KakaoMapContainer';

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
import { fetchAiRecommendedStore } from '../api/ai';
import { extractBouns, type InternalBounds } from '../utils/extractBouns';
import type { RouteItem } from '../components/sidebar/RoadSection';

//bounds 타입에러 방지

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
export interface LocationInfo {
  name: string; // 사용자 입력 혹은 장소명
  lat: number;
  lng: number;
}

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
  //detail,road 열고 닫힐 때 사용
  const [panelIndex, setPanelIndex] = useState<number>(0);
  //검색 디바운스
  const [isCategory, SetIsCategory] = useState<string>('');

  //출발지
  const [startValue, setStartValue] = useState<LocationInfo>({
    name: '',
    lat: 0,
    lng: 0,
  });
  //선택지
  const [endValue, setEndValue] = useState<LocationInfo>({
    name: '',
    lat: 0,
    lng: 0,
  });

  //즐겨찾기
  const [bookmarks, setBookmarks] = useState<StoreInfo[]>([]);

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
  //AI 추천 제휴처
  const [recommendedStore, setRecommendedStore] = useState<StoreInfo>();
  // 선택한 길찾기
  const [selectedRoute, setSelectedRoute] = useState<RouteItem | null>(null);

  // 제휴처 목록 조회 함수
  const searchHere = useCallback(async () => {
    if (!map) return;
    const bounds = extractBouns(map);
    if (!bounds) return;

    try {
      const data = await fetchStores({
        keyword: debouncedKeyword,
        category: isCategory,
        ...bounds,
        centerLat: center.lat,
        centerLng: center.lng,
      });

      setStores(data);
      fetchAI();
    } catch {
      setStores([]);
    }
  }, [map, debouncedKeyword, isCategory]);

  useEffect(() => {
    searchHere();
  }, [searchHere]);

  // 초기 바텀시트 위치 계산
  useEffect(() => {
    const sheetHeight = window.innerHeight * 0.75;
    setSheetY(sheetHeight - peekHeight);
  }, []);

  useEffect(() => {
    const handler = window.setTimeout(() => setDebouncedKeyword(keyword), 300);
    return () => clearTimeout(handler);
  }, [keyword]);

  const fetchAI = useCallback(async () => {
    if (!map) return;

    const bounds = extractBouns(map);
    if (!bounds) return;

    try {
      const result = await fetchAiRecommendedStore({
        keyword: debouncedKeyword,
        category: isCategory,
        ...bounds,
        centerLat: center.lat,
        centerLng: center.lng,
      });
      const recommended = { ...result.store, isRecommended: result.reason };
      setRecommendedStore(recommended);

      setStores((prev) => {
        const exists = prev.some((store) => store.id === recommended.id);
        return exists ? prev : [recommended, ...prev];
      });
    } catch (err) {
      console.log('AI 제휴처 추천 실패:', err);
    }
  }, [map, debouncedKeyword, isCategory]);

  useEffect(() => {
    fetchAI();
  }, [fetchAI]);

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

  //즐겨찾기 사이드바 클릭 시 즐겨찾기만 보이도록 +AI 추천 제휴처 추가
  const displayedStores = useMemo<StoreInfo[]>(() => {
    if (panel.menu === '즐겨찾기') return bookmarks;

    const list = [...filteredStores];

    if (recommendedStore) {
      // 이미 있는 경우도 일단 제외하고 맨 앞에 다시 삽입 (표식 포함)
      const listWithoutRecommended = list.filter(
        (store) => store.id !== recommendedStore.id,
      );
      return [recommendedStore, ...listWithoutRecommended];
    }

    return list;
  }, [panel.menu, bookmarks, filteredStores, recommendedStore]);

  // 사이드바 메뉴 Open
  const openMenu = (menu: MenuType) => {
    setPanel({ type: 'menu', menu });
  };

  //매장 선택 시 상세열기
  const openDetail = useCallback(
    (store: StoreInfo) => {
      setPanel({ type: 'detail', menu: panel.menu, item: store });
      setPanelIndex(1);
    },
    [panel.menu],
  );
  // 길찾기 상세보기
  const openRoadDetail = useCallback(
    (route: RouteItem) => {
      setPanel({ type: 'road', menu: panel.menu, item: route });
      setPanelIndex(1);
      setSelectedRoute(route);
    },
    [panel.menu],
  );

  //상세 닫기
  const closePanel = useCallback(() => {
    setPanel({ type: 'menu', menu: panel.menu });
    setPanelIndex(0);
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
  const onStartChange = (store: LocationInfo) => {
    setStartValue(store);
    openMenu('길찾기');
  };

  // 도착지 변경
  const onEndChange = (store: LocationInfo) => {
    setEndValue(store);
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
    setStartValue({ name: '', lat: 0, lng: 0 });
    setEndValue({ name: '', lat: 0, lng: 0 });
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

  //길찾기 시 그 중심으로 이동
  useEffect(() => {
    console.log('📍selectedRoute.path:', selectedRoute?.path);
    if (selectedRoute?.path.length) {
      const centerIdx = Math.floor(selectedRoute.path.length / 2);
      const center = selectedRoute.path[centerIdx];
      map?.setCenter(new kakao.maps.LatLng(center.lat, center.lng));
    }
  }, [selectedRoute]);

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
          bookmarks={bookmarks}
          toggleBookmark={toggleBookmark}
          bookmarkIds={bookmarkIds}
          goToStore={goToStore}
          sheetRef={sheetRef}
          sheetDetail={sheetDetail}
          onSheetPositionChange={(y) => setSheetY(y)}
          onDetailSheetPositionChange={(y) => setSheetY(y)}
          openRoadDetail={openRoadDetail}
          index={panelIndex}
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
        {map && (
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
            selectedRoute={selectedRoute}
            start={
              startValue.lat !== 0 && startValue.lng !== 0
                ? { lat: startValue.lat, lng: startValue.lng }
                : undefined
            }
            end={
              endValue.lat !== 0 && endValue.lng !== 0
                ? { lat: endValue.lat, lng: endValue.lng }
                : undefined
            }
          >
            {/* 2D 마커/오버레이 */}
            <FilterMarker
              hoveredMarkerId={hoveredId}
              setHoveredMarkerId={setHoveredId}
              map={map}
              center={center}
              containerRef={containerRef}
              stores={displayedStores}
              openDetail={openDetail}
              onStartChange={onStartChange}
              onEndChange={onEndChange}
              toggleBookmark={toggleBookmark}
              bookmarkIds={bookmarkIds}
            />

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
