import { Button } from '@/components/Button';
import Calendar from 'react-calendar';

interface RangeCalendarProps {
  type: '시작일' | '종료일';
  selectedDate?: Date;
  onSelectDate: (date: Date) => void;
  onClose: () => void;
}

export const RangeCalendar: React.FC<RangeCalendarProps> = ({
  type,
  selectedDate,
  onSelectDate,
  onClose,
}) => {
  const defaultValue = selectedDate
    ? new Date(
        selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000,
      )
        .toISOString()
        .slice(0, 10)
    : '';

  return (
    <>
      <div
        className="z-10001 absolute left-0 md:left-auto top-1/2 -translate-y-1/2 md:-translate-y-0 md:right-0 md:top-[42px] m-5 md:m-0 bg-white w-fit border border-gray-300 
                    rounded-2xl px-3 py-6 md:p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="mb-2 text-gray-700 text-xl w-full flex justify-center">
          {type} 선택하기
        </p>
        <Calendar
          value={defaultValue}
          onChange={(value) => {
            if (value instanceof Date) {
              onSelectDate(value);
            }
          }}
          calendarType="gregory"
          prev2Label={null}
          next2Label={null}
          showNeighboringMonth={false}
          formatDay={(_, date) => date.getDate().toString()}
        />
        <div className="w-full flex justify-center">
          <Button width="100px" variant="secondary" onClick={onClose}>
            닫기
          </Button>
        </div>
      </div>
      <div className="md:hidden fixed inset-0 z-10000 flex items-center justify-center bg-black/30"></div>
    </>
  );
};
