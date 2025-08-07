import { Star, Webcam, Map, ChevronRight, Info } from 'lucide-react';
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
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RoadviewViewer from '../RoadviewView';
import type { UserInfoApi } from '@/domains/MyPage/types/profile';
import { Ring } from 'ldrs/react';
interface DetailSectionProps {
  store: StoreInfo;
  onStartChange: (v: LocationInfo) => void;
  onEndChange: (v: LocationInfo) => void;
  bookmarkIds: Set<string>;
  goToStore: (store: StoreInfo) => void;
  toggleBookmark: (store: StoreInfo) => void;
  userInfo?: UserInfoApi;
}

const BenefitLabel = ['VIP', 'VVIP', '우수'];
const allMedals = [bronzeMedal, silverMedal, goldMedal, diamondMedal];

function DetailSection({
  store,
  onStartChange,
  onEndChange,
  bookmarkIds,
  goToStore,
  toggleBookmark,
  userInfo,
}: DetailSectionProps) {
  const navigate = useNavigate();
  const isBookmark = bookmarkIds.has(store.id);
  const [isLoad, setIsLoad] = useState<boolean>(false);
  const [isInfo, setIsInfo] = useState<boolean>(false);
  const {
    data: benefits = [],
    isLoading,
    isError,
    error,
  } = useBenefitBrands(store.brandName);
  const { usageHistory, fetchUsageHistory } = useUsageHistoryStore();

  const InfoClicked = async () => {
    setIsInfo(true);
    const info = setTimeout(() => {
      setIsInfo(false);
    }, 3000);
    return { info };
  };
  useEffect(() => {
    fetchUsageHistory();
  }, [fetchUsageHistory]);

  const storeUsageCount = usageHistory.filter((u) =>
    u.storeId.startsWith(store.brandName),
  ).length;

  if (isLoading)
    return (
      <div className="h-screen flex justify-center items-center">
        <Ring size="48" stroke="3" bgOpacity="0" speed="2" color="#6fc3d1" />
      </div>
    );
  if (isError) return `Error: ${error.message}`;
  if (benefits.length === 0) return '해당 브랜드 혜택이 없습니다.';

  return (
    <div className="space-y-2  h-full md:min-h-[791px]">
      {/* 헤더 */}
      <div className="flex items-center justify-between absolute w-full md:w-[332px] rounded-t-xl bg-white px-6 py-1 md:p-6 z-1 mb-0">
        <p className="text-xl font-bold">{store.name}</p>
        <span className="text-gray-500 text-sm">{store.category}</span>
      </div>
      <div className="absolute top-10 md:top-19  md:overflow-y-auto scrollbar-custom h-[calc(100%-72px)] pb-15 md:h-[calc(100dvh-160px)] w-full">
        {/* 위치 & 영업시간 */}
        <div className="flex flex-col gap-1 text-gray-600 mb-1 px-6">
          <p>영업시간</p>
          <div className="flex justify-between">
            <p>09:00~21:00</p>
            <span className="text-primaryGreen-80 text-sm font-semibold  ">
              영업중
            </span>
          </div>
        </div>

        {/* 간단 설명 */}
        <div className="flex justify-between items-center mb-3 px-6">
          <p className="text-gray-600">{store.address}</p>
          <Map
            className="cursor-pointer text-gray-400 hover:text-black transition-all duration-100"
            size={28}
            onClick={() => goToStore(store)}
          />
        </div>

        <div className="flex justify-between px-6">
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
              {
                icon: <Webcam />,
                label: '로드뷰',
                onClick: () => setIsLoad((prev) => !prev),
              },
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
          <p className="text-lg font-semibold mb-2 px-6">주요 혜택</p>
          <ul>
            {benefits.map((benefit, idx) => {
              const isMyMembership = userInfo?.membership === BenefitLabel[idx];
              return (
                <li
                  key={benefit.id?.trim() || `benefit-${idx}`}
                  className="flex items-center justify-between py-1 rounded-md"
                >
                  <div className="relative flex flex-col justify-center">
                    <p className="px-6">
                      {BenefitLabel[idx]}{' '}
                      {isMyMembership && (
                        <span className="text-primaryGreen-80">(내 등급)</span>
                      )}
                    </p>

                    <p
                      className={clsx(
                        'text-sm inline-block  py-1 rounded transition',
                        isMyMembership
                          ? 'bg-primaryGreen-80 text-white ml-4 px-2'
                          : 'bg-white text-gray-800 px-6',
                      )}
                    >
                      {benefit.name}
                    </p>
                    <p className="text-xs text-gray-500 px-6">
                      ({benefit.description})
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
        <div className="w-full border border-gray-200  my-6"></div>
        {/* 내 도감 현황 */}
        <section className="relative flex flex-col px-6 pb-20">
          <p className="text-lg font-semibold mb-2">내 도감 현황</p>
          <Info
            size={17}
            onClick={InfoClicked}
            className=" cursor-pointer md:block absolute top-[6px] left-[120px] text-primaryGreen-80"
          />
          {isInfo && (
            <div className="ml-3 absolute -top-9 left-30 flex items-center">
              {/* 말풍선 */}
              <div className="bg-white border w-[150px] border-gray-200 px-3 py-1 rounded-r-lg rounded-tl-lg shadow text-[13px] text-gray-800 relative z-10">
                <span className="font-semibold text-primaryGreen-80">
                  제휴처를 사용하면 <br />
                  도감을 채울 수 있어요!
                </span>

                {/* 꼬리 */}
                {/* <div
                  className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-0 h-0 
                                border-t-8 border-t-transparent border-b-8 border-b-transparent 
                                border-r-8 border-r-gray-200 border-l-0 border-l-transparent"
                ></div>
                <div
                  className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-0 h-0 
                                border-t-7 border-t-transparent border-b-7 border-b-transparent 
                                border-r-7 border-r-white border-l-0 border-l-transparent"
                ></div> */}
              </div>
            </div>
          )}

          <div className="flex justify-between ">
            <ul className="flex -space-x-3 items-end">
              {allMedals.map((medal, idx) => (
                <li key={`${medal}-${idx}`}>
                  <img
                    src={medal}
                    alt="medal"
                    className="w-[50px] md:w-[35px]"
                  />
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
          {/* 비로그인일 때 블러/딤 처리 + 안내 메시지 */}
          {!userInfo && (
            <div
              className="
        absolute top-0 left-0 w-full h-full 
        flex flex-col items-center justify-center
        bg-white/60 backdrop-blur-[2px] rounded-lg z-20
      "
              style={{ minHeight: '100px' }}
            >
              <p className="text-base font-semibold text-gray-600 mb-2">
                로그인 후 도감 현황을 확인할 수 있어요!
              </p>
              <Button
                size="sm"
                variant="primary"
                onClick={() => navigate('/login')}
              >
                로그인
              </Button>
            </div>
          )}
        </section>

        {isLoad && (
          <RoadviewViewer
            location={{
              lat: store.latitude,
              lng: store.longitude,
              isDetail: true,
            }}
          />
        )}
      </div>
    </div>
  );
}

export default React.memo(DetailSection);
