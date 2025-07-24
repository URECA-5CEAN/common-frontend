import type { RangeType } from '@/domains/MyPage/types/dateFilter';

interface RangeDropdownProps {
  selectedRange: RangeType;
  onSelect: (range: RangeType) => void;
}

export const RangeDropdown: React.FC<RangeDropdownProps> = ({
  selectedRange,
  onSelect,
}) => {
  const ranges: RangeType[] = ['오늘', '1개월', '6개월', '1년'];

  return (
    <div
      className="absolute left-0 top-[42px] w-full flex flex-col justify-center items-center 
                    bg-white border border-gray-300 rounded-2xl p-2 z-50 shadow-lg"
    >
      {ranges.map((range) => (
        <div
          key={range}
          onClick={() => onSelect(range)}
          className={`w-full p-1.5 cursor-pointer hover:bg-gray-200 rounded-[10px] 
                     flex justify-center items-center transition-colors duration-100 
                     ${selectedRange === range ? 'text-gray-400' : ''}`}
        >
          {range}
        </div>
      ))}
    </div>
  );
};
