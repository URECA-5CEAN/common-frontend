import { motion } from 'framer-motion';
import clsx from 'clsx';
import UserSection from './UserSection';
import MapSection from './MapSection';
import StarSection from './StarSection';
import DetailSection from './DetailSection';
import { ChevronLeft } from 'lucide-react';
import RoadSection, { type RouteItem } from './RoadSection';
import {
  useEffect,
  useState,
  type ChangeEventHandler,
  type Dispatch,
  type SetStateAction,
} from 'react';
import type { StoreInfo } from '../../api/store';
import type { Panel } from './MapSidebar';
import { getUserInfo, getUserStat } from '@/domains/MyPage/api/profile';
import type { UserInfoApi } from '@/domains/MyPage/types/profile';
import type { LocationInfo } from '../../pages/MapPage';
import RoadDetailSection from './RoadDetailSection';

interface SidebarPanelProps {
  index: number; // 0 = 메뉴, 1 = 상세
  panel: Panel; //현재 보여줄 메뉴
  stores: StoreInfo[];
  openDetail: (store: StoreInfo) => void;
  onClose: (idx: number) => void;
  //제휴처 검색
  changeKeyword?: ChangeEventHandler<HTMLInputElement>;
  //키워드
  keyword?: string;
  startValue: LocationInfo;
  endValue: LocationInfo;
  onStartChange: (v: LocationInfo) => void;
  onEndChange: (v: LocationInfo) => void;
  onSwap?: () => void;
  onReset?: () => void;
  onNavigate?: () => void;
  bookmarks: StoreInfo[];
  toggleBookmark: (store: StoreInfo) => void;
  bookmarkIds: Set<string>;
  goToStore: (store: StoreInfo) => void;
  openRoadDetail: (route: RouteItem) => void;
  setStartValue: Dispatch<SetStateAction<LocationInfo>>;
  setEndValue: Dispatch<SetStateAction<LocationInfo>>;
}

export default function SidebarPanel({
  index,
  panel,
  stores,
  openDetail,
  onClose,
  changeKeyword,
  keyword,
  startValue,
  endValue,
  onStartChange,
  onEndChange,
  onSwap,
  onReset,
  onNavigate,
  bookmarks,
  toggleBookmark,
  bookmarkIds,
  goToStore,
  openRoadDetail,
  setStartValue,
  setEndValue,
}: SidebarPanelProps) {
  const [userInfo, setUserInfo] = useState<UserInfoApi>();
  const token = localStorage.getItem('authToken');
  useEffect(() => {
    if (!token) return;
    const fetchUserData = async () => {
      const userInfoRes = await getUserInfo();
      const userStatRes = await getUserStat();

      const mergedData = {
        ...userInfoRes.data,
        ...userStatRes.data,
      };

      setUserInfo(mergedData);
    };

    fetchUserData();
  }, [token]);

  const left = 64 + index * 345;
  const isDetail = panel.type === 'detail';
  const isRoad = panel.type === 'road';
  if (!userInfo) return;
  return (
    <motion.div
      key={index}
      initial={{ x: -332, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -332, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={clsx(
        'bg-white rounded-t-2xl shadow h-auto  ',
        'md:rounded-tl-2xl  md:ml-6.5 md:mt-20 md:rounded-bl-2xl md:fixed md:top-0 md:bottom-0 md:left-0 md:w-[332px] md:max-h-full',
      )}
      style={{ left }}
    >
      <div className="p-4 pr-2 bg-white relative md:shadow-lg rounded-lg scrollbar-custom overflow-y-auto h-auto  md:max-h-[calc(100vh-78px)] z-10 ">
        {/* 첫 번째 패널: 사용자 정보 */}
        <div className="hidden md:block">
          {index === 0 && (
            <UserSection
              membership={userInfo.membership}
              username={userInfo.nickname}
              level={userInfo.level}
              currentExp={userInfo.exp}
              nextLevelExp={50}
            />
          )}
        </div>
        {/* 메뉴 및 상세 분기 렌더링 */}
        {index === 0 && panel.menu === '지도' && (
          <MapSection
            openDetail={openDetail}
            stores={stores}
            changeKeyword={changeKeyword}
            keyword={keyword}
            onStartChange={onStartChange}
            onEndChange={onEndChange}
            toggleBookmark={toggleBookmark}
            bookmarkIds={bookmarkIds}
          />
        )}
        {index === 0 && panel.menu === '즐겨찾기' && (
          <StarSection
            openDetail={openDetail}
            bookmarks={bookmarks}
            onStartChange={onStartChange}
            onEndChange={onEndChange}
            toggleBookmark={toggleBookmark}
            bookmarkIds={bookmarkIds}
          />
        )}
        {index === 0 && panel.menu === '길찾기' && (
          <RoadSection
            startValue={startValue}
            endValue={endValue}
            onSwap={onSwap}
            onReset={onReset}
            onNavigate={onNavigate}
            bookmarks={bookmarks}
            openDetail={openDetail}
            goToStore={goToStore}
            openRoadDetail={openRoadDetail}
            setStartValue={setStartValue}
            setEndValue={setEndValue}
          />
        )}
        {index === 1 && panel.type === 'detail' && panel.item && (
          <DetailSection
            store={panel.item}
            onStartChange={onStartChange}
            onEndChange={onEndChange}
            bookmarkIds={bookmarkIds}
            toggleBookmark={toggleBookmark}
            goToStore={goToStore}
          />
        )}
        {index === 1 && panel.type === 'road' && panel.item && (
          <RoadDetailSection route={panel.item} />
        )}
      </div>

      {/* 패널 닫기 버튼 */}
      {index === 1 && (isDetail || isRoad) && (
        <button
          onClick={() => onClose(index)}
          className="absolute active:scale-95 active:opacity-80 z-10 left-2  md:left-[100%] top-8  w-10 md:h-12 md:border-l-0 h-10 md:top-[43%] cursor-pointer hover:bg-gray-100 focus:outline-none bg-white border-1  md:rounded-lg rounded-full border-gray-200"
        >
          <ChevronLeft
            className="translate-x-1.5 text-gray-300"
            strokeWidth={3}
          />
        </button>
      )}
    </motion.div>
  );
}
