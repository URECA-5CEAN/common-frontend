import { Button } from '@/components/Button';
import { Breadcrumb } from '@/domains/MyPage/components/Breadcrumb';
import Calendar from 'react-calendar';
import presentIcon from '@/assets/icons/present_icon.png';
import { useEffect, useState } from 'react';
import {
  checkInAttendance,
  getUserAttendance,
} from '@/domains/MyPage/api/mission';

const MissionPage = () => {
  const [attendedDates, setAttendedDates] = useState<Set<string>>(new Set([]));
  const [calendarValue, setCalendarValue] = useState<Date | null>(null);
  const [activeDate, setActiveDate] = useState<Date>(new Date()); // 달력에서 보여주는 월을 제어
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const year = activeDate.getFullYear();
      const month = activeDate.getMonth() + 1;

      try {
        const userAttendanceData = await getUserAttendance(year, month);

        const attendanceSet = new Set<string>(
          userAttendanceData.data.attendance,
        );
        setAttendedDates(attendanceSet);
      } catch (error) {
        console.error('출석 데이터 불러오기 실패:', error);
      }
    }

    fetchData();
  }, [activeDate]);

  const getStatusDot = (isPresent: boolean) => {
    if (isPresent) {
      return (
        <div className="w-full md:max-w-9 h-full md:max-h-9 rounded-full">
          <img src={presentIcon} alt="출석" className="w-full h-full" />
        </div>
      );
    }
    return (
      <div className="w-full md:max-w-9 h-full md:max-h-9 bg-gray-200 rounded-full" />
    );
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const today = new Date();
  const todayStr = formatDate(today);
  const isTodayPresent = attendedDates.has(todayStr);

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      await checkInAttendance();
      setAttendedDates((prev) => {
        const newSet = new Set(prev);
        newSet.add(todayStr);
        return newSet;
      });
      setActiveDate(today);
    } catch (error) {
      alert('출석 처리에 실패했습니다.' + error);
    } finally {
      setLoading(false);
    }
  };

  const LoadingSpinner = () => {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="w-5 h-5 border-3 border-gray-300 border-t-primaryGreen-80 rounded-full animate-spin" />
      </div>
    );
  };

  return (
    <div className="w-full max-w-[1050px]">
      <Breadcrumb title="미션" />
      <div className="text-[32px] font-bold">미션</div>
      <div className="text-2xl font-bold">출석체크</div>
      <div className="w-full flex justify-center md:justify-start">
        <div className="max-w-[463px] border border-gray-200 rounded-xl p-[30px] flex flex-col items-center">
          <Calendar
            className="attendance-calendar"
            calendarType="gregory"
            prev2Label={null}
            next2Label={null}
            showNeighboringMonth={false}
            formatDay={(_, date) => date.getDate().toString()}
            tileContent={({ date, view }) => {
              if (view !== 'month') return null;

              const dateStr = formatDate(date);
              const isPresent = attendedDates.has(dateStr);

              return (
                <div className="w-full max-w-9 aspect-square">
                  {getStatusDot(isPresent)}
                </div>
              );
            }}
            value={calendarValue}
            onChange={(value) => {
              if (value instanceof Date) {
                setCalendarValue(value);
              } else if (Array.isArray(value)) {
                setCalendarValue(value[0]);
              }
            }}
            activeStartDate={activeDate}
            onActiveStartDateChange={({ activeStartDate }) => {
              if (activeStartDate) setActiveDate(activeStartDate);
            }}
          />
          <Button
            onClick={handleCheckIn}
            width="190px"
            height="40px"
            disabled={isTodayPresent || loading}
            loading={loading}
          >
            {loading ? (
              <LoadingSpinner />
            ) : isTodayPresent ? (
              '출석 완료'
            ) : (
              '출석 체크'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MissionPage;
