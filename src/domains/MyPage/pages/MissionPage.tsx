import { Breadcrumb } from '@/domains/MyPage/components/Breadcrumb';
import dolphinImg from '@/assets/image/mission_dolphin.png';
import { useAttendanceCalendar } from '@/domains/MyPage/hooks/useAttendanceCalendar';
import { AttendanceCalendar } from '@/domains/MyPage/components/attendance/AttendanceCalendar';
import { MissionList } from '@/domains/MyPage/components/mission/MissionList';

const STYLES = {
  container: 'w-full max-w-[1050px]',
  title: 'text-[32px] font-bold',
  subtitle: 'text-2xl font-bold',
  dolphinImg: 'fixed top-20 right-0 w-[700px] -z-1 hidden md:block',
} as const;

const MissionPage = () => {
  const {
    calendarValue,
    activeDate,
    loading,
    attendedDates,
    formatDate,
    handleCalendarChange,
    handleActiveStartDateChange,
    handleCheckIn,
    isTodayPresent,
  } = useAttendanceCalendar();

  return (
    <div className={STYLES.container}>
      <Breadcrumb title="미션" />

      <div className={STYLES.title}>미션</div>
      <div className={STYLES.subtitle}>출석체크</div>

      <AttendanceCalendar
        calendarValue={calendarValue}
        activeDate={activeDate}
        attendedDates={attendedDates}
        loading={loading}
        isTodayPresent={isTodayPresent}
        formatDate={formatDate}
        onCalendarChange={handleCalendarChange}
        onActiveStartDateChange={handleActiveStartDateChange}
        onCheckIn={handleCheckIn}
      />

      <MissionList />

      <img src={dolphinImg} alt="돌고래 캐릭터" className={STYLES.dolphinImg} />
    </div>
  );
};

export default MissionPage;
