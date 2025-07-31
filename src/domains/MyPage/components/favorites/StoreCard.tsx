import type { StoreInfo } from '@/domains/Map/api/store';
import { Star } from 'lucide-react';

interface StoreCardProps {
  store: StoreInfo;
  toggleBookmark: (store: StoreInfo) => void;
  isBookmark: boolean;
}

export default function StoreCard({
  store,
  toggleBookmark,
  isBookmark,
}: StoreCardProps) {
  return (
    <div className="flex items-stretch bg-white w-full border border-gray-200 p-4 rounded-2xl break-normal">
      <img
        src={store.brandImageUrl}
        alt={store.name}
        className="w-[80px] h-[80px] rounded-md mr-3 self-center"
        loading="lazy"
        width={80}
        height={80}
      />
      {/* 텍스트 영역 */}
      <div className="flex flex-1 mt-2 flex-col justify-between space-y-2">
        <p className="text-lg font-semibold w-full">{store.name}</p>
        <p className=" text-xs text-gray-500 line-clamp-2 w-full">
          {store.address}
        </p>
        <div className="flex justify-end items-center">
          <div
            className="p-1 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation(); // 카드 클릭과 겹치지 않도록
              toggleBookmark(store);
            }}
          >
            <Star
              className={`${isBookmark ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
