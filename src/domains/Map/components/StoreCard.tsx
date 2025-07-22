import { Star } from 'lucide-react';
import StartEndBtn from './StartEndBtn';
import type { StoreInfo } from '../api/store';

interface StoreCardProps {
  store: StoreInfo;
  openDetail: (store: StoreInfo) => void;
  onStartChange: (v: string) => void;
  onEndChange: (v: string) => void;
  toggleBookmark: (store: StoreInfo) => void;
}

export default function StoreCard({
  store,
  openDetail,
  onStartChange,
  onEndChange,
  toggleBookmark,
}: StoreCardProps) {
  return (
    <div
      className="flex items-stretch bg-white "
      onClick={() => openDetail(store)}
    >
      <img
        src={store.brandImageUrl}
        alt={store.name}
        className="w-[100px] h-[100px] rounded-md mr-3"
      />
      {/* 텍스트 영역 */}
      <div className="flex flex-1 mt-2 flex-col justify-between space-y-2 h-full  ">
        <p className="text-lg font-semibold truncate w-[170px]">{store.name}</p>
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
          <Star onClick={() => toggleBookmark(store)} />
        </div>
      </div>
    </div>
  );
}
