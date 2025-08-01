import { ChevronRight, MoveRight } from 'lucide-react';
import { MajorLoads } from './MajorLoads';
import type { RouteItem } from './sidebar/RoadSection';
import clsx from 'clsx';
import { Button } from '@/components/Button';
import { updateBookmarkStatus } from '../api/road';

interface Props {
  route: RouteItem;
  idx: number;
  onClick?: (route: RouteItem) => void;
  isDetail?: boolean;
}

export default function RouteCard({
  route,
  idx,
  onClick,
  isDetail = false,
}: Props) {
  const allRoads = route.section?.flatMap((s) => s.roads) || [];
  const majorRoad = MajorLoads(allRoads);

  const routeCreateBookmark = async () => {
    try {
      await updateBookmarkStatus(route.directionid, true);
      alert('경로가 즐겨찾기에 저장되었습니다.');
    } catch (err) {
      console.error(err);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <div
      className={clsx(
        ' flex flex-col rounded-lg py-2 mb-2',
        isDetail ? 'bg-white' : 'bg-primaryGreen-40',
      )}
    >
      <p className="font-semibold text-xl mb-1 px-2">추천경로 {idx + 1}</p>
      <div className="flex gap-4 text-sm px-2 items-center">
        <p className="text-lg font-semibold">{route.durationText}</p>
        <p className="text-base">{route.distanceText}</p>
      </div>
      <div className="flex gap-4 text-xs px-2 mt-1">
        <p>택시비: {route.taxiFare.toLocaleString()}원</p>
        <p>통행료: {route.tollFare.toLocaleString()}원</p>
      </div>
      <div className="px-2 mt-2 text-sm text-gray-600 space-y-0.5">
        {majorRoad.map((road, i) => (
          <div key={`${road.name}-${i}`} className="flex flex-wrap gap-1">
            <div className="flex items-center space-x-1 space-y-1">
              {road.traffic && (
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: road.traffic.color,
                    color: 'white',
                  }}
                >
                  {road.traffic.label}
                </span>
              )}
              <span className="text-xs mt-0.5">{road.name}</span>
              <span className="text-xs mt-0.5">{road.distanceKm}</span>
              <MoveRight size={15} className="mb-0.5" />
            </div>
          </div>
        ))}
        {!isDetail && (
          <div className="flex justify-between items-center mt-1 cursor-pointer">
            <Button
              size="sm"
              variant="secondary"
              className="h-6 w-[80px] flex justify-end items-center"
              onClick={() => onClick?.(route)}
            >
              <p className="text-xs w-20">상세보기</p>
              <ChevronRight size={20} />
            </Button>
            <Button
              size="sm"
              variant="primary"
              className="py-1! px-2! "
              onClick={routeCreateBookmark}
            >
              경로 저장
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
