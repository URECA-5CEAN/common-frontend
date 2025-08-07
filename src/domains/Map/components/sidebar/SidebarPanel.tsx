import { motion } from 'framer-motion';
import clsx from 'clsx';
import MapSection from './MapSection';
import StarSection from './StarSection';
import DetailSection from './DetailSection';
import { ChevronLeft } from 'lucide-react';
import RoadSection, { type RouteItem } from './RoadSection';
import React, {
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
import Banner from '@/domains/MyPage/components/Banner';

interface SidebarPanelProps {
  index: number; // 0 = 메뉴, 1 = 상세
  panel: Panel; //현재 보여줄 메뉴
  stores: StoreInfo[];
  openDetail: (store: StoreInfo) => void;
  onClose: (idx: number) => void;
  //제휴처 검색
  changeKeyword?: ChangeEventHandler<HTMLInputElement>;
  //키워드
  keyword: string;
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
  resetKeyword: () => void;
  selectedCardId: string;
  SetKeyword: Dispatch<SetStateAction<string>>;
  searchInput: string;
  handleSearchChange: ChangeEventHandler<HTMLInputElement>;
  mode: 'default' | 'search';
  setMode: Dispatch<SetStateAction<'default' | 'search'>>;
  searchStores: StoreInfo[];
  setStartInput: Dispatch<SetStateAction<string>>;
  setEndInput: Dispatch<SetStateAction<string>>;
  setWayInput: Dispatch<SetStateAction<string>>;
  setFocusField: Dispatch<SetStateAction<'start' | 'end' | number | null>>;
  focusField: 'start' | 'end' | number | null;
  isMainLoading: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
  waypoints: LocationInfo[];
  setWaypoints: Dispatch<SetStateAction<LocationInfo[]>>;
}

function SidebarPanel({
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
  resetKeyword,
  selectedCardId,
  SetKeyword,
  searchInput,
  handleSearchChange,
  mode,
  setMode,
  searchStores,
  setStartInput,
  setEndInput,
  setWayInput,
  setFocusField,
  focusField,
  isMainLoading,
  setIsOpen,
  isOpen,
  waypoints,
  setWaypoints,
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

  // const left = 64 + index * 345;
  const isDetail = panel.type === 'detail';
  const isRoad = panel.type === 'road';

  return (
    <motion.div
      key={index}
      initial={{ x: -332, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -332, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={clsx(
        'bg-white shadow h-auto',
        'md:fixed md:bottom-0 md:w-[332px] overflow-visible relative h-full',
        index === 1
          ? 'md:max-h-[calc(100vh-80px)] top-8 md:top-17 z-21 rounded-xl md:left-102'
          : 'md:max-h-full md:top-14 md:ml-1.5 z-22 md:left-16',
      )}
    >
      <div
        className={`relative z-10 mt-1 md:mt-0 h-full md:overflow-y-hidden md:h-full overflow-y-hidden'}`}
      >
        {/* 메뉴 및 상세 분기 렌더링 */}
        {index === 0 && panel.menu === '지도' && (
          <>
            {/* 광고 배너 */}
            <div className="md:absolute px-6 md:px-0 left-6 top-3 md:top-6 md:w-[calc(100%-48px)]">
              <Banner />
            </div>
            <MapSection
              openDetail={openDetail}
              stores={stores}
              changeKeyword={changeKeyword}
              keyword={keyword}
              onStartChange={onStartChange}
              onEndChange={onEndChange}
              toggleBookmark={toggleBookmark}
              bookmarkIds={bookmarkIds}
              resetKeyword={resetKeyword}
              selectedCardId={selectedCardId}
              SetKeyword={SetKeyword}
              goToStore={goToStore}
              searchInput={searchInput}
              handleSearchChange={handleSearchChange}
              mode={mode}
              setMode={setMode}
              searchStores={searchStores}
              isMainLoading={isMainLoading}
            />
          </>
        )}
        {index === 0 && panel.menu === '즐겨찾기' && (
          <StarSection
            openDetail={openDetail}
            bookmarks={bookmarks}
            onStartChange={onStartChange}
            onEndChange={onEndChange}
            toggleBookmark={toggleBookmark}
            bookmarkIds={bookmarkIds}
            selectedCardId={selectedCardId}
            goToStore={goToStore}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
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
            goToStore={goToStore}
            openRoadDetail={openRoadDetail}
            setStartValue={setStartValue}
            setEndValue={setEndValue}
            setStartInput={setStartInput}
            setEndInput={setEndInput}
            setWayInput={setWayInput}
            searchStores={searchStores}
            onClose={onClose}
            setFocusField={setFocusField}
            focusField={focusField}
            waypoints={waypoints}
            setWaypoints={setWaypoints}
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
            userInfo={userInfo}
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
          className="absolute z-10 left-4 px-3 md:px-0 md:left-83 -top-10 flex justify-center items-center w-12 md:w-7 md:h-12 md:border-l-0 h-10 md:top-[50%] cursor-pointer focus:outline-none bg-white md:rounded-r-lg rounded-full md:rounded-l-none"
        >
          <ChevronLeft
            className="translate-x-1.3 text-gray-600 md:text-gray-300"
            strokeWidth={3}
          />
        </button>
      )}
    </motion.div>
  );
}

export default React.memo(SidebarPanel);
