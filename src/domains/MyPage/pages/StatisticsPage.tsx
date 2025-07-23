import { Breadcrumb } from '@/domains/MyPage/components/Breadcrumb';
import DateFilter from '@/domains/MyPage/components/profile/DateFilter';
import type { DateRange } from '@/domains/MyPage/types/dateFilter';
import { useState } from 'react';

const STYLES = {
  container: 'w-full max-w-[1050px]',
  title: 'text-[32px] font-bold',
  subtitle: 'text-2xl font-bold',
} as const;

const StatisticsPage = () => {
  const [selectedRange, setSelectedRange] = useState<DateRange>({
    type: '오늘',
    startDate: new Date(new Date().setHours(0, 0, 0, 0)),
    endDate: new Date(),
  });

  return (
    <div className="h-[1500px] w-full max-w-[1050px]">
      <Breadcrumb title="통계" />

      <div className={STYLES.title}>통계</div>
      <div className="border border-gray-200 rounded-[20px] px-[70px] py-[50px]">
        <div className="flex flex-col items-center justify-center gap-[52px]">
          <div className="w-fit">
            <DateFilter
              selectedRange={selectedRange}
              onChange={setSelectedRange}
            />
          </div>

          <div className="text-center text-2xl font-bold">
            <span>전체 이용자 평균보다</span>
            <br />
            <span className="text-primaryGreen-80">30,000원 </span>
            <span>더 아꼈어요</span>
          </div>

          <div className="w-full flex flex-col gap-3">
            <div className="flex w-full justify-center gap-3">
              <div className="w-full max-w-[300px] h-8 flex justify-center">
                전체 이용자 평균
              </div>
              <div className="w-[96px]"></div>
              <div className="w-full max-w-[300px] h-8 flex justify-center">
                나
              </div>
            </div>

            <div className="flex w-full justify-center gap-3">
              <div className="w-full max-w-[300px] flex flex-col items-end gap-1">
                <div className="w-full h-8 bg-primaryGreen rounded-l-xl"></div>
                <div className="text-xs text-gray-500">12회</div>
              </div>
              <div className="w-[96px] h-[32px] flex justify-center items-center">
                혜택 사용 횟수
              </div>
              <div className="w-full max-w-[300px] flex flex-col items-start gap-1">
                <div className="w-1/2 max-w-[300px] h-8 bg-primaryGreen rounded-r-xl"></div>
                <div className="text-xs text-gray-500">6회</div>
              </div>
            </div>

            <div className="flex w-full justify-center gap-3">
              <div className="w-full max-w-[300px] flex flex-col items-end gap-1">
                <div className="w-1/2 h-8 bg-primaryGreen rounded-l-xl"></div>
                <div className="text-xs text-gray-500">30,000원</div>
              </div>
              <div className="w-[96px] h-[32px] flex justify-center items-center">
                절약한 금액
              </div>
              <div className="w-full max-w-[300px] flex flex-col items-start gap-1">
                <div className="w-full max-w-[300px] h-8 bg-primaryGreen rounded-r-xl"></div>
                <div className="text-xs text-gray-500">60,000원</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
