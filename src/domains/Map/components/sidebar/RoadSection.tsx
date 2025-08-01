import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import {
  Star,
  RefreshCcw,
  ArrowUpDown,
  ChevronRight,
  ChevronDown,
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
export interface TrafficInfo {
  color: string;
  label: string;
}

export interface RouteItem {
  directionid: string;
  from: string;
  to: string;
  waypointNames?: string[];
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

  section?: RouteSection[];
}

interface RouteInputProps {
  openDetail: (store: StoreInfo) => void;
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
  stores: StoreInfo[];
  SetKeyword: Dispatch<SetStateAction<string>>;
}
type ViewMode = 'bookmark' | 'saved' | 'route';
export default function RoadSection({
  startValue,
  endValue,
  onSwap,
  onReset,
  bookmarks,
  goToStore,
  openDetail,
  openRoadDetail,
  setStartValue,
  setEndValue,
  stores,
  SetKeyword,
}: RouteInputProps) {
  const [showRecent, setShowRecent] = useState<boolean>(true);
  const [mode, setMode] = useState<ViewMode>('saved');
  const inputStyle = 'w-full px-4 py-2 text-sm focus:outline-none';
  const [routes, setRoutes] = useState<RouteItem[]>([]);
  const [savedRoutes, setSavedRoutes] = useState<RouteItem[]>([]);
  const [recentRoutes, setRecentRoutes] = useState<RouteItem[]>([]);
  const [waypoints, setWaypoints] = useState<LocationInfo[]>([]);
  const [focusField, setFocusField] = useState<'start' | 'end' | number | null>(
    null,
  );

  const keywordRequire =
    focusField !== null &&
    stores.length > 0 &&
    (startValue.name.length > 0 ||
      endValue.name.length > 0 ||
      (typeof focusField === 'number' &&
        waypoints[focusField]?.name.length > 0));
  // 리스트 토글
  const toggleMode = () => {
    setMode((prev) => (prev === 'bookmark' ? 'saved' : 'bookmark'));
  };
  const handleNavigate = async () => {
    try {
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
      console.log(body);
      const res = await findDirectionPath(body);

      const routeItems = DirecitonRoot(res);
      setMode('route');
      setRoutes(routeItems);
    } catch (err) {
      alert(err instanceof Error ? err.message : '오류 발생');
    }
  };

  useEffect(() => {
    const fetchBookmark = async () => {
      try {
        const bookmarks = await fetchDirectionBookmarks();
        const converted = bookmarks.map(convertBookmarkToDirectionResponse);
        const routeItems = converted.flatMap((res) => DirecitonRoot(res));
        setSavedRoutes(routeItems);
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
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-md mx-auto  space-y-6 bg-white min-h-dvh">
      {/* 입력창 + 액션 버튼 */}
      <div className="space-y-3 py-4 px-2 bg-white ">
        {/* 입력창 영역 */}
        <div className="relative w-full max-w-md mx-auto">
          {/*인풋 컨테이너 */}
          <div className="border border-gray-300 rounded-xl overflow-hidden">
            {/* 출발지 */}
            <DebouncedInput
              value={startValue?.name || ''}
              placeholder="출발지를 입력하세요"
              onChange={(e) => {
                const value = e.target.value;
                setStartValue((prev) => ({ ...prev, name: value }));
                SetKeyword(value);
              }}
              onFocus={() => setFocusField('start')}
              className={inputStyle}
            />
            {/* 구분선 */}
            <div className="h-px bg-gray-200"></div>
            {waypoints.map((point, idx) => (
              <div key={idx} className="relative">
                <DebouncedInput
                  value={point.name || ''}
                  placeholder={`경유지 ${idx + 1}`}
                  onFocus={() => setFocusField(idx)}
                  onChange={(e) => {
                    const value = e.target.value;
                    const updated = [...waypoints];
                    updated[idx] = { ...updated[idx], name: value };
                    setWaypoints(updated);
                    SetKeyword(value);
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
              onFocus={() => setFocusField('end')}
              value={endValue?.name || ''}
              onChange={(e) => {
                const value = e.target.value;
                setEndValue((prev) => ({ ...prev, name: value }));
                SetKeyword(value);
              }}
              placeholder="도착지를 입력하세요"
              className={inputStyle}
            />
            {keywordRequire && (
              <ul className="mt-2  border border-gray-200 rounded-md shadow scrollbar-custom bg-white max-h-72 overflow-y-auto">
                {stores.map((store) => (
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
                ))}
              </ul>
            )}
          </div>

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
          {mode === 'saved' ? (
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
              setEndValue({ name: '', lat: 0, lng: 0 });
            }}
            className=" text-xs text-primaryGreen cursor-pointer hover:text-primaryGreen-80"
          >
            + 경유지 추가
          </button>
        </div>
      </div>

      {mode === 'bookmark' && (
        <div className="space-y-2 px-2">
          <div className=" flex justify-between">
            <p className="text-xl font-bold text-gray-600">즐겨찾기</p>
            <div className="text-sm flex ">
              <p>추천순</p> <ChevronDown className="inline" />
            </div>
          </div>
          {bookmarks.map((bookmark) => (
            <StarListItem
              bookmark={bookmark}
              key={bookmark.id}
              onCenter={() => goToStore(bookmark)}
              openDetail={() => openDetail(bookmark)}
            />
          ))}
        </div>
      )}

      {/* 저장한 경로 */}
      {mode === 'saved' && (
        <div className="space-y-2 px-2">
          <p className="text-xl font-semibold text-gray-600">저장한 경로</p>
          <ul className="space-y-1">
            {savedRoutes &&
              savedRoutes.map((route, idx) => (
                <li
                  key={`${route.directionid}-${idx}`}
                  className="flex cursor-pointer items-center justify-between px-3 py-2 bg-gray-50 rounded-full"
                  onClick={() => openRoadDetail(route)}
                >
                  <div className="flex items-center space-x-2 overflow-hidden">
                    <span className="text-sm font-medium text-gray-800 truncate max-w-[250px]">
                      {route.from}
                    </span>
                    <span className="text-gray-400">→</span>
                    <span className="text-sm font-medium text-gray-800 truncate max-w-[250px]">
                      {route.to}
                    </span>
                  </div>
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
        </div>
      )}
      {/* 최근 경로 토글 */}
      {mode === 'saved' && (
        <div className="space-y-2 px-2">
          <div className="flex items-center justify-between">
            <p className="text-xl font-semibold text-gray-600">최근 경로</p>
            <OnOffBtn setShowRecent={setShowRecent} showRecent={showRecent} />
          </div>
          {showRecent && (
            <ul className="space-y-1">
              {recentRoutes.map((route) => (
                <li
                  key={route.directionid}
                  className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-full cursor-pointer"
                  onClick={() => openRoadDetail(route)}
                >
                  <div className="flex items-center space-x-2 overflow-hidden">
                    <span className="text-sm font-medium text-gray-800 truncate max-w-[250px]">
                      {route.from}
                    </span>
                    <span className="text-gray-400">→</span>
                    <span className="text-sm font-medium text-gray-800 truncate max-w-[250px]">
                      {route.to}
                    </span>
                  </div>
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
      {mode === 'route' && (
        <div className="flex flex-col px-2 ">
          {routes.map((route, idx) => (
            <RouteCard
              key={route.directionid}
              route={route}
              idx={idx}
              onClick={() => openRoadDetail(route)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
