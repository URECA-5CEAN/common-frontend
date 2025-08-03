import { Button } from '@/components/Button';
import { ProgressBar } from '@/domains/MyPage/components/ProgressBar';
import type { UserInfoApi } from '@/domains/MyPage/types/profile';

interface BadgeButtonProps {
  title: string;
  onClick: () => void;
}

const BadgeButton: React.FC<BadgeButtonProps> = ({ title, onClick }) => {
  return title ? (
    <div
      onClick={onClick}
      className="shimmer px-2 py-1.5 rounded-xl w-fit cursor-pointer text-[#282ab3] 
               transition-all duration-300 hover:brightness-115 whitespace-nowrap"
    >
      {title}
    </div>
  ) : (
    <div>
      <Button onClick={onClick} className="" variant="secondary" height="30px">
        칭호 생성하기
      </Button>
    </div>
  );
};

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
  grade: string;
}

const UserLocation: React.FC<UserLocationProps> = ({ grade }) => (
  <div className="flex flex-col gap-1">
    <div>{grade}</div>
  </div>
);

interface UserInfoProps {
  onBadgeClick: () => void;
  userInfoApi?: UserInfoApi;
}

const UserInfo: React.FC<UserInfoProps> = ({ onBadgeClick, userInfoApi }) => {
  if (!userInfoApi) {
    return <div>로딩 중...</div>;
  }
  if (userInfoApi.error) {
    return (
      <div className="h-full">
        유저 정보를 불러오는데 실패했어요.
        <br />
        잠시 후 다시 시도해주세요.
      </div>
    );
  }
  return (
    <div className="flex flex-col justify-between w-full max-w-[200px]">
      <div className="flex flex-col gap-1 w-full">
        <BadgeButton title={userInfoApi.title} onClick={onBadgeClick} />
        <UserLevel nickname={userInfoApi.nickname} level={userInfoApi.level} />
        <ProgressBar current={userInfoApi.exp} max={50} />
      </div>
      <UserLocation grade={userInfoApi.membership} />
    </div>
  );
};

export default UserInfo;
