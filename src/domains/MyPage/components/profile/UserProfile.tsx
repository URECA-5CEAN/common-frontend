import UserInfo from '@/domains/MyPage/components/profile/UserInfo';
import UserStats from '@/domains/MyPage/components/profile/UserStats';
import type { UserInfoApi } from '@/domains/MyPage/types/profile';
import excellentIcon from '@/assets/icons/excellent_icon.png';
import vipIcon from '@/assets/icons/vip_icon.png';
import vvipIcon from '@/assets/icons/vvip_icon.png';

interface ProfileImageProps {
  src?: string;
  alt: string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ src, alt }) => (
  <div className="w-[144px] h-full overflow-hidden">
    {src ? (
      <img
        src={src}
        alt={alt}
        className="h-full w-auto object-cover object-center"
      />
    ) : (
      <div className="h-full aspect-square w-auto object-cover object-center bg-gray-200 rounded-xl"></div>
    )}
  </div>
);

interface UserProfileProps {
  onBadgeClick: () => void;
  userInfoApi?: UserInfoApi;
  usageHistoryLength: number;
  progressText: string;
}

const UserProfile: React.FC<UserProfileProps> = ({
  onBadgeClick,
  userInfoApi,
  usageHistoryLength,
  progressText,
}) => {
  const membershipIconMap: Record<string, string> = {
    우수: excellentIcon,
    VIP: vipIcon,
    VVIP: vvipIcon,
  };

  const iconSrc =
    userInfoApi?.membership && membershipIconMap[userInfoApi.membership];

  return (
    <div className="w-full lg:h-[186px] border border-gray-200 rounded-2xl flex lg:flex-row flex-col gap-5 p-5 md:justify-between items-center">
      <div className="flex gap-4 w-full">
        <ProfileImage src={iconSrc} alt="우수아이콘" />
        <UserInfo onBadgeClick={onBadgeClick} userInfoApi={userInfoApi} />
      </div>
      <UserStats
        usageHistoryLength={usageHistoryLength}
        progressText={progressText}
      />
    </div>
  );
};

export default UserProfile;
