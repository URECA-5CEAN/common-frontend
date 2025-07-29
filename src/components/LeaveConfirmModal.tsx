import { useNavigate } from 'react-router-dom';
import { useUnsavedChanges } from '@/contexts/UnsavedChangesContext';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import dolphin from '@/assets/image/dolphin_normal.png';

const ConfirmModal = () => {
  const navigate = useNavigate();
  const {
    showConfirmModal,
    setShowConfirmModal,
    pendingNavigation,
    setPendingNavigation,
    setHasUnsavedChanges,
  } = useUnsavedChanges();

  if (!showConfirmModal) return null;

  const handleConfirm = () => {
    if (pendingNavigation) {
      setHasUnsavedChanges(false);
      navigate(pendingNavigation);
    }
    setShowConfirmModal(false);
    setPendingNavigation(null);
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
    setPendingNavigation(null);
  };

  return (
    <Modal
      isOpen={showConfirmModal}
      onClose={handleCancel}
      title="작성을 중단하시겠어요?"
      description={
        <>
          페이지를 나가면 작성한 내용은
          <br />
          저장되지 않고 모두 사라져요
        </>
      }
      img={
        <div className="w-full flex justify-center">
          <img src={dolphin} alt="캐릭터" className="w-30 h-30" />
        </div>
      }
      actions={
        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={handleCancel}>
            취소
          </Button>
          <Button variant="primary" fullWidth onClick={handleConfirm}>
            나가기
          </Button>
        </div>
      }
    />
  );
};

export default ConfirmModal;
