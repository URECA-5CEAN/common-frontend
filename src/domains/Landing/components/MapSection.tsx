import dolphinFinger from '@/assets/image/dolphin-finger.svg';

const MapSection = () => {
  return (
    <div className="absolute top-[50vh] md:top-[90vh] w-full">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <div className="flex items-center justify-center mb-6 md:mb-12">
          <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl text-white font-bold mr-4">
            멤버십 제휴 매장을
            <br />
            지도를 통해 확인해보세요!
          </h2>
          <img
            src={dolphinFinger}
            alt="돌고래 손가락"
            className="w-12 h-12 md:w-20 md:h-20 object-contain mt-4 md:mt-8"
          />
        </div>

        {/* 지도와 설명 박스들 */}
        <div className="relative flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 w-full max-w-7xl mt-8 md:mt-20">
          {/* 지도 이미지 */}
          <div className="w-[50vw] md:w-[35vw] max-w-[700px] aspect-video bg-white rounded-lg overflow-hidden shadow-lg">
            <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 relative"></div>
          </div>

          {/* 설명 박스들 */}
          <div className="flex flex-col space-y-8 flex-1 md:transform md:-translate-x-8">
            <div
              className="bg-primaryGreen-80 text-white p-4 md:p-8 rounded-2xl md:transform md:-translate-x-12 min-h-[100px] md:min-h-[158px] flex items-center justify-center w-full md:max-w-[28vw]"
              style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)' }}
            >
              <p className="text-xs sm:text-sm md:text-lg lg:text-xl xl:text-2xl font-medium text-center leading-[1.75]">
                멤버십 지도에서 제휴 매장을
                <br />
                빠르게 찾아보세요
              </p>
            </div>
            <div
              className="bg-primaryGreen-80 text-white p-4 md:p-8 rounded-2xl min-h-[100px] md:min-h-[158px] flex items-center justify-center w-full md:max-w-[28vw]"
              style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)' }}
            >
              <p className="text-xs sm:text-sm md:text-lg lg:text-xl xl:text-2xl font-medium text-center leading-[1.75]">
                제휴 매장을 클릭하여
                <br />
                매장 및 혜택 정보를 확인해보세요
              </p>
            </div>
            <div
              className="bg-primaryGreen-80 text-white p-4 md:p-8 rounded-2xl min-h-[100px] md:min-h-[158px] flex items-center justify-center md:transform md:translate-x-12 w-full md:max-w-[28vw]"
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
