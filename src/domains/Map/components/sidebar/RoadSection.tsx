import { useState } from 'react';
import {
  Star,
  Trash2,
  RefreshCcw,
  ArrowUpDown,
  ChevronRight,
  ChevronDown,
  Route,
} from 'lucide-react';
import type { StoreInfo } from '../../api/store';
import OnOffBtn from '../OnOffBtn';
import StarListItem from '../StarListItem';
import { Button } from '@/components/Button';

interface RouteItem {
  id: number;
  from: string;
  to: string;
}
interface RouteInputProps {
  openDetail: (store: StoreInfo) => void;
  onStar: () => void;
  isShowStar: boolean;
  startValue?: string;
  endValue?: string;
  onStartChange: (v: string) => void;
  onEndChange: (v: string) => void;
  onSwap?: () => void;
  onReset?: () => void;
  onNavigate?: () => void;
  bookmarks: StoreInfo[];
  goToStore: (store: StoreInfo) => void;
}

export default function RoadSection({
  startValue,
  endValue,
  onStartChange,
  onEndChange,
  onSwap,
  onReset,
  onStar,
  onNavigate,
  isShowStar,
  bookmarks,
  goToStore,
  openDetail,
}: RouteInputProps) {
  const [savedRoutes, setSavedRoutes] = useState<RouteItem[]>([
    { id: 1, from: '할리스 OO점', to: '할리스 OO점' },
    { id: 2, from: '할리스 OO점', to: '할리스 OO점' },
    { id: 3, from: '할리스 OO점', to: '할리스 OO점' },
  ]);
  const [showRecent, setShowRecent] = useState<boolean>(true);
  const [recentRoutes] = useState<RouteItem[]>([
    { id: 11, from: '할리스 OO점', to: '할리스 OO점' },
    { id: 12, from: '할리스 OO점', to: '할리스 OO점' },
    { id: 13, from: '할리스 OO점', to: '할리스 OO점' },
  ]);
  const inputStyle = 'w-full px-4 py-2 text-sm focus:outline-none';

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
              value={startValue}
              onChange={(e) => onStartChange(e.target.value)}
              placeholder="출발지를 입력하세요"
              className={inputStyle}
            />
            {/* 구분선 */}
            <div className="h-px bg-gray-200"></div>
            {/* 도착지 */}
            <input
              type="text"
              value={endValue}
              onChange={(e) => onEndChange(e.target.value)}
              placeholder="도착지를 입력하세요"
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
        <div className="flex items-center space-x-2 ">
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
            onClick={onNavigate}
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
          <div className="space-y-2 px-2">
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
          </div>
          {/* 최근 경로 토글 */}
          <div className="space-y-2 px-2">
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
          </div>
        </>
      )}
    </div>
  );
}
