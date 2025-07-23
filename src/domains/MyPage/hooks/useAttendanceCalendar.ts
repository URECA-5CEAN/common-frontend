import { useState, useEffect } from 'react';
import { checkInAttendance } from '@/domains/MyPage/api/mission';
import { useAttendanceQuery } from '@/domains/MyPage/api/queries/useAttendanceQuery';

type CalendarValue = Date | null;

export const useAttendanceCalendar = () => {
  const [calendarValue, setCalendarValue] = useState<CalendarValue>(null);
  const [activeDate, setActiveDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);
  const [attendedDates, setAttendedDates] = useState<Set<string>>(new Set());

  const year = activeDate.getFullYear();
  const month = activeDate.getMonth() + 1;
  const { data, refetch } = useAttendanceQuery(year, month);

  useEffect(() => {
    if (!data?.data.attendance) return;

    setAttendedDates((prev) => {
      const next = new Set(prev);
      data.data.attendance.forEach((dateStr: string) => {
        next.add(dateStr);
      });
      return next;
    });
  }, [data]);

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleCalendarChange = (value: CalendarValue | CalendarValue[]) => {
    if (value instanceof Date) {
      setCalendarValue(value);
    } else if (Array.isArray(value)) {
      setCalendarValue(value[0]);
    }
  };

  const handleActiveStartDateChange = ({
    activeStartDate,
  }: {
    activeStartDate: Date | null;
  }) => {
    if (activeStartDate) {
      setActiveDate(activeStartDate);
    }
  };

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      await checkInAttendance();
      await refetch();
      setActiveDate(new Date());
    } catch (error) {
      alert('출석 처리에 실패했습니다. ' + error);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date();
  const todayStr = formatDate(today);
  const isTodayPresent = attendedDates.has(todayStr);

  return {
    calendarValue,
    activeDate,
    loading,
    attendedDates,
    formatDate,
    handleCalendarChange,
    handleActiveStartDateChange,
    handleCheckIn,
    isTodayPresent,
  };
};
