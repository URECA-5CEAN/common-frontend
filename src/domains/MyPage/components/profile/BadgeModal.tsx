import type { UserInfoApi } from '@/domains/MyPage/types/profile';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import BadgeSelection from './BadgeSelection';
import { getTitles } from '@/domains/MyPage/api/profile';
import { useState } from 'react';
import { Grid } from 'ldrs/react';
import 'ldrs/react/Grid.css';
import { Ring } from 'ldrs/react';
import 'ldrs/react/Ring.css';
import { Plus } from 'lucide-react';
import dolphinError from '@/assets/image/dolphin-error.svg';

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
  const [badges, setBadges] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [titleError, setTitleError] = useState(false);

  const fetchTitle = async () => {
    setIsLoading(true);
    try {
      const response = await getTitles();

      setBadges(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('칭호 생성 실패:', error);
      setTitleError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (titleError) {
      setBadges([]);
      setTitleError(false);
    }
    onClose();
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
          <Button variant="secondary" fullWidth onClick={handleClose}>
            취소
          </Button>
          <Button
            variant="primary"
            fullWidth
            onClick={onConfirm}
            disabled={isConfirmLoading || tempBadge === ''}
            loading={isConfirmLoading}
          >
            {isConfirmLoading ? (
              <div className="flex">
                <Ring
                  size="24"
                  stroke="3"
                  bgOpacity="0"
                  speed="2"
                  color="white"
                />
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
          <div className="px-4 py-4 w-full md:w-[460px] h-[150px] flex flex-col items-center justify-center gap-4 rounded-xl text-center">
            <Grid size="100" speed="1.5" color="#6fc3d1" />
            <p className="text-gray-500">칭호 생성중</p>
          </div>
        ) : titleError ? (
          <div className="break-keep w-full md:w-[460px] h-[150px] flex flex-col items-center justify-center text-red-500 text-center">
            <img src={dolphinError} alt="돌고래" className="w-25" />
            칭호 생성에 실패했어요.
            <br />
            잠시 후 다시 시도해주세요.
          </div>
        ) : badges.length !== 0 ? (
          <>
            <div className="w-full flex justify-end">
              <Button onClick={fetchTitle} size="sm" disabled={isLoading}>
                다시 생성하기
              </Button>
            </div>
            <BadgeSelection
              badges={badges}
              tempBadge={tempBadge}
              setTempBadge={setTempBadge}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-[150px] text-gray-500 w-full md:w-[460px]">
            <Button onClick={fetchTitle} size="lg">
              <div className="flex flex-col justify-center items-center">
                <Plus size={70} />
                칭호 생성하기
              </div>
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default BadgeModal;
