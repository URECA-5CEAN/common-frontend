import Calendar from 'react-calendar';
import { Button } from '@/components/Button';
import presentIcon from '@/assets/icons/present_icon.png';
import { Ring } from 'ldrs/react';
import 'ldrs/react/Ring.css';
import { motion } from 'framer-motion';

interface AttendanceCalendarProps {
  calendarValue: Date | null;
  activeDate: Date;
  attData: string[];
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
  calendarWrapper: 'w-full flex justify-start mb-10',
  calendarContainer:
    'bg-white w-full h-full md:h-[648px] md:max-w-[463px] border border-gray-200 rounded-xl p-3 pb-5 md:p-[30px] flex flex-col items-center justify-between',
  statusDotPresent: 'w-full md:max-w-9 h-full md:max-h-9 bg-white rounded-full',
  statusDotAbsent: 'w-full md:max-w-9 h-full md:max-h-9 rounded-full',
  tileContent:
    'w-full max-w-9 aspect-square overflow-visible bg-gray-200 rounded-full',
};

const StatusDot = ({
  isPresent,
  isToday,
}: {
  isPresent: boolean;
  isToday: boolean;
}) => {
  if (isPresent) {
    if (isToday) {
      // 오늘이고 출석했을 때만 모션
      return (
        <motion.div
          className={STYLES.statusDotPresent}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [2, 1.8, 1], opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <img src={presentIcon} alt="출석" className="w-full h-full" />
        </motion.div>
      );
    }
    // 오늘이 아니고 출석한 날짜
    return (
      <div className={STYLES.statusDotPresent}>
        <img src={presentIcon} alt="출석" className="w-full h-full" />
      </div>
    );
  }

  return <div className={STYLES.statusDotAbsent} />;
};

export const AttendanceCalendar = ({
  calendarValue,
  activeDate,
  attData,
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
    const isPresent = attData.includes(dateStr);

    const todayStr = formatDate(new Date());
    const isToday = dateStr === todayStr;

    return (
      <div className={STYLES.tileContent}>
        <StatusDot isPresent={isPresent} isToday={isToday} />
      </div>
    );
  };

  const getButtonText = () => {
    if (loading)
      return (
        <>
          <Ring size="24" stroke="3" bgOpacity="0" speed="2" color="white" />
        </>
      );
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
