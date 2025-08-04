import rankingPodium from '@/assets/image/ranking-podium.png';
import woosIcon from '@/assets/image/woos.svg';
import vipIcon from '@/assets/icons/vip_icon.png';
import vvipIcon from '@/assets/icons/vvip_icon.png';

const ExploreSection = () => {
  return (
    <div className="absolute top-[125vh] md:top-[200vh] w-full">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center relative">
        {/* 데스크톱 버전 - 기존 레이아웃 유지 */}
        <div className="hidden md:block relative w-full">
          {/* 메인 카드 */}
          <div
            className="bg-[#FFBC52] rounded-2xl p-8 md:p-12 lg:p-16 w-full max-w-4xl shadow-2xl min-h-[300px] md:min-h-[350px] lg:min-h-[400px] flex flex-col justify-center mt-32 relative mx-auto"
            style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)' }}
          >
            <div className="absolute -top-32 md:-top-36 lg:-top-42 left-1/2 transform -translate-x-1/2 z-10">
              <img
                src={rankingPodium}
                className="w-auto h-32 md:h-40 lg:h-48 object-contain"
              />
            </div>

            {/* 우측 아이콘들 - 큰 화면에서만 절대 위치 */}
            <div className="hidden xl:flex absolute -right-40 top-36 flex-col space-y-2">
              {/* VVIP 아이콘 */}
              <div className="w-28 h-28 bg-white/80 rounded-full shadow-lg flex items-center justify-center border-2 border-cyan-200 ml-8">
                <img
                  src={vvipIcon}
                  className="w-24 h-24 object-contain"
                  alt="vvip"
                />
              </div>

              {/* VIP 아이콘 */}
              <div className="w-24 h-24 bg-white/80 rounded-full shadow-lg flex items-center justify-center border-2 border-cyan-200 -ml-10">
                <img
                  src={vipIcon}
                  className="w-22 h-22 object-contain"
                  alt="vip"
                />
              </div>

              {/* 우수 아이콘 */}
              <div className="w-20 h-20 bg-white/80 rounded-full shadow-lg flex items-center justify-center border-2 border-cyan-200 ml-24 -mt-16">
                <img
                  src={woosIcon}
                  className="w-16 h-16 object-contain"
                  alt="우수"
                />
              </div>
            </div>

            <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl text-white font-bold mb-6 md:mb-8 lg:mb-10 leading-[1.75]">
              멤버십 혜택 탐험을 떠나요
            </h2>
            <p className="text-sm md:text-lg lg:text-xl xl:text-2xl text-white font-medium mb-6 md:mb-8 leading-[1.75]">
              멤버십 혜택 활용 순위를 확인해보세요
            </p>
            <p className="text-sm md:text-lg lg:text-xl xl:text-2xl text-white font-medium leading-[1.75]">
              혜택을 나누고 싶은 사람을 찾고
              <br />
              채팅을 통해 소통할 수 있어요
            </p>
          </div>

          {/* 중간 화면용 아이콘들 - 카드 아래에 배치 */}
          <div className="flex xl:hidden flex-row space-x-6 justify-center mt-8">
            {/* VVIP 아이콘 */}
            <div className="w-20 h-20 md:w-24 md:h-24 bg-white/80 rounded-full shadow-lg flex items-center justify-center border-2 border-cyan-200">
              <img
                src={vvipIcon}
                className="w-16 h-16 md:w-20 md:h-20 object-contain"
                alt="vvip"
              />
            </div>

            {/* VIP 아이콘 */}
            <div className="w-18 h-18 md:w-22 md:h-22 bg-white/80 rounded-full shadow-lg flex items-center justify-center border-2 border-cyan-200">
              <img
                src={vipIcon}
                className="w-14 h-14 md:w-18 md:h-18 object-contain"
                alt="vip"
              />
            </div>

            {/* 우수 아이콘 */}
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white/80 rounded-full shadow-lg flex items-center justify-center border-2 border-cyan-200">
              <img
                src={woosIcon}
                className="w-12 h-12 md:w-16 md:h-16 object-contain"
                alt="우수"
              />
            </div>
          </div>
        </div>

        {/* 모바일 버전 - 세로 배치 */}
        <div className="block md:hidden relative w-full mt-16">
          {/* 메인 카드 */}
          <div
            className="bg-[#FFBC52] rounded-2xl p-4 w-full max-w-sm shadow-2xl min-h-[200px] flex flex-col justify-center relative mx-auto"
            style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)' }}
          >
            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-10">
              <img src={rankingPodium} className="w-auto h-16 object-contain" />
            </div>

            <h2 className="text-lg sm:text-xl text-white font-bold mb-3 leading-[1.75]">
              멤버십 혜택 탐험을 떠나요
            </h2>
            <p className="text-xs sm:text-sm text-white font-medium mb-3 leading-[1.75]">
              멤버십 혜택 활용 순위를 확인해보세요
            </p>
            <p className="text-xs sm:text-sm text-white font-medium leading-[1.75]">
              혜택을 나누고 싶은 사람을 찾고
              <br />
              채팅을 통해 소통할 수 있어요
            </p>
          </div>

          {/* 아이콘들 - 모바일에서만 아래쪽에 배치 */}
          <div className="flex flex-row space-x-4 justify-center mt-4">
            {/* VVIP 아이콘 */}
            <div className="w-20 h-20 bg-white/80 rounded-full shadow-lg flex items-center justify-center border-2 border-cyan-200">
              <img
                src={vvipIcon}
                className="w-16 h-16 object-contain"
                alt="vvip"
              />
            </div>

            {/* VIP 아이콘 */}
            <div className="w-18 h-18 bg-white/80 rounded-full shadow-lg flex items-center justify-center border-2 border-cyan-200">
              <img
                src={vipIcon}
                className="w-16 h-16 object-contain"
                alt="vip"
              />
            </div>

            {/* 우수 아이콘 */}
            <div className="w-16 h-16 bg-white/80 rounded-full shadow-lg flex items-center justify-center border-2 border-cyan-200">
              <img
                src={woosIcon}
                className="w-12 h-12 object-contain"
                alt="우수"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreSection;
