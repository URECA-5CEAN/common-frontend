import BadgeModal from '@/domains/MyPage/components/profile/BadgeModal';
import UserProfile from '@/domains/MyPage/components/profile/UserProfile';
import { BADGES, USAGE_HISTORY } from '@/domains/MyPage/constants/profile';
import type { UserInfo } from '@/domains/MyPage/types/profile';
import { useState } from 'react';
import outstandingIcon from '@/assets/icons/outstanding_icon.png';
import UsageHistory from '@/domains/MyPage/components/profile/UsageHistory';

const Breadcrumb: React.FC = () => (
  <div className="flex">
    <p className="text-gray-400">마이페이지</p>&nbsp;/&nbsp;<p>내 정보</p>
  </div>
);

const ProfilePage: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedBadge, setSelectedBadge] = useState<string>('earlybird');
  const [tempBadge, setTempBadge] = useState<string>(selectedBadge);

  // 실제로는 API에서 받아올 데이터
  const userInfo: UserInfo = {
    nickname: '닉네임',
    level: 6,
    currentExp: 5,
    maxExp: 20,
    location: '서울특별시 강남구',
    grade: '우수',
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
        <Breadcrumb />

        <div>
          <div className="text-[32px]">내 정보</div>
          <div className="text-2xl">{userInfo.nickname}님 반갑습니다</div>

          <UserProfile
            userInfo={userInfo}
            selectedBadgeName={selectedBadgeName}
            onBadgeClick={handleBadgeClick}
            profileImageSrc={outstandingIcon}
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
