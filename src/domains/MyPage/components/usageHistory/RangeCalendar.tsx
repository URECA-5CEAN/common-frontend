import { Button } from '@/components/Button';
import { useEffect } from 'react';
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

  useEffect(() => {
    const isMobile = window.innerWidth < 768; // md breakpoint

    if (isMobile) {
      // 스크롤 막기
      document.body.style.overflow = 'hidden';

      // cleanup: 컴포넌트 언마운트 시 스크롤 복원
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, []);

  return (
    <>
      <div
        className="z-10001 fixed top-1/2 left-1/2 md:left-auto -translate-1/2  md:absolute md:right-0 md:top-[42px] md:-translate-0 md:m-0 bg-white md:w-fit border border-gray-300 
                    rounded-2xl px-3 w-5/6 sm:w-2/3 py-6 md:p-6 shadow-lg"
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
      <div className="md:hidden fixed inset-0 z-10000 flex items-center justify-center bg-black/30">
        <div>인셋</div>
      </div>
    </>
  );
};
