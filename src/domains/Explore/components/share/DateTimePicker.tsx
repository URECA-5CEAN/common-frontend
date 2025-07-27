import Calendar from 'react-calendar';
import { formatDate } from '../../utils/datetimeUtils';
import type { SelectOption, TimeValue } from '../../types/share';
import CustomSelect from '../CustomSelect';
import { useEffect, useRef, useState } from 'react';

interface DateTimePickerProps {
  date: string;
  setDate: (date: string) => void;
  selectedTime: TimeValue;
  setSelectedTime: (time: TimeValue) => void;
}

const DateTimePicker = ({
  date,
  setDate,
  selectedTime,
  setSelectedTime,
}: DateTimePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleTimeChange = (value: SelectOption | TimeValue | null) => {
    setSelectedTime(value as TimeValue);
  };

  return (
    <div className="relative mb-4 flex gap-2 items-center" ref={ref}>
      <label className="whitespace-nowrap font-bold">약속 일정</label>
      <div
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className="cursor-pointer border rounded-2xl p-3 border-gray-200"
      >
        {date}, {selectedTime.period} {selectedTime.hour}:
        {selectedTime.minute.toString().padStart(2, '0')}
      </div>
      {isOpen && (
        <div className="absolute z-10001 bg-white sm:top-14 border -translate-y-1/2 md:-translate-y-0 rounded-2xl p-5 sm:left-16 border-gray-300 shadow-lg max-w-xl flex flex-col gap-3.5">
          <Calendar
            onChange={(value) => {
              if (value instanceof Date) {
                const selectedDate = formatDate(value);
                setDate(selectedDate);
              }
            }}
            value={new Date(date)}
            calendarType="gregory"
            prev2Label={null}
            next2Label={null}
            minDate={new Date()}
            showNeighboringMonth={false}
            formatDay={(_, date) => date.getDate().toString()}
          />

          <div className="flex items-center gap-2">
            <span className="font-bold">시간</span>
            <CustomSelect
              type="time"
              value={selectedTime}
              onChange={handleTimeChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DateTimePicker;
