import { type ReactNode, forwardRef, useImperativeHandle, useRef } from 'react';
import {
  AnimatePresence,
  motion,
  type PanInfo,
  useAnimation,
} from 'framer-motion';
import { useEffect, useState } from 'react';

export interface BottomSheetHandle {
  snapTo: (which: 'full' | 'middle' | 'bottom') => void;
}

interface BottomSheetProps {
  isOpen: boolean; // true면 완전 열림, false면 닫힌 상태
  onClose: () => void; // peek 이하로 내려갈 때 호출
  onMapClick?: () => void; // 뒤 지도 클릭 시 호출
  children: ReactNode;
  peekHeight?: number; // peek 상태에서 남길 높이(px)
  midRatio?: number; // middle 위치 비율
}

const BottomSheet = forwardRef<BottomSheetHandle, BottomSheetProps>(
  (
    { isOpen, onClose, onMapClick, children, peekHeight = 30, midRatio = 0.5 },
    ref,
  ) => {
    const animation = useAnimation();
    // 현재 y좌표 위치 추적 (Infinity:아직 결정 안 된 상태)
    const [currentY, setCurrentY] = useState<number>(Infinity);
    const contentRef = useRef<HTMLDivElement>(null);
    const lastTouchY = useRef(0);
    //바텀시트 높이
    const sheetHeight =
      typeof window !== 'undefined' ? window.innerHeight * 0.75 : 0;
    //다 열린 상태
    const fullY = 0;
    // 중간
    const middleY = sheetHeight * (1 - midRatio);
    //닫힌상태
    const bottomY = sheetHeight - peekHeight;

    // 부모에게 snapTo 메서드 노출
    useImperativeHandle(
      ref,
      () => ({
        // which에 따라 목표 y값 결정
        snapTo(which) {
          const y =
            which === 'full' ? fullY : which === 'middle' ? middleY : bottomY;
          animation
            .start({
              y,
              transition: { type: 'spring', stiffness: 300, damping: 30 },
            })
            .then(() => {
              // 이동 완료 후 현재 위치 업데이트
              setCurrentY(y);
              if (which === 'bottom') onClose();
            });
        },
      }),
      [animation, onClose, fullY, middleY, bottomY],
    );

    //바텀시트 토글 시 middle 혹은 bottom으로 스냅됨
    useEffect(() => {
      const target = isOpen ? middleY : bottomY;
      animation
        .start({
          y: target,
          transition: { type: 'spring', stiffness: 300, damping: 30 },
        })
        .then(() => setCurrentY(target));
    }, [isOpen, animation, fullY, bottomY]);

    return (
      <AnimatePresence>
        {(isOpen || currentY !== bottomY) && (
          <div className="fixed inset-0 z-30 pointer-events-none">
            {/* overlay: middle/full 상태일 때만 보임 */}
            {currentY < bottomY && (
              <div
                className="absolute inset-x-0 top-0"
                style={{ bottom: sheetHeight - currentY }}
                onClick={() => {
                  // 맵 클릭 콜백 먼저 실행
                  onMapClick?.();
                  // 그리고 peek 위치로 스냅
                  animation
                    .start({
                      y: bottomY,
                      transition: {
                        type: 'spring',
                        stiffness: 300,
                        damping: 30,
                      },
                    })
                    .then(() => {
                      setCurrentY(bottomY);
                      onClose();
                    });
                }}
                pointerEvents="auto"
              />
            )}

            {/* 바텀시트 */}
            <motion.div
              className="absolute bottom-0 left-0 w-full bg-white rounded-t-2xl shadow-lg z-50 flex flex-col"
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
                const offsetY =
                  info.point.y - (window.innerHeight - sheetHeight);
                // snap to nearest
                const pts = [fullY, middleY, bottomY];
                let closest = pts[0],
                  mind = Math.abs(offsetY - pts[0]);
                pts.forEach((pt) => {
                  const d = Math.abs(offsetY - pt);
                  if (d < mind) {
                    mind = d;
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
              {/* handle */}
              <div className="w-full flex justify-center py-2 pointer-events-auto">
                <div className="w-12 h-1.5 rounded-full bg-gray-400" />
              </div>
              {/* content */}
              <div
                ref={contentRef}
                className="flex-1 overflow-y-auto pointer-events-auto px-5 pt-1 pb-5"
                // 마우스 휠
                onWheel={(e) => {
                  if (currentY === middleY) {
                    if (e.deltaY < 0) {
                      // 위로 스크롤 → full
                      animation
                        .start({
                          y: fullY,
                          transition: {
                            type: 'spring',
                            stiffness: 300,
                            damping: 30,
                          },
                        })
                        .then(() => setCurrentY(fullY));
                      e.preventDefault();
                    } else if (e.deltaY > 0) {
                      // 아래로 스크롤 → peek(bottom)
                      animation
                        .start({
                          y: bottomY,
                          transition: {
                            type: 'spring',
                            stiffness: 300,
                            damping: 30,
                          },
                        })
                        .then(() => {
                          setCurrentY(bottomY);
                          onClose();
                        });
                      e.preventDefault();
                    }
                  }
                }}
                // 터치 시작 지점 기록
                onTouchStart={(e) => {
                  lastTouchY.current = e.touches[0].clientY;
                }}
                // 터치 이동
                onTouchMove={(e) => {
                  if (currentY !== middleY) return;
                  const dy = lastTouchY.current - e.touches[0].clientY;
                  if (dy > 0) {
                    // 위로 당기기 → full
                    animation
                      .start({
                        y: fullY,
                        transition: {
                          type: 'spring',
                          stiffness: 300,
                          damping: 30,
                        },
                      })
                      .then(() => setCurrentY(fullY));
                    e.preventDefault();
                  } else if (dy < 0) {
                    // 아래로 당기기 → peek(bottom)
                    animation
                      .start({
                        y: bottomY,
                        transition: {
                          type: 'spring',
                          stiffness: 300,
                          damping: 30,
                        },
                      })
                      .then(() => {
                        setCurrentY(bottomY);
                        onClose();
                      });
                    e.preventDefault();
                  }
                }}
              >
                {children}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  },
);

export default BottomSheet;
