import { ProgressBar } from '@/domains/MyPage/components/ProgressBar';
import type {
  UserInfoApi,
  UserInfo as UserInfoType,
} from '@/domains/MyPage/types/profile';

interface BadgeButtonProps {
  name: string;
  onClick: () => void;
}

const BadgeButton: React.FC<BadgeButtonProps> = ({ name, onClick }) => (
  <div
    onClick={onClick}
    className="shimmer px-2 py-1.5 rounded-xl w-fit cursor-pointer text-[#282ab3] 
               transition-all duration-300 hover:brightness-115"
  >
    {name}
  </div>
);

interface UserLevelProps {
  nickname?: string;
  level?: number;
}

const UserLevel: React.FC<UserLevelProps> = ({ nickname, level }) => (
  <div className="flex items-end font-bold gap-1">
    <p className="text-2xl">{nickname}</p>
    <p>Lv.{level}</p>
  </div>
);

interface UserLocationProps {
  location: string;
  grade: string;
}

const UserLocation: React.FC<UserLocationProps> = ({ location, grade }) => (
  <div className="flex flex-col gap-1">
    <div>{location}</div>
    <div>{grade}</div>
  </div>
);

interface UserInfoProps {
  userInfo: UserInfoType;
  selectedBadgeName: string;
  onBadgeClick: () => void;
  userInfoApi?: UserInfoApi;
}

const UserInfo: React.FC<UserInfoProps> = ({
  userInfo,
  selectedBadgeName,
  onBadgeClick,
  userInfoApi,
}) => {
  if (!userInfoApi) {
    return <div>로딩 중...</div>;
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <BadgeButton name={selectedBadgeName} onClick={onBadgeClick} />
        <UserLevel nickname={userInfoApi.nickname} level={userInfoApi.level} />
        <ProgressBar current={userInfoApi.exp} max={50} />
      </div>
      <UserLocation
        location={userInfoApi.address}
        grade={userInfoApi.membership}
      />
    </div>
  );
};

export default UserInfo;
