import { CircleCheck } from 'lucide-react';

const STYLES = {
  subtitle: 'text-2xl font-bold',
  todayMissionBox:
    'w-full max-w-[463px] bg-gray-100 text-gray-300 py-4 px-5 rounded-xl flex justify-between',
  todayMissionIcon: 'text-primaryGreen',
  encyclopediaBox:
    'w-full max-w-[463px] bg-white border border-primaryGreen-60 py-4 px-5 rounded-xl flex justify-between',
  encyclopediaIcon: 'text-gray-200',
  weeklyMissionBox:
    'w-full max-w-[463px] bg-white border border-primaryGreen-60 py-4 px-5 rounded-xl flex justify-between',
  weeklyMissionRight: 'flex gap-2',
  weeklyMissionIcon: 'text-gray-200',
};

export const MissionList = () => {
  return (
    <>
      <div className={STYLES.subtitle}>미션 도전하기</div>
      <div>일일미션</div>
      <div className={STYLES.todayMissionBox}>
        오늘 출석체크하기
        <CircleCheck className={STYLES.todayMissionIcon} strokeWidth={2} />
      </div>

      <div className={STYLES.encyclopediaBox}>
        도감 현황 확인하기
        <CircleCheck className={STYLES.encyclopediaIcon} strokeWidth={2} />
      </div>

      <div>주간미션</div>
      <div className={STYLES.weeklyMissionBox}>
        멤버십 혜택 10회 이용하기
        <div className={STYLES.weeklyMissionRight}>
          <p>2/10</p>
          <CircleCheck className={STYLES.weeklyMissionIcon} strokeWidth={2} />
        </div>
      </div>
    </>
  );
};
