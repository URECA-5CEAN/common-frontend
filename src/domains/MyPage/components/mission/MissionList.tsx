import { CircleCheck } from 'lucide-react';
import dolphinFind from '@/assets/image/dolphin_find.png';
import { Button } from '@/components/Button';

const STYLES = {
  subtitle: 'text-2xl font-bold mb-2',
  todayMissionBox:
    'w-full md:max-w-[463px] bg-gray-100 text-gray-300 py-4 px-5 rounded-xl flex justify-between',
  todayMissionIcon: 'text-primaryGreen',
  encyclopediaBox:
    'w-full md:max-w-[463px] bg-white border border-primaryGreen-60 py-4 px-5 rounded-xl flex justify-between',
  encyclopediaIcon: 'text-gray-200',
  weeklyMissionBox:
    'w-full md:max-w-[463px] bg-white border border-primaryGreen-60 py-4 px-5 rounded-xl flex justify-between mb-3',
  weeklyMissionRight: 'flex gap-2',
  weeklyMissionIcon: 'text-gray-200',

  MissionBox:
    'w-full md:max-w-[463px] bg-white border border-primaryGreen-60 py-4 px-4 rounded-xl flex justify-between gap-3 items-center',
  MissionRight: 'text-gray-200 w-full max-w-[62px] flex justify-center',
  MissionCompletedBox:
    'w-full md:max-w-[463px] bg-gray-100 text-gray-300 py-4 px-4 rounded-xl flex justify-between gap-3 items-center',
  MissionCompletedRight:
    'text-primaryGreen w-full max-w-[62px] flex justify-center',
};

interface MissionType {
  id: string;
  missionName: string;
  completed: boolean;
  current: number;
  goal: number;
}

interface MissionListProps {
  mission: MissionType[];
  completeMission: (id: string) => void;
}

// const dummyMissions: MissionType[] = [
//   {
//     id: '12034123',
//     missionName: '오늘 출석체크하기',
//     completed: false,
//     current: 0,
//     goal: 1,
//   },
//   {
//     id: '49345343',
//     missionName: '도감 현황 확인하기',
//     completed: false,
//     current: 1,
//     goal: 1,
//   },
//   {
//     id: '68456456',
//     missionName: '멤버십 혜택 10회 이용하기',
//     completed: false,
//     current: 2,
//     goal: 10,
//   },
//   {
//     id: '89756756',
//     missionName: '친구 초대하고 보상받기',
//     completed: true,
//     current: 5,
//     goal: 5,
//   },
// ];

export const MissionList: React.FC<MissionListProps> = ({
  mission,
  completeMission,
}) => {
  return (
    <div className="mb-3 flex flex-col gap-2">
      <div className={STYLES.subtitle}>미션 도전하기</div>
      {mission.length === 0 || !mission ? (
        <div className="w-full md:max-w-[463px] bg-white border border-gray-200 py-10 px-5 rounded-xl flex flex-col justify-center items-center gap-3 text-center">
          <img src={dolphinFind} alt="무언가를 찾는 돌고래" className="w-25" />
          새로운 미션을 준비 중이에요. <br />곧 찾아뵐게요!
        </div>
      ) : (
        mission.map((item, index) => {
          const canComplete = item.current === item.goal && !item.completed;

          return (
            <div
              key={index}
              className={
                item.completed
                  ? STYLES.MissionCompletedBox
                  : `${STYLES.MissionBox} ${canComplete ? 'cursor-pointer' : ''}`
              }
              // 완료 가능한 경우에만 클릭 핸들러 적용
            >
              <div className="flex justify-between w-full">
                {item.missionName}
                <p>
                  {item.current}/{item.goal}
                </p>
              </div>
              <div
                className={
                  item.completed
                    ? STYLES.MissionCompletedRight
                    : STYLES.MissionRight
                }
              >
                {canComplete ? (
                  <Button onClick={() => completeMission(item.id)}>완료</Button>
                ) : (
                  <CircleCheck strokeWidth={2} />
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
