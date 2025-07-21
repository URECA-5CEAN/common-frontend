import BadgeModal from '@/domains/MyPage/components/profile/BadgeModal';
import UserProfile from '@/domains/MyPage/components/profile/UserProfile';
import { BADGES, USAGE_HISTORY } from '@/domains/MyPage/constants/profile';
import type { UserInfo, UserInfoApi } from '@/domains/MyPage/types/profile';
import { useEffect, useState } from 'react';
import UsageHistory from '@/domains/MyPage/components/profile/UsageHistory';
import { getUserInfo, getUserStat } from '@/domains/MyPage/api/profile';
import { Breadcrumb } from '@/domains/MyPage/components/Breadcrumb';

const ProfilePage: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedBadge, setSelectedBadge] = useState<string>('earlybird');
  const [tempBadge, setTempBadge] = useState<string>(selectedBadge);
  const [userInfoApi, setUserInfoApi] = useState<UserInfoApi>();

  useEffect(() => {
    async function fetchData() {
      const userInfoRes = await getUserInfo();
      const userStatRes = await getUserStat();

      const mergedData = {
        ...userInfoRes.data,
        ...userStatRes.data,
      };

      setUserInfoApi(mergedData);
    }

    fetchData();
  }, []);

  console.log(userInfoApi);

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
      <div className="w-full max-w-[1050px]">
        <Breadcrumb title="내 정보" />

        <div>
          <div className="text-[32px]">내 정보</div>
          <div className="text-2xl">{userInfoApi?.nickname}님 반갑습니다</div>

          <UserProfile
            userInfo={userInfo}
            selectedBadgeName={selectedBadgeName}
            onBadgeClick={handleBadgeClick}
            userInfoApi={userInfoApi}
          />
        </div>

        <UsageHistory items={USAGE_HISTORY} />
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
