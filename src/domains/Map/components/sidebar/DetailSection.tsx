import { Star, Share2, Webcam, Map, ChevronRight } from 'lucide-react';
import StartEndBtn from '../StartEndBtn';
import IconActionGroup from '../IconActionGroup';
import { type StoreInfo } from '../../api/store';
import clsx from 'clsx';

import bronzeMedal from '@/assets/image/bronze_medal.png';
import silverMedal from '@/assets/image/silver_medal.png';
import goldMedal from '@/assets/image/gold_medal.png';
import diamondMedal from '@/assets/image/diamond_medal.png';
import { Button } from '@/components/Button';
import { useBenefitBrands } from '../../hooks/useBenefitBrands';
import type { LocationInfo } from '../../pages/MapPage';
import { useUsageHistoryStore } from '@/store/useUsageHistoryStore';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
interface DetailSectionProps {
  store: StoreInfo;
  onStartChange: (v: LocationInfo) => void;
  onEndChange: (v: LocationInfo) => void;
  bookmarkIds: Set<string>;
  goToStore: (store: StoreInfo) => void;
  toggleBookmark: (store: StoreInfo) => void;
}

const BenefitLabel = ['VIP', 'VVIP', '장기고객'];
const allMedals = [bronzeMedal, silverMedal, goldMedal, diamondMedal];

export default function DetailSection({
  store,
  onStartChange,
  onEndChange,
  bookmarkIds,
  goToStore,
  toggleBookmark,
}: DetailSectionProps) {
  const navigate = useNavigate();
  const isBookmark = bookmarkIds.has(store.id);
  const {
    data: benefits = [],
    isLoading,
    isError,
    error,
  } = useBenefitBrands(store.brandName);
  const { usageHistory, fetchUsageHistory } = useUsageHistoryStore();

  useEffect(() => {
    fetchUsageHistory();
  }, [fetchUsageHistory]);

  const storeUsageCount = usageHistory.filter((u) =>
    u.storeId.startsWith(store.brandName),
  ).length;

  if (isLoading) return 'Loading...';
  if (isError) return `Error: ${error.message}`;
  if (benefits.length === 0) return '해당 브랜드 혜택이 없습니다.';

  return (
    <div className="space-y-2  h-screen md:min-h-[800px] z-10 ">
      {/* 헤더 */}
      <div className="flex items-center justify-between mt-10">
        <p className="text-xl font-bold">{store.name}</p>
        <span className="text-gray-500 text-sm">{store.category}</span>
      </div>

      {/* 위치 & 영업시간 */}
      <div className="flex flex-col  text-gray-600">
        <p>영업시간</p>
        <div className="flex justify-between">
          <p>09:00~21:00</p>
          <span className="text-primaryGreen-80 text-sm font-semibold  ">
            영업중
          </span>
        </div>
      </div>

      {/* 간단 설명 */}
      <div className="flex justify-between items-center">
        <p className="text-gray-700">{store.address}</p>
        <Map
          className="cursor-pointer text-gray-400 hover:text-black"
          size={28}
          onClick={() => goToStore(store)}
        />
      </div>

      <div className="flex justify-between ">
        <IconActionGroup
          actions={[
            {
              icon: (
                <Star
                  className={clsx(
                    'cursor-pointer',
                    isBookmark
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300',
                  )}
                />
              ),
              label: '즐겨찾기',
              onClick: () => toggleBookmark(store),
            },
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
      <div className="w-full border border-gray-200  my-6"></div>
      {/* 주요 혜택 */}
      <section>
        <p className="text-lg font-semibold mb-2">주요 혜택</p>
        <ul>
          {benefits.map((benefit, idx) => (
            <li
              key={benefit.id}
              className="flex items-center justify-between p-1 rounded-md"
            >
              <div className="flex flex-col justify-center ">
                <p className="font-bold">{BenefitLabel[idx]}</p>
                <p className="text-sm">{benefit.name}</p>
                <p className="text-xs text-gray-500 ">
                  ({benefit.description})
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <div className="w-full border border-gray-200  my-6"></div>
      {/* 내 도감 현황 */}
      <section className="flex flex-col">
        <p className="text-lg font-semibold mb-2">내 도감 현황</p>
        <div className="flex justify-between">
          <ul className="flex -space-x-3 items-end">
            {allMedals.map((medal, idx) => (
              <li key={idx}>
                <img src={medal} alt="medal" className="w-[50px] md:w-[35px]" />
              </li>
            ))}
          </ul>
          <p className="self-end">{storeUsageCount}/20</p>
        </div>

        <div className="self-end">
          <Button
            variant="secondary"
            size="sm"
            className="h-6 w-[75px] flex justify-end items-center"
            onClick={() => navigate('/mypage/collection')}
          >
            <p className="text-xs">더보기</p> <ChevronRight size={15} />
          </Button>
        </div>
      </section>

      <div className="w-full border border-gray-200  my-6"></div>
    </div>
  );
}
