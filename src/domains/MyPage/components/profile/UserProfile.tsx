import UserInfo from '@/domains/MyPage/components/profile/UserInfo';
import UserStats from '@/domains/MyPage/components/profile/UserStats';
import type { UserInfo as UserInfoType } from '@/domains/MyPage/types/profile';

interface ProfileImageProps {
  src: string;
  alt: string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ src, alt }) => (
  <div className="w-[144px] overflow-hidden">
    <img
      src={src}
      alt={alt}
      className="h-full w-auto object-cover object-center"
    />
  </div>
);

interface UserProfileProps {
  userInfo: UserInfoType;
  selectedBadgeName: string;
  onBadgeClick: () => void;
  profileImageSrc: string;
}

const UserProfile: React.FC<UserProfileProps> = ({
  userInfo,
  selectedBadgeName,
  onBadgeClick,
  profileImageSrc,
}) => (
  <div className="w-full border border-gray-200 rounded-2xl flex md:flex-row flex-col gap-5 p-5 md:justify-between items-center">
    <div className="flex gap-4 items-center w-full">
      <ProfileImage src={profileImageSrc} alt="우수아이콘" />
      <UserInfo
        userInfo={userInfo}
        selectedBadgeName={selectedBadgeName}
        onBadgeClick={onBadgeClick}
      />
    </div>
    <UserStats userInfo={userInfo} />
  </div>
);

export default UserProfile;
