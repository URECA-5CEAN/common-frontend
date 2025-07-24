import { motion } from 'framer-motion';
import clsx from 'clsx';
import UserSection from '../UserSection';
import MapSection from './MapSection';
import StarSection from './StarSection';
import DetailSection from './DetailSection';
import { ChevronLeft } from 'lucide-react';
import RoadSection from './RoadSection';
import { useState, type ChangeEventHandler } from 'react';
import type { StoreInfo } from '../../api/store';
import type { MenuType } from './MapSidebar';

interface SidebarPanelProps {
  index: number; // 0 = 메뉴, 1 = 상세
  panel: { type: 'menu' | 'detail'; menu: MenuType; item?: StoreInfo }; //현재 보여줄 메뉴
  stores: StoreInfo[];
  openDetail: (store: StoreInfo) => void;
  onClose: (idx: number) => void;
  //제휴처 검색
  changeKeyword?: ChangeEventHandler<HTMLInputElement>;
  //키워드
  keyword?: string;
  startValue?: string;
  endValue?: string;
  onStartChange: (v: string) => void;
  onEndChange: (v: string) => void;
  onSwap?: () => void;
  onReset?: () => void;
  onNavigate?: () => void;
  bookmarks: StoreInfo[];
  toggleBookmark: (store: StoreInfo) => void;
  bookmarkIds: Set<string>;
  goToStore: (store: StoreInfo) => void;
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
}: SidebarPanelProps) {
  const [ShowStar, SetShowStar] = useState<boolean>(false);

  // 즐겨찾기 토글
  const onStar = () => {
    SetShowStar((prev) => !prev);
  };

  const left = 64 + index * 345;
  const isDetail = panel.type === 'detail';

  return (
    <motion.div
      key={index}
      initial={{ x: -332, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -332, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={clsx(
        'bg-white rounded-t-2xl shadow scrollbar-custom ',
        'sm:rounded-tl-2xl  sm:ml-6.5 sm:mt-20 sm:rounded-bl-2xl sm:fixed sm:top-0 sm:bottom-0 sm:left-0 sm:w-[332px] sm:max-h-full',
      )}
      style={{ left }}
    >
      <div className="p-4 pr-2 bg-white relative shadow-lg rounded-lg overflow-y-auto   max-h-[calc(100vh-78px)] z-10 ">
        {/* 첫 번째 패널: 사용자 정보 */}
        <div className="hidden sm:block">
          {index === 0 && (
            <UserSection
              username="김민석"
              level={1}
              currentExp={5}
              nextLevelExp={20}
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
            onStartChange={onStartChange}
            onEndChange={onEndChange}
            onSwap={onSwap}
            onReset={onReset}
            onNavigate={onNavigate}
            onStar={onStar}
            bookmarks={bookmarks}
            openDetail={openDetail}
            isShowStar={ShowStar}
            goToStore={goToStore}
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
      </div>

      {/* 패널 닫기 버튼 */}
      {index === 1 && isDetail && (
        <button
          onClick={() => onClose(index)}
          className="absolute z-10 right-2 top-2 w-10 h-10 bottom-[55%] cursor-pointer hover:bg-gray-100 focus:outline-none bg-white border-2  rounded-full border-gray-200"
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
