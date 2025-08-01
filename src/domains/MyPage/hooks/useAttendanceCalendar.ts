import { useState, useEffect } from 'react';
import {
  checkInAttendance,
  getUserAttendance,
} from '@/domains/MyPage/api/mission';

type CalendarValue = Date | null;

export const useAttendanceCalendar = () => {
  const [calendarValue, setCalendarValue] = useState<CalendarValue>(null);
  const [activeDate, setActiveDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);
  const [isTodayPresent, setIsTodayPresent] = useState(true);
  const [attData, setAttData] = useState<string[]>([]);

  const year = activeDate.getFullYear();
  const month = activeDate.getMonth() + 1;

  const loadAttData = async () => {
    try {
      const response = await getUserAttendance(year, month);
      const newDates = response.data.attendance;
      const todayStr = formatDate(new Date());

      setAttData((prev) => {
        const merged = [...prev, ...newDates];
        const unique = Array.from(new Set(merged));
        setIsTodayPresent(unique.includes(todayStr));

        return unique;
      });
    } catch (error) {
      console.error('출석체크 데이터 로드 실패:', error);
    }
  };

  useEffect(() => {
    loadAttData();
  }, [year, month]);

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
      await loadAttData();
      setActiveDate(new Date());
    } catch (error) {
      alert('출석 처리에 실패했습니다. ' + error);
    } finally {
      setLoading(false);
    }
  };

  return {
    calendarValue,
    activeDate,
    loading,
    attData,
    formatDate,
    handleCalendarChange,
    handleActiveStartDateChange,
    handleCheckIn,
    isTodayPresent,
  };
};
