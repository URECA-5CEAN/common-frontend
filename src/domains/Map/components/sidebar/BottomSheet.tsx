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

// 외부에서 바텀시트를 제어하기 위한 핸들
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
      isOpen, // true이면 middle로 열기, false이면 peek으로 닫힘
      onClose,
      onPositionChange, // 바텀시트 높이에 대한 버튼들의 위치 구하기 위해
      children,
      peekHeight = 30, // peek 모드 높이
      midRatio = 0.5, // middle 높이 50%
    },
    ref,
  ) => {
    const animation = useAnimation();
    const [currentY, setCurrentY] = useState<number>(Infinity); // 현재 바텀시트 위치(Y값) 저장
    const contentRef = useRef<HTMLDivElement>(null); // scroll 영역 참조
    const touchStartY = useRef(0); // 터치 시작 Y 좌표
    const scrollTopOnStart = useRef(0); // 터치 시작 시점의 scrollTop
    const prevIsOpenRef = useRef<boolean>(isOpen); // 이전 isOpen 상태 저장

    // 바텀시트 위치 계산
    const sheetHeight =
      typeof window !== 'undefined' ? window.innerHeight * 0.75 : 0;
    const fullY = 0;
    const middleY = sheetHeight * (1 - midRatio);
    const bottomY = sheetHeight - peekHeight;

    // 애니메이션 옵션
    const transition = { type: 'spring' as const, stiffness: 300, damping: 30 };

    // 외부에서 .snapTo('full' | 'middle' | 'bottom') 호출할 수 있게 ref 연결
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

    // isOpen 상태 변경 시 middle 또는 bottom으로 열고 닫기
    useEffect(() => {
      if (prevIsOpenRef.current === isOpen) return;
      prevIsOpenRef.current = isOpen;
      const target = isOpen ? middleY : bottomY;
      animation.start({ y: target, transition }).then(() => {
        setCurrentY(target);
        onPositionChange?.(target);
      });
    }, [isOpen, animation, middleY, bottomY, onPositionChange]);

    // 터치 기반 드래그 처리 (middle 상태에서만 위/아래 스와이프 반응)
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

        // 아래로 스와이프 → bottom으로
        if (goingDown && scrollTopOnStart.current <= 0 && el.scrollTop <= 0) {
          animation.start({ y: bottomY, transition }).then(() => {
            setCurrentY(bottomY);
            onPositionChange?.(bottomY);
            onClose();
          });
          if (e.cancelable) e.preventDefault();
          // 위로 스와이프 → full로
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

    // scroll 비율이 일정 이상이면 자동으로 full로 확장
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
                // 아래로 드래그 → middle → bottom
                const target = currentY === fullY ? middleY : bottomY;
                animation.start({ y: target, transition }).then(() => {
                  setCurrentY(target);
                  onPositionChange?.(target);
                  if (target === bottomY) onClose();
                });
              } else if (offsetY < -threshold) {
                // 위로 드래그 → full
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
