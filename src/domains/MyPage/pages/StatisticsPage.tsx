import { Breadcrumb } from '@/components/Breadcrumb';
import {
  getBrand,
  getCategory,
  getDaily,
  getHourly,
  getMonthly,
  getRegion,
  getSavings,
  getStore,
  getWeekday,
  getWeekly,
} from '@/domains/MyPage/api/statistics';
import DonutChart from '@/domains/MyPage/components/statistics/DonutChart';
import LineChart from '@/domains/MyPage/components/statistics/LineChart';
import { useClickOutside } from '@/domains/MyPage/hooks/useClickOutside';
import { useEffect, useState } from 'react';
import dolphinFind from '@/assets/image/dolphin_find.png';

const STYLES = {
  container: 'w-[calc(100%-48px)] max-w-[1050px] m-6',
  title: 'text-[32px] font-bold my-3 flex items-end gap-2',
  subtitle: 'text-2xl font-bold',
  card: '',
  section: 'w-full flex flex-col gap-3',
} as const;

// API 데이터
// const statsData = {
//   usage: { mine: 6, average: 12 },
//   savings: { mine: 60000, average: 30000 },
// };

// const dailyUsageList = [
//   //최근 10일
//   { date: '7/17', amount: 3200 },
//   { date: '7/18', amount: 4500 },
//   { date: '7/19', amount: 3800 },
//   { date: '7/20', amount: 2900 },
//   { date: '7/21', amount: 5000 },
//   { date: '7/22', amount: 4100 },
//   { date: '7/23', amount: 3700 },
//   { date: '7/24', amount: 3700 },
// ];

// const weeklyUsageList = [
//   //최근 10주
//   { week: '5월 5주차', amount: 2100 },
//   { week: '6월 1주차', amount: 21500 },
//   { week: '6월 2주차', amount: 11500 },
//   { week: '6월 3주차', amount: 31500 },
//   { week: '6월 4주차', amount: 61500 },
//   { week: '6월 5주차', amount: 1500 },
//   { week: '7월 1주차', amount: 21500 },
//   { week: '7월 2주차', amount: 18300 },
//   { week: '7월 3주차', amount: 19700 },
//   { week: '7월 4주차', amount: 16800 },
// ];

// const monthlyUsageList = [
//   // 최근 5개월
//   { month: '3월', amount: 85000 },
//   { month: '4월', amount: 72000 },
//   { month: '5월', amount: 88000 },
//   { month: '6월', amount: 64000 },
//   { month: '7월', amount: 69000 },
// ];

const categoryData = [
  { name: '카페', count: 60 },
  { name: '음식점', count: 30 },
  { name: '편의점', count: 10 },
];

const regionUsage = [
  { name: '강남구', count: 6 },
  { name: '서초구', count: 5 },
  { name: '마포구', count: 4 },
  { name: '종로구', count: 3 },
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
  const targetAverageWidth = (average / maxValue) * 100;
  const targetMyWidth = (mine / maxValue) * 100;

  const [averageWidth, setAverageWidth] = useState(0);
  const [myWidth, setMyWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAverageWidth(targetAverageWidth);
      setMyWidth(targetMyWidth);
    }, 50); // 마운트 직후 트리거
    return () => clearTimeout(timer);
  }, [targetAverageWidth, targetMyWidth]);

  return (
    <div className="flex w-full justify-center gap-2 md:gap-3">
      <div className="w-full max-w-[300px] flex flex-col items-end gap-1">
        <div
          className="h-8 bg-primaryGreen rounded-l-xl transition-all duration-700"
          style={{ width: `${averageWidth}%` }}
        />
        <div className="text-xs text-gray-500">
          {average.toLocaleString()}
          {unit}
        </div>
      </div>
      <div className="min-w-[64px] md:min-w-[96px] h-[32px] flex justify-center items-center text-center break-keep">
        {label}
      </div>
      <div className="w-full max-w-[300px] flex flex-col items-start gap-1">
        <div
          className="h-8 bg-primaryGreen rounded-r-xl transition-all duration-700"
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
  const targetWidth = maxCount > 0 ? (count / maxCount) * 100 : 0;
  const [width, setWidth] = useState(0);

  useEffect(() => {
    // 마운트 후 실제 width로 천천히 증가
    const timer = setTimeout(() => {
      setWidth(targetWidth);
    }, 50); // DOM 렌더 직후 트리거

    return () => clearTimeout(timer);
  }, [targetWidth]);

  return (
    <div className="flex w-full justify-center gap-3 mb-2">
      <div className="w-[102px] h-[32px] flex justify-center items-center whitespace-normal break-keep text-center">
        {name}
      </div>
      <div className="w-full md:max-w-[300px] flex flex-col items-start gap-1">
        <div
          className="h-8 bg-primaryGreen rounded-r-xl transition-all duration-700"
          style={{ width: `${width}%` }}
        />
        <div className="text-xs text-gray-500">{count}회</div>
      </div>
    </div>
  );
};

interface NoStatisticsProps {
  children: React.ReactNode;
  selectedRange: string;
  getRangeLabel: (range: string) => string;
}

const NoStatistics = ({
  children,
  selectedRange,
  getRangeLabel,
}: NoStatisticsProps) => {
  return (
    <div className="h-full relative">
      <div className="h-full blur-xs">{children}</div>
      <div className="absolute left-0 top-0 w-full h-full">
        <div className="w-full h-full bg-white rounded-3xl opacity-60 blur-lg"></div>
      </div>
      <div className="absolute left-0 top-0 w-full h-full flex justify-center items-center text-center text-gray-600">
        {getRangeLabel(selectedRange) === '전체'
          ? '전체 기간 동안 조회된 데이터가 없어요!'
          : `최근 ${getRangeLabel(selectedRange)} 동안 조회된 통계가 없어요!`}
      </div>
    </div>
  );
};

interface SavingsType {
  savings: {
    mine: number;
    average: number;
  };
  usage: {
    mine: number;
    average: number;
  };
}
interface DailyType {
  date: string;
  amount: number;
}
interface WeeklyType {
  week: string;
  amount: number;
}
interface MonthlyType {
  month: string;
  amount: number;
}
interface CategoryType {
  name: string;
  count: number;
}
interface RegionType {
  name: string;
  count: number;
}
interface WeekdayType {
  name: string;
  count: number;
}
interface HourlyType {
  name: string;
  count: number;
}
interface BrandType {
  name: string;
  count: number;
}
interface StoreType {
  name: string;
  count: number;
}

const StatisticsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<
    'daily' | 'weekly' | 'monthly'
  >('daily');
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectedRange, setSelectedRange] = useState('7D');
  const [savings, setSavings] = useState<SavingsType>({
    savings: { mine: 0, average: 0 },
    usage: { mine: 0, average: 0 },
  });
  const [daily, setDaily] = useState<DailyType[]>([]);
  const [weekly, setWeekly] = useState<WeeklyType[]>([]);
  const [monthly, setMonthly] = useState<MonthlyType[]>([]);
  const [category, setCategory] = useState<CategoryType[]>([]);
  const [regions, setRegions] = useState<RegionType[]>([]);
  const [weekday, setWeekday] = useState<WeekdayType[]>([]);
  const [hourly, setHourly] = useState<HourlyType[]>([]);
  const [brand, setBrand] = useState<BrandType[]>([]); // 브랜드별
  const [store, setStore] = useState<StoreType[]>([]); // 지점별
  const [error, setError] = useState(false);

  let labels: string[] = [];
  let data: number[] = [];

  useEffect(() => {
    const fetchSavings = async () => {
      try {
        const response = await getSavings();
        setSavings(response.data);
      } catch (error) {
        console.error('비교 통계 로드 실패:', error);
        setError(true);
      }
    };

    const fetchDaily = async () => {
      try {
        const response = await getDaily();
        setDaily(response.data);
      } catch (error) {
        setError(true);
        console.error('일별 통계 로드 실패:', error);
      }
    };

    const fetchWeekly = async () => {
      try {
        const response = await getWeekly();
        setWeekly(response.data);
      } catch (error) {
        setError(true);
        console.error('주별 통계 로드 실패:', error);
      }
    };

    const fetchMonthly = async () => {
      try {
        const response = await getMonthly();
        setMonthly(response.data);
      } catch (error) {
        setError(true);
        console.error('주별 통계 로드 실패:', error);
      }
    };

    fetchSavings();
    fetchDaily();
    fetchWeekly();
    fetchMonthly();
  }, []);

  useEffect(() => {
    getDetailStats(selectedRange);
  }, [selectedRange]);

  const getDetailStats = async (period: string) => {
    try {
      const [
        categoryRes,
        regionRes,
        weekdayRes,
        hourlyRes,
        brandRes,
        storeRes,
      ] = await Promise.all([
        getCategory(period),
        getRegion(period),
        getWeekday(period),
        getHourly(period),
        getBrand(period),
        getStore(period),
      ]);

      setCategory(categoryRes.data);
      setRegions(regionRes.data);
      setWeekday(weekdayRes.data);
      setHourly(hourlyRes.data);
      setBrand(brandRes.data);
      setStore(storeRes.data);
    } catch (error) {
      setError(true);
      console.error('상세 통계 로드 실패:', error);
    }
  };

  if (selectedPeriod === 'daily') {
    labels = daily.map((item) => item.date);
    data = daily.map((item) => item.amount);
  } else if (selectedPeriod === 'weekly') {
    labels = weekly.map((item) => item.week);
    data = weekly.map((item) => item.amount);
  } else if (selectedPeriod === 'monthly') {
    labels = monthly.map((item) => item.month);
    data = monthly.map((item) => item.amount);
  }

  // 비교 데이터 계산
  const comparisonData = [
    {
      label: '혜택 사용 횟수',
      average: savings.usage.average,
      mine: savings.usage.mine,
      unit: '회',
    },
    {
      label: '절약한 금액',
      average: savings.savings.average,
      mine: savings.savings.mine,
      unit: '원',
    },
  ];

  // 각 섹션별 최대값 계산
  const maxUsageValue = Math.max(savings.usage.average, savings.usage.mine);
  const maxSavingsValue = Math.max(
    savings.savings.average,
    savings.savings.mine,
  );

  const maxRegionCount =
    regions.length > 0 ? Math.max(...regions.map((r) => r.count)) : 0;
  const maxWeeklyCount =
    weekday.length > 0 ? Math.max(...weekday.map((w) => w.count)) : 0;
  const maxHourlyCount =
    hourly.length > 0 ? Math.max(...hourly.map((h) => h.count)) : 0;
  const maxPartnerCount =
    brand.length > 0 ? Math.max(...brand.map((b) => b.count)) : 0;
  const maxBranchCount =
    store.length > 0 ? Math.max(...store.map((s) => s.count)) : 0;

  // 지역별 데이터를 사용 횟수 기준으로 내림차순 정렬
  const sortedRegionUsage = [...regions].sort((a, b) => b.count - a.count);

  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);

  // 모든 값이 0인지 확인
  const isAllZero = data.every((v) => v === 0);

  // 조건에 따라 y축 범위 설정
  const minWithMargin = isAllZero ? 0 : Math.max(0, minValue * 0.9);
  const maxWithMargin = isAllZero ? 1000 : maxValue * 1.1;

  const ranges = ['7D', '30D', '180D', '365D', 'ALL'];

  useClickOutside(openDropdown, () => {
    setOpenDropdown(false);
  });

  const getRangeLabel = (range: string): string => {
    switch (range) {
      case '7D':
        return '1주';
      case '30D':
        return '1개월';
      case '180D':
        return '6개월';
      case '365D':
        return '1년';
      case 'ALL':
        return '전체';
      default:
        return '기간 없음';
    }
  };

  if (error) {
    return (
      <>
        <div className="w-[calc(100%-48px)] md:w-[80%] max-w-[1050px] mb-50 md:mb-100">
          <Breadcrumb title="마이페이지" subtitle="통계" />

          <div className={STYLES.title}>통계</div>
          <div className="h-[320px] flex justify-center items-center flex-col text-center gap-2">
            <img
              src={dolphinFind}
              alt="무언가를 찾는 돌고래"
              className="w-20"
            />
            통계를 불러오는 중 오류가 발생했어요.
            <br />
            잠시 후 다시 시도해주세요.
          </div>
        </div>
      </>
    );
  }

  const getYesterday = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const year = yesterday.getFullYear();
    const month = String(yesterday.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작
    const day = String(yesterday.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  return (
    <div className="w-[calc(100%-48px)] md:w-[80%] max-w-[1050px] mb-50 md:mb-100">
      <Breadcrumb title="마이페이지" subtitle="통계" />

      <div className={STYLES.title}>
        통계
        <span className="text-sm text-gray-500 font-medium flex">
          {getYesterday()} 03:00 기준
        </span>
      </div>

      <div className={STYLES.card}>
        <div className="flex flex-col items-center justify-center gap-[52px]">
          {/* 절약 금액 하이라이트 */}
          <div className="text-center text-2xl font-bold">
            <span>멤버십 혜택으로</span>
            <br />
            <span>총 </span>
            <span className="text-primaryGreen-80">
              {savings.savings.mine.toLocaleString()}원{' '}
            </span>
            <span>아꼈어요</span>
          </div>

          {/* 비교 차트 */}
          <div className={STYLES.section}>
            <div className="flex w-full justify-center text-center">
              <p className="w-[300px]">전체 사용자 평균</p>
              <div className="min-w-[96px]"></div>
              <p className="w-[300px]">나</p>
            </div>

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
                    beginAtZero: true,
                    min: minWithMargin,
                    max: maxWithMargin,
                    ticks: {
                      callback: (value) =>
                        `${Number(value).toLocaleString()}원`,
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
               border border-gray-300 rounded-full cursor-pointer hover:bg-gray-50 
               transition-colors duration-200"
                  role="button"
                  onClick={() => setOpenDropdown((prev) => !prev)}
                >
                  {getRangeLabel(selectedRange) === '전체'
                    ? '전체 기간'
                    : `최근 ${getRangeLabel(selectedRange)}`}
                </div>
                {openDropdown && (
                  <div
                    className="absolute left-0 top-[42px] w-full flex flex-col justify-center items-center 
                    bg-white border border-gray-300 rounded-2xl p-2 z-50 shadow-lg"
                  >
                    {ranges.map((range) => {
                      return (
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
                          {getRangeLabel(range)}
                        </div>
                      );
                    })}
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
                    {category.length === 0 ? (
                      <NoStatistics
                        selectedRange={selectedRange}
                        getRangeLabel={getRangeLabel}
                      >
                        <div className="h-full">
                          <DonutChart
                            labels={categoryData.map((item) => item.name)}
                            data={categoryData.map((item) => item.count)}
                          />
                        </div>
                      </NoStatistics>
                    ) : (
                      <DonutChart
                        labels={category.map((item) => item.name)}
                        data={category.map((item) => item.count)}
                      />
                    )}
                  </div>
                </div>

                {/* 지역별 통계 */}
                <div className="flex-1 w-full md:max-w-[50%]">
                  <h3 className="text-xl mb-4">지역별 통계</h3>
                  <div className="space-y-2">
                    {sortedRegionUsage.length === 0 ? (
                      <NoStatistics
                        selectedRange={selectedRange}
                        getRangeLabel={getRangeLabel}
                      >
                        {regionUsage.map((region) => (
                          <ProgressBar
                            key={region.name}
                            name={region.name}
                            count={region.count}
                            maxCount={6}
                          />
                        ))}
                      </NoStatistics>
                    ) : (
                      sortedRegionUsage.map((region) => (
                        <ProgressBar
                          key={region.name}
                          name={region.name}
                          count={region.count}
                          maxCount={maxRegionCount}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* 요일별/시간대별 통계 */}
              <div className="w-full flex flex-col md:flex-row gap-[52px]">
                {/* 요일별 통계 */}
                <div className="flex-1 w-full md:max-w-[50%]">
                  <h3 className="text-xl mb-4">요일별 통계</h3>
                  <div className="">
                    {weekday.every((day) => day.count === 0) ? (
                      <NoStatistics
                        selectedRange={selectedRange}
                        getRangeLabel={getRangeLabel}
                      >
                        {weeklyUsage.map((day) => (
                          <ProgressBar
                            key={day.name}
                            name={day.name}
                            count={day.count}
                            maxCount={6}
                          />
                        ))}
                      </NoStatistics>
                    ) : (
                      weekday.map((day) => (
                        <ProgressBar
                          key={day.name}
                          name={day.name}
                          count={day.count}
                          maxCount={maxWeeklyCount}
                        />
                      ))
                    )}
                  </div>
                </div>

                {/* 시간대별 통계 */}
                <div className="flex-1 w-full md:max-w-[50%]">
                  <h3 className="text-xl mb-4">시간대별 통계</h3>
                  <div className="space-y-2">
                    {hourly.every((day) => day.count === 0) ? (
                      <NoStatistics
                        selectedRange={selectedRange}
                        getRangeLabel={getRangeLabel}
                      >
                        {hourlyUsage.map((hour) => (
                          <ProgressBar
                            key={hour.name}
                            name={hour.name}
                            count={hour.count}
                            maxCount={8}
                          />
                        ))}
                      </NoStatistics>
                    ) : (
                      hourly.map((hour) => (
                        <ProgressBar
                          key={hour.name}
                          name={hour.name}
                          count={hour.count}
                          maxCount={maxHourlyCount}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* 브랜드별/지점별 통계 */}
              <div className="w-full flex flex-col md:flex-row gap-[52px]">
                {/* 브랜드별 통계 */}
                <div className="flex-1 w-full md:max-w-[50%]">
                  <h3 className="text-xl mb-4">가장 많이 사용한 제휴사</h3>
                  <div className="">
                    {brand.length === 0 ? (
                      <NoStatistics
                        selectedRange={selectedRange}
                        getRangeLabel={getRangeLabel}
                      >
                        {topPartners.map((partner) => (
                          <ProgressBar
                            key={partner.name}
                            name={partner.name}
                            count={partner.count}
                            maxCount={21}
                          />
                        ))}
                      </NoStatistics>
                    ) : (
                      brand.map((partner) => (
                        <ProgressBar
                          key={partner.name}
                          name={partner.name}
                          count={partner.count}
                          maxCount={maxPartnerCount}
                        />
                      ))
                    )}
                  </div>
                </div>

                {/* 지점별 통계 */}
                <div className="flex-1 w-full md:max-w-[50%]">
                  <h3 className="text-xl mb-4">가장 많이 사용한 지점</h3>
                  <div className="space-y-2">
                    {store.length === 0 ? (
                      <NoStatistics
                        selectedRange={selectedRange}
                        getRangeLabel={getRangeLabel}
                      >
                        {topBranches.map((branch) => (
                          <ProgressBar
                            key={branch.name}
                            name={branch.name}
                            count={branch.count}
                            maxCount={24}
                          />
                        ))}
                      </NoStatistics>
                    ) : (
                      store.map((branch) => (
                        <ProgressBar
                          key={branch.name}
                          name={branch.name}
                          count={branch.count}
                          maxCount={maxBranchCount}
                        />
                      ))
                    )}
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
