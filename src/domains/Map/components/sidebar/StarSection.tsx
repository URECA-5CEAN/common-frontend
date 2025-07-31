import StoreCard from '../StoreCard';
import type { StoreInfo } from '../../api/store';
import type { LocationInfo } from '../../pages/MapPage';

interface MapSectionProps {
  bookmarks: StoreInfo[];
  openDetail: (store: StoreInfo) => void;
  onStartChange: (v: LocationInfo) => void;
  onEndChange: (v: LocationInfo) => void;
  toggleBookmark: (store: StoreInfo) => void;
  bookmarkIds: Set<string>;
}

export default function StarSection({
  bookmarks,
  openDetail,
  onStartChange,
  onEndChange,
  toggleBookmark,
  bookmarkIds,
}: MapSectionProps) {
  return (
    <div className="px-2 py-3 space-y-3 h-screen ">
      {/* 리스트 아이템 반복 */}
      {bookmarks.map((bookmark, idx) => (
        <StoreCard
          key={`${bookmark.id}-${idx}`}
          store={bookmark}
          openDetail={openDetail}
          onStartChange={onStartChange}
          onEndChange={onEndChange}
          toggleBookmark={toggleBookmark}
          isBookmark={bookmarkIds.has(bookmark.id)}
        />
      ))}
    </div>
  );
}
