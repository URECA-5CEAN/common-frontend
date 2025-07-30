import { useState } from 'react';
import {
  Star,
  RefreshCcw,
  ArrowUpDown,
  ChevronRight,
  ChevronDown,
  Route,
  MoveRight,
} from 'lucide-react';
import type { StoreInfo } from '../../api/store';
import StarListItem from '../StarListItem';
import { Button } from '@/components/Button';
import {
  findDirectionPath,
  type DirectionRequestBody,
  type Road,
  type RouteSection,
} from '../../api/road';
import { DirecitonRoot } from '../DirecitonRoot';
import { MajorLoads } from '../MajorLoads';
import type { LocationInfo } from '../../pages/MapPage';
export interface TrafficInfo {
  color: string;
  label: string;
}

export interface RouteItem {
  id: string;
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
  road: Road;
  section?: RouteSection[];
}

interface RouteInputProps {
  openDetail: (store: StoreInfo) => void;
  onStar: () => void;
  isShowStar: boolean;
  startValue: LocationInfo;
  endValue: LocationInfo;
  onSwap?: () => void;
  onReset?: () => void;
  onNavigate?: () => void;
  bookmarks: StoreInfo[];
  goToStore: (store: StoreInfo) => void;
  openRoadDetail: (route: RouteItem) => void;
}

export default function RoadSection({
  startValue,
  endValue,
  onSwap,
  onReset,
  onStar,
  isShowStar,
  bookmarks,
  goToStore,
  openDetail,
  openRoadDetail,
}: RouteInputProps) {
  const [showRecent, setShowRecent] = useState<boolean>(true);

  const inputStyle = 'w-full px-4 py-2 text-sm focus:outline-none';
  const [routes, setRoutes] = useState<RouteItem[]>([]);
  const handleNavigate = async () => {
    try {
      const body: DirectionRequestBody = {
        origin: { x: startValue.lng, y: startValue.lat, angle: 270 },
        destination: { x: endValue.lng, y: endValue.lat, angle: 270 },
        waypoints: [],
        priority: 'RECOMMEND',
        car_fuel: 'GASOLINE',
        car_hipass: false,
        alternatives: false,
        road_details: false,
        summary: false,
      };

      const res = await findDirectionPath(body);
      console.log(res);
      const routeItems = DirecitonRoot(res);
      setRoutes(routeItems);
    } catch (err) {
      alert(err instanceof Error ? err.message : '오류 발생');
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
            <input
              type="text"
              value={startValue?.name || ''}
              readOnly
              placeholder="출발지를 선택하세요"
              className={inputStyle}
            />
            {/* 구분선 */}
            <div className="h-px bg-gray-200"></div>
            {/* 도착지 */}
            <input
              type="text"
              value={endValue?.name || ''}
              readOnly
              placeholder="도착지를 선택하세요"
              className={inputStyle}
            />
          </div>

          {/* 2) 출발 도착 바꾸기버튼 */}
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
          {!isShowStar ? (
            <Button
              onClick={onStar}
              variant="ghost"
              size="sm"
              className=" hover:bg-gray-100 focus:outline-none flex"
            >
              <Star size={16} className="mr-1 text-yellow-400 fill-current" />
              <p className="w-11 text-xs">즐겨찾기</p>
            </Button>
          ) : (
            <Button
              onClick={onStar}
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
      </div>

      {isShowStar ? (
        <div className="space-y-2 px-2">
          <div className=" flex justify-between">
            <p className="text-xl font-bold text-gray-600">즐겨찾기</p>
            <p className="text-sm flex ">
              <p>추천순</p> <ChevronDown className="inline" />
            </p>
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
      ) : (
        <>
          {/* 저장한 경로 */}
          {/* <div className="space-y-2 px-2">
            <p className="text-xl font-semibold text-gray-600">저장한 경로</p>
            <ul className="space-y-1">
              {savedRoutes.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-full"
                >
                  <span className="text-sm">{`${r.from} → ${r.to}`}</span>
                  <button
                    onClick={() =>
                      setSavedRoutes((s) => s.filter((x) => x.id !== r.id))
                    }
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={16} className="cursor-pointer" />
                  </button>
                </li>
              ))}
            </ul>
          </div> */}
          {/* 최근 경로 토글 */}
          {/* <div className="space-y-2 px-2">
            <div className="flex items-center justify-between">
              <p className="text-xl font-semibold text-gray-600">최근 경로</p>
              <OnOffBtn setShowRecent={setShowRecent} showRecent={showRecent} />
            </div>
            {showRecent && (
              <ul className="space-y-1">
                {recentRoutes.map((r) => (
                  <li
                    key={r.id}
                    className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-full"
                  >
                    <span className="text-sm">{`${r.from} → ${r.to}`}</span>
                    <button className="p-1 text-gray-400 hover:text-red-500">
                      <Trash2 size={16} className="cursor-pointer" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div> */}
        </>
      )}
      <div className="flex flex-col px-2 ">
        {routes.map((route, idx) => {
          const allRoads = route.section?.flatMap((s) => s.roads) || [];
          const majorRoad = MajorLoads(allRoads);
          return (
            <div
              key={route.id}
              className="bg-primaryGreen-40 flex flex-col rounded-lg py-2 mb-2"
            >
              <p className="font-semibold text-xl mb-1 px-2">
                추천경로 {idx + 1}
              </p>
              <div className="flex gap-4 text-sm px-2 items-center">
                <p className="text-lg font-semibold">{route.durationText}</p>
                <p className="text-base">{route.distanceText}</p>
              </div>
              <div className="flex gap-4 text-xs px-2 mt-1">
                <p>택시비: {route.taxiFare.toLocaleString()}원</p>
                <p>통행료: {route.tollFare.toLocaleString()}원</p>
              </div>
              <div className="px-2 mt-2 text-sm text-gray-600 space-y-0.5">
                {majorRoad.map((road, i) => (
                  <div key={i} className="flex flex-wrap gap-1">
                    <div className="flex items-center space-x-1 space-y-1 ">
                      {road.traffic && (
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: road.traffic.color,
                            color: 'white',
                          }}
                        >
                          {road.traffic.label}
                        </span>
                      )}
                      <span className="text-xs mt-0.5 ">{road.name}</span>
                      <span className="text-xs mt-0.5">{road.distanceKm}</span>
                      <MoveRight size={15} className="mb-0.5" />
                    </div>
                  </div>
                ))}
                <div className="mt-1" onClick={() => openRoadDetail(route)}>
                  상세보기 &gt;
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
