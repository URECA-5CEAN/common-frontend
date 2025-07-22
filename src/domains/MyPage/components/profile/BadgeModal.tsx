import type { Badge } from '@/domains/MyPage/types/profile';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import BadgeSelection from './BadgeSelection';

interface BadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  badges: Badge[];
  tempBadge: string;
  setTempBadge: (badgeId: string) => void;
  onConfirm: () => void;
}

const BadgeModal: React.FC<BadgeModalProps> = ({
  isOpen,
  onClose,
  badges,
  tempBadge,
  setTempBadge,
  onConfirm,
}) => (
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
      <div className="flex gap-3">
        <Button variant="secondary" fullWidth onClick={onClose}>
          취소
        </Button>
        <Button variant="primary" fullWidth onClick={onConfirm}>
          칭호 바꾸기
        </Button>
      </div>
    }
  >
    <BadgeSelection
      badges={badges}
      tempBadge={tempBadge}
      setTempBadge={setTempBadge}
    />
  </Modal>
);

export default BadgeModal;
