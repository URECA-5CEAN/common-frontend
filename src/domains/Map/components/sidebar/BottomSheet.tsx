import {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
  useRef,
  type ReactNode,
} from 'react';
import {
  AnimatePresence,
  motion,
  type PanInfo,
  useAnimation,
} from 'framer-motion';

export interface BottomSheetHandle {
  snapTo: (which: 'full' | 'middle' | 'bottom') => void;
}

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onPositionChange?: (y: number) => void;
  children: ReactNode;
  peekHeight?: number;
  midRatio?: number;
}

const BottomSheet = forwardRef<BottomSheetHandle, BottomSheetProps>(
  (
    {
      isOpen,
      onClose,
      onPositionChange,
      children,
      peekHeight = 30,
      midRatio = 0.5,
    },
    ref,
  ) => {
    const animation = useAnimation();
    const [currentY, setCurrentY] = useState<number>(Infinity);
    const contentRef = useRef<HTMLDivElement>(null);
    const touchStartY = useRef(0);
    const scrollTopOnStart = useRef(0);
    const prevIsOpenRef = useRef<boolean>(isOpen);

    const sheetHeight =
      typeof window !== 'undefined' ? window.innerHeight * 0.75 : 0;
    const fullY = 0;
    const middleY = sheetHeight * (1 - midRatio);
    const bottomY = sheetHeight - peekHeight;

    const transition = { type: 'spring' as const, stiffness: 300, damping: 30 };

    useImperativeHandle(
      ref,
      () => ({
        snapTo(which) {
          const target =
            which === 'full' ? fullY : which === 'middle' ? middleY : bottomY;
          animation.start({ y: target, transition }).then(() => {
            setCurrentY(target);
            onPositionChange?.(target);
            if (which === 'bottom') onClose();
          });
        },
      }),
      [animation, fullY, middleY, bottomY, onClose, onPositionChange],
    );

    useEffect(() => {
      if (prevIsOpenRef.current === isOpen) return;
      prevIsOpenRef.current = isOpen;
      const target = isOpen ? middleY : bottomY;
      animation.start({ y: target, transition }).then(() => {
        setCurrentY(target);
        onPositionChange?.(target);
      });
    }, [isOpen, animation, middleY, bottomY, onPositionChange]);

    useEffect(() => {
      const el = contentRef.current;
      if (!el) return;

      const onTouchStart = (e: TouchEvent) => {
        touchStartY.current = e.touches[0].clientY;
        scrollTopOnStart.current = el.scrollTop;
      };

      const onTouchMove = (e: TouchEvent) => {
        const dy = touchStartY.current - e.touches[0].clientY;
        const goingUp = dy > 10;
        const goingDown = dy < -10;

        if (currentY !== middleY) return;

        if (goingDown && scrollTopOnStart.current <= 0 && el.scrollTop <= 0) {
          animation.start({ y: bottomY, transition }).then(() => {
            setCurrentY(bottomY);
            onPositionChange?.(bottomY);
            onClose();
          });
          if (e.cancelable) e.preventDefault();
        } else if (goingUp && el.scrollTop <= 0) {
          animation.start({ y: fullY, transition }).then(() => {
            setCurrentY(fullY);
            onPositionChange?.(fullY);
          });
          if (e.cancelable) e.preventDefault();
        }
      };

      el.addEventListener('touchstart', onTouchStart, { passive: true });
      el.addEventListener('touchmove', onTouchMove, { passive: false });
      return () => {
        el.removeEventListener('touchstart', onTouchStart);
        el.removeEventListener('touchmove', onTouchMove);
      };
    }, [
      animation,
      currentY,
      fullY,
      bottomY,
      onClose,
      onPositionChange,
      middleY,
    ]);

    useEffect(() => {
      const el = contentRef.current;
      if (!el) return;

      const onScroll = () => {
        const scrollRatio = el.scrollTop / (el.scrollHeight - el.clientHeight);
        if (scrollRatio > 0.1 && currentY !== fullY) {
          animation.start({ y: fullY, transition }).then(() => {
            setCurrentY(fullY);
            onPositionChange?.(fullY);
          });
        }
      };

      el.addEventListener('scroll', onScroll);
      return () => el.removeEventListener('scroll', onScroll);
    }, [animation, currentY, fullY, onPositionChange]);

    return (
      <AnimatePresence>
        {(isOpen || currentY !== bottomY) && (
          <motion.div
            className="fixed bottom-0 left-0 w-full bg-white rounded-t-2xl shadow-lg z-50 flex flex-col pointer-events-auto"
            style={{ height: sheetHeight, maxHeight: '80vh' }}
            drag="y"
            dragConstraints={{ top: fullY, bottom: bottomY }}
            dragElastic={0.25}
            dragMomentum={true}
            initial={{ y: isOpen ? middleY : bottomY }}
            animate={animation}
            exit={{ y: sheetHeight, transition }}
            onDragEnd={(_, info: PanInfo) => {
              const offsetY = info.offset.y;
              const threshold = sheetHeight * 0.15;

              if (offsetY > threshold) {
                const target = currentY === fullY ? middleY : bottomY;
                animation.start({ y: target, transition }).then(() => {
                  setCurrentY(target);
                  onPositionChange?.(target);
                  if (target === bottomY) onClose();
                });
              } else if (offsetY < -threshold) {
                animation.start({ y: fullY, transition }).then(() => {
                  setCurrentY(fullY);
                  onPositionChange?.(fullY);
                });
              } else {
                animation.start({ y: currentY, transition });
              }
            }}
          >
            <div className="w-full flex justify-center py-2">
              <div className="w-12 h-1.5 rounded-full bg-gray-300" />
            </div>

            <div
              ref={contentRef}
              className="flex-1 overflow-y-auto pt-1 pb-5 touch-none"
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  },
);

export default BottomSheet;
