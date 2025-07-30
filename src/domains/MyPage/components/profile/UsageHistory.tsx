import DateFilter from '@/domains/MyPage/components/profile/DateFilter';
import HistoryList from '@/domains/MyPage/components/profile/HistoryList';
import type { UsageHistoryItem } from '@/domains/MyPage/types/profile';
import { useMemo, useState } from 'react';

interface UsageHistoryProps {
  items: UsageHistoryItem[] | undefined;
}

type RangeType = '오늘' | '1개월' | '6개월' | '1년' | '직접 설정';

interface DateRange {
  type: RangeType;
  startDate: Date;
  endDate: Date;
}

const UsageHistory: React.FC<UsageHistoryProps> = ({ items }) => {
  const [selectedRange, setSelectedRange] = useState<DateRange>({
    type: '오늘',
    startDate: new Date(new Date().setHours(0, 0, 0, 0)),
    endDate: new Date(),
  });

  const filteredItems = useMemo(() => {
    const startDate = selectedRange.startDate;
    const endDate = selectedRange.endDate;

    if (!items) return [];

    return items.filter((item) => {
      const itemDate = new Date(item.visitedAt);
      return itemDate >= startDate && itemDate <= endDate;
    });
  }, [items, selectedRange]);

  return (
    <div className="mt-10">
      <div className="text-[32px] mb-2 font-bold">사용 내역</div>
      <DateFilter selectedRange={selectedRange} onChange={setSelectedRange} />
      <HistoryList items={filteredItems} />
    </div>
  );
};

export default UsageHistory;
