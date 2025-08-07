import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface UnsavedChangesContextType {
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (value: boolean) => void;
  showConfirmModal: boolean;
  setShowConfirmModal: (value: boolean) => void;
  pendingNavigation: string | null;
  setPendingNavigation: (path: string | null) => void;
  handleProtectedNavigation: (path: string) => void;
}

const UnsavedChangesContext = createContext<
  UnsavedChangesContextType | undefined
>(undefined);

export const UnsavedChangesProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(
    null,
  );

  const location = useLocation();
  const navigate = useNavigate();

  // 브라우저 새로고침/닫기 방지
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // 보호된 네비게이션 처리
  const handleProtectedNavigation = (path: string) => {
    // 현재 경로와 같으면 아무것도 하지 않음
    if (location.pathname === path) return;

    // 글쓰기 페이지들 정의 (필요에 따라 추가)
    const writePages = [
      '/explore/share/write',
      '/explore/share/edit',
      '/mypage/share/edit',
      '/mypage/share/write',
    ];
    const isCurrentlyWritePage = writePages.some(
      (page) =>
        location.pathname === page ||
        location.pathname.includes('/write') ||
        location.pathname.includes('/edit'),
    );

    if (isCurrentlyWritePage && hasUnsavedChanges) {
      setPendingNavigation(path);
      setShowConfirmModal(true);
    } else {
      navigate(path);
    }
  };

  return (
    <UnsavedChangesContext.Provider
      value={{
        hasUnsavedChanges,
        setHasUnsavedChanges,
        showConfirmModal,
        setShowConfirmModal,
        pendingNavigation,
        setPendingNavigation,
        handleProtectedNavigation,
      }}
    >
      {children}
    </UnsavedChangesContext.Provider>
  );
};

export const useUnsavedChanges = () => {
  const context = useContext(UnsavedChangesContext);
  if (context === undefined) {
    throw new Error(
      'useUnsavedChanges must be used within a UnsavedChangesProvider',
    );
  }
  return context;
};
