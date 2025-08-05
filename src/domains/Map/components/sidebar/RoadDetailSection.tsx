import type { RouteItem } from './RoadSection';

import { NaviGuideIconMap } from '../NaviIcon';
import { Clock } from 'lucide-react';
import RouteCard from '../RouteCard';

interface Props {
  type: number;
}
interface RoadProps {
  route: RouteItem;
}

export default function RoadDetailSection({ route }: RoadProps) {
  const GuideIcon = ({ type }: Props) => {
    const Icon = NaviGuideIconMap[type] ?? Clock;
    return <Icon size={25} strokeWidth={2} className="text-primaryGreen-80" />;
  };

  return (
    <div className="space-y-2 text-sm text-gray-700 h-full">
      <RouteCard
        key={route.directionid}
        route={route}
        idx={0}
        isDetail={true}
      />
      <div className="overflow-y-auto scrollbar-custom h-[calc(100dvh-282px)] px-6">
        <div className="flex gap-4 items-center py-4">
          <p className="text-primaryGreen-80 text-sm font-semibold">출발</p>
          <p className="font-semibold">{route.from}</p>
        </div>
        {/* 필요시 주요 도로 정보 등도 렌더링 가능 */}
        {route.guide.map((g, idx) => {
          const distanceKm = (g.distance / 1000).toFixed(1);
          const durationHour = Math.floor(g.duration / 60);
          const durationMinute = g.duration % 60;

          return (
            <div
              className="flex justify-between items-center border-t border-t-gray-200 py-2"
              key={g.name + idx}
            >
              <div className="flex flex-col items-center w-10">
                <GuideIcon type={Number(g.type)} />
                <p className="text-primaryGreen-80 text-xs mt-0.5">
                  {g.distance > 1000 ? distanceKm + 'km' : g.distance + 'm'}
                </p>
              </div>
              <p className="text-xs text-left w-44 font-semibold">
                {g.description}
              </p>
              <p className="text-xs w-16 text-center">
                {g.duration > 60
                  ? durationHour + 'h ' + durationMinute + 'm'
                  : g.duration + 'm'}
              </p>
            </div>
          );
        })}
        <div className="flex gap-4 items-center border-t border-t-gray-200 py-4 mb-8">
          <p className="text-primaryGreen-80 text-sm font-semibold">도착</p>
          <p className="font-semibold">{route.to}</p>
        </div>
      </div>
    </div>
  );
}
