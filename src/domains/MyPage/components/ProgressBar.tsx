import { useEffect, useState } from 'react';

interface ProgressBarProps {
  current: number;
  max: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, max }) => {
  const progressPercentage = (current / max) * 100;
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth(progressPercentage);
    });

    return () => clearTimeout(timer);
  }, [progressPercentage]);

  return (
    <div className="relative bg-gray-200 rounded-full h-4 text-xs w-full overflow-hidden">
      <div
        className="absolute top-0 bg-[#96E0ED] h-full rounded-full 
                   after:content-[''] after:block after:h-[2px] after:absolute after:mx-2/3
                   after:top-1 after:bg-white/30 after:rounded-full after:left-1 after:right-1 transition-all duration-700"
        style={{ width: `${width}%` }}
      />
      <p className="relative z-1 flex justify-center items-center font-bold text-gray-600">
        {current}/{max}
      </p>
    </div>
  );
};
