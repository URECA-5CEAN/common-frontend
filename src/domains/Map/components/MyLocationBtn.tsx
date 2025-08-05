import { LocateFixed } from 'lucide-react';
import clsx from 'clsx';
import { Button } from '@/components/Button';
import type { LatLng } from '../KakaoMapContainer';
interface MyLocationButtonProps {
  map: kakao.maps.Map | null;
  myLocation: LatLng | null;
  goToMyLocation: () => void;
  sheetY?: number; // 모바일에서만 필요
}

export default function MyLocationBtn({
  map,
  myLocation,
  goToMyLocation,
  sheetY = 0,
}: MyLocationButtonProps) {
  if (!map || !myLocation) return null;

  return (
    <>
      {/* 모바일용 버튼 */}
      <div
        className={clsx(
          'fixed bottom-13 block md:hidden left-6 z-1 ',
          sheetY === 0 ? 'hidden' : 'block',
        )}
        // style={{ top: sheetY + 160 }}
      >
        <Button
          onClick={goToMyLocation}
          variant="ghost"
          size="md"
          className="rounded-full p-0 focus:border-none"
        >
          <LocateFixed size={30} className="w-4 h-7 " />
        </Button>
      </div>

      {/*데스크탑용 버튼 */}
      <div className="hidden md:block fixed right-12 bottom-8 z-2">
        <Button
          onClick={goToMyLocation}
          variant="ghost"
          size="md"
          className="rounded-full p-0 md:px-4 md:py-3 focus:border-none"
        >
          <LocateFixed size={30} className="w-5 h-7 md:w-7 md:h-8" />
        </Button>
      </div>
    </>
  );
}
