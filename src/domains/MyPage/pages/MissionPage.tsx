import { Breadcrumb } from '@/components/Breadcrumb';
import dolphinImg from '@/assets/image/mission_dolphin.png';
import { useAttendanceCalendar } from '@/domains/MyPage/hooks/useAttendanceCalendar';
import { AttendanceCalendar } from '@/domains/MyPage/components/attendance/AttendanceCalendar';
import { MissionList } from '@/domains/MyPage/components/mission/MissionList';
import { useEffect, useState } from 'react';
import {
  getMyMission,
  setMissionCompleted,
} from '@/domains/MyPage/api/mission';

const STYLES = {
  container: 'w-[calc(100%-48px)] max-w-[1050px] m-6',
  title: 'text-[32px] font-bold my-3',
  subtitle: 'text-2xl font-bold mb-2',
  dolphinImg: 'fixed top-20 right-0 w-[700px] -z-1 hidden lg:block',
} as const;

interface MissionType {
  id: string;
  missionName: string;
  completed: boolean;
  current: number;
  goal: number;
}

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

  const [myMission, setMyMission] = useState<MissionType[]>([]);

  useEffect(() => {
    const fetchMyMission = async () => {
      try {
        const response = await getMyMission();
        setMyMission(response.data);
      } catch (error) {
        console.error('미션 로드 실패:', error);
      }
    };
    fetchMyMission();
  }, []);

  const completeMission = async (id: string) => {
    console.log(id);
    try {
      const response = await setMissionCompleted(id);
      console.log(response.data);
    } catch (error) {
      console.error('미션 완료 로드 실패:', error);
    }
  };

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

      <MissionList mission={myMission} completeMission={completeMission} />

      <img src={dolphinImg} alt="돌고래 캐릭터" className={STYLES.dolphinImg} />
    </div>
  );
};

export default MissionPage;
