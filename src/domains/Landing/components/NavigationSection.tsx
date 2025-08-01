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
    <div className="absolute top-[540vh] w-full">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* 제목 */}
        <div className="flex items-center justify-center mb-20">
          <h2 className="text-[40px] text-white font-bold">
            이제 지중해로 항해를 떠나보아요!
          </h2>
        </div>

        {/* 원형 레이어 */}
        <div className="flex justify-center space-x-16 max-w-6xl w-full">
          {/* 멤버십 지도 */}
          <div className="flex flex-col items-center">
            <div
              className="w-80 h-80 bg-primaryGreen-40 rounded-full flex flex-col items-center justify-between hover:scale-105 transition-transform duration-300 cursor-pointer py-12"
              style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)' }}
              onClick={onMapClick}
            >
              <div className="flex-1 flex items-center justify-center">
                <img src={dolphinMap} className="w-48 h-48 object-contain" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-white">
                  멤버십 지도 바로가기
                </h3>
              </div>
            </div>
          </div>

          {/* 혜택 탐험 */}
          <div className="flex flex-col items-center">
            <div
              className="w-80 h-80 bg-primaryGreen-40 rounded-full flex flex-col items-center justify-between hover:scale-105 transition-transform duration-300 cursor-pointer py-12"
              style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)' }}
              onClick={onExploreClick}
            >
              <div className="flex-1 flex items-center justify-center">
                <img
                  src={dolphinExploration}
                  className="w-48 h-48 object-contain"
                />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-white">
                  혜택 탐험 바로가기
                </h3>
              </div>
            </div>
          </div>

          {/* 마이페이지 */}
          <div className="flex flex-col items-center">
            <div
              className="w-80 h-80 bg-primaryGreen-40 rounded-full flex flex-col items-center justify-between hover:scale-105 transition-transform duration-300 cursor-pointer py-12"
              style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)' }}
              onClick={onMyPageClick}
            >
              <div className="flex-1 flex items-center justify-center">
                <img src={dolphinSofa} className="w-48 h-48 object-contain" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-white">
                  마이페이지 바로가기
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationSection;
