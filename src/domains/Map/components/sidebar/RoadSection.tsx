import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import {
  Star,
  RefreshCcw,
  ArrowUpDown,
  ChevronRight,
  Route,
  Trash2,
  CircleMinus,
} from 'lucide-react';
import type { StoreInfo } from '../../api/store';
import StarListItem from '../StarListItem';
import { Button } from '@/components/Button';
import {
  convertBookmarkToDirectionResponse,
  deleteDirectionPath,
  fetchDirectionBookmarks,
  findDirectionPath,
  findDirectionPathAI,
  getDirectionPath,
  updateBookmarkStatus,
  type DirectionRequestBody,
  type RouteSection,
} from '../../api/road';
import { DirecitonRoot } from '../DirecitonRoot';
import type { LocationInfo } from '../../pages/MapPage';
import RouteCard from '../RouteCard';
import type { LatLng } from '../../KakaoMapContainer';
import OnOffBtn from '../OnOffBtn';
import DebouncedInput from '../DebouncedInput';
import clsx from 'clsx';
import RouteLine from '../RouteLine';
import { Ring } from 'ldrs/react';
import MapImage from '@/assets/image/dolphin-map.svg';
export interface TrafficInfo {
  color: string;
  label: string;
}

export interface RouteItem {
  directionid: string;
  from: string;
  to: string;
  waypoints: LocationInfo[];
  distanceText: string;
  durationText: string;
  tollFare: number;
  taxiFare: number;
  path: {
    lat: number;
    lng: number;
  }[];
  guide: {
    name: string;
    description: string;
    point: { lat: number; lng: number };
    type: string;
    duration: number;
    distance: number;
    rode_index: number;
  }[];
  traffic?: TrafficInfo;
  road: {
    name: string;
    distance: number;
    traffic_state: number;
    path?: LatLng[];
  }[];
  recommendReason?: string;
  section?: RouteSection[];
  scenario?: string;
  bookmark?: boolean;
}

interface RouteInputProps {
  startValue: LocationInfo;
  endValue: LocationInfo;
  onSwap?: () => void;
  onReset?: () => void;
  onNavigate?: () => void;
  bookmarks: StoreInfo[];
  goToStore: (store: StoreInfo) => void;
  openRoadDetail: (route: RouteItem) => void;
  setStartValue: Dispatch<SetStateAction<LocationInfo>>;
  setEndValue: Dispatch<SetStateAction<LocationInfo>>;

  setStartInput: Dispatch<SetStateAction<string>>;
  setEndInput: Dispatch<SetStateAction<string>>;
  setWayInput: Dispatch<SetStateAction<string>>;
  searchStores: StoreInfo[];
  onClose: (idx: number) => void;
  setFocusField: Dispatch<SetStateAction<'start' | 'end' | number | null>>;
  focusField: 'start' | 'end' | number | null;
}
type ViewMode = 'bookmark' | 'saved' | 'route';
export default function RoadSection({
  startValue,
  endValue,
  onSwap,
  onReset,
  bookmarks,
  goToStore,
  openRoadDetail,
  setStartValue,
  setEndValue,
  setStartInput,
  setEndInput,
  setWayInput,
  searchStores,
  onClose,
  setFocusField,
  focusField,
}: RouteInputProps) {
  const [showRecent, setShowRecent] = useState<boolean>(false);
  const [viewmode, setViewMode] = useState<ViewMode>('saved');
  const inputStyle = 'w-full px-4 py-2 text-sm focus:outline-none';
  const [routes, setRoutes] = useState<RouteItem[]>([]);
  const [savedRoutes, setSavedRoutes] = useState<RouteItem[]>([]);
  const [recentRoutes, setRecentRoutes] = useState<RouteItem[]>([]);
  const [waypoints, setWaypoints] = useState<LocationInfo[]>([]);
  const [Roadmode, setRoadMode] = useState<'default' | 'ai'>('default');
  const [scenario, setScenario] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const keywordRequire =
    focusField !== null &&
    ((focusField === 'start' && startValue.name.length > 0) ||
      (focusField === 'end' && endValue.name.length > 0) ||
      (typeof focusField === 'number' &&
        waypoints[focusField]?.name.length > 0));
  // 리스트 토글
  const toggleMode = () => {
    setViewMode((prev) => (prev === 'bookmark' ? 'saved' : 'bookmark'));
  };
  const handleNavigate = async () => {
    setIsLoading(true);
    try {
      onClose(1);
      const body: DirectionRequestBody = {
        origin: {
          name: startValue?.name,
          x: startValue.lng,
          y: startValue.lat,
          angle: 270,
        },
        destination: {
          name: endValue?.name,
          x: endValue.lng,
          y: endValue.lat,
          angle: 270,
        },
        waypoints: waypoints.map((w) => ({
          name: w.name,
          x: w.lng,
          y: w.lat,
        })),

        priority: 'RECOMMEND',
        car_fuel: 'GASOLINE',
        car_hipass: false,
        alternatives: false,
        road_details: false,
        summary: false,
      };

      if (Roadmode === 'default') {
        const res = await findDirectionPath(body);
        const routeItems = DirecitonRoot(res);
        setRoutes(routeItems);
        setViewMode('route');
      } else {
        // AI 길찾기
        const res = await findDirectionPathAI(body);
        console.log(res);
        setRoutes(DirecitonRoot(res));
        setScenario(res.data.scenario);
        setViewMode('route');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : '오류 발생');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSavedRoutes = async () => {
    const bookmarks = await fetchDirectionBookmarks();
    const converted = bookmarks.map(convertBookmarkToDirectionResponse);
    const routeItems = converted.flatMap((res) => DirecitonRoot(res));
    setSavedRoutes(routeItems);
  };

  useEffect(() => {
    const fetchBookmark = async () => {
      try {
        refreshSavedRoutes();
      } catch (error) {
        console.log(error);
      }
    };
    fetchBookmark();
  }, []);

  const routeDeleteBookmark = async (route: RouteItem) => {
    try {
      await updateBookmarkStatus(route.directionid, false);
      alert('경로가 삭제되었습니다.');
    } catch (err) {
      console.error(err);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    const fetchRecentRoute = async () => {
      try {
        const res = await getDirectionPath();
        // routes 배열 안에 있는 일부 route는 summary 또는 sections가 undefined 또는 누락된거 filter
        const convertedResponses = res.data
          .filter(
            (bookmark) =>
              bookmark.routes?.[0]?.summary && bookmark.routes?.[0]?.sections,
          )
          .reverse()
          .map((bookmark) => convertBookmarkToDirectionResponse(bookmark));
        const routeItems = convertedResponses.flatMap((r) => DirecitonRoot(r));
        setRecentRoutes(routeItems);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRecentRoute();
  }, []);

  const deleteRoutes = async (id: string) => {
    try {
      await deleteDirectionPath(id);
      alert('최근 경로 삭제');
    } catch (error) {
      console.error(error);
    }
  };

  const handleBookmarkClick = (bookmark: StoreInfo) => {
    // 이미 등록된 제휴처 인지 확인
    const isAlready =
      startValue?.name === bookmark.name ||
      endValue?.name === bookmark.name ||
      waypoints.some((w) => w.name === bookmark.name);

    if (isAlready) return; // 중복이면 무시

    if (!startValue?.name) {
      setStartValue({
        name: bookmark.name,
        lat: bookmark.latitude,
        lng: bookmark.longitude,
      });
      return;
    }
    if (waypoints.length > 0) {
      //빈 경유지 슬롯 우선
      const emptyIdx = waypoints.findIndex((w) => !w.name);
      if (emptyIdx !== -1) {
        const updated = [...waypoints];
        updated[emptyIdx] = {
          name: bookmark.name,
          lat: bookmark.latitude,
          lng: bookmark.longitude,
        };
        setWaypoints(updated);
        return;
      }
      // 도착지가 비었으면 도착지로
      if (!endValue?.name) {
        setEndValue({
          name: bookmark.name,
          lat: bookmark.latitude,
          lng: bookmark.longitude,
        });
      }
      return;
    }

    // 경유지가 아예 없을 때는 바로 도착지로
    if (!endValue?.name) {
      setEndValue({
        name: bookmark.name,
        lat: bookmark.latitude,
        lng: bookmark.longitude,
      });
      return;
    }
  };

  return (
    <div className="max-w-md mx-auto  space-y-4 bg-white min-h-dvh">
      <div className="flex relative top-4 w-[95%] ml-2 py-1 rounded-xl bg-gray-100 shadow-inner">
        <button
          onClick={() => setRoadMode('default')}
          className={clsx(
            `w-1/2 py-2 cursor-pointer text-sm font-semibold rounded-xl transition-all duration-200`,

            Roadmode === 'default'
              ? 'bg-primaryGreen-80 text-white shadow-sm  border border-primaryGreen-80'
              : 'text-black bg-white hover:text-primaryGreen-80  border border-primaryGreen-40',
          )}
        >
          길찾기
        </button>
        <button
          onClick={() => setRoadMode('ai')}
          className={clsx(
            `w-1/2 py-2 cursor-pointer text-sm font-semibold rounded-xl transition-all duration-200  `,

            Roadmode === 'ai'
              ? 'bg-primaryGreen-80 text-white shadow-md animate-none border border-primaryGreen-80'
              : 'text-black bg-white hover:text-primaryGreen-80 shadow-sm border border-primaryGreen-40 animate-floatBounce ',
          )}
        >
          AI 길찾기
        </button>
        <span
          className={clsx(
            `absolute -top-2 -right-2 text-[10px] bg-red-400 text-white px-1.5 py-0.5 rounded-full shadow`,
            Roadmode !== 'ai' ? 'duration-200 animate-floatBounce' : 'hidden',
          )}
        >
          HOT
        </span>
      </div>
      {/* 입력창 + 액션 버튼  */}
      <div className="space-y-3 py-4 px-2 bg-white ">
        {/* 입력창 영역 */}
        <div className="relative w-full max-w-md mx-auto">
          {/*인풋 컨테이너 */}
          <div className="border relative border-gray-300 rounded-xl overflow-hidden">
            {/* 출발지 */}
            <DebouncedInput
              value={startValue?.name || ''}
              placeholder="출발지를 입력하세요"
              onChange={(e) => {
                const value = e.target.value;
                setStartValue((prev) => ({ ...prev, name: value }));
                setStartInput(value);
              }}
              onFocus={() => {
                setFocusField('start');
              }}
              className={inputStyle}
            />
            {/* 구분선 */}
            <div className="h-px bg-gray-200"></div>
            {Roadmode === 'default' &&
              waypoints.map((point, idx) => (
                <div key={idx} className="relative">
                  <DebouncedInput
                    value={point.name || ''}
                    placeholder={`경유지 ${idx + 1}`}
                    onFocus={() => {
                      setFocusField(idx);
                    }}
                    onChange={(e) => {
                      const value = e.target.value;
                      const updated = [...waypoints];
                      updated[idx] = { ...updated[idx], name: value };
                      setWaypoints(updated);
                      setWayInput(value);
                    }}
                    className={inputStyle}
                  />
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 cursor-pointer hover:text-gray-500"
                    onClick={() =>
                      setWaypoints((prev) => prev.filter((_, i) => i !== idx))
                    }
                  >
                    <CircleMinus size={20} />
                  </button>
                </div>
              ))}
            <div className="h-px bg-gray-200"></div>
            {/* 도착지 */}
            <DebouncedInput
              onFocus={() => {
                setFocusField('end');
              }}
              value={endValue?.name || ''}
              onChange={(e) => {
                const value = e.target.value;
                setEndValue((prev) => ({ ...prev, name: value }));
                setEndInput(value);
              }}
              placeholder="도착지를 입력하세요"
              className={inputStyle}
            />
            {/* 2) 출발 도착 바꾸기버튼 */}
            {waypoints.length === 0 && (
              <button
                onClick={onSwap}
                aria-label="출발/도착 교환"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6
            bg-white border border-gray-300  
            rounded-full flex items-center justify-center 
            shadow-sm  hover:bg-gray-50 focus:outline-none cursor-pointer"
              >
                <ArrowUpDown size={16} />
              </button>
            )}
          </div>

          {keywordRequire && (
            <ul className="mt-2  border border-gray-200 rounded-md shadow scrollbar-custom bg-white max-h-72 overflow-y-auto">
              {Array.isArray(searchStores) && searchStores.length > 0
                ? searchStores.map((store) => (
                    <li
                      key={store.id}
                      className="p-2 border-b border-b-gray-200 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        const selectedLocation: LocationInfo = {
                          name: store.name,
                          lat: store.latitude,
                          lng: store.longitude,
                        };

                        if (focusField === 'start') {
                          setStartValue(selectedLocation);
                        } else if (focusField === 'end') {
                          setEndValue(selectedLocation);
                        } else if (typeof focusField === 'number') {
                          const updated = [...waypoints];
                          updated[focusField] = selectedLocation;
                          setWaypoints(updated);
                        }
                        setFocusField(null); // 선택 후 닫기
                      }}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-sm text-gray-800">
                          {store.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {store.address}
                        </span>
                      </div>
                    </li>
                  ))
                : null}
            </ul>
          )}
        </div>

        {/* 액션 버튼 그룹 */}
        <div className="flex items-center justify-between space-x-2 ">
          {/* 다시입력 */}
          <Button
            onClick={onReset}
            variant="ghost"
            size="sm"
            className=" hover:bg-gray-100 focus:outline-none flex"
          >
            <RefreshCcw size={16} className="mr-1 text-primaryGreen" />
            <p className="w-11 text-xs">다시입력</p>
          </Button>

          {/* 즐겨찾기 혹은 경로목록*/}
          {viewmode === 'saved' ? (
            <Button
              onClick={toggleMode}
              variant="ghost"
              size="sm"
              className=" hover:bg-gray-100 focus:outline-none flex"
            >
              <Star size={16} className="mr-1 text-yellow-400 fill-current" />
              <p className="w-11 text-xs">즐겨찾기</p>
            </Button>
          ) : (
            <Button
              onClick={toggleMode}
              variant="ghost"
              size="sm"
              className=" hover:bg-gray-100 focus:outline-none flex"
            >
              <Route size={16} className="mr-1" />
              <p className="w-11 text-xs">경로목록</p>
            </Button>
          )}

          <Button
            onClick={handleNavigate}
            variant="primary"
            size="sm"
            className="flex hover:brightness-110 focus:outline-none"
          >
            <p className="w-11 text-xs">길찾기</p>
            <ChevronRight size={16} />
          </Button>
        </div>
        <div>
          <button
            type="button"
            onClick={() => {
              setWaypoints([...waypoints, { name: '', lat: 0, lng: 0 }]);
            }}
            className=" text-xs text-primaryGreen cursor-pointer hover:text-primaryGreen-80"
          >
            + 경유지 추가
          </button>
        </div>
      </div>

      {!isLoading && viewmode === 'bookmark' && (
        <div className="space-y-2 px-2">
          <div className=" flex justify-between">
            <p className="text-xl font-bold text-gray-600">즐겨찾기</p>
          </div>
          {bookmarks.map((bookmark) => (
            <StarListItem
              bookmark={bookmark}
              key={bookmark.id}
              onRoadClick={() => handleBookmarkClick(bookmark)}
              onCenter={() => goToStore(bookmark)}
            />
          ))}
        </div>
      )}

      {/* 저장한 경로 */}
      {!isLoading && viewmode === 'saved' && (
        <div className="space-y-2 px-2">
          <p className="text-xl font-semibold text-gray-600">저장한 경로</p>
          {(!isLoading && !savedRoutes) || savedRoutes.length === 0 ? (
            <div className="py-4 text-center text-gray-400 text-sm space-y-1">
              <p>저장된 경로가 없어요!</p>
              {Roadmode === 'default' && (
                <>
                  <p>AI 길찾기를 통해 경로 추천 받고 저장해봐요!</p>
                  <Button size="sm" onClick={() => setRoadMode('ai')}>
                    AI 길찾기 이동하기
                  </Button>
                </>
              )}
            </div>
          ) : (
            <ul className="space-y-1">
              {savedRoutes.map((route, idx) => (
                <li
                  key={`${route.directionid}-${idx}`}
                  className="flex cursor-pointer items-center justify-between px-3 py-2 bg-white rounded-2xl  hover:bg-primaryGreen-40 border border-white hover:border-primaryGreen-80"
                  onClick={() => openRoadDetail(route)}
                >
                  <RouteLine
                    from={route.from}
                    waypoints={route.waypoints?.map((w) => w.name) || []}
                    to={route.to}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSavedRoutes((s) =>
                        s.filter((x) => x.directionid !== route.directionid),
                      );
                      routeDeleteBookmark(route);
                    }}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={18} className="cursor-pointer" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* 최근 경로 토글 */}
      {!isLoading && viewmode === 'saved' && (
        <div className="space-y-2 px-2">
          <div className="flex items-center justify-between">
            <p className="text-xl font-semibold text-gray-600">최근 경로</p>
            <OnOffBtn setShowRecent={setShowRecent} showRecent={showRecent} />
          </div>
          {showRecent && (
            <ul className="space-y-1">
              {recentRoutes.map((route, idx) => (
                <li
                  key={`${route.directionid}-${idx}`}
                  className="flex cursor-pointer items-center justify-between px-3 py-2 bg-white rounded-2xl hover:bg-primaryGreen-40 border border-white hover:border-primaryGreen-80"
                  onClick={() => openRoadDetail(route)}
                >
                  <RouteLine
                    from={route.from}
                    waypoints={route.waypoints?.map((w) => w.name) || []}
                    to={route.to}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setRecentRoutes((s) =>
                        s.filter((x) => x.directionid !== route.directionid),
                      );
                      deleteRoutes(route.directionid);
                    }}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={18} className="cursor-pointer" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {!isLoading && viewmode === 'route' && (
        <div className="flex flex-col px-2 ">
          {routes.map((route, idx) => (
            <RouteCard
              key={route.directionid}
              route={route}
              idx={idx}
              onClick={() => openRoadDetail(route)}
              showScenario={Roadmode === 'ai'}
              scenario={scenario}
              refreshSavedRoutes={refreshSavedRoutes}
            />
          ))}
        </div>
      )}
      {isLoading && (
        <div className="h-72 flex flex-col justify-center items-center gap-3">
          <img src={MapImage} alt="AI 길찾기 안내" className="w-24 h-24" />
          {/* 안내 텍스트 */}
          <div className="text-lg font-semibold text-gray-700">
            AI가 최적의 경로를 찾고 있어요...
          </div>
          {/* Ring 스피너 */}
          <Ring size="40" stroke="3" bgOpacity="0" speed="2" color="#6fc3d1" />
        </div>
      )}
    </div>
  );
}
