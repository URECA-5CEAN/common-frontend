import { CircleCheck } from 'lucide-react';
import dolphinFind from '@/assets/image/dolphin_find.png';
import { Button } from '@/components/Button';
import type { MissionType } from '@/domains/MyPage/types/mission';
import { Ring } from 'ldrs/react';
import 'ldrs/react/Ring.css';

const STYLES = {
  subtitle: 'text-2xl font-bold mb-2',
  MissionBox:
    'w-full md:max-w-[463px] bg-white border border-primaryGreen-60 py-4 px-4 rounded-xl flex justify-between gap-3 items-center',
  MissionRight: 'text-gray-200 w-full max-w-[62px] flex justify-center',
  MissionCompletedBox:
    'w-full md:max-w-[463px] bg-gray-100 border border-gray-100 text-gray-300 py-4 px-4 rounded-xl flex justify-between gap-3 items-center',
  MissionCompletedRight:
    'text-primaryGreen w-full max-w-[62px] flex justify-center',
};

interface MissionListProps {
  mission: MissionType[];
  completeMission: (id: string, expReward: number, missionName: string) => void;
  loadingMissionIds: string[];
}

export const MissionList: React.FC<MissionListProps> = ({
  mission,
  completeMission,
  loadingMissionIds,
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
          let canComplete = false;

          if (item.myValue === item.requireValue) {
            if (!item.completed) {
              canComplete = true;
            }
          }

          return (
            <div
              key={index}
              className={
                item.completed
                  ? STYLES.MissionCompletedBox
                  : `${STYLES.MissionBox}`
              }
              // 완료 가능한 경우에만 클릭 핸들러 적용
            >
              <div className="flex justify-between w-full">
                <p className="flex flex-col md:flex-row justify-center md:items-center gap-1">
                  {item.name}
                  <span
                    className={`text-sm ${item.completed ? 'text-primaryGreen' : 'text-primaryGreen-80'}`}
                  >
                    경험치 +{item.expReward}
                  </span>
                </p>
                <p className="flex justify-center items-center">
                  {item.myValue}/{item.requireValue}
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
                  <Button
                    onClick={() =>
                      completeMission(item.missionId, item.expReward, item.name)
                    }
                    height={'24px'}
                    width={'62px'}
                    disabled={loadingMissionIds.includes(item.missionId)}
                  >
                    {loadingMissionIds.includes(item.missionId) ? (
                      <div className="flex">
                        <Ring
                          size="16"
                          stroke="3"
                          bgOpacity="0"
                          speed="2"
                          color="white"
                        />
                      </div>
                    ) : (
                      '완료'
                    )}
                  </Button>
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
