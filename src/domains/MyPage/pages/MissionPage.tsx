import { Breadcrumb } from '@/components/Breadcrumb';
import dolphinImg from '@/assets/image/mission_dolphin.png';
import { useAttendanceCalendar } from '@/domains/MyPage/hooks/useAttendanceCalendar';
import { AttendanceCalendar } from '@/domains/MyPage/components/attendance/AttendanceCalendar';
import { MissionList } from '@/domains/MyPage/components/mission/MissionList';
import { useEffect, useState } from 'react';
import {
  getMyMission,
  increaseUserExp,
  setMissionCompleted,
} from '@/domains/MyPage/api/mission';
import type { MissionType } from '@/domains/MyPage/types/mission';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

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

  const [myMission, setMyMission] = useState<MissionType[]>([]);
  const [loadingMissionIds, setLoadingMissionIds] = useState<string[]>([]);

  const navigate = useNavigate();

  const fetchMyMission = async () => {
    try {
      const response = await getMyMission();
      setMyMission(response.data);
    } catch (error) {
      console.error('미션 로드 실패:', error);
    }
  };

  useEffect(() => {
    fetchMyMission();
  }, []);

  const completeMission = async (id: string, expReward: number) => {
    if (loadingMissionIds.includes(id)) return;
    setLoadingMissionIds((prev) => [...prev, id]);
    try {
      await setMissionCompleted(id);
      const res = await increaseUserExp(expReward);

      fetchMyMission();
      toast.success(
        <span>
          미션을 완료했어요! 경험치{' '}
          <span style={{ color: '#158c9f', fontWeight: 'bold' }}>
            +{expReward}
          </span>
        </span>,
        {
          duration: 2000,
          style: {
            border: '1px solid #ebebeb',
            padding: '16px',
            color: '#1e1e1e',
          },
          iconTheme: {
            primary: '#158c9f',
            secondary: '#FFFAEE',
          },
        },
      );

      if (res.data.levelUpdated) {
        toast.success(
          (t) => (
            <div>
              <div className="flex justify-between">
                <p>축하해요!</p>
                <p className="font-bold">&nbsp;{res.data.level}</p>
                <p>&nbsp;달성!</p>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'end',
                  gap: '8px',
                  marginTop: '4px',
                }}
              >
                <button
                  onClick={() => {
                    toast.dismiss(t.id);
                    navigate('/mypage/profile');
                  }}
                  className="font-bold cursor-pointer"
                >
                  확인하러 가기
                </button>
              </div>
            </div>
          ),
          {
            duration: 5000,
            style: {
              border: '1px solid #6fc3d1',
              padding: '16px',
              color: '#ffffff',
              background: '#6fc3d1',
            },
            iconTheme: {
              primary: '#158c9f',
              secondary: '#FFFAEE',
            },
          },
        );
      }
    } catch (error) {
      console.error('미션 완료 로드 실패:', error);
      toast.error(<span>잠시 후 다시 시도해주세요.</span>, {
        duration: 2000,
        style: {
          border: '1px solid #ebebeb',
          padding: '16px',
          color: '#e94e4e',
        },
        iconTheme: {
          primary: '#e94e4e',
          secondary: '#FFFAEE',
        },
      });
    } finally {
      setLoadingMissionIds((prev) => prev.filter((mid) => mid !== id));
    }
  };

  const onCheckIn = () => {
    fetchMyMission();
    handleCheckIn();
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
        onCheckIn={onCheckIn}
      />

      <MissionList
        mission={myMission}
        completeMission={completeMission}
        loadingMissionIds={loadingMissionIds}
      />

      <img src={dolphinImg} alt="돌고래 캐릭터" className={STYLES.dolphinImg} />
    </div>
  );
};

export default MissionPage;
