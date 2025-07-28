import VipImage from '@/assets/image/vip.svg';
import VVipImage from '@/assets/image/vvip.svg';
import WoosoImage from '@/assets/image/woos.svg';
interface UserSectionProps {
  username: string;
  level: number;
  currentExp: number;
  nextLevelExp: number;
  membership: string;
}

const membershipImage: Record<string, string> = {
  우수: WoosoImage,
  VIP: VipImage,
  VVIP: VVipImage,
};

export default function UserSection({
  username,
  level,
  currentExp,
  nextLevelExp,
  membership,
}: UserSectionProps) {
  const ImageSrc = membershipImage[membership];
  // 경험치 퍼센트
  const percent = Math.min(100, Math.floor((currentExp / nextLevelExp) * 100));

  return (
    <div className="flex items-center space-x-4 bg-white p-2 pt-2 ">
      {/* 등급 이미지 */}
      <img src={ImageSrc} alt="vip" className="w-20 h-20" />

      {/* 유저 정보 && 프로그레스바*/}
      <div className="flex-1  ">
        <div className="flex items-baseline ">
          <span className="font-semibold text-gray-800">{username}</span>
        </div>
        <span className="text-sm text-gray-500">level {level}</span>
        <div className="relative  h-3 bg-gray-200 rounded-full mt-1 overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-[#96E0ED]"
            style={{ width: `${percent}%` }}
          />
          <div className="text-xs text-gray-500 left-[42%] absolute  ">
            {currentExp} / {nextLevelExp}
          </div>
        </div>
      </div>
    </div>
  );
}
