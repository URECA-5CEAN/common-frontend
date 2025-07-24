import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  img?: React.ReactNode;
  title?: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
  actions?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  img,
  title,
  description,
  children,
  actions,
}) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const onOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-10000 flex items-center justify-center bg-black/30"
      onClick={onOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-[90%] md:w-fit rounded-2xl bg-white p-5 shadow-xl flex flex-col gap-5">
        {img && <>{img}</>}

        {title && <h2 className="text-2xl text-center">{title}</h2>}

        {description && (
          <p className="text-center text-gray-500">{description}</p>
        )}

        {children}

        {actions}
      </div>
    </div>,
    document.body,
  );
};
