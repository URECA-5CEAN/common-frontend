import { Search, X } from 'lucide-react';
import StoreCard from '../StoreCard';
import type { StoreInfo } from '../../api/store';
import type { ChangeEventHandler } from 'react';
import DebouncedInput from '../DebouncedInput';
import type { LocationInfo } from '../../pages/MapPage';

interface MapSectionProps {
  stores: StoreInfo[];
  openDetail: (store: StoreInfo) => void;
  changeKeyword?: ChangeEventHandler<HTMLInputElement>;
  keyword?: string;
  onStartChange: (v: LocationInfo) => void;
  onEndChange: (v: LocationInfo) => void;
  toggleBookmark: (store: StoreInfo) => void;
  bookmarkIds: Set<string>;
  resetKeyword: () => void;
  selectedCardId: string;
}

export default function MapSection({
  stores,
  openDetail,
  changeKeyword,
  keyword,
  onStartChange,
  onEndChange,
  toggleBookmark,
  bookmarkIds,
  resetKeyword,
  selectedCardId,
}: MapSectionProps) {
  return (
    <div className="px-2 py-3 space-y-3 h-screen ">
      {/* 검색바 */}
      <div className="hidden sm:flex  items-center border border-gray-200 rounded-2xl px-2 py-2 mb-4">
        <Search />
        <DebouncedInput
          value={keyword}
          onChange={changeKeyword}
          debounceTime={300}
          placeholder="검색"
        />
        <X onClick={resetKeyword} className="cursor-pointer" />
      </div>

      {/* 리스트 아이템 반복 */}
      {stores.map((store, idx) => (
        <StoreCard
          key={`${store.id}-${idx}`}
          store={store}
          openDetail={openDetail}
          onStartChange={onStartChange}
          onEndChange={onEndChange}
          toggleBookmark={toggleBookmark}
          isBookmark={bookmarkIds.has(store.id)}
          isSelected={selectedCardId === store.id}
        />
      ))}
    </div>
  );
}
