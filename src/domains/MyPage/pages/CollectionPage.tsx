import { Breadcrumb } from '@/components/Breadcrumb';
import { ProgressBar } from '@/domains/MyPage/components/ProgressBar';
import bronzeMedal from '@/assets/image/bronze_medal.png';
import silverMedal from '@/assets/image/silver_medal.png';
import goldMedal from '@/assets/image/gold_medal.png';
import diamondMedal from '@/assets/image/diamond_medal.png';
import { getAllBrandList } from '@/domains/MyPage/api/collection';
import { useEffect, useState } from 'react';
import { getUsageHistory } from '@/domains/MyPage/api/profile';
import type { UsageHistoryItem } from '@/domains/MyPage/types/profile';

interface Brand {
  name: string;
  image_url: string;
  count: number;
}

const CollectionPage = () => {
  const allMedals = [bronzeMedal, silverMedal, goldMedal, diamondMedal];
  const [brandList, setBrandList] = useState<Brand[]>([]);
  const [usageHistory, setUsageHistory] = useState<UsageHistoryItem[]>([]);

  useEffect(() => {
    const fetchAllBrandList = async () => {
      try {
        const response = await getAllBrandList();
        setBrandList(response.data);
      } catch (error) {
        console.error('사용자 정보 로드 실패:', error);
      }
    };
    const fetchUsageHistory = async () => {
      try {
        const response = await getUsageHistory();
        setUsageHistory(response.data);
      } catch (error) {
        console.error('사용자 정보 로드 실패:', error);
      }
    };

    fetchAllBrandList();
    fetchUsageHistory();
  }, []);

  // 브랜드명만 추출 (지점명 제거)
  function extractBrand(storeId: string, brandNames: string[]) {
    return brandNames.find((brand) => storeId.startsWith(brand)) || '기타';
  }

  const brandVisitCountMap = new Map<string, number>();
  brandList.forEach((brand) => {
    brandVisitCountMap.set(brand.name, 0);
  });

  usageHistory.forEach((item) => {
    const brandName = extractBrand(
      item.storeId,
      brandList.map((b) => b.name),
    );
    const currentCount = brandVisitCountMap.get(brandName) || 0;
    if (currentCount < 20) {
      brandVisitCountMap.set(brandName, currentCount + 1);
    }
  });

  // 결과 배열 생성
  const result = Array.from(brandVisitCountMap.entries()).map(
    ([name, count]) => {
      const brand = brandList.find((b) => b.name === name);
      return {
        name,
        image_url: brand?.image_url || '',
        count,
      };
    },
  );

  const sortedResult = result.sort((a, b) => b.count - a.count);

  // 전체 방문 횟수 (제한 적용 후 합계)
  const totalVisitCount = result.reduce((acc, cur) => acc + cur.count, 0);

  // 총 가능한 방문 횟수
  const maxVisitCount = 420;

  const progressPercentage = ((totalVisitCount / maxVisitCount) * 100).toFixed(
    2,
  );

  const getMedalCount = (current?: number): number => {
    if (!current) return 0;
    if (current >= 15) return 4;
    if (current >= 10) return 3;
    if (current >= 5) return 2;
    if (current >= 1) return 1;
    return 0;
  };

  return (
    <>
      <div className="w-[calc(100%-48px)] max-w-[1050px] m-6">
        <Breadcrumb title="마이페이지" subtitle="혜택 도감" />
        <div>
          <div className="text-[32px] font-bold my-3">혜택 도감</div>
          <div className="text-2xl font-bold">도감 완성도</div>
          <div className="my-5">
            <div className="z-1 relative bg-gray-300 rounded-2xl h-10 text-xs w-full overflow-hidden mb-1">
              <div
                className="shimmer z-0 absolute top-0 bg-[#96E0ED] h-full rounded-2xl 
                   after:content-[''] after:block after:h-1 after:absolute after:mx-2
                   after:top-2 after:bg-white/30 after:rounded-full after:left-1 after:right-1"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="relative z-1 flex justify-end items-center text-xs text-gray-600">
              {totalVisitCount}/{maxVisitCount} ({progressPercentage}%)
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
            {sortedResult.map((brand, index) => {
              const earnedMedalCount = getMedalCount(brand.count);
              const medalsToShow = allMedals.slice(0, earnedMedalCount);

              return (
                <div
                  key={index}
                  className="border-1 border-gray-200 rounded-xl p-4 flex md:flex-row flex-col gap-3 w-full items-center justify-around"
                >
                  <div className="max-w-[129px] flex items-center">
                    <img src={brand.image_url} alt={brand.name} />
                  </div>
                  <div className="w-full md:w-[100px] flex flex-col gap-2 items-center">
                    <div className="break-words break-keep text-center h-[48px] w-full flex justify-center items-center">
                      {brand.name}
                    </div>
                    <div className="flex h-[47px] md:h-[33px] -space-x-[24px] md:-space-x-[12%] w-full md:w-[100px] justify-center md:justify-start">
                      {medalsToShow.map((medal, idx) => (
                        <img
                          key={idx}
                          className="w-[50px] md:w-[35px]"
                          src={medal}
                          alt={`메달-${idx}`}
                        />
                      ))}
                    </div>
                    <div className="w-full">
                      <ProgressBar current={brand.count} max={20} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default CollectionPage;
