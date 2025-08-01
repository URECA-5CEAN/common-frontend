import { AnimatePresence, motion } from 'framer-motion';
import Lottie from 'lottie-react';
import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import confetti from '@/assets/lottie/Confetti.json';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  img?: React.ReactNode;
  title?: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
  actions?: React.ReactNode;
}

export const LevelupModal: React.FC<ModalProps> = ({
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
      className="fixed inset-0 z-10000 flex items-center justify-center bg-black/20"
      onClick={onOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <Lottie
        animationData={confetti}
        loop={false}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] md:-translate-y-[60%] h-[120%] w-[120%] brightness-130 contrast-125 saturate-110 z-10000 pointer-events-none"
      />
      <AnimatePresence>
        <motion.div
          className="relative w-[90%] md:w-[500px] rounded-2xl bg-white p-5 shadow-xl flex flex-col gap-5"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            delay: 0,
            ease: [0, 0.71, 0.2, 1.01],
          }}
        >
          {img && <>{img}</>}

          {title && (
            <h2 className="text-2xl text-primaryGreen-80 text-center break-keep">
              {title}
            </h2>
          )}

          {description && (
            <div className="text-center text-gray-500 break-keep">
              {description}
            </div>
          )}

          {children}

          <div className="flex gap-3">{actions}</div>
        </motion.div>
      </AnimatePresence>
    </div>,
    document.body,
  );
};
