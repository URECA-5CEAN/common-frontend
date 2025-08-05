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
import { Search, X, type LucideIcon } from 'lucide-react';
import type { LatLng } from '../KakaoMapContainer';

import {
  createBookmark,
  deleteBookmark,
  fetchBookmark,
  fetchSearchStores,
  fetchStores,
  type StoreInfo,
} from '../api/store';
import BenefitModal from '../components/BenefitModal';
import type { BottomSheetHandle } from '../components/sidebar/BottomSheet';
import DebouncedInput from '../components/DebouncedInput';
import CategorySlider from '../components/CategorySlider';
import DeskTopBtns from '../components/DeskTopBtns';
import MyLocationBtn from '../components/MyLocationBtn';
import SearchHereBtn from '../components/SearchHearBtn';
import { fetchAiRecommendedStore } from '../api/ai';
import { extractBouns } from '../utils/extractBouns';
import type { RouteItem } from '../components/sidebar/RoadSection';

import BenefitButton from '../components/BenefitButtons';
import { useCurrentLocation } from '../hooks/useCurrentLoaction';
import { useLocation, useNavigate } from 'react-router-dom';
// import CategoryBenefitSlider from '../components/CategoryBenefitSlider';
import {
  benefitIconMap,
  categoryIconMap,
  type BenefitType,
  type CategoryType,
} from '../utils/constant';

export interface CategoryIconMeta {
  icon: LucideIcon;
  className?: string;
  color?: string;
  size?: number;
}

export interface LocationInfo {
  name: string;
  lat: number;
  lng: number;
  recommendReason?: string;
}

export default function MapPage() {
  //도 + 3D 캔버스 감쌀 div
  const containerRef = useRef<HTMLDivElement>(null);

  // Kakao Map 인스턴스
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  // 지도 중심 좌표
  const [center, setCenter] = useState<LatLng>();
  // 내 위치 (Geolocation)
  const [myLocation, setMyLocation] = useState<LatLng | null>(null);

  // API로 불러온 매장 리스트
  const [stores, setStores] = useState<StoreInfo[]>([]);

  // 사이드바에서 선택한 매장 (상세보기)
  //const [selectedStore, setSelectedStore] = useState<StoreInfo | null>(null);
  // 호버 오버레이 할 ID
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  //검색 keyword
  const [keyword, SetKeyword] = useState<string>('');

  // 디바운스 키워드(한글 검색 시 자꾸 바로 검색 => 에러)
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>(keyword);

  const [mode, setMode] = useState<'default' | 'search'>('default');
  // 검색input
  const [searchInput, setSearchInput] = useState<string>('');
  const [startInput, setStartInput] = useState<string>('');
  const [wayInput, setWayInput] = useState<string>('');
  const [endInput, setEndInput] = useState<string>('');
  // API로 불러온 매장 리스트
  const [searchStores, setSearchStores] = useState<StoreInfo[]>([]);

  // 사이드바 menu 현재 상태
  const [panel, setPanel] = useState<Panel>({
    type: 'menu',
    menu: '지도',
  });
  //detail,road 열고 닫힐 때 사용
  const [panelIndex, setPanelIndex] = useState<number>(0);
  //검색 디바운스
  const [isCategory, SetIsCategory] = useState<string>('');
  //선택된 혜택 유형
  const [selectedBenefit, setSelectedBenefit] = useState<BenefitType | ''>('');

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
  const [showSearchBtn, setShowSearchBtn] = useState(true);

  // bounds 변경 시마다 시간 업데이트
  const hideTimeoutRef = useRef<number>(0);

  // peek 상태 바텀시트 높이
  const peekHeight = 30;

  //AI 추천 제휴처
  const [recommendedStore, setRecommendedStore] = useState<StoreInfo>();
  // 선택한 길찾기
  const [selectedRoute, setSelectedRoute] = useState<RouteItem | null>(null);
  // 선택한 카드
  const [selectedCardId, setSelectedCardId] = useState<string>('');
  //경유지
  const [waypoints, setWaypoints] = useState<LocationInfo[]>([]);
  //혜택 인증 모달
  const [isBenefitModalOpen, setIsBenefitModalOpen] = useState(false);

  // 길찾기 input Focus
  const [focusField, setFocusField] = useState<'start' | 'end' | number | null>(
    null,
  );
  // 위치권한 여부
  const { location, hasLocation, requestLocation } = useCurrentLocation();

  const [isMainLoading, setIsMainLoading] = useState<boolean>(false);

  const createBoundsFromLocation = (loc: LatLng, radiusKm = 0.3) => {
    const latDelta = radiusKm / 111;
    const lngDelta = radiusKm / (111 * Math.cos((loc.lat * Math.PI) / 180));

    return {
      centerLat: loc.lat,
      centerLng: loc.lng,
      latMin: loc.lat - latDelta,
      latMax: loc.lat + latDelta,
      lngMin: loc.lng - lngDelta,
      lngMax: loc.lng + lngDelta,
    };
  };

  //제휴처 조회 및 AI 제휴처 조회
  const searchStoresWithAI = useCallback(
    async (myLocation?: LatLng) => {
      if (!map) return;

      const bounds = myLocation
        ? createBoundsFromLocation(myLocation, 1.0)
        : extractBouns(map);

      console.log(myLocation);

      // const bounds = extractBouns(map);

      if (!bounds) return;

      setCenter({ lat: bounds.centerLat, lng: bounds.centerLng });

      setIsMainLoading(true);
      try {
        // 1. 매장 목록 가져오기

        const storeList = await fetchStores({
          keyword: debouncedKeyword,
          category: isCategory,
          benefit: selectedBenefit,
          ...bounds,
          // centerLat: center?.lat,
          // centerLng: center?.lng,
        });

        let finalList = [...storeList];
        try {
          const aiResult = await fetchAiRecommendedStore({
            keyword: debouncedKeyword,
            category: isCategory,
            ...bounds,
            // centerLat: center?.lat,
            // centerLng: center?.lng,
          });

          if (aiResult?.store?.id) {
            const aiStore: StoreInfo = {
              ...aiResult.store,
              isRecommended: aiResult.reason,
            };

            setRecommendedStore(aiStore);

            const exists = storeList.some((store) => store.id === aiStore.id);
            if (!exists) {
              finalList = [aiStore, ...storeList];
            }
          } else {
            setRecommendedStore(undefined);
          }
        } catch (e) {
          console.warn('AI 추천 실패:', e);
          setRecommendedStore(undefined); // AI 추천 실패 시 undefined 처리
        }

        // 3. 최종 매장 목록 반영
        setStores(finalList);
      } catch (err) {
        console.error('매장 목록 로딩 실패:', err);
        setStores([]);
      } finally {
        setIsMainLoading(false);
      }
    },
    [map, debouncedKeyword, isCategory, selectedBenefit],
  );

  // 초기 바텀시트 위치 계산
  useEffect(() => {
    const sheetHeight = window.innerHeight * 0.75;
    setSheetY(sheetHeight - peekHeight);
  }, []);

  // Geolocation API로 내 위치 가져오기
  useEffect(() => {
    requestLocation();
  }, []);

  useEffect(() => {
    const handler = window.setTimeout(() => setDebouncedKeyword(keyword), 300);
    return () => clearTimeout(handler);
  }, [keyword]);

  useEffect(() => {
    searchStoresWithAI();
  }, [debouncedKeyword]);

  //화면 내 매장만 filter해 sidebar 및 marker적용
  // const filterStoresInView = useCallback(() => {
  //   if (!map) return;
  //   const bounds = map.getBounds() as InternalBounds;
  //   if (!bounds) return;

  //   const latSpan = bounds.pa - bounds.qa;
  //   const lngSpan = bounds.oa - bounds.ha;

  //   const narrowedBounds = {
  //     pa: bounds.pa - latSpan * 0.12,
  //     qa: bounds.qa + latSpan * 0.05,
  //     oa: bounds.oa - lngSpan * 0.001,
  //     ha: bounds.ha + lngSpan * 0.1,
  //   };

  //   const list = Array.isArray(stores) ? stores : [];

  //   const inView = list.filter((store) => {
  //     const { latitude: lat, longitude: lng } = store;
  //     return (
  //       lat <= narrowedBounds.pa &&
  //       lat >= narrowedBounds.qa &&
  //       lng <= narrowedBounds.oa &&
  //       lng >= narrowedBounds.ha
  //     );
  //   });

  //   console.log('필터드스토어');

  //   setFilteredStores(inView);

  //   if (inView.length > 0) {
  //     const sum = inView.reduce(
  //       (acc, cur) => {
  //         acc.lat += cur.latitude;
  //         acc.lng += cur.longitude;
  //         return acc;
  //       },
  //       { lat: 0, lng: 0 },
  //     );

  //     const center = {
  //       lat: sum.lat / inView.length,
  //       lng: sum.lng / inView.length,
  //     };

  //     setCenter(center);
  //   }
  //   setShowSearchBtn(true);
  // }, [map, stores]);

  // bounds 변경 시마다 필터링 + 검색 버튼 토글

  // useEffect(() => {

  //   filterStoresInView();
  // }, []);
  // useDebounce(
  //   () => {
  //     if (hasFilteredOnce) return;

  //     filterStoresInView();
  //     setShowSearchBtn(true);
  //     setHasFilteredOnce(true);

  //     // 버튼 숨기기 타이머
  //     clearTimeout(hideTimeoutRef.current);
  //     hideTimeoutRef.current = window.setTimeout(() => {
  //       setShowSearchBtn(false);
  //     }, 5000);
  //   },
  //   300,
  //   [idleCount],
  // );

  // idle 이벤트에서는 카운터만 올려 주기
  useEffect(() => {
    if (!map) return;
    // 마운트 시 제휴처 보여줌
    // filterStoresInView();
    searchStoresWithAI();

    const handleIdle = () => {
      // setIdleCount((c) => c + 1);
    };
    kakao.maps.event.addListener(map, 'idle', handleIdle);
    return () => {
      kakao.maps.event.removeListener(map, 'idle', handleIdle);
      clearTimeout(hideTimeoutRef.current);
    };
  }, [map]);

  // useEffect(() => {
  //   console.log('map changed:', map);
  // }, [map]);

  // useEffect(() => {
  //   console.log('stores changed:', stores);
  // }, [stores]);

  useEffect(() => {
    if (location && location.lat && location.lng) {
      setMyLocation(location);
    }
  }, [location]);

  // useEffect(() => {
  //   if (stores.length > 0 && map) {
  //     filterStoresInView();
  //   }
  // }, [stores, map]);

  // 내 위치가 생기면 지도 중심으로 이동
  useEffect(() => {
    if (map && myLocation) {
      const mylocate = new kakao.maps.LatLng(myLocation.lat, myLocation.lng);
      map.panTo(mylocate);
      setCenter(myLocation);
      searchStoresWithAI(myLocation);
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
      // searchStoresWithAI();
    },
    [map, searchStoresWithAI],
  );

  //즐겨찾기 사이드바 클릭 시 즐겨찾기만 보이도록 +AI 추천 제휴처 추가
  const displayedStores = useMemo<StoreInfo[]>(() => {
    if (isMainLoading) return [];

    if (panel.menu === '즐겨찾기') return bookmarks;

    const list = [...stores];

    if (recommendedStore) {
      const listWithoutRecommended = list.filter(
        (store) => store.id !== recommendedStore.id,
      );
      return [recommendedStore, ...listWithoutRecommended];
    }
    return list;
  }, [isMainLoading, panel.menu, bookmarks, stores, recommendedStore, center]);

  // 사이드바 메뉴 Open
  const openMenu = useCallback((menu: MenuType) => {
    setPanel({ type: 'menu', menu });
    setSelectedCardId('');
    SetKeyword('');
    if (menu !== '길찾기') {
      setWaypoints([]);
      setSelectedRoute(null);
    }
  }, []);

  //매장 선택 시 상세열기
  const openDetail = useCallback(
    (store: StoreInfo) => {
      setPanel({ type: 'detail', menu: panel.menu, item: store });
      setPanelIndex(1);
      setSelectedCardId(store.id);
    },

    [panel.menu],
  );
  // 길찾기 상세보기
  const openRoadDetail = useCallback(
    (route: RouteItem) => {
      setPanel({ type: 'road', menu: panel.menu, item: route });
      setPanelIndex(1);
      setSelectedRoute(route);

      const startPoint = route.path?.[0];
      const endPoint = route.path?.[route.path.length - 1];
      if (startPoint && endPoint) {
        setStartValue({
          name: route.from || '출발지',
          lat: startPoint.lat,
          lng: startPoint.lng,
        });
        setEndValue({
          name: route.to || '도착지',
          lat: endPoint.lat,
          lng: endPoint.lng,
        });
      }

      if (
        route.waypoints &&
        route.waypoints.length > 0 &&
        route.path.length > 2
      ) {
        if (route.waypoints && route.waypoints.length > 0) {
          const restoredWaypoints = route.waypoints.map((wp) => ({
            name: wp.name,
            lat: wp.lat,
            lng: wp.lng,
            ...(wp.recommendReason && { recommendReason: wp.recommendReason }),
          }));

          setWaypoints(restoredWaypoints);
        } else {
          setWaypoints([]);
        }
      }
    },

    [panel.menu],
  );

  //상세 닫기
  const closePanel = useCallback(() => {
    setPanel({ type: 'menu', menu: panel.menu });
    setPanelIndex(0);
    setSelectedRoute(null);
    setSelectedCardId('');
    setStartValue({ name: '', lat: 0, lng: 0 });
    setEndValue({ name: '', lat: 0, lng: 0 });
    setWaypoints([{ name: '', lat: 0, lng: 0 }]);
  }, [panel.menu]);

  //키워드 변경 시 카테고리 초기화
  const changeKeyword = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    SetKeyword(e.target.value);
    SetIsCategory('');
  }, []);
  //카테고리 변경 시 키워드 변경
  const changeCategory = useCallback(
    (category: string) => {
      SetIsCategory((prev) => (prev === category ? '' : category));
      SetKeyword((prev) => (prev === category ? '' : category));
    },
    [openMenu],
  );

  // 출발지 변경
  const onStartChange = useCallback((store: LocationInfo) => {
    setStartValue(store);
    openMenu('길찾기');
  }, []);

  // 도착지 변경
  const onEndChange = useCallback((store: LocationInfo) => {
    setEndValue(store);
    openMenu('길찾기');
  }, []);

  const onSwap = useCallback(() => {
    // 출발/도착 교환
    setStartValue((prev) => {
      setEndValue(prev);
      return endValue;
    });
  }, [endValue]);
  // 출발지 도착지 리셋
  const onReset = useCallback(() => {
    setStartValue({ name: '', lat: 0, lng: 0 });
    setEndValue({ name: '', lat: 0, lng: 0 });
  }, []);

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

  //즐겨찾기 토글
  const toggleBookmark = useCallback(
    async (store: StoreInfo) => {
      if (bookmarks.some((bookmark) => bookmark.id === store.id)) {
        await deleteBookmark(store.id);
        setBookmarks((prev) =>
          prev.filter((bookmark) => bookmark.id !== store.id),
        );
      } else {
        await createBookmark(store.id);
        setBookmarks((prev) => [...prev, store]);
      }
    },
    [bookmarks],
  );

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
    if (selectedRoute?.path.length) {
      const centerIdx = Math.floor(selectedRoute.path.length / 2);
      const center = selectedRoute.path[centerIdx];
      map?.setCenter(new kakao.maps.LatLng(center.lat, center.lng));
    }
  }, [selectedRoute]);

  const resetKeyword = useCallback(() => {
    SetKeyword('');
    SetIsCategory('');
    setSelectedBenefit('');
    setSearchInput('');
  }, []);

  const fetchAndSetSearchStores = useCallback(
    async (keyword: string, category: string, benefit: BenefitType | '') => {
      if (keyword.trim() !== '' || category || benefit) {
        try {
          const result = await fetchSearchStores({
            keyword,
            category,
            benefit,
          });
          setSearchStores(result);
        } catch (e) {
          console.error(e);
          setSearchStores([]);
        }
      } else {
        setSearchStores([]);
      }
    },
    [], // fetchSearchStores가 바깥에 고정이라면 의존성 없음
  );

  //길찾기 입력시 키워드 검색 함수 호출
  useEffect(() => {
    if (focusField === 'start' && startInput.trim()) {
      fetchAndSetSearchStores(startInput, '', '');
    } else if (focusField === 'end' && endInput.trim()) {
      fetchAndSetSearchStores(endInput, '', '');
    } else if (typeof focusField === 'number' && wayInput.trim()) {
      fetchAndSetSearchStores(wayInput, '', '');
    } else {
      setSearchStores([]);
    }
  }, [focusField, startInput, endInput, wayInput]);

  useEffect(() => {
    SetKeyword('');
    setSearchInput('');
    SetIsCategory('');
    setSelectedBenefit('');
  }, [mode]);
  // 키워드 변경 함수
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchInput(value);
      fetchAndSetSearchStores(value, isCategory, selectedBenefit);
    },
    [fetchAndSetSearchStores, isCategory, selectedBenefit],
  );

  const locationPath = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(locationPath.search);
    const shouldClick = params.get('autoClick');

    if (shouldClick === 'true') {
      setIsBenefitModalOpen(true);

      const newParams = new URLSearchParams(locationPath.search);
      newParams.delete('autoClick');

      navigate(`${locationPath.pathname}?${newParams.toString()}`, {
        replace: true,
      });
    }
  }, [locationPath.search]);

  const handleMapClickOrDrag = () => {
    sheetRef.current?.snapTo('bottom');
    sheetDetail.current?.snapTo('bottom');
  };

  return (
    <div className="flex h-screen flex-col-reverse md:flex-row overflow-y-hidden ">
      {/* 사이드바 */}
      <aside className="relative top-[62px] md:top-[86px] mr-6 md:m-0  left-0 bottom-0 md:w-[402px] z-20 flex-shrink-0">
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
          setStartValue={setStartValue}
          setEndValue={setEndValue}
          resetKeyword={resetKeyword}
          selectedCardId={selectedCardId}
          SetKeyword={SetKeyword}
          searchInput={searchInput}
          handleSearchChange={handleSearchChange}
          mode={mode}
          setMode={setMode}
          searchStores={searchStores}
          setStartInput={setStartInput}
          setEndInput={setEndInput}
          setWayInput={setWayInput}
          setIsBenefitModalOpen={setIsBenefitModalOpen}
          setFocusField={setFocusField}
          focusField={focusField}
          isMainLoading={isMainLoading}
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
        {map && myLocation && panel.menu !== '길찾기' && (
          <SearchHereBtn
            map={map}
            show={showSearchBtn}
            sheetY={sheetY}
            onClick={() => {
              searchStoresWithAI();
              setMode('default');
            }}
          />
        )}
      </aside>

      {/* 지도 영역 */}
      <div className="flex-1 md:w-[calc(100%-402px)] h-100dvh relative overflow-x-hidden">
        <div ref={containerRef} className="absolute inset-0">
          <KakaoMapContainer
            center={myLocation ?? center ?? { lat: 37.5, lng: 127 }}
            level={4}
            onMapCreate={setMap}
            selectedRoute={selectedRoute}
            onMapDrag={handleMapClickOrDrag}
            panel={panel}
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
            waypoints={waypoints.length > 0 ? waypoints : undefined}
          >
            {/* 2D 마커/오버레이 */}
            {panel.type !== 'road' && panel.menu !== '길찾기' && (
              <FilterMarker
                hoveredMarkerId={hoveredId}
                setHoveredMarkerId={setHoveredId}
                map={map}
                center={center ?? { lat: 37.5, lng: 127 }}
                containerRef={containerRef}
                stores={displayedStores}
                openDetail={openDetail}
                onStartChange={onStartChange}
                onEndChange={onEndChange}
                toggleBookmark={toggleBookmark}
                bookmarkIds={bookmarkIds}
                selectedCardId={selectedCardId}
                setSelectedCardId={setSelectedCardId}
                goToStore={goToStore}
                panel={panel}
              />
            )}
            {panel.menu !== '길찾기' && (
              <div className="absolute  w-full md:ml-10 ml-0 top-24 md:top-16 z-2  overflow-x-auto overflow-y-visible md:py-4">
                <CategorySlider
                  categoryList={Object.keys(categoryIconMap) as CategoryType[]}
                  selectedCategory={isCategory}
                  onCategoryChange={changeCategory}
                  categoryIconMap={categoryIconMap}
                  benefitList={['쿠폰', '할인', '증정']}
                  selectedBenefit={selectedBenefit}
                  onBenefitChange={setSelectedBenefit}
                  benefitIconMap={benefitIconMap}
                />
                <DeskTopBtns
                  Category={Object.keys(categoryIconMap) as CategoryType[]}
                  isCategory={isCategory}
                  changeCategory={changeCategory}
                  categoryIconMap={categoryIconMap}
                />
              </div>
            )}
            {panel.menu !== '길찾기' && (
              <div className="absolute  w-full md:ml-10 ml-6 top-28 md:top-[110px] z-2  overflow-x-auto py-4 hidden md:block">
                <BenefitButton
                  benefitList={['쿠폰', '할인', '증정']}
                  selected={selectedBenefit}
                  onSelect={setSelectedBenefit}
                  benefitIconMap={benefitIconMap}
                />
              </div>
            )}
            {panel.menu !== '길찾기' && (
              <div className="flex md:hidden absolute top-[68px] left-6 right-6 bg-white z-2 items-center border border-gray-200 rounded-xl px-2 py-1">
                <Search />
                <DebouncedInput
                  value={mode === 'search' ? searchInput : keyword}
                  onChange={
                    mode === 'search' ? handleSearchChange : changeKeyword
                  }
                  debounceTime={300}
                  placeholder="검색"
                />
                <X
                  onClick={resetKeyword}
                  className="cursor-pointer "
                  color="gray"
                />
              </div>
            )}

            <BenefitModal
              isBenefitModalOpen={isBenefitModalOpen}
              setIsBenefitModalOpen={setIsBenefitModalOpen}
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
