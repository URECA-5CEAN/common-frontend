import rankingPodium from '@/assets/image/ranking-podium.png';
import woosIcon from '@/assets/image/woos.svg';
import vipIcon from '@/assets/icons/vip_icon.png';
import vvipIcon from '@/assets/icons/vvip_icon.png';
import FadeInSection from '@/domains/Landing/components/FadeInSection';

const ExploreSection = () => {
  return (
    <div className="w-full mt-30 sm:mt-50 md:mt-30 xl:mt-60 2xl:mt-12">
      <div className="w-full mx-auto flex flex-col text-center">
        {/* 데스크톱 버전 - 기존 레이아웃 유지 */}
        <FadeInSection className="hidden md:block relative w-full">
          {/* 메인 카드 */}
          <div
            className="bg-[#FFBC52] rounded-2xl p-4 md:p-8 lg:p-10 w-full max-w-4xl md:max-w-2xl lg:max-w-2xl shadow-2xl min-h-[300px] md:min-h-[280px] lg:min-h-[400px] flex flex-col justify-center mt-32 relative mx-auto"
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

            <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-[40px] text-white font-bold mb-6 md:mb-8 lg:mb-10 leading-[1.75]">
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
            <div className="w-16 h-16 md:w-18 md:h-18 lg:w-24 lg:h-24 bg-white/80 rounded-full shadow-lg flex items-center justify-center border-2 border-cyan-200">
              <img
                src={vvipIcon}
                className="w-12 h-12 md:w-14 md:h-14 lg:w-20 lg:h-20 object-contain"
                alt="vvip"
              />
            </div>

            {/* VIP 아이콘 */}
            <div className="w-14 h-14 md:w-16 md:h-16 lg:w-22 lg:h-22 bg-white/80 rounded-full shadow-lg flex items-center justify-center border-2 border-cyan-200">
              <img
                src={vipIcon}
                className="w-10 h-10 md:w-12 md:h-12 lg:w-18 lg:h-18 object-contain"
                alt="vip"
              />
            </div>

            {/* 우수 아이콘 */}
            <div className="w-12 h-12 md:w-14 md:h-14 lg:w-20 lg:h-20 bg-white/80 rounded-full shadow-lg flex items-center justify-center border-2 border-cyan-200">
              <img
                src={woosIcon}
                className="w-8 h-8 md:w-10 md:h-10 lg:w-16 lg:h-16 object-contain"
                alt="우수"
              />
            </div>
          </div>
        </FadeInSection>

        {/* 모바일 버전 - 세로 배치 */}
        <FadeInSection className="block md:hidden relative w-full mt-16 px-6">
          {/* 메인 카드 */}
          <div
            className="bg-[#FFBC52] rounded-2xl p-8 w-full max-w-md shadow-2xl min-h-[160px] flex flex-col justify-center relative mx-auto"
            style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)' }}
          >
            <div className="absolute -top-18 left-1/2 transform -translate-x-1/2 z-10">
              <img src={rankingPodium} className="w-auto h-24 object-contain" />
            </div>

            <h2 className="text-lg sm:text-2xl text-white font-bold mb-2 leading-[1.5]">
              멤버십 혜택 탐험을 떠나요
            </h2>
            <p className="text-base sm:text-lg text-white font-medium mb-2 leading-[1.5]">
              멤버십 혜택 활용 순위를 확인해보세요
            </p>
            <p className="text-base sm:text-lg text-white font-medium leading-[1.5]">
              혜택을 나누고 싶은 사람을 찾고
              <br />
              채팅을 통해 소통할 수 있어요
            </p>
          </div>

          {/* 아이콘들 - 모바일에서만 아래쪽에 배치 */}
          <div className="flex flex-row space-x-3 justify-center mt-3">
            {/* VVIP 아이콘 */}
            <div className="w-14 h-14 bg-white/80 rounded-full shadow-lg flex items-center justify-center border-2 border-cyan-200">
              <img
                src={vvipIcon}
                className="w-10 h-10 object-contain"
                alt="vvip"
              />
            </div>

            {/* VIP 아이콘 */}
            <div className="w-12 h-12 bg-white/80 rounded-full shadow-lg flex items-center justify-center border-2 border-cyan-200">
              <img src={vipIcon} className="w-8 h-8 object-contain" alt="vip" />
            </div>

            {/* 우수 아이콘 */}
            <div className="w-10 h-10 bg-white/80 rounded-full shadow-lg flex items-center justify-center border-2 border-cyan-200">
              <img
                src={woosIcon}
                className="w-6 h-6 object-contain"
                alt="우수"
              />
            </div>
          </div>
        </FadeInSection>
      </div>
    </div>
  );
};

export default ExploreSection;
