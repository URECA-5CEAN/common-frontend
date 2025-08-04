import { Info, Star } from 'lucide-react';
import StartEndBtn from './StartEndBtn';
import type { StoreInfo } from '../api/store';
import clsx from 'clsx';
import type { LocationInfo } from '../pages/MapPage';
import React from 'react';

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

function StoreCard({
  store,
  openDetail,
  onStartChange,
  onEndChange,
  toggleBookmark,
  isBookmark,
  isSelected,
  onCenter,
}: StoreCardProps) {
  return (
    <div
      className={clsx(
        'relative flex items-stretch  cursor-pointer py-2 rounded-lg',
        store.isRecommended ? 'bg-primaryGreen-40 pt-6' : 'bg-white',
      )}
      onClick={() => {
        openDetail(store);
        onCenter();
      }}
    >
      {isSelected && (
        <div className="absolute -left-2 top-3 bottom-3  w-2 rounded bg-primaryGreen-60" />
      )}
      <img
        src={store.brandImageUrl}
        alt={store.name}
        className="w-[80px] h-[80px] rounded-md mr-3 self-center ml-1"
        loading="lazy"
        decoding="async"
      />
      {store.isRecommended && (
        <div className="group">
          <div className="hidden  md:block absolute top-[28px] left-[28px] md:top-[5px] md:left-[5px] text-primaryGreen-80 text-lg font-semibold z-2">
            AI의 픽!
          </div>
          <Info
            size={17}
            className="hidden md:block absolute top-[32px] left-[90px] md:top-[10px] md:left-[65px] text-primaryGreen-80"
          />

          {/* 말풍선 툴팁 */}
          <div className="absolute -top-5 left-[86px] hidden group-hover:block bg-white  text-xs px-3 py-2 z-2 shadow rounded-xl whitespace-nowrap">
            <p className="w-36">
              AI를 활용해 김민석님을 위한 <br />
              맞춤 제휴처를 제공해드려요!
            </p>
          </div>
          <p className="absolute md:hidden text-base top-[5px] left-[6px] font-semibold text-primaryGreen-80">
            AI를 활용해 김민석님을 위한 맞춤 제휴처 추천!
          </p>
        </div>
      )}

      {/* 텍스트 영역 */}
      <div className="flex flex-1 mt-2 flex-col justify-between space-y-2 h-full  ">
        <p className="text-lg font-semibold truncate w-48 ">{store.name}</p>
        <p className=" text-xs text-gray-500 line-clamp-2 w-40">
          {store.address}
        </p>
        <div className="flex justify-between mr-1 items-center">
          <StartEndBtn
            isSmall={true}
            store={store}
            onStartChange={onStartChange}
            onEndChange={onEndChange}
          />
          <Star
            className={
              isBookmark ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }
            onClick={(e) => {
              e.stopPropagation(); // 카드 클릭과 겹치지 않도록
              toggleBookmark(store);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default React.memo(StoreCard);
