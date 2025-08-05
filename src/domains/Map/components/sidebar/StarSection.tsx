import StoreCard from '../StoreCard';
import type { StoreInfo } from '../../api/store';
import type { LocationInfo } from '../../pages/MapPage';
import { useAuthStore } from '@/store/useAuthStore';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { useNavigate } from 'react-router-dom';
import type { Dispatch, SetStateAction } from 'react';

interface MapSectionProps {
  bookmarks: StoreInfo[];
  openDetail: (store: StoreInfo) => void;
  onStartChange: (v: LocationInfo) => void;
  onEndChange: (v: LocationInfo) => void;
  toggleBookmark: (store: StoreInfo) => void;
  bookmarkIds: Set<string>;
  selectedCardId: string;
  goToStore: (store: StoreInfo) => void;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
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
  isOpen,
  setIsOpen,
}: MapSectionProps) {
  const { isLoggedIn } = useAuthStore();
  const navigate = useNavigate();

  if (!isLoggedIn) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        title="로그인이 필요한 서비스에요"
        description={
          <>
            로그인 후 원하는 제휴처를 즐겨찾기 해봐요!
            <br />
            내가 저장한 제휴처를 쉽게 관리할 수 있어요!
          </>
        }
        actions={
          <>
            <Button
              fullWidth
              variant="secondary"
              onClick={() => setIsOpen(false)}
            >
              닫기
            </Button>
            <Button fullWidth onClick={() => navigate('/login')}>
              로그인하기
            </Button>
          </>
        }
      ></Modal>
    );
  }
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
