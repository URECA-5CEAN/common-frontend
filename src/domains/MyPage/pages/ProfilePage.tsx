import BadgeModal from '@/domains/MyPage/components/profile/BadgeModal';
import UserProfile from '@/domains/MyPage/components/profile/UserProfile';
import type { UserInfo, UserInfoApi } from '@/domains/MyPage/types/profile';
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

const ProfilePage: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedBadge, setSelectedBadge] = useState<string>('');
  const [tempBadge, setTempBadge] = useState<string>(selectedBadge);
  const [userInfoApi, setUserInfoApi] = useState<UserInfoApi>();
  const { usageHistory, fetchUsageHistory } = useUsageHistoryStore();
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);

  const navigate = useNavigate();
  const usageHistoryLength = usageHistory.length;
  useEffect(() => {
    const fetchUserData = async () => {
      const userInfoRes = await getUserInfo();
      const userStatRes = await getUserStat();

      const mergedData = {
        ...userInfoRes.data,
        ...userStatRes.data,
      };

      setUserInfoApi(mergedData);
    };

    fetchUserData();
    if (usageHistoryLength === 0) {
      fetchUsageHistory();
    }
  }, [fetchUsageHistory, usageHistoryLength]);

  // 실제로는 API에서 받아올 데이터
  const userInfo: UserInfo = {
    collectionCount: 3,
    totalCollection: 105,
    missionCount: 0,
    totalMission: 3,
  };

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
      <div className="w-[calc(100%-48px)] max-w-[1050px] m-6">
        <Breadcrumb title="마이페이지" subtitle="내 정보" />

        <div className="flex flex-col">
          <div className="flex gap-3 items-center">
            <div className="text-[32px] mt-3 mb-2 font-bold">내 정보</div>
            <Button
              variant="secondary"
              height="30px"
              onClick={() => navigate('/mypage/edit')}
            >
              내 정보 수정
            </Button>
          </div>

          <UserProfile
            userInfo={userInfo}
            onBadgeClick={handleBadgeClick}
            userInfoApi={userInfoApi}
            usageHistoryLength={usageHistoryLength}
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
