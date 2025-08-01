import dolphinFinger from '@/assets/image/dolphin-finger.svg';

const MapSection = () => {
  return (
    <div className="absolute top-[110vh] w-full">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <div className="flex items-center justify-center mb-12">
          <h2 className="text-[40px] text-white font-bold mr-4">
            멤버십 제휴 매장을
            <br />
            지도를 통해 확인해보세요!
          </h2>
          <img
            src={dolphinFinger}
            alt="돌고래 손가락"
            className="w-20 h-20 object-contain mt-8"
          />
        </div>

        {/* 지도와 설명 박스들 */}
        <div className="relative flex items-center justify-between w-full max-w-7xl mt-20">
          {/* 지도 이미지 */}
          <div className="w-180 h-112 bg-white rounded-lg overflow-hidden shadow-lg">
            <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 relative"></div>
          </div>

          {/* 설명 박스들 */}
          <div className="flex flex-col space-y-8 ml-16 flex-1">
            <div className="bg-primaryGreen-80 text-white p-8 rounded-2xl shadow-lg transform -translate-x-22 min-h-[158px] flex items-center justify-center">
              <p
                className="text-2xl font-medium text-center"
                style={{ lineHeight: '42px' }}
              >
                멤버십 지도에서 제휴 매장을
                <br />
                빠르게 찾아보세요
              </p>
            </div>
            <div className="bg-primaryGreen-80 text-white p-8 rounded-2xl shadow-lg min-h-[158px] flex items-center justify-center">
              <p
                className="text-2xl font-medium text-center"
                style={{ lineHeight: '42px' }}
              >
                제휴 매장을 클릭하여
                <br />
                매장 및 혜택 정보를 확인해보세요
              </p>
            </div>
            <div className="bg-primaryGreen-80 text-white p-8 rounded-2xl shadow-lg min-h-[158px] flex items-center justify-center transform translate-x-22">
              <p
                className="text-2xl font-medium text-center"
                style={{ lineHeight: '42px' }}
              >
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
