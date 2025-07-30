import type { RouteItem } from './RoadSection';

interface RoadProps {
  route: RouteItem;
}
export default function RoadDetailSection({ route }: RoadProps) {
  console.log(route);
  return (
    <div className="space-y-2 text-sm text-gray-700">
      <div className="text-base font-semibold">추천 경로 상세</div>
      {/* 필요시 주요 도로 정보 등도 렌더링 가능 */}
      <p>sadsadassadsdsad</p>
    </div>
  );
}
