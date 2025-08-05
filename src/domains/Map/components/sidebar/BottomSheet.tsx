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
  useAnimation,
  type PanInfo,
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
  panelMenu: string;
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
      panelMenu,
    },
    ref,
  ) => {
    const animation = useAnimation();
    const [currentY, setCurrentY] = useState<number>(Infinity);

    // Height, y 위치 계산
    const sheetHeight =
      typeof window !== 'undefined' ? window.innerHeight * 0.8 : 0;
    const fullY = 0;
    const middleY = sheetHeight * (1 - midRatio);
    const bottomY = sheetHeight - peekHeight;
    const transition = { type: 'spring' as const, stiffness: 300, damping: 30 };

    // 최초 진입/상태 전환시
    useEffect(() => {
      let target;
      if (isOpen) {
        if (panelMenu === '길찾기') {
          target = fullY;
        } else {
          target = middleY;
        }
      } else {
        target = bottomY;
      }
      animation.start({ y: target, transition });
      setCurrentY(target);
      onPositionChange?.(target);
    }, [isOpen, middleY, bottomY, fullY, panelMenu]);

    // ref로 snapTo 제공
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

    // Drag 상태
    const dragOrigin = useRef(0);

    // 핸들에서만 drag (drag로 y 이동량 → 시트 전체 y animation에 반영)
    const handleDragStart = () => {
      dragOrigin.current = currentY;
    };
    const handleDrag = (
      _: MouseEvent | TouchEvent | PointerEvent,
      info: PanInfo,
    ) => {
      let newY = dragOrigin.current + info.offset.y;
      // clamp to boundaries
      newY = Math.max(fullY, Math.min(bottomY, newY));
      animation.set({ y: newY });
    };
    const handleDragEnd = (
      _: MouseEvent | TouchEvent | PointerEvent,
      info: PanInfo,
    ) => {
      let newY = dragOrigin.current + info.offset.y;
      newY = Math.max(fullY, Math.min(bottomY, newY));
      // 스냅 포인트로
      const snapPoints = [fullY, middleY, bottomY];
      const closest = snapPoints.reduce((prev, curr) =>
        Math.abs(curr - newY) < Math.abs(prev - newY) ? curr : prev,
      );
      animation.start({ y: closest, transition }).then(() => {
        setCurrentY(closest);
        onPositionChange?.(closest);
        if (closest === bottomY) onClose();
      });
    };
    const handleContentScroll = (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      const scrollPercent =
        (target.scrollTop + target.clientHeight) / target.scrollHeight;
      if (scrollPercent > 0.4 && ref && typeof ref !== 'function') {
        // ref가 current를 가진 객체일 때만
        (ref as React.RefObject<BottomSheetHandle>).current?.snapTo('full');
      }
    };

    const HANDLE_HEIGHT = 40;
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-0 left-0 w-full bg-white rounded-t-2xl shadow-lg z-50 flex flex-col pointer-events-auto "
            style={{ height: sheetHeight, maxHeight: '80vh' }}
            animate={animation}
            initial={{ y: bottomY }}
            exit={{ y: sheetHeight, transition }}
          >
            {/* 핸들에서만 drag! */}
            <motion.div
              className="w-full flex justify-center py-2 cursor-grab active:cursor-grabbing "
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }} // drag자체는 이동X, 이동량만 추적용
              dragElastic={0}
              dragMomentum={false}
              onDragStart={handleDragStart}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
            >
              <div className="w-12 h-1.5 rounded-full bg-gray-300" />
            </motion.div>
            {/* 콘텐츠는 drag 없음 */}
            <div
              className="flex-1 overflow-y-auto pt-1 md:pb-5 pb-1 touch-none h-full"
              onScroll={handleContentScroll}
              style={{
                minHeight: sheetHeight - HANDLE_HEIGHT,
              }}
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
