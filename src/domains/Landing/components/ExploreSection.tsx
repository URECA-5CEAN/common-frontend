import rankingPodium from '@/assets/image/ranking-podium.png';
import woosIcon from '@/assets/image/woos.svg';
import vipIcon from '@/assets/icons/vip_icon.png';
import vvipIcon from '@/assets/icons/vvip_icon.png';

const ExploreSection = () => {
  return (
    <div className="absolute top-[230vh] w-full">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center relative">
        {/* 메인 카드 */}
        <div
          className="bg-[#FFBC52] rounded-2xl p-16 max-w-3xl w-full shadow-2xl min-h-[400px] flex flex-col justify-center mt-32 relative"
          style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)' }}
        >
          <div className="absolute -top-42 left-1/2 transform -translate-x-1/2 z-10">
            <img src={rankingPodium} className="w-auto h-48 object-contain" />
          </div>

          {/* 우측 아이콘들 */}
          <div className="absolute -right-40 top-36 flex flex-col space-y-2">
            {/* W 아이콘 (상단) */}
            <div className="w-28 h-28 bg-white/80 rounded-full shadow-lg flex items-center justify-center border-2 border-cyan-200 ml-8">
              <img
                src={vvipIcon}
                className="w-24 h-24 object-contain"
                alt="vvip"
              />
            </div>

            {/* V 아이콘 (중간 왼쪽) */}
            <div className="w-24 h-24 bg-white/80 rounded-full shadow-lg flex items-center justify-center border-2 border-cyan-200 -ml-10">
              <img
                src={vipIcon}
                className="w-22 h-22 object-contain"
                alt="vip"
              />
            </div>

            {/* 우수 아이콘 (중간 오른쪽) */}
            <div className="w-20 h-20 bg-white/80 rounded-full shadow-lg flex items-center justify-center border-2 border-cyan-200 ml-24 -mt-16">
              <img
                src={woosIcon}
                className="w-16 h-16 object-contain"
                alt="우수"
              />
            </div>
          </div>

          <h2 className="text-[20px] md:text-[40px] text-white font-bold mb-10 leading-tight">
            멤버십 혜택 탐험을 떠나요
          </h2>
          <p className="text-[12px] md:text-2xl text-white font-medium mb-8">
            멤버십 혜택 활용 순위를 확인해보세요
          </p>
          <p className="text-[12px] md:text-2xl text-white font-medium leading-relaxed">
            혜택을 나누고 싶은 사람을 찾고
            <br />
            채팅을 통해 소통할 수 있어요
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExploreSection;
