import StoreCard from '../StoreCard';
import type { StoreInfo } from '../../api/store';
import type { LocationInfo } from '../../pages/MapPage';
import { useAuthStore } from '@/store/useAuthStore';
import type { Dispatch, SetStateAction } from 'react';
import dolphinFind from '@/assets/image/dolphin_find.png';
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
}: MapSectionProps) {
  const { isLoggedIn } = useAuthStore();
  const navigate = useNavigate();
  if (!isLoggedIn) {
    return (
      <>
        <div className="w-full flex flex-col items-center justify-center pt-10 md:pt-50 gap-2">
          <img src={dolphinFind} alt="돌고래" className="w-24" />
          <span className="text-gray-600">로그인이 필요한 서비스에요</span>
          <Button size="sm" onClick={() => navigate('/login')}>
            로그인
          </Button>
        </div>
        {/* <Modal
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
        ></Modal> */}
      </>
    );
  }
  return (
    <div className="py-3 space-y-3 h-screen">
      <div className="absolute top-0 w-full md:top-0 md:left-0 font-bold py-4 text-xl md:w-[332px] flex justify-center border-b border-b-gray-200">
        내 즐겨찾기
      </div>
      {/* 리스트 아이템 반복 */}
      <div className="absolute top-16 w-full md:w-[332px] h-[calc(100dvh-320px)] md:h-[calc(100dvh-120px)] md:overflow-y-auto scrollbar-custom">
        {bookmarks.length === 0 && (
          <div className="w-full flex flex-col  items-center justify-center pt-10 md:pt-50 gap-2">
            <img src={dolphinFind} alt="돌고래" className="w-24" />
            <span className="text-gray-600">아직 즐겨찾기가 없어요!</span>
          </div>
        )}
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
    </div>
  );
}
