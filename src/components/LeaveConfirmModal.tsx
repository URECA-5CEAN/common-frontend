import { useLocation, useNavigate } from 'react-router-dom';
import { useUnsavedChanges } from '@/contexts/UnsavedChangesContext';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import dolphin from '@/assets/image/dolphin_normal.png';

const ConfirmModal = () => {
  const navigate = useNavigate();
  const location = useLocation();
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

  const isEditPage = location.pathname.includes('/share/edit') ? true : false;

  return (
    <Modal
      isOpen={showConfirmModal}
      onClose={handleCancel}
      title={isEditPage ? '수정을 그만두시겠어요?' : '작성을 그만두시겠어요?'}
      description={
        isEditPage ? (
          <>페이지를 나가면 수정한 내용은 반영되지 않아요</>
        ) : (
          <>페이지를 나가면 작성한 내용은 저장되지 않고 모두 사라져요</>
        )
      }
      img={
        <div className="w-full flex justify-center">
          <img src={dolphin} alt="캐릭터" className="w-30 h-30" />
        </div>
      }
      actions={
        <>
          <Button variant="secondary" fullWidth onClick={handleCancel}>
            취소
          </Button>
          <Button variant="primary" fullWidth onClick={handleConfirm}>
            그만두기
          </Button>
        </>
      }
    />
  );
};

export default ConfirmModal;
