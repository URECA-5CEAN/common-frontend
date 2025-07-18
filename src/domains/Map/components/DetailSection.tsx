import type { StoreInfo, Benefit, RankingItem } from '../MockStore';
import { Star, Share2, MapPin, Clock, Webcam } from 'lucide-react';
import StartEndBtn from './StartEndBtn';

interface DetailSectionProps {
  store: StoreInfo;
}

export default function DetailSection({ store }: DetailSectionProps) {
  return (
    <div className="p-4 space-y-4 min-h-[800px]">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold">{store.name}</p>
      </div>

      {/* 위치 & 영업시간 */}
      <div className="flex flex-col  text-gray-600">
        <p>영업시간</p>
        <span>{store.openHours}</span>
      </div>

      {/* 간단 설명 */}
      <p className="text-gray-700">{store.description}</p>

      <div className="flex justify-between ">
        <div className="flex space-x-2">
          <button className="flex items-center justify-center p-1.5  border border-gray-200 rounded-full hover:bg-gray-200">
            {/* 별 아이콘 */}
            <Star />
          </button>
          <button className="flex items-center justify-center p-1.5  border border-gray-200 rounded-full hover:bg-gray-200">
            {/* 로드뷰 아이콘 */}
            <Webcam />
          </button>
          <button className="flex items-center justify-center p-1.5 border border-gray-200 rounded-full hover:bg-gray-200">
            {/* 공유 아이콘 */}
            <Share2 />
          </button>
        </div>
        {/* 출발/도착 버튼 */}
        <StartEndBtn />
      </div>
      {/* 주요 혜택 */}
      <section>
        <h3 className="text-lg font-semibold mb-2">주요 혜택</h3>
        <ul className="space-y-2">
          {store.benefits.map((b: Benefit) => (
            <li
              key={b.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
            >
              <div>
                <p className="font-medium">{b.title}</p>
                {b.description && (
                  <p className="text-xs text-gray-500">{b.description}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* 내 도감 현황 */}
      <section>
        <h3 className="text-lg font-semibold mb-2">내 도감 현황</h3>
        <ul className="flex space-x-2">
          {store.history.map(({ benefitId, usedCount }) => (
            <li key={benefitId} className="flex flex-col items-center">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                {usedCount}
              </div>
              <p className="text-xs text-gray-500 mt-1">{benefitId}</p>
            </li>
          ))}
        </ul>
        <button className="float-right">더보기</button>
      </section>

      {/* 혜택 순위 */}
      <section>
        <h3 className="text-lg font-semibold mb-2">혜택 순위</h3>
        <ul className="space-y-1">
          {store.ranking.map((r: RankingItem) => (
            <li
              key={r.benefitId}
              className="flex justify-between px-3 py-2 bg-gray-50 rounded-md"
            >
              <span>
                {r.rank}. {r.benefitId}
              </span>
              <span className="font-medium">{r.usedCount}회</span>
            </li>
          ))}
        </ul>
        <button className="float-right">더보기</button>
      </section>
    </div>
  );
}
