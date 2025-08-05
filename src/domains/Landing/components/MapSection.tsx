import dolphinFinger from '@/assets/image/dolphin-finger.svg';
import mapPage from '@/assets/image/mapPage.png';

const MapSection = () => {
  return (
    <div className="absolute top-[55vh] md:top-[100vh] w-full">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <div className="flex items-center justify-center mb-4 sm:mb-6 md:mb-8 lg:mb-12">
          <h2 className="text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-[40px] text-white font-bold mr-2 sm:mr-4">
            멤버십 제휴 매장을
            <br />
            지도를 통해 확인해보세요!
          </h2>
          <img
            src={dolphinFinger}
            alt="돌고래 손가락"
            className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain mt-2 sm:mt-4 md:mt-6 lg:mt-8"
          />
        </div>

        {/* 지도와 설명 박스들 */}
        <div className="relative flex flex-col md:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-12 lg:gap-16 w-full max-w-7xl mt-4 sm:mt-8 md:mt-16 lg:mt-20">
          {/* 지도 이미지 */}
          <div className="w-[80vw] sm:w-[70vw] md:w-[45vw] lg:w-[35vw] max-w-[700px] aspect-video bg-white rounded-lg overflow-hidden shadow-lg">
            <img
              src={mapPage}
              alt="멤버십 지도"
              className="w-full h-full object-cover"
            />
          </div>

          {/* 설명 박스들 */}
          <div className="flex flex-col space-y-4 sm:space-y-6 md:space-y-8 flex-1 md:items-center lg:transform lg:-translate-x-8">
            <div
              className="bg-primaryGreen-80 text-white p-3 sm:p-4 md:p-6 lg:p-8 rounded-2xl lg:transform lg:-translate-x-12 min-h-[80px] sm:min-h-[100px] md:min-h-[120px] lg:min-h-[158px] flex items-center justify-center w-full md:max-w-[32vw] lg:max-w-[28vw]"
              style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)' }}
            >
              <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-medium text-center leading-[1.75]">
                멤버십 지도에서 제휴 매장을
                <br />
                빠르게 찾아보세요
              </p>
            </div>
            <div
              className="bg-primaryGreen-80 text-white p-3 sm:p-4 md:p-6 lg:p-8 rounded-2xl min-h-[80px] sm:min-h-[100px] md:min-h-[120px] lg:min-h-[158px] flex items-center justify-center w-full md:max-w-[32vw] lg:max-w-[28vw]"
              style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)' }}
            >
              <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-medium text-center leading-[1.75]">
                제휴 매장을 클릭하여
                <br />
                매장 및 혜택 정보를 확인해보세요
              </p>
            </div>
            <div
              className="bg-primaryGreen-80 text-white p-4 md:p-8 rounded-2xl min-h-[100px] md:min-h-[158px] flex items-center justify-center lg:transform lg:translate-x-12 w-full md:max-w-[28vw]"
              style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)' }}
            >
              <p className="text-xs sm:text-sm md:text-lg lg:text-xl xl:text-2xl font-medium text-center leading-[1.75]">
                자주 가는 제휴 매장을 즐겨찾기하고
                <br />
                AI 추천 제휴처도 확인해보세요
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapSection;
