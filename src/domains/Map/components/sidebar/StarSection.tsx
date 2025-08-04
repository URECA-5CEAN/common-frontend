import StoreCard from '../StoreCard';
import type { StoreInfo } from '../../api/store';
import type { LocationInfo } from '../../pages/MapPage';
import { useAuthStore } from '@/store/useAuthStore';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { useNavigate } from 'react-router-dom';

interface MapSectionProps {
  bookmarks: StoreInfo[];
  openDetail: (store: StoreInfo) => void;
  onStartChange: (v: LocationInfo) => void;
  onEndChange: (v: LocationInfo) => void;
  toggleBookmark: (store: StoreInfo) => void;
  bookmarkIds: Set<string>;
  selectedCardId: string;
  goToStore: (store: StoreInfo) => void;
}

export default function StarSection({
  bookmarks,
  openDetail,
  onStartChange,
  onEndChange,
  toggleBookmark,
  bookmarkIds,
  selectedCardId,
  goToStore,
}: MapSectionProps) {
  // const { isLoggedIn } = useAuthStore();
  // const navigate = useNavigate();

  return (
    <div className="px-2 py-3 space-y-3 h-screen ">
      {/* 리스트 아이템 반복 */}
      {bookmarks.map((bookmark) => (
        <StoreCard
          key={bookmark.id?.trim() || `unknown-${bookmark.name}`}
          store={bookmark}
          openDetail={openDetail}
          onStartChange={onStartChange}
          onEndChange={onEndChange}
          toggleBookmark={toggleBookmark}
          isBookmark={bookmarkIds.has(bookmark.id)}
          isSelected={selectedCardId === bookmark.id}
          onCenter={() => goToStore(bookmark)}
        />
      ))}
    </div>
  );
}
