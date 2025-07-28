import { Breadcrumb } from '@/components/Breadcrumb';
import DonutChart from '@/domains/MyPage/components/statistics/DonutChart';
import LineChart from '@/domains/MyPage/components/statistics/LineChart';
import { useClickOutside } from '@/domains/MyPage/hooks/useClickOutside';
import { useState } from 'react';

const STYLES = {
  container: 'w-[calc(100%-48px)] max-w-[1050px] m-6',
  title: 'text-[32px] font-bold my-3',
  subtitle: 'text-2xl font-bold',
  card: '',
  section: 'w-full flex flex-col gap-3',
} as const;

// API 데이터
const statsData = {
  usage: { mine: 6, average: 12 },
  savings: { mine: 60000, average: 30000 },
};

const dailyUsageList = [
  //최근 10일
  { date: '7/17', amount: 3200 },
  { date: '7/18', amount: 4500 },
  { date: '7/19', amount: 3800 },
  { date: '7/20', amount: 2900 },
  { date: '7/21', amount: 5000 },
  { date: '7/22', amount: 4100 },
  { date: '7/23', amount: 3700 },
  { date: '7/24', amount: 3700 },
];

const weeklyUsageList = [
  //최근 10주
  { week: '5월 5주차', amount: 2100 },
  { week: '6월 1주차', amount: 21500 },
  { week: '6월 2주차', amount: 11500 },
  { week: '6월 3주차', amount: 31500 },
  { week: '6월 4주차', amount: 61500 },
  { week: '6월 5주차', amount: 1500 },
  { week: '7월 1주차', amount: 21500 },
  { week: '7월 2주차', amount: 18300 },
  { week: '7월 3주차', amount: 19700 },
  { week: '7월 4주차', amount: 16800 },
];

const monthlyUsageList = [
  // 최근 5개월
  { month: '3월', amount: 85000 },
  { month: '4월', amount: 72000 },
  { month: '5월', amount: 88000 },
  { month: '6월', amount: 64000 },
  { month: '7월', amount: 69000 },
];

const categoryData = [
  { category: '카페', count: 60 },
  { category: '음식점', count: 30 },
  { category: '편의점', count: 10 },
];

const regionUsage = [
  { name: '강남구', count: 6 },
  { name: '서초구', count: 4 },
  { name: '마포구', count: 3 },
  { name: '종로구', count: 5 },
  { name: '용산구', count: 2 },
];

const weeklyUsage = [
  { name: '월', count: 6 },
  { name: '화', count: 4 },
  { name: '수', count: 3 },
  { name: '목', count: 5 },
  { name: '금', count: 2 },
  { name: '토', count: 2 },
  { name: '일', count: 2 },
];

const hourlyUsage = [
  { name: '0~3시', count: 2 },
  { name: '3~6시', count: 1 },
  { name: '6~9시', count: 4 },
  { name: '9~12시', count: 7 },
  { name: '12~15시', count: 6 },
  { name: '15~18시', count: 5 },
  { name: '18~21시', count: 8 },
  { name: '21~24시', count: 3 },
];

const topPartners = [
  { name: '할리스커피', count: 21 },
  { name: 'CGV', count: 18 },
  { name: 'GS25', count: 15 },
];

const topBranches = [
  { name: '할리스커피 강남점', count: 24 },
  { name: 'CGV 홍대점', count: 19 },
  { name: 'GS25 잠실점', count: 17 },
];

// 컴포넌트들
interface ComparisonBarProps {
  label: string;
  average: number;
  mine: number;
  unit: string;
  maxValue: number;
}

const ComparisonBar = ({
  label,
  average,
  mine,
  unit,
  maxValue,
}: ComparisonBarProps) => {
  const averageWidth = (average / maxValue) * 100;
  const myWidth = (mine / maxValue) * 100;

  return (
    <div className="flex w-full justify-center gap-3">
      <div className="w-full max-w-[300px] flex flex-col items-end gap-1">
        <div
          className="h-8 bg-primaryGreen rounded-l-xl"
          style={{ width: `${averageWidth}%` }}
        />
        <div className="text-xs text-gray-500">
          {average.toLocaleString()}
          {unit}
        </div>
      </div>
      <div className="min-w-[96px] h-[32px] flex justify-center items-center">
        {label}
      </div>
      <div className="w-full max-w-[300px] flex flex-col items-start gap-1">
        <div
          className="h-8 bg-primaryGreen rounded-r-xl"
          style={{ width: `${myWidth}%` }}
        />
        <div className="text-xs text-gray-500">
          {mine.toLocaleString()}
          {unit}
        </div>
      </div>
    </div>
  );
};

interface ProgressBarProps {
  name: string;
  count: number;
  maxCount: number;
}

const ProgressBar = ({ name, count, maxCount }: ProgressBarProps) => {
  const width = (count / maxCount) * 100;

  return (
    <div className="flex w-full justify-center gap-3 mb-2">
      <div className="w-[102px] h-[32px] flex justify-center items-center whitespace-normal break-keep text-center">
        {name}
      </div>
      <div className="w-full md:max-w-[300px] flex flex-col items-start gap-1">
        <div
          className="h-8 bg-primaryGreen rounded-r-xl"
          style={{ width: `${width}%` }}
        />
        <div className="text-xs text-gray-500">{count}회</div>
      </div>
    </div>
  );
};

const StatisticsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<
    'daily' | 'weekly' | 'monthly'
  >('daily');
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectedRange, setSelectedRange] = useState('1주');

  let labels: string[] = [];
  let data: number[] = [];

  if (selectedPeriod === 'daily') {
    labels = dailyUsageList.map((item) => item.date);
    data = dailyUsageList.map((item) => item.amount);
  } else if (selectedPeriod === 'weekly') {
    labels = weeklyUsageList.map((item) => item.week);
    data = weeklyUsageList.map((item) => item.amount);
  } else if (selectedPeriod === 'monthly') {
    labels = monthlyUsageList.map((item) => item.month);
    data = monthlyUsageList.map((item) => item.amount);
  }

  // 비교 데이터 계산
  const comparisonData = [
    {
      label: '혜택 사용 횟수',
      average: statsData.usage.average,
      mine: statsData.usage.mine,
      unit: '회',
    },
    {
      label: '절약한 금액',
      average: statsData.savings.average,
      mine: statsData.savings.mine,
      unit: '원',
    },
  ];

  // 각 섹션별 최대값 계산
  const maxUsageValue = Math.max(statsData.usage.average, statsData.usage.mine);
  const maxSavingsValue = Math.max(
    statsData.savings.average,
    statsData.savings.mine,
  );
  const maxRegionCount = Math.max(...regionUsage.map((region) => region.count));
  const maxWeeklyCount = Math.max(...weeklyUsage.map((region) => region.count));
  const maxHourlyCount = Math.max(...hourlyUsage.map((region) => region.count));
  const maxPartnerCount = Math.max(
    ...topPartners.map((region) => region.count),
  );
  const maxBranchCount = Math.max(...topBranches.map((region) => region.count));

  // 지역별 데이터를 사용 횟수 기준으로 내림차순 정렬
  const sortedRegionUsage = [...regionUsage].sort((a, b) => b.count - a.count);

  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);

  // 라인 차트 퍼센트 마진 (아래로 10%, 위로 10%)
  const minWithMargin = Math.max(0, minValue * 0.9);
  const maxWithMargin = maxValue * 1.1;

  const ranges = ['1주', '1개월', '3개월', '6개월', '1년'];

  useClickOutside(openDropdown, () => {
    setOpenDropdown(false);
  });

  return (
    <div className={STYLES.container}>
      <Breadcrumb title="마이페이지" subtitle="통계" />

      <div className={STYLES.title}>통계</div>

      <div className={STYLES.card}>
        <div className="flex flex-col items-center justify-center gap-[52px]">
          {/* 절약 금액 하이라이트 */}
          <div className="text-center text-2xl font-bold">
            <span>멤버십 혜택으로</span>
            <br />
            <span>총 </span>
            <span className="text-primaryGreen-80">
              {statsData.savings.mine.toLocaleString()}원{' '}
            </span>
            <span>아꼈어요</span>
          </div>

          {/* 비교 차트 */}
          <div className={STYLES.section}>
            {comparisonData.map((item, idx) => (
              <ComparisonBar
                key={item.label}
                label={item.label}
                average={item.average}
                mine={item.mine}
                unit={item.unit}
                maxValue={idx === 0 ? maxUsageValue : maxSavingsValue}
              />
            ))}
          </div>

          {/* 선택된 기간 꺾은선 그래프 */}
          <div className="w-full">
            <div className="flex mb-4 gap-2 flex-col md:flex-row">
              <h3 className="text-xl flex items-center">절약 그래프</h3>
              {/* 기간 선택 버튼 */}
              <div className="flex gap-1 justify-center">
                {(['daily', 'weekly', 'monthly'] as const).map((period) => (
                  <button
                    key={period}
                    className={`text-sm px-3 py-1 rounded cursor-pointer hover:bg-primaryGreen-40 transition-[background-color] ${
                      selectedPeriod === period
                        ? 'bg-primaryGreen-40 text-primaryGreen-80'
                        : 'bg-white text-gray-700'
                    }`}
                    onClick={() => setSelectedPeriod(period)}
                  >
                    {period === 'daily' && '일별'}
                    {period === 'weekly' && '주별'}
                    {period === 'monthly' && '월별'}
                  </button>
                ))}
              </div>
            </div>

            <LineChart
              labels={labels}
              data={data}
              borderColor="#4F46E5"
              backgroundColor="rgba(79,70,229,0.1)"
              options={{
                scales: {
                  y: {
                    min: minWithMargin,
                    max: maxWithMargin,
                    ticks: {
                      callback: (value) =>
                        Math.round(value as number).toLocaleString(),
                    },
                  },
                },
              }}
            />
          </div>

          <div className="w-full flex flex-col gap-5">
            <div className="w-full flex gap-2 items-center mt-10">
              <div className="text-2xl font-bold">세부 통계</div>

              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <div
                  className="min-h-[38px] min-w-[104px] py-1 px-3 flex justify-center items-center 
               border border-gray-200 rounded-full cursor-pointer hover:bg-gray-50 
               transition-colors duration-200"
                  role="button"
                  onClick={() => setOpenDropdown((prev) => !prev)}
                >
                  최근 {selectedRange}
                </div>
                {openDropdown && (
                  <div
                    className="absolute left-0 top-[42px] w-full flex flex-col justify-center items-center 
                    bg-white border border-gray-300 rounded-2xl p-2 z-50 shadow-lg"
                  >
                    {ranges.map((range) => (
                      <div
                        key={range}
                        className={`w-full p-1.5 cursor-pointer hover:bg-gray-200 rounded-[10px] 
                     flex justify-center items-center transition-colors duration-100 
                     ${selectedRange === range ? 'text-gray-400' : ''}`}
                        onClick={() => {
                          setSelectedRange(range);
                          setOpenDropdown(false);
                        }}
                      >
                        {range}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-[52px]">
              {/* 카테고리별/지역별 통계 */}
              <div className="w-full flex flex-col md:flex-row gap-[52px]">
                {/* 카테고리별 통계 */}
                <div className="flex-1 w-full md:max-w-[50%]">
                  <h3 className="text-xl mb-4">카테고리별 통계</h3>
                  <div className="h-[240px]">
                    <DonutChart
                      labels={categoryData.map((item) => item.category)}
                      data={categoryData.map((item) => item.count)}
                    />
                  </div>
                </div>

                {/* 지역별 통계 */}
                <div className="flex-1 w-full md:max-w-[50%]">
                  <h3 className="text-xl mb-4">지역별 통계</h3>
                  <div className="space-y-2">
                    {sortedRegionUsage.map((region) => (
                      <ProgressBar
                        key={region.name}
                        name={region.name}
                        count={region.count}
                        maxCount={maxRegionCount}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* 요일별/시간대별 통계 */}
              <div className="w-full flex flex-col md:flex-row gap-[52px]">
                {/* 요일별 통계 */}
                <div className="flex-1 w-full md:max-w-[50%]">
                  <h3 className="text-xl mb-4">요일별 통계</h3>
                  <div className="">
                    {weeklyUsage.map((day) => (
                      <ProgressBar
                        key={day.name}
                        name={day.name}
                        count={day.count}
                        maxCount={maxWeeklyCount}
                      />
                    ))}
                  </div>
                </div>

                {/* 시간대별 통계 */}
                <div className="flex-1 w-full md:max-w-[50%]">
                  <h3 className="text-xl mb-4">시간대별 통계</h3>
                  <div className="space-y-2">
                    {hourlyUsage.map((hour) => (
                      <ProgressBar
                        key={hour.name}
                        name={hour.name}
                        count={hour.count}
                        maxCount={maxHourlyCount}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* 브랜드별/지점별 통계 */}
              <div className="w-full flex flex-col md:flex-row gap-[52px]">
                {/* 브랜드별 통계 */}
                <div className="flex-1 w-full md:max-w-[50%]">
                  <h3 className="text-xl mb-4">가장 많이 사용한 제휴사</h3>
                  <div className="">
                    {topPartners.map((partner) => (
                      <ProgressBar
                        key={partner.name}
                        name={partner.name}
                        count={partner.count}
                        maxCount={maxPartnerCount}
                      />
                    ))}
                  </div>
                </div>

                {/* 지점별 통계 */}
                <div className="flex-1 w-full md:max-w-[50%]">
                  <h3 className="text-xl mb-4">가장 많이 사용한 지점</h3>
                  <div className="space-y-2">
                    {topBranches.map((branch) => (
                      <ProgressBar
                        key={branch.name}
                        name={branch.name}
                        count={branch.count}
                        maxCount={maxBranchCount}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
