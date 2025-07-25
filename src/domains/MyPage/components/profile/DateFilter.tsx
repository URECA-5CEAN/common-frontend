import { FilterButton } from '@/domains/MyPage/components/usageHistory/FilterButton';
import { RangeCalendar } from '@/domains/MyPage/components/usageHistory/RangeCalendar';
import { RangeDropdown } from '@/domains/MyPage/components/usageHistory/RangeDropdown';
import { useClickOutside } from '@/domains/MyPage/hooks/useClickOutside';
import type { DateRange, RangeType } from '@/domains/MyPage/types/dateFilter';
import {
  formatDate,
  getStartDateByRange,
  normalizeDate,
} from '@/domains/MyPage/utils/dateUtils';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

interface DateFilterProps {
  selectedRange: DateRange;
  onChange: (range: DateRange) => void;
}

const DateFilter: React.FC<DateFilterProps> = ({ selectedRange, onChange }) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openCalendarType, setOpenCalendarType] = useState<
    null | '시작일' | '종료일'
  >(null);

  // 외부 클릭 시 드롭다운 닫기
  useClickOutside(openDropdown || !!openCalendarType, () => {
    setOpenDropdown(false);
    setOpenCalendarType(null);
  });

  // 빠른 필터 선택 핸들러
  const handleQuickFilterSelect = (rangeType: RangeType) => {
    const endDate = new Date();
    const startDate = getStartDateByRange(rangeType);

    onChange({
      type: rangeType,
      startDate,
      endDate,
    });

    setOpenDropdown(false);
  };

  // 커스텀 날짜 변경 핸들러
  const handleCustomDateChange = (date: Date, target: '시작일' | '종료일') => {
    const normalizedDate = normalizeDate(date, target === '종료일');

    const newRange: DateRange = {
      ...selectedRange,
      type: '직접 설정',
      startDate: target === '시작일' ? normalizedDate : selectedRange.startDate,
      endDate: target === '종료일' ? normalizedDate : selectedRange.endDate,
    };

    onChange(newRange);
    setOpenCalendarType(null);
  };

  // 드롭다운 토글 핸들러
  const handleDropdownToggle = () => {
    setOpenDropdown((prev) => !prev);
    setOpenCalendarType(null);
  };

  // 캘린더 토글 핸들러
  const handleCalendarToggle = (type: '시작일' | '종료일') => {
    setOpenCalendarType((prev) => (prev === type ? null : type));
    setOpenDropdown(false);
  };

  const displayRangeText =
    selectedRange.type !== '직접 설정' ? selectedRange.type : '직접 설정';

  const location = useLocation();
  const isStatisticsPage = location.pathname === '/mypage/statistics';

  const containerClass = `flex md:flex-row flex-wrap md:items-center items-end gap-2 ${
    isStatisticsPage ? 'justify-center' : 'justify-end'
  } mb-3`;

  return (
    <div className={containerClass}>
      {/* 빠른 필터 드롭다운 */}
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <FilterButton text={displayRangeText} onClick={handleDropdownToggle} />
        {openDropdown && (
          <RangeDropdown
            selectedRange={selectedRange.type}
            onSelect={handleQuickFilterSelect}
          />
        )}
      </div>

      {/* 날짜 범위 직접 설정 */}
      <div className="md:relative flex items-center gap-2">
        <FilterButton
          text={formatDate(selectedRange.startDate)}
          onClick={(e) => {
            e.stopPropagation();
            handleCalendarToggle('시작일');
          }}
        />

        <span className="text-gray-500">~</span>

        <FilterButton
          text={formatDate(selectedRange.endDate)}
          onClick={(e) => {
            e.stopPropagation();
            handleCalendarToggle('종료일');
          }}
        />

        {openCalendarType && (
          <RangeCalendar
            type={openCalendarType}
            selectedDate={
              openCalendarType === '시작일'
                ? selectedRange.startDate
                : selectedRange.endDate
            }
            onSelectDate={(date) =>
              handleCustomDateChange(date, openCalendarType)
            }
            onClose={() => setOpenCalendarType(null)}
          />
        )}
      </div>
    </div>
  );
};

export default DateFilter;
