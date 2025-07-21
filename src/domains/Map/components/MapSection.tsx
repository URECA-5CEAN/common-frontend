import { Search } from 'lucide-react';
import StoreCard from './StoreCard';
import type { StoreInfo } from '../api/store';
import type { ChangeEventHandler } from 'react';
import DebouncedInput from './DebouncedInput';

interface MapSectionProps {
  stores: StoreInfo[];
  openDetail: (store: StoreInfo) => void;
  changeKeyword?: ChangeEventHandler<HTMLInputElement>;
  keyword?: string;
}

export default function MapSection({
  stores,
  openDetail,
  changeKeyword,
  keyword,
}: MapSectionProps) {
  return (
    <div className="px-2 py-3 space-y-3 min-h-dvh">
      {/* 검색바 */}
      <div className="flex items-center border border-gray-200 rounded-2xl px-2 py-2 mb-4">
        <DebouncedInput
          value={keyword}
          onChange={changeKeyword}
          debounceTime={300}
          placeholder="검색"
        />
        <Search />
      </div>

      {/* 리스트 아이템 반복 */}
      {stores.map((store) => (
        <StoreCard key={store.id} store={store} openDetail={openDetail} />
      ))}
    </div>
  );
}
