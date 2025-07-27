import { Breadcrumb } from '@/components/Breadcrumb';
import dolphinImg from '@/assets/image/mission_dolphin.png';
import { useAttendanceCalendar } from '@/domains/MyPage/hooks/useAttendanceCalendar';
import { AttendanceCalendar } from '@/domains/MyPage/components/attendance/AttendanceCalendar';
import { MissionList } from '@/domains/MyPage/components/mission/MissionList';

const STYLES = {
  container: 'w-[calc(100%-48px)] max-w-[1050px] m-6',
  title: 'text-[32px] font-bold my-3',
  subtitle: 'text-2xl font-bold mb-2',
  dolphinImg: 'fixed top-20 right-0 w-[700px] -z-1 hidden lg:block',
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
      <Breadcrumb title="마이페이지" subtitle="미션" />

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
