import Calendar from 'react-calendar';
import { Button } from '@/components/Button';
import presentIcon from '@/assets/icons/present_icon.png';

interface AttendanceCalendarProps {
  calendarValue: Date | null;
  activeDate: Date;
  attendedDates: Set<string>;
  loading: boolean;
  isTodayPresent: boolean;
  formatDate: (date: Date) => string;
  onCalendarChange: (value: Date | null | (Date | null)[]) => void;
  onActiveStartDateChange: ({
    activeStartDate,
  }: {
    activeStartDate: Date | null;
  }) => void;
  onCheckIn: () => void;
}

const CALENDAR_CONFIG = {
  type: 'gregory' as const,
  showNeighboringMonth: false,
  prev2Label: null,
  next2Label: null,
};

const STYLES = {
  calendarWrapper: 'w-full flex justify-center lg:justify-start mb-10',
  calendarContainer:
    'bg-white w-full h-[648px] md:max-w-[463px] border border-gray-200 rounded-xl p-3 md:p-[30px] flex flex-col items-center justify-between',
  statusDotPresent: 'w-full md:max-w-9 h-full md:max-h-9 rounded-full',
  statusDotAbsent:
    'w-full md:max-w-9 h-full md:max-h-9 bg-gray-200 rounded-full',
  tileContent: 'w-full max-w-9 aspect-square',
  spinner: 'w-full h-full flex justify-center items-center',
  spinnerDot:
    'w-5 h-5 border-3 border-gray-300 border-t-primaryGreen-80 rounded-full animate-spin',
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

export const AttendanceCalendar = ({
  calendarValue,
  activeDate,
  attendedDates,
  loading,
  isTodayPresent,
  formatDate,
  onCalendarChange,
  onActiveStartDateChange,
  onCheckIn,
}: AttendanceCalendarProps) => {
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

  const getButtonText = () => {
    if (loading) return <LoadingSpinner />;
    if (isTodayPresent) return '오늘 출석 완료';
    return '출석 체크';
  };

  return (
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
          onChange={onCalendarChange}
          activeStartDate={activeDate}
          onActiveStartDateChange={onActiveStartDateChange}
        />

        <Button
          onClick={onCheckIn}
          width="190px"
          height="40px"
          disabled={isTodayPresent || loading}
          loading={loading}
        >
          {getButtonText()}
        </Button>
      </div>
    </div>
  );
};
