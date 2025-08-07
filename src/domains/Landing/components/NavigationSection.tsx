import dolphinMap from '@/assets/image/dolphin-map.svg';
import dolphinExploration from '@/assets/image/dolphin-exploration.svg';
import dolphinSofa from '@/assets/image/dolphin-sofa.svg';
import FadeInSection from '@/domains/Landing/components/FadeInSection';

interface NavigationSectionProps {
  onMapClick: () => void;
  onExploreClick: () => void;
  onMyPageClick: () => void;
}

const NavigationSection = ({
  onMapClick,
  onExploreClick,
  onMyPageClick,
}: NavigationSectionProps) => {
  return (
    <FadeInSection className="w-full mt-50 md:mt-100 xl:mt-150">
      <div className="w-full max-w-[90rem] xl:max-w-[1440px] mx-auto px-[1rem] sm:px-[1.5rem] lg:px-[2rem] flex flex-col items-center text-center">
        {/* 제목 */}
        <div className="flex items-center justify-center mb-16 lg:mb-20">
          <h2 className="text-base md:text-2xl lg:text-[2.5rem] xl:text-[40px] text-white font-bold px-4 text-center leading-tight">
            이제 지중해로 항해를 떠나보아요!
          </h2>
        </div>

        {/* 원형 레이어 */}
        <div className="flex flex-row justify-center items-center gap-1 sm:gap-2 md:gap-4 lg:gap-8 xl:gap-16 w-full px-1 sm:px-2 md:px-4">
          {/* 멤버십 지도 */}
          <div className="flex flex-col items-center">
            <div
              className="bg-primaryGreen-40 rounded-full flex flex-col items-center justify-between hover:scale-105 transition-transform duration-300 cursor-pointer w-[28vw] h-[28vw] max-w-[110px] max-h-[110px] sm:w-[30vw] sm:h-[30vw] sm:max-w-[190px] sm:max-h-[190px] md:w-[26vw] md:h-[26vw] md:max-w-[280px] md:max-h-[280px] lg:w-80 lg:h-80 p-2 sm:p-3 md:p-6 lg:p-8"
              style={{
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
              }}
              onClick={onMapClick}
            >
              <div className="flex-1 flex items-center justify-center">
                <img
                  src={dolphinMap}
                  className="w-[16vw] h-[16vw] max-w-[60px] max-h-[60px] sm:w-[14vw] sm:h-[14vw] sm:max-w-[80px] sm:max-h-[80px] md:w-[11vw] md:h-[11vw] md:max-w-[140px] md:max-h-[140px] lg:w-44 lg:h-44 object-contain"
                />
              </div>
              <div
                className="text-center"
                style={{ marginBottom: 'min(1rem, 2vw)' }}
              >
                <div className="bg-opacity-90 rounded-full overflow-hidden">
                  <h3 className="font-bold text-gray-600 whitespace-nowrap md:whitespace-nowrap lg:whitespace-normal text-[8px] sm:text-[2vw] md:text-[12px] lg:text-lg px-1 py-1 sm:px-2 sm:py-2 md:px-2 md:py-2 lg:px-4 lg:py-2">
                    멤버십 지도 바로가기
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* 혜택 탐험 */}
          <div className="flex flex-col items-center">
            <div
              className="bg-primaryGreen-40 rounded-full flex flex-col items-center justify-between hover:scale-105 transition-transform duration-300 cursor-pointer w-[28vw] h-[28vw] max-w-[110px] max-h-[110px] sm:w-[25vw] sm:h-[25vw] sm:max-w-[190px] sm:max-h-[190px] md:w-[26vw] md:h-[26vw] md:max-w-[280px] md:max-h-[280px] lg:w-80 lg:h-80 p-2 sm:p-3 md:p-6 lg:p-8"
              style={{
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
              }}
              onClick={onExploreClick}
            >
              <div className="flex-1 flex items-center justify-center">
                <img
                  src={dolphinExploration}
                  className="w-[16vw] h-[16vw] max-w-[60px] max-h-[60px] sm:w-[14vw] sm:h-[14vw] sm:max-w-[80px] sm:max-h-[80px] md:w-[11vw] md:h-[11vw] md:max-w-[140px] md:max-h-[140px] lg:w-44 lg:h-44 object-contain"
                />
              </div>
              <div
                className="text-center"
                style={{ marginBottom: 'min(1rem, 2vw)' }}
              >
                <div className="bg-opacity-90 rounded-full overflow-hidden">
                  <h3 className="font-bold text-gray-600 whitespace-nowrap md:whitespace-nowrap lg:whitespace-normal text-[8px] sm:text-[2vw] md:text-[12px] lg:text-lg px-1 py-1 sm:px-2 sm:py-2 md:px-2 md:py-2 lg:px-4 lg:py-2">
                    혜택 탐험 바로가기
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* 마이페이지 */}
          <div className="flex flex-col items-center">
            <div
              className="bg-primaryGreen-40 rounded-full flex flex-col items-center justify-between hover:scale-105 transition-transform duration-300 cursor-pointer w-[28vw] h-[28vw] max-w-[110px] max-h-[110px] sm:w-[25vw] sm:h-[25vw] sm:max-w-[190px] sm:max-h-[190px] md:w-[26vw] md:h-[26vw] md:max-w-[280px] md:max-h-[280px] lg:w-80 lg:h-80 p-2 sm:p-3 md:p-6 lg:p-8"
              style={{
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
              }}
              onClick={onMyPageClick}
            >
              <div className="flex-1 flex items-center justify-center">
                <img
                  src={dolphinSofa}
                  className="w-[16vw] h-[16vw] max-w-[60px] max-h-[60px] sm:w-[14vw] sm:h-[14vw] sm:max-w-[80px] sm:max-h-[80px] md:w-[11vw] md:h-[11vw] md:max-w-[140px] md:max-h-[140px] lg:w-44 lg:h-44 object-contain"
                />
              </div>
              <div
                className="text-center"
                style={{ marginBottom: 'min(1rem, 2vw)' }}
              >
                <div className="bg-opacity-90 rounded-full overflow-hidden">
                  <h3 className="font-bold text-gray-600 whitespace-nowrap md:whitespace-nowrap lg:whitespace-normal text-[8px] sm:text-[2vw] md:text-[12px] lg:text-lg px-1 py-1 sm:px-2 sm:py-2 md:px-2 md:py-2 lg:px-4 lg:py-2">
                    마이페이지 바로가기
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FadeInSection>
  );
};

export default NavigationSection;
