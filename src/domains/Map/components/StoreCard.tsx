import { Info, Star } from 'lucide-react';
import StartEndBtn from './StartEndBtn';
import type { StoreInfo } from '../api/store';
import clsx from 'clsx';
import type { LocationInfo } from '../pages/MapPage';
import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

interface StoreCardProps {
  store: StoreInfo;
  openDetail: (store: StoreInfo) => void;
  onStartChange: (v: LocationInfo) => void;
  onEndChange: (v: LocationInfo) => void;
  toggleBookmark: (store: StoreInfo) => void;
  isBookmark: boolean;
  isSelected: boolean;
  onCenter: () => void;
}

export default function StoreCard({
  store,
  openDetail,
  onStartChange,
  onEndChange,
  toggleBookmark,
  isBookmark,
  isSelected,
  onCenter,
}: StoreCardProps) {
  const { isLoggedIn } = useAuthStore();
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSelected && cardRef.current) {
      cardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center', // 또는 'start', 'end', 'nearest'
        inline: 'nearest',
      });
    }
  }, [isSelected]);

  return (
    <div
      ref={cardRef}
      className={clsx(
        'relative flex items-stretch cursor-pointer py-2 w-full border-b border-b-gray-200 px-6',
        store.isRecommended ? 'bg-primaryGreen-40 pt-6' : 'bg-white',
      )}
      onClick={() => {
        openDetail(store);
        onCenter();
      }}
    >
      <div
        className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-1.5 rounded bg-primaryGreen-60 transition-all duration-150 ${
          isSelected ? 'h-[98px]' : 'h-0'
        }`}
      />
      <img
        src={store.brandImageUrl}
        alt={store.name}
        className="w-[80px] h-[80px] rounded-md mr-3 self-center"
        loading="lazy"
      />

      {store.isRecommended && (
        <div className="group">
          <div className="hidden md:block absolute top-[28px] left-[28px] md:top-[5px] md:left-6 text-primaryGreen-80 text-lg font-semibold">
            AI의 픽!
          </div>
          <Info
            size={17}
            className="hidden md:block absolute top-[32px] left-[90px] md:top-[10px] md:left-22 text-primaryGreen-80"
          />
          {/* 말풍선 툴팁 */}
          <div className="absolute top-5 left-24 hidden group-hover:block bg-white text-xs px-3 py-2 z-2000 shadow rounded-xl rounded-tl-none whitespace-nowrap">
            <p className="w-36">
              AI가 사용자의 패턴을 분석해 <br />
              맞춤 제휴처를 추천해드려요!
            </p>
          </div>
          <p className="absolute md:hidden text-base top-[5px] left-6 font-semibold text-primaryGreen-80">
            AI의 맞춤 제휴처 추천!
          </p>
        </div>
      )}

      {/* 텍스트 영역 */}
      <div className="flex flex-1 my-2 flex-col justify-between space-y-2 h-full w-[182px]">
        <p className="text-lg font-semibold truncate w-full overflow-ellipsis">
          {store.name}
        </p>
        <p className=" text-xs text-gray-500 line-clamp-2 w-40">
          {store.address}
        </p>
        <div className="flex justify-between items-center">
          <StartEndBtn
            isSmall={true}
            store={store}
            onStartChange={onStartChange}
            onEndChange={onEndChange}
          />
          {isLoggedIn && (
            <Star
              className={
                isBookmark ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
              }
              onClick={(e) => {
                e.stopPropagation(); // 카드 클릭과 겹치지 않도록
                toggleBookmark(store);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
