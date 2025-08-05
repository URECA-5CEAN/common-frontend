import { RotateCcw } from 'lucide-react';
import clsx from 'clsx';
import { Button } from '@/components/Button';
import type { LatLng } from '../KakaoMapContainer';

interface SearchHereButtonProps {
  map: kakao.maps.Map | null;
  myLocation: LatLng | null;
  show: boolean;
  sheetY: number;
  onClick: () => void;
}

export default function SearchHereBtn({
  map,
  myLocation,
  show,
  sheetY,
  onClick,
}: SearchHereButtonProps) {
  if (!map || !myLocation || !show) return null;

  return (
    <>
      {/* 모바일 */}
      <div
        className={clsx(
          'fixed block md:hidden left-[50%] transform -translate-x-1/2 z-20',
          sheetY === 0 ? 'hidden' : 'block',
        )}
        style={{ top: sheetY + 110 }}
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
