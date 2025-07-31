import type { UserInfoApi } from '@/domains/MyPage/types/profile';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import BadgeSelection from './BadgeSelection';
import { getTitles } from '@/domains/MyPage/api/profile';
import { useState } from 'react';
import { LoadingSpinner } from '@/domains/MyPage/components/LoadingSpinner';

interface BadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  tempBadge: string;
  setTempBadge: (badgeId: string) => void;
  onConfirm: () => void;
  userInfoApi?: UserInfoApi;
  isConfirmLoading: boolean;
}

const BadgeModal: React.FC<BadgeModalProps> = ({
  isOpen,
  onClose,
  tempBadge,
  setTempBadge,
  onConfirm,
  isConfirmLoading,
}) => {
  const [badges, setBadges] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const fetchTitle = async () => {
    setIsLoading(true);
    try {
      const response = await getTitles();
      setBadges(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('사용자 정보 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="칭호 선택하기"
      description={
        <>
          AI가 나의 활동을 분석해 어울리는 칭호를 만들어줘요.
          <br />
          자랑하고 싶은 칭호를 골라보세요!
        </>
      }
      actions={
        <>
          <Button variant="secondary" fullWidth onClick={onClose}>
            취소
          </Button>
          <Button
            variant="primary"
            fullWidth
            onClick={onConfirm}
            disabled={isConfirmLoading}
          >
            {isConfirmLoading ? (
              <div className="w-6 h-6">
                <LoadingSpinner />
              </div>
            ) : (
              '칭호 바꾸기'
            )}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        {isLoading ? (
          <div className="px-4 py-4 w-full md:w-[482px] h-[150px] flex flex-col items-center justify-center gap-2 rounded-xl text-center">
            <div className="w-10 h-10">
              <LoadingSpinner />
            </div>
            칭호 생성중
          </div>
        ) : badges ? (
          <>
            <div className="w-full flex justify-end">
              <Button onClick={fetchTitle} size="sm" disabled={isLoading}>
                새로고침
              </Button>
            </div>

            <BadgeSelection
              badges={badges}
              tempBadge={tempBadge}
              setTempBadge={setTempBadge}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-[150px] text-gray-500 w-full md:w-[482px]">
            <Button onClick={fetchTitle} size="sm">
              칭호 생성하기
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default BadgeModal;
