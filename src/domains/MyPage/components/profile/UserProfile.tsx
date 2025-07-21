import UserInfo from '@/domains/MyPage/components/profile/UserInfo';
import UserStats from '@/domains/MyPage/components/profile/UserStats';
import type {
  UserInfoApi,
  UserInfo as UserInfoType,
} from '@/domains/MyPage/types/profile';
import excellentIcon from '@/assets/icons/excellent_icon.png';
import vipIcon from '@/assets/icons/vip_icon.png';
import vvipIcon from '@/assets/icons/vvip_icon.png';

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
  userInfoApi?: UserInfoApi;
}

const UserProfile: React.FC<UserProfileProps> = ({
  userInfo,
  selectedBadgeName,
  onBadgeClick,
  userInfoApi,
}) => {
  const membershipIconMap: Record<string, string> = {
    우수: excellentIcon,
    VIP: vipIcon,
    VVIP: vvipIcon,
  };

  const iconSrc = userInfoApi
    ? (membershipIconMap[userInfoApi.membership] ?? excellentIcon)
    : excellentIcon;

  return (
    <div className="w-full border border-gray-200 rounded-2xl flex md:flex-row flex-col gap-5 p-5 md:justify-between items-center">
      <div className="flex gap-4 items-center w-full">
        <ProfileImage src={iconSrc} alt="우수아이콘" />
        <UserInfo
          userInfo={userInfo}
          selectedBadgeName={selectedBadgeName}
          onBadgeClick={onBadgeClick}
          userInfoApi={userInfoApi}
        />
      </div>
      <UserStats userInfo={userInfo} />
    </div>
  );
};

export default UserProfile;
