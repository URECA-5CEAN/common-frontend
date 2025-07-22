interface RangeCalendarProps {
  type: '시작일' | '종료일';
  selectedDate?: Date;
  onSelectDate: (date: Date) => void;
}

export const RangeCalendar: React.FC<RangeCalendarProps> = ({
  type,
  selectedDate,
  onSelectDate,
}) => {
  const defaultValue = selectedDate
    ? new Date(
        selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000,
      )
        .toISOString()
        .slice(0, 10)
    : '';

  return (
    <div
      className="absolute right-0 top-[42px] bg-white w-fit border border-gray-300 
                    rounded-2xl p-6 z-50 shadow-lg"
    >
      <p className="mb-2 font-semibold text-gray-700">{type} 선택하기</p>
      <input
        type="date"
        className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none 
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        value={defaultValue}
        onChange={(e) => onSelectDate(new Date(e.target.value))}
      />
    </div>
  );
};
