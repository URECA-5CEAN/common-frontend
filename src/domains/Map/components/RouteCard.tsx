import { ChevronRight, HelpCircle, MoveRight, Sparkles } from 'lucide-react';
import { MajorLoads } from './MajorLoads';
import type { RouteItem } from './sidebar/RoadSection';
import clsx from 'clsx';
import { Button } from '@/components/Button';
import { updateBookmarkStatus } from '../api/road';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  route: RouteItem;
  idx: number;
  onClick?: (route: RouteItem) => void;
  isDetail?: boolean;
  scenario?: string;
  showScenario?: boolean;
}

export default function RouteCard({
  route,
  idx,
  onClick,
  isDetail = false,
  showScenario,
  scenario,
}: Props) {
  const allRoads = route.section?.flatMap((s) => s.roads) || [];
  const majorRoad = MajorLoads(allRoads);
  const [open, setOpen] = useState(false);
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
      <div className="flex justify-between">
        <p className="font-semibold text-xl mb-1 px-2">추천경로 {idx + 1}</p>
        {showScenario && (
          <button
            onClick={() => setOpen((v) => !v)}
            className={clsx(
              'mt-2 flex items-center justify-center rounded-full shadow-lg',
              'bg-primaryGreen-80 text-white w-9 h-9 hover:scale-110 transition-transform',
              open && 'ring-2 ring-primaryGreen-50',
            )}
            aria-label="추천 이유 보기"
            type="button"
          >
            <HelpCircle className="w-6 h-6" />
          </button>
        )}
      </div>

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
              variant="primary"
              className="text-xs"
              onClick={routeCreateBookmark}
            >
              경로 저장
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-[85px] flex justify-end items-center"
              onClick={() => onClick?.(route)}
            >
              <p className="text-xs w-20">상세보기</p>
              <ChevronRight size={20} />
            </Button>
          </div>
        )}
        {showScenario && scenario && (
          <div>
            <AnimatePresence>
              {open && (
                <motion.div
                  key="recommend-reason"
                  initial={{ rotate: -180, scale: 0.7, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 180, scale: 0.7, opacity: 0 }}
                  transition={{
                    duration: 0.6,
                    type: 'spring',
                    bounce: 0.3,
                  }}
                  className="overflow-hidden"
                >
                  <div className="relative inline-block mt-4 ">
                    <div className="bg-white rounded-xl shadow-md p-4 text-gray-700">
                      {scenario}
                    </div>
                    <div className="absolute left-6 -bottom-3 w-4 h-4 bg-white rotate-45 shadow-md"></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
