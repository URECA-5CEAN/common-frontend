import { RotateCcw } from 'lucide-react';
import clsx from 'clsx';
import { Button } from '@/components/Button';

interface SearchHereButtonProps {
  map: kakao.maps.Map | null;
  show: boolean;
  sheetY: number;
  onClick: () => void;
}

export default function SearchHereBtn({
  map,
  show,
  sheetY,
  onClick,
}: SearchHereButtonProps) {
  if (!map || !show) return null;

  return (
    <>
      {/* 모바일 */}
      <div
        className={clsx(
          'fixed bottom-13 block md:hidden left-[50%] transform -translate-x-1/2 z-20',
          sheetY === 0 ? 'hidden' : 'block',
        )}
        // style={{ top: sheetY + 80 }}
      >
        <Button
          onClick={onClick}
          variant="primary"
          size="sm"
          className="shadow px-3 py-2"
        >
          <RotateCcw size={16} className="mr-1" />이 위치에서 검색
        </Button>
      </div>

      {/* 데스크탑 */}
      <div className="hidden md:block fixed bottom-8 left-[55%] transform -translate-x-1/2 z-20">
        <Button
          onClick={onClick}
          variant="primary"
          size="sm"
          className="shadow px-4 py-2"
        >
          <RotateCcw size={16} className="mr-1" />이 위치에서 검색
        </Button>
      </div>
    </>
  );
}
