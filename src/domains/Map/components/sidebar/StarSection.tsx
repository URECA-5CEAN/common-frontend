import { Search } from 'lucide-react';
import StoreCard from '../StoreCard';
import type { StoreInfo } from '../../api/store';

interface MapSectionProps {
  bookmarks?: StoreInfo[];
  openDetail: (store: StoreInfo) => void;
  onStartChange: (v: string) => void;
  onEndChange: (v: string) => void;
  toggleBookmark?: (store: StoreInfo) => void;
}

export default function StarSection({
  bookmarks,
  openDetail,
  onStartChange,
  onEndChange,
}: MapSectionProps) {
  return (
    <div className="px-2 py-3 space-y-3 h-screen overflow-y-auto">
      {/* 검색바 */}
      <div className="flex items-center border border-gray-200 rounded-2xl px-2 py-2 mb-4">
        <input
          type="text"
          placeholder="검색"
          className="flex-1 bg-transparent outline-none ml-2 text-sm"
        />
        <Search />
      </div>

      {/* 리스트 아이템 반복 */}
      {bookmarks.map((bookmark) => (
        <StoreCard
          key={bookmark.id}
          store={bookmark}
          openDetail={openDetail}
          onStartChange={onStartChange}
          onEndChange={onEndChange}
        />
      ))}
    </div>
  );
}
