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
import type {
  ExpResultType,
  MissionType,
} from '@/domains/MyPage/types/mission';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from 'framer-motion';
import { LevelupModal } from '@/components/LevelupModal';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import success from '@/assets/lottie/Success.json';
import Lottie from 'lottie-react';

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
    attData,
    formatDate,
    handleCalendarChange,
    handleActiveStartDateChange,
    handleCheckIn,
    isTodayPresent,
  } = useAttendanceCalendar();

  const [myMission, setMyMission] = useState<MissionType[]>([]);
  const [loadingMissionIds, setLoadingMissionIds] = useState<string[]>([]);
  const [levelUpdated, setLevelUpdated] = useState(false);
  const [expResult, setExpResult] = useState<ExpResultType>({
    exp: 0,
    level: 0,
    levelUpdated: false,
    prevExp: 0,
    expReward: 0,
    missionName: '',
  });
  const [missionSuccess, setMissionSuccess] = useState(false);
  const [shouldShowLevelup, setShouldShowLevelup] = useState(false);

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

  const completeMission = async (
    id: string,
    expReward: number,
    missionName: string,
  ) => {
    if (loadingMissionIds.includes(id)) return;
    setLoadingMissionIds((prev) => [...prev, id]);

    try {
      await setMissionCompleted(id);
      const res = await increaseUserExp(expReward);

      const prevExp = res.data.levelUpdated
        ? 50 - (expReward - res.data.exp)
        : res.data.exp - expReward;

      setExpResult({
        ...res.data,
        prevExp,
        expReward,
        missionName,
      });
      setMissionSuccess(true);
      if (res.data.levelUpdated) {
        setShouldShowLevelup(true);
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
    handleCheckIn();
    fetchMyMission();
  };

  interface HTMLContentProps {
    levelUpdated: boolean;
    startValue: number;
    endValue: number;
  }

  function ExpContent({
    levelUpdated,
    startValue,
    endValue,
  }: HTMLContentProps) {
    const count = useMotionValue(startValue);
    const rounded = useTransform(count, (val) => Math.round(val));

    // Progress bar 값은 count를 0~50 범위로 변환 (50 이상은 max 고정)
    const progress = useTransform(count, (val) => {
      const clamped = Math.max(0, Math.min(val, 50));
      return `${(clamped / 50) * 100}%`;
    });

    const [displayedValue, setDisplayedValue] = useState(
      Math.round(count.get()),
    );
    useMotionValueEvent(rounded, 'change', (v) => {
      setDisplayedValue(v);
    });

    useEffect(() => {
      let controls: ReturnType<typeof animate> | null = null;

      const runAnimation = async () => {
        if (levelUpdated) {
          await animate(count, 50, { duration: 0.75, ease: 'easeOut' })
            .finished;
          count.set(0);
          controls = animate(count, endValue, {
            duration: 1.0,
            ease: 'easeOut',
          });
        } else {
          controls = animate(count, endValue, {
            duration: 1.0,
            ease: 'easeOut',
          });
        }
      };

      runAnimation();

      return () => {
        controls?.stop();
      };
    }, [levelUpdated, startValue, endValue]);

    return (
      <div className="w-full max-w-[300px] mx-auto text-center space-y-4">
        <div className="relative w-full h-8 md:h-9 bg-gray-200 rounded-xl overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-primaryGreen-60 after:content-[''] after:block after:h-[4px] after:absolute after:mx-2
               after:top-2 after:bg-white/30 after:rounded-full after:left-1 after:right-1"
            style={{ width: progress }}
          />
          <motion.pre
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg md:text-xl font-bold text-primaryGreen-80 font-[NanumSquareRound] pointer-events-none select-none"
            style={{ userSelect: 'none' }}
          >
            {displayedValue.toString().padStart(2, '0')}/50
          </motion.pre>
        </div>
      </div>
    );
  }

  function LevelContent({
    startValue,
    endValue,
  }: Pick<HTMLContentProps, 'startValue' | 'endValue'>) {
    const count = useMotionValue(startValue);
    const rounded = useTransform(count, (val) => Math.round(val));
    const [displayedValue, setDisplayedValue] = useState(
      Math.round(count.get()),
    );

    useMotionValueEvent(rounded, 'change', (v) => {
      setDisplayedValue(v);
    });

    useEffect(() => {
      const controls = animate(count, endValue, {
        duration: 2.0,
        ease: 'easeOut',
      });

      return () => controls.stop();
    }, [startValue, endValue]);

    return (
      <div className="w-full max-w-[300px] mx-auto text-center space-y-4">
        <motion.pre className="text-3xl md:text-7xl font-bold text-primaryGreen-80 font-[NanumSquareRound] pointer-events-none select-none">
          Lv.{displayedValue.toString().padStart(2, '0')}
        </motion.pre>
      </div>
    );
  }

  return (
    <>
      <div className="w-[calc(100%-48px)] md:w-[80%] max-w-[1050px] mb-50 md:mb-100">
        <Breadcrumb title="마이페이지" subtitle="미션" />

        <div className={STYLES.title}>미션</div>
        <div className={STYLES.subtitle}>출석체크</div>

        <AttendanceCalendar
          calendarValue={calendarValue}
          activeDate={activeDate}
          attData={attData}
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

        <img
          src={dolphinImg}
          alt="돌고래 캐릭터"
          className={STYLES.dolphinImg}
        />
      </div>
      <Modal
        isOpen={missionSuccess}
        onClose={() => {
          setMissionSuccess(false);
          if (shouldShowLevelup) {
            setTimeout(() => setLevelUpdated(true), 300); // 약간 딜레이 주면 부드러움
          }
        }}
        title="미션 성공"
        actions={
          <>
            <Button
              fullWidth
              variant="secondary"
              onClick={() => {
                setMissionSuccess(false);
                if (shouldShowLevelup) {
                  setLevelUpdated(true);
                }
              }}
            >
              확인
            </Button>
          </>
        }
      >
        <div className="w-full flex justify-center items-center">
          <Lottie animationData={success} loop={false} className="w-30 h-30" />
        </div>
        <div className="flex justify-center items-center text-center flex-col gap-2 break-keep">
          <p className="text-primaryGreen-80 font-bold text-lg">
            {expResult.missionName}
          </p>
          <p className="text-gray-500">
            미션을 완료했어요! 경험치 +{expResult.expReward}
          </p>
        </div>
      </Modal>

      <LevelupModal
        isOpen={levelUpdated}
        onClose={() => setLevelUpdated(false)}
        title="레벨이 올랐어요!"
        actions={
          <>
            <Button
              fullWidth
              variant="secondary"
              onClick={() => setLevelUpdated(false)}
            >
              닫기
            </Button>
            <Button fullWidth onClick={() => navigate('/mypage/profile')}>
              마이페이지
            </Button>
          </>
        }
      >
        <div className="my-5 md:my-10 flex flex-col justify-center items-center gap-4">
          <LevelContent
            startValue={expResult.level - 1}
            endValue={expResult.level}
          />
          <ExpContent
            levelUpdated={expResult.levelUpdated}
            startValue={expResult.prevExp}
            endValue={expResult.exp}
          />
        </div>
      </LevelupModal>
    </>
  );
};

export default MissionPage;
