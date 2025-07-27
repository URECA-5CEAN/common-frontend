import BadgeModal from '@/domains/MyPage/components/profile/BadgeModal';
import UserProfile from '@/domains/MyPage/components/profile/UserProfile';
import { BADGES } from '@/domains/MyPage/constants/profile';
import type {
  UsageHistoryItem,
  UserInfo,
  UserInfoApi,
} from '@/domains/MyPage/types/profile';
import { useEffect, useState } from 'react';
import UsageHistory from '@/domains/MyPage/components/profile/UsageHistory';
import {
  getUsageHistory,
  getUserInfo,
  getUserStat,
} from '@/domains/MyPage/api/profile';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Button } from '@/components/Button';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedBadge, setSelectedBadge] = useState<string>('earlybird');
  const [tempBadge, setTempBadge] = useState<string>(selectedBadge);
  const [userInfoApi, setUserInfoApi] = useState<UserInfoApi>();
  const [usageHistory, setUsageHistory] = useState<
    UsageHistoryItem[] | undefined
  >();

  const navigate = useNavigate();

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

    const fetchUsageHistory = async () => {
      const usageHistoryRes = await getUsageHistory();

      setUsageHistory(usageHistoryRes.data);
    };

    fetchUserData();
    fetchUsageHistory();
  }, []);

  // 실제로는 API에서 받아올 데이터
  const userInfo: UserInfo = {
    collectionCount: 3,
    totalCollection: 105,
    missionCount: 0,
    totalMission: 3,
  };

  const selectedBadgeName =
    BADGES.find((badge) => badge.id === selectedBadge)?.name || '';

  const handleBadgeClick = (): void => {
    setTempBadge(selectedBadge);
    setOpen(true);
  };

  const handleConfirm = (): void => {
    setSelectedBadge(tempBadge);
    setOpen(false);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  return (
    <>
      <div className="w-full max-w-[1050px] m-6">
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
            selectedBadgeName={selectedBadgeName}
            onBadgeClick={handleBadgeClick}
            userInfoApi={userInfoApi}
          />
        </div>

        <UsageHistory items={usageHistory} />
      </div>

      <BadgeModal
        isOpen={open}
        onClose={handleClose}
        badges={BADGES}
        tempBadge={tempBadge}
        setTempBadge={setTempBadge}
        onConfirm={handleConfirm}
      />
    </>
  );
};

export default ProfilePage;
