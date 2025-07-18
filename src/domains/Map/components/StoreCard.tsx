import { Star } from 'lucide-react';

import type { StoreInfo } from '../MockStore';
import StartEndBtn from './StartEndBtn';

interface StoreCardProps {
  store: StoreInfo;
  openDetail: (store: StoreInfo) => void;
}

export default function StoreCard({ store, openDetail }: StoreCardProps) {
  return (
    <div
      className="flex items-stretch bg-white"
      onClick={() => openDetail(store)}
    >
      <img
        src={store.imageUrl}
        alt={store.name}
        className="w-[100px] h-[100px] rounded-md mr-3"
      />
      {/* 텍스트 영역 */}
      <div className="flex flex-1 mt-2 flex-col justify-between space-y-2 h-full ">
        <p className="text-lg font-semibold ">{store.name}</p>
        <p className=" text-xs text-gray-500 line-clamp-2 w-44 ">
          {store.description}
        </p>
        <div className="flex justify-between">
          <StartEndBtn isSmall={true} />
          <Star />
        </div>
      </div>
    </div>
  );
}
