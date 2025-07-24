// src/components/BottomSheet.tsx

import {
  type ReactNode,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
  useRef,
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
  isOpen: boolean; // true면 middle, false면 peek
  onClose: () => void; // peek 이하로 내려갈 때 호출
  children: ReactNode;
  peekHeight?: number; // peek 상태에서 남길 높이(px)
  midRatio?: number; // middle 위치 비율 (0~1)
}

const BottomSheet = forwardRef<BottomSheetHandle, BottomSheetProps>(
  ({ isOpen, onClose, children, peekHeight = 25, midRatio = 0.5 }, ref) => {
    const animation = useAnimation();
    const [currentY, setCurrentY] = useState<number>(Infinity);
    const contentRef = useRef<HTMLDivElement>(null);
    const touchStartY = useRef(0);

    // 시트 전체 높이 (뷰포트의 75%)
    const sheetHeight =
      typeof window !== 'undefined' ? window.innerHeight * 0.75 : 0;
    const fullY = 0;
    const middleY = sheetHeight * (1 - midRatio);
    const bottomY = sheetHeight - peekHeight;

    // 외부에서 snapTo 호출 허용
    useImperativeHandle(
      ref,
      () => ({
        snapTo(which) {
          const targetY =
            which === 'full' ? fullY : which === 'middle' ? middleY : bottomY;
          animation
            .start({
              y: targetY,
              transition: { type: 'spring', stiffness: 300, damping: 30 },
            })
            .then(() => {
              setCurrentY(targetY);
              if (which === 'bottom') onClose();
            });
        },
      }),
      [animation, onClose, fullY, middleY, bottomY],
    );

    // isOpen 변화에 따라 middle/bottom 스냅
    useEffect(() => {
      const target = isOpen ? middleY : bottomY;
      animation
        .start({
          y: target,
          transition: { type: 'spring', stiffness: 300, damping: 30 },
        })
        .then(() => setCurrentY(target));
    }, [isOpen, animation, middleY, bottomY]);

    // content 내부 터치 드래그 (middle 위치에서만)
    useEffect(() => {
      const el = contentRef.current;
      if (!el) return;

      const startHandler = (e: TouchEvent) => {
        touchStartY.current = e.touches[0].clientY;
      };
      const moveHandler = (e: TouchEvent) => {
        if (currentY !== middleY) return;
        const dy = touchStartY.current - e.touches[0].clientY;

        if (dy > 0) {
          // 위로 당기면 full
          animation
            .start({
              y: fullY,
              transition: { type: 'spring', stiffness: 300, damping: 30 },
            })
            .then(() => setCurrentY(fullY));
          e.preventDefault();
        } else if (dy < 0 && el.scrollTop === 0) {
          // 아래로 당기면 peek
          animation
            .start({
              y: bottomY,
              transition: { type: 'spring', stiffness: 300, damping: 30 },
            })
            .then(() => {
              setCurrentY(bottomY);
              onClose();
            });
          e.preventDefault();
        }
      };

      el.addEventListener('touchstart', startHandler, { passive: true });
      el.addEventListener('touchmove', moveHandler, { passive: false });
      return () => {
        el.removeEventListener('touchstart', startHandler);
        el.removeEventListener('touchmove', moveHandler);
      };
    }, [currentY, middleY, fullY, bottomY, animation, onClose]);

    return (
      <AnimatePresence>
        {(isOpen || currentY !== bottomY) && (
          <motion.div
            className="fixed bottom-0 left-0 w-full bg-white rounded-t-2xl shadow-lg z-50 flex flex-col pointer-events-auto"
            style={{ height: sheetHeight, maxHeight: '80vh' }}
            drag="y"
            dragConstraints={{ top: fullY, bottom: bottomY }}
            dragElastic={0.2}
            dragMomentum={false}
            initial={{ y: sheetHeight }}
            animate={animation}
            exit={{
              y: sheetHeight,
              transition: { type: 'spring', stiffness: 300, damping: 30 },
            }}
            onDragEnd={(_, info: PanInfo) => {
              const offsetY = info.point.y - (window.innerHeight - sheetHeight);
              const pts = [fullY, middleY, bottomY];
              let closest = fullY;
              let minD = Math.abs(offsetY - fullY);
              pts.forEach((pt) => {
                const d = Math.abs(offsetY - pt);
                if (d < minD) {
                  minD = d;
                  closest = pt;
                }
              });
              animation
                .start({
                  y: closest,
                  transition: { type: 'spring', stiffness: 300, damping: 30 },
                })
                .then(() => {
                  setCurrentY(closest);
                  if (closest === bottomY) onClose();
                });
            }}
          >
            {/* drag handle */}
            <div className="w-full flex justify-center py-2">
              <div className="w-12 h-1.5 rounded-full bg-gray-400" />
            </div>

            {/* scrollable content */}
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
