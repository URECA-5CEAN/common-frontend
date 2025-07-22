import { Button } from '@/components/Button';
import { Breadcrumb } from '@/domains/MyPage/components/Breadcrumb';
import Calendar from 'react-calendar';
import presentIcon from '@/assets/icons/present_icon.png';
import dolphinImg from '@/assets/image/mission_dolphin.png';
import { useEffect, useState } from 'react';
import {
  checkInAttendance,
  getUserAttendance,
} from '@/domains/MyPage/api/mission';

type CalendarValue = Date | null;
type AttendanceSet = Set<string>;

const CALENDAR_CONFIG = {
  type: 'gregory' as const,
  showNeighboringMonth: false,
  prev2Label: null,
  next2Label: null,
};

const STYLES = {
  container: 'w-full max-w-[1050px]',
  title: 'text-[32px] font-bold',
  subtitle: 'text-2xl font-bold',
  calendarWrapper: 'w-full flex justify-center md:justify-start',
  calendarContainer:
    'bg-white max-w-[463px] border border-gray-200 rounded-xl p-[30px] flex flex-col items-center',
  statusDot: 'w-full md:max-w-9 h-full md:max-h-9',
  statusDotPresent: 'w-full md:max-w-9 h-full md:max-h-9 rounded-full',
  statusDotAbsent:
    'w-full md:max-w-9 h-full md:max-h-9 bg-gray-200 rounded-full',
  tileContent: 'w-full max-w-9 aspect-square',
  dolphinImg: 'absolute top-0 right-0 w-[870px] -z-1 hidden md:block',
  dolphinImgWrapper: 'w-1/2 fixed top-20 right-0 -z-1',
  spinner: 'w-full h-full flex justify-center items-center',
  spinnerDot:
    'w-5 h-5 border-3 border-gray-300 border-t-primaryGreen-80 rounded-full animate-spin',
} as const;

const MissionPage = () => {
  const [attendedDates, setAttendedDates] = useState<AttendanceSet>(
    new Set([]),
  );
  const [calendarValue, setCalendarValue] = useState<CalendarValue>(null);
  const [activeDate, setActiveDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchAttendanceData = async (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    try {
      const userAttendanceData = await getUserAttendance(year, month);
      const attendanceSet = new Set<string>(userAttendanceData.data.attendance);
      setAttendedDates(attendanceSet);
    } catch (error) {
      console.error('출석 데이터 불러오기 실패:', error);
    }
  };

  const StatusDot = ({ isPresent }: { isPresent: boolean }) => {
    if (isPresent) {
      return (
        <div className={STYLES.statusDotPresent}>
          <img src={presentIcon} alt="출석" className="w-full h-full" />
        </div>
      );
    }
    return <div className={STYLES.statusDotAbsent} />;
  };

  const LoadingSpinner = () => (
    <div className={STYLES.spinner}>
      <div className={STYLES.spinnerDot} />
    </div>
  );

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
      setAttendedDates((prev) => new Set(prev).add(todayStr));
      setActiveDate(today);
    } catch (error) {
      alert('출석 처리에 실패했습니다. ' + error);
    } finally {
      setLoading(false);
    }
  };

  const renderTileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;

    const dateStr = formatDate(date);
    const isPresent = attendedDates.has(dateStr);

    return (
      <div className={STYLES.tileContent}>
        <StatusDot isPresent={isPresent} />
      </div>
    );
  };

  const today = new Date();
  const todayStr = formatDate(today);
  const isTodayPresent = attendedDates.has(todayStr);

  const getButtonText = () => {
    if (loading) return <LoadingSpinner />;
    if (isTodayPresent) return '출석 완료';
    return '출석 체크';
  };

  useEffect(() => {
    fetchAttendanceData(activeDate);
  }, [activeDate]);

  return (
    <div className={STYLES.container}>
      <Breadcrumb title="미션" />

      <div className={STYLES.title}>미션</div>
      <div className={STYLES.subtitle}>출석체크</div>

      <div className={STYLES.calendarWrapper}>
        <div className={STYLES.calendarContainer}>
          <Calendar
            className="attendance-calendar"
            calendarType={CALENDAR_CONFIG.type}
            prev2Label={CALENDAR_CONFIG.prev2Label}
            next2Label={CALENDAR_CONFIG.next2Label}
            showNeighboringMonth={CALENDAR_CONFIG.showNeighboringMonth}
            formatDay={(_, date) => date.getDate().toString()}
            tileContent={renderTileContent}
            value={calendarValue}
            onChange={handleCalendarChange}
            activeStartDate={activeDate}
            onActiveStartDateChange={handleActiveStartDateChange}
          />

          <Button
            onClick={handleCheckIn}
            width="190px"
            height="40px"
            disabled={isTodayPresent || loading}
            loading={loading}
          >
            {getButtonText()}
          </Button>
        </div>
      </div>
      <div className={STYLES.dolphinImgWrapper}>
        <img
          src={dolphinImg}
          alt="돌고래 캐릭터"
          className={STYLES.dolphinImg}
        />
      </div>
    </div>
  );
};

export default MissionPage;
