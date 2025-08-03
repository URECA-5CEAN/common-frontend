import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from 'framer-motion';
import { useEffect, useState } from 'react';

interface HTMLContentProps {
  levelUpdated: boolean;
  startValue: number;
  endValue: number;
}

export function ExpContent({
  levelUpdated,
  startValue,
  endValue,
}: HTMLContentProps) {
  const count = useMotionValue(startValue);
  const rounded = useTransform(count, (val) => Math.round(val));

  // Progress bar 값은 count를 0~50 범위로 변환 (50 이상은 max 고정)
  const progress = useTransform(count, (val) => {
    const clamped = Math.max(0, Math.min(val, 50));
    return `${(clamped / 50) * 100}%`;
  });

  const [displayedValue, setDisplayedValue] = useState(Math.round(count.get()));
  useMotionValueEvent(rounded, 'change', (v) => {
    setDisplayedValue(v);
  });

  useEffect(() => {
    let controls: ReturnType<typeof animate> | null = null;

    const runAnimation = async () => {
      if (levelUpdated) {
        await animate(count, 50, { duration: 0.75, ease: 'easeOut' }).finished;
        count.set(0);
        controls = animate(count, endValue, {
          duration: 1.0,
          ease: 'easeOut',
        });
      } else {
        controls = animate(count, endValue, {
          duration: 1.0,
          ease: 'easeOut',
        });
      }
    };

    runAnimation();

    return () => {
      controls?.stop();
    };
  }, [levelUpdated, startValue, endValue]);

  return (
    <div className="w-full max-w-[300px] mx-auto text-center space-y-4">
      <div className="relative w-full h-8 md:h-9 bg-gray-200 rounded-xl overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-primaryGreen-60 after:content-[''] after:block after:h-[4px] after:absolute after:mx-2
               after:top-2 after:bg-white/30 after:rounded-full after:left-1 after:right-1"
          style={{ width: progress }}
        />
        <motion.pre
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg md:text-xl font-bold text-primaryGreen-80 font-[NanumSquareRound] pointer-events-none select-none"
          style={{ userSelect: 'none' }}
        >
          {displayedValue.toString().padStart(2, '0')}/50
        </motion.pre>
      </div>
    </div>
  );
}

export function LevelContent({
  startValue,
  endValue,
}: Pick<HTMLContentProps, 'startValue' | 'endValue'>) {
  const count = useMotionValue(startValue);
  const rounded = useTransform(count, (val) => Math.round(val));
  const [displayedValue, setDisplayedValue] = useState(Math.round(count.get()));

  useMotionValueEvent(rounded, 'change', (v) => {
    setDisplayedValue(v);
  });

  useEffect(() => {
    const controls = animate(count, endValue, {
      duration: 2.0,
      ease: 'easeOut',
    });

    return () => controls.stop();
  }, [startValue, endValue]);

  return (
    <div className="w-full max-w-[300px] mx-auto text-center space-y-4">
      <motion.pre className="text-3xl md:text-7xl font-bold text-primaryGreen-80 font-[NanumSquareRound] pointer-events-none select-none">
        Lv.{displayedValue.toString().padStart(2, '0')}
      </motion.pre>
    </div>
  );
}
