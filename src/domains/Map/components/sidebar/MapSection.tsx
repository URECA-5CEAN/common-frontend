import { Search, X } from 'lucide-react';
import StoreCard from '../StoreCard';
import type { StoreInfo } from '../../api/store';
import {
  useState,
  type ChangeEventHandler,
  type Dispatch,
  type SetStateAction,
} from 'react';
import DebouncedInput from '../DebouncedInput';
import type { LocationInfo } from '../../pages/MapPage';

interface MapSectionProps {
  stores: StoreInfo[];
  openDetail: (store: StoreInfo) => void;
  changeKeyword?: ChangeEventHandler<HTMLInputElement>;
  keyword: string;
  onStartChange: (v: LocationInfo) => void;
  onEndChange: (v: LocationInfo) => void;
  toggleBookmark: (store: StoreInfo) => void;
  bookmarkIds: Set<string>;
  resetKeyword: () => void;
  selectedCardId: string;
  SetKeyword: Dispatch<SetStateAction<string>>;
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
  SetKeyword,
}: MapSectionProps) {
  const [isFocused, setIsFocused] = useState(false);
  const keywordRequire = isFocused && stores.length > 0 && keyword.length > 0;
  return (
    <div className="px-2 py-3 space-y-3 h-screen ">
      {/* 검색바 */}
      <div className="hidden sm:flex  items-center border border-gray-200 rounded-2xl px-2 py-2 mb-4">
        <Search />
        <DebouncedInput
          value={keyword}
          onChange={changeKeyword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          debounceTime={300}
          placeholder="검색"
        />
        <X onClick={resetKeyword} className="cursor-pointer" />
      </div>
      {keywordRequire && (
        <ul className="mt-2 border border-gray-200 rounded-md shadow bg-white max-h-72 scrollbar-custom overflow-y-auto">
          {stores.map((store) => (
            <li
              key={store.id}
              className="p-2 border-b border-b-gray-200 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                SetKeyword(store.name);
              }}
            >
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="font-medium text-sm text-gray-800">
                    {store.name}
                  </span>
                  <span className="text-xs text-gray-500">{store.address}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      {/* 리스트 아이템 반복 */}
      {stores.map((store, idx) => (
        <StoreCard
          key={store.id?.trim() || `unknown-${store.name}-${idx}`}
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
