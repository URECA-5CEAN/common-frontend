import { Star, Share2, Webcam } from 'lucide-react';
import StartEndBtn from '../StartEndBtn';
import IconActionGroup from '../IconActionGroup';
import type { StoreInfo } from '../../api/store';

interface DetailSectionProps {
  store: StoreInfo;
  onStartChange: (v: string) => void;
  onEndChange: (v: string) => void;
}

export default function DetailSection({
  store,
  onStartChange,
  onEndChange,
}: DetailSectionProps) {
  return (
    <div className="p-4 space-y-4 min-h-[800px]">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <p className="text-xl font-bold">{store.name}</p>
        <span className="text-gray-500 text-sm">{store.category}</span>
      </div>

      {/* 위치 & 영업시간 */}
      <div className="flex flex-col  text-gray-600">
        <p>영업시간</p>
        <p>09:00~21:00</p>
      </div>

      {/* 간단 설명 */}
      <p className="text-gray-700">{store.address}</p>

      <div className="flex justify-between ">
        <IconActionGroup
          actions={[
            { icon: <Star />, label: '즐겨찾기' },
            { icon: <Webcam />, label: '로드뷰' },
            { icon: <Share2 />, label: '공유' },
          ]}
        />
        {/* 출발/도착 버튼 */}
        <StartEndBtn
          store={store}
          onStartChange={onStartChange}
          onEndChange={onEndChange}
        />
      </div>
      {/* 주요 혜택 */}
      {/*<section>
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
        */}
      {/* 내 도감 현황 */}
      {/*<section>
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
        */}
      {/* 혜택 순위 */}
      {/*
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
        */}
    </div>
  );
}
