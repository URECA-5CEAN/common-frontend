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
import clsx from 'clsx';

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
  goToStore: (store: StoreInfo) => void;
  searchInput: string;
  handleSearchChange: ChangeEventHandler<HTMLInputElement>;
  mode: 'default' | 'search';
  setMode: Dispatch<SetStateAction<'default' | 'search'>>;
  searchStores: StoreInfo[];
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
  goToStore,
  searchInput,
  handleSearchChange,
  mode,
  setMode,
  searchStores,
}: MapSectionProps) {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const keywordRequire = isFocused && stores.length > 0 && keyword.length > 0;

  const modeStore = mode === 'default' ? stores : searchStores;
  return (
    <div className="px-2 space-y-8 h-screen ">
      <div className="flex relative top-4 py-1 rounded-sm mx-auto">
        <button
          onClick={() => setMode('default')}
          className={clsx(
            `w-1/2 py-2 cursor-pointer text-sm font-semibold transition-all duration-200 rounded-l-xl rounded-r-none`,
            mode === 'default'
              ? 'bg-primaryGreen-80 text-white shadow-sm border-none border border-primaryGreen-80 '
              : 'bg-white text-bloack hover:text-primaryGreen-80 border border-primaryGreen-40',
          )}
          style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
        >
          근처 제휴처
        </button>
        <button
          onClick={() => setMode('search')}
          className={clsx(
            `w-1/2 py-2 cursor-pointer text-sm font-semibold transition-all duration-200 rounded-r-xl rounded-l-none`,
            mode === 'search'
              ? 'bg-primaryGreen-80 text-white shadow-sm border-none border border-primaryGreen-80'
              : 'bg-white text-black hover:text-primaryGreen-80 border border-primaryGreen-40',
          )}
        >
          전체 검색
        </button>
      </div>

      {mode === 'default' ? (
        <div className="hidden sm:flex  items-center border border-gray-200 rounded-2xl px-2 py-2 ">
          <Search color="gray" size={20} />
          <DebouncedInput
            value={keyword}
            onChange={changeKeyword}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 150)}
            debounceTime={300}
            placeholder="근처 제휴처를 검색해봐요!"
          />
          <X onClick={resetKeyword} className="cursor-pointer " color="gray" />
        </div>
      ) : (
        <div className="hidden sm:flex  items-center border border-gray-200 rounded-2xl px-2 py-2 ">
          <Search color="gray" size={20} />
          <DebouncedInput
            value={searchInput}
            onChange={handleSearchChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 150)}
            debounceTime={300}
            placeholder="전국에 있는 제휴처를 검색해봐요!"
          />
          <X onClick={resetKeyword} className="cursor-pointer " color="gray" />
        </div>
      )}

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
      {modeStore.map((store, idx) => (
        <StoreCard
          key={store.id?.trim() || `unknown-${store.name}-${idx}`}
          store={store}
          openDetail={openDetail}
          onStartChange={onStartChange}
          onEndChange={onEndChange}
          toggleBookmark={toggleBookmark}
          isBookmark={bookmarkIds.has(store.id)}
          isSelected={selectedCardId === store.id}
          onCenter={() => goToStore(store)}
        />
      ))}
    </div>
  );
}
