import dolphinMap from '@/assets/image/dolphin-map.svg';
import dolphinExploration from '@/assets/image/dolphin-exploration.svg';
import dolphinSofa from '@/assets/image/dolphin-sofa.svg';

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
    <div className="absolute top-[340vh] md:top-[460vh] w-full">
      <div className="w-full max-w-[90rem] xl:max-w-[1440px] mx-auto px-[1rem] sm:px-[1.5rem] lg:px-[2rem] flex flex-col items-center text-center">
        {/* 제목 */}
        <div className="flex items-center justify-center mb-16 lg:mb-20">
          <h2 className="text-[1.25rem] sm:text-[1.75rem] lg:text-[2.5rem] text-white font-bold px-4 text-center leading-tight">
            이제 지중해로 항해를 떠나보아요!
          </h2>
        </div>

        {/* 원형 레이어 */}
        <div className="flex flex-row justify-center items-center gap-[1rem] sm:gap-[2rem] lg:gap-16 max-w-[76rem] xl:max-w-6xl w-full">
          {/* 멤버십 지도 */}
          <div className="flex flex-col items-center">
            <div
              className="bg-primaryGreen-40 rounded-full flex flex-col items-center justify-between hover:scale-105 transition-transform duration-300 cursor-pointer"
              style={{
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
                width: 'min(18rem, 28vw)',
                height: 'min(18rem, 28vw)',
                padding: 'min(1.5rem, 2.5vw)',
              }}
              onClick={onMapClick}
            >
              <div className="flex-1 flex items-center justify-center">
                <img
                  src={dolphinMap}
                  style={{
                    width: 'min(10rem, 18vw)',
                    height: 'min(10rem, 18vw)',
                  }}
                  className="object-contain"
                />
              </div>
              <div
                className="text-center"
                style={{ marginBottom: 'min(1rem, 2vw)' }}
              >
                <div
                  className="bg-white bg-opacity-90 rounded-full"
                  style={{
                    paddingLeft: 'min(1rem, 2vw)',
                    paddingRight: 'min(1rem, 2vw)',
                    paddingTop: 'min(0.5rem, 1vw)',
                    paddingBottom: 'min(0.5rem, 1vw)',
                  }}
                >
                  <h3
                    className="font-bold text-gray-800"
                    style={{ fontSize: 'min(0.75rem, 1.5vw)' }}
                  >
                    멤버십 지도 바로가기
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* 혜택 탐험 */}
          <div className="flex flex-col items-center">
            <div
              className="bg-primaryGreen-40 rounded-full flex flex-col items-center justify-between hover:scale-105 transition-transform duration-300 cursor-pointer"
              style={{
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
                width: 'min(18rem, 28vw)',
                height: 'min(18rem, 28vw)',
                padding: 'min(1.5rem, 2.5vw)',
              }}
              onClick={onExploreClick}
            >
              <div className="flex-1 flex items-center justify-center">
                <img
                  src={dolphinExploration}
                  style={{
                    width: 'min(10rem, 18vw)',
                    height: 'min(10rem, 18vw)',
                  }}
                  className="object-contain"
                />
              </div>
              <div
                className="text-center"
                style={{ marginBottom: 'min(1rem, 2vw)' }}
              >
                <div
                  className="bg-white bg-opacity-90 rounded-full"
                  style={{
                    paddingLeft: 'min(1rem, 2vw)',
                    paddingRight: 'min(1rem, 2vw)',
                    paddingTop: 'min(0.5rem, 1vw)',
                    paddingBottom: 'min(0.5rem, 1vw)',
                  }}
                >
                  <h3
                    className="font-bold text-gray-800"
                    style={{ fontSize: 'min(0.75rem, 1.5vw)' }}
                  >
                    혜택 탐험 바로가기
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* 마이페이지 */}
          <div className="flex flex-col items-center">
            <div
              className="bg-primaryGreen-40 rounded-full flex flex-col items-center justify-between hover:scale-105 transition-transform duration-300 cursor-pointer"
              style={{
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
                width: 'min(18rem, 28vw)',
                height: 'min(18rem, 28vw)',
                padding: 'min(1.5rem, 2.5vw)',
              }}
              onClick={onMyPageClick}
            >
              <div className="flex-1 flex items-center justify-center">
                <img
                  src={dolphinSofa}
                  style={{
                    width: 'min(10rem, 18vw)',
                    height: 'min(10rem, 18vw)',
                  }}
                  className="object-contain"
                />
              </div>
              <div
                className="text-center"
                style={{ marginBottom: 'min(1rem, 2vw)' }}
              >
                <div
                  className="bg-white bg-opacity-90 rounded-full"
                  style={{
                    paddingLeft: 'min(1rem, 2vw)',
                    paddingRight: 'min(1rem, 2vw)',
                    paddingTop: 'min(0.5rem, 1vw)',
                    paddingBottom: 'min(0.5rem, 1vw)',
                  }}
                >
                  <h3
                    className="font-bold text-gray-800"
                    style={{ fontSize: 'min(0.75rem, 1.5vw)' }}
                  >
                    마이페이지 바로가기
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationSection;
