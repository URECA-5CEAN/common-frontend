import BadgeModal from '@/domains/MyPage/components/profile/BadgeModal';
import UserProfile from '@/domains/MyPage/components/profile/UserProfile';
import type { UserInfoApi } from '@/domains/MyPage/types/profile';
import { useEffect, useState } from 'react';
import UsageHistory from '@/domains/MyPage/components/profile/UsageHistory';
import {
  editUserInfo,
  getUserInfo,
  getUserStat,
} from '@/domains/MyPage/api/profile';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Button } from '@/components/Button';
import { useNavigate } from 'react-router-dom';
import { useUsageHistoryStore } from '@/store/useUsageHistoryStore';
import { getMyMission } from '@/domains/MyPage/api/mission';

interface MissionType {
  id: string;
  missionName: string;
  completed: boolean;
  current: number;
  goal: number;
}

const ProfilePage: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedBadge, setSelectedBadge] = useState<string>('');
  const [tempBadge, setTempBadge] = useState<string>(selectedBadge);
  const [userInfoApi, setUserInfoApi] = useState<UserInfoApi>();
  const { usageHistory, fetchUsageHistory } = useUsageHistoryStore();
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);
  const [myMission, setMyMission] = useState<MissionType[]>([]);

  const navigate = useNavigate();
  const usageHistoryLength = usageHistory.length;
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userInfoRes = await getUserInfo();
        const userStatRes = await getUserStat();

        const mergedData = {
          ...userInfoRes.data,
          ...userStatRes.data,
          error: false,
        };

        setUserInfoApi(mergedData);
      } catch (error) {
        console.error(error);
        setUserInfoApi({
          address: '',
          email: '',
          gender: '',
          id: '',
          membership: '',
          name: '',
          nickname: '',
          title: '',
          level: 0,
          exp: 0,
          error: true,
        });
      }
    };

    fetchUserData();
    fetchUsageHistory();
  }, [fetchUsageHistory, usageHistoryLength]);

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

  const missionTotal = myMission.length;
  const missionCompleted = myMission.filter(
    (mission) => mission.completed,
  ).length;

  const progressText = `${missionCompleted}/${missionTotal}`;

  const handleBadgeClick = (): void => {
    setTempBadge(selectedBadge);
    setOpen(true);
  };

  const updateTitle = async () => {
    setIsConfirmLoading(true);
    try {
      await editUserInfo({ title: tempBadge });
      setSelectedBadge(tempBadge);
      setIsConfirmLoading(false);
      setUserInfoApi((prev) => {
        if (!prev) return prev;
        return { ...prev, title: tempBadge };
      });
    } catch (error) {
      console.error('사용자 정보 로드 실패:', error);
      alert('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsConfirmLoading(false);
      setOpen(false);
    }
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  return (
    <>
      <div className="w-[calc(100%-48px)] md:w-[80%] max-w-[1050px] mb-50 md:mb-100">
        <Breadcrumb title="마이페이지" subtitle="내 정보" />

        <div className="flex flex-col">
          <div className="flex gap-3 items-center">
            <div className="text-[32px] mt-3 mb-2 font-bold">내 정보</div>
            <Button
              variant="secondary"
              height="30px"
              onClick={() => navigate('/mypage/profile/edit')}
            >
              내 정보 수정
            </Button>
          </div>

          <UserProfile
            onBadgeClick={handleBadgeClick}
            userInfoApi={userInfoApi}
            usageHistoryLength={usageHistoryLength}
            progressText={progressText}
          />
        </div>

        <UsageHistory items={usageHistory} />
      </div>

      <BadgeModal
        isOpen={open}
        onClose={handleClose}
        userInfoApi={userInfoApi}
        tempBadge={tempBadge}
        setTempBadge={setTempBadge}
        onConfirm={updateTitle}
        isConfirmLoading={isConfirmLoading}
      />
    </>
  );
};

export default ProfilePage;
