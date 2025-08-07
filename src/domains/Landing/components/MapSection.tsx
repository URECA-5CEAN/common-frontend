import dolphinFinger from '@/assets/image/dolphin-finger.svg';
import mapPage5 from '@/assets/image/mapPage.png';
import clsx from 'clsx';
import FadeInSection from '@/domains/Landing/components/FadeInSection';

const MapSection = () => {
  return (
    <div className="w-full -mt-30 md:mt-60 px-6 md:px-10">
      <div className="w-full mx-auto flex flex-col text-center">
        <div className="flex items-center justify-center mb-0 2xl:mb-8 translate-x-">
          <h2 className="text-2xl md:text-4xl text-white font-bold leading-tight pl-8 sm:pl-[48px] md:pl-[64px] lg:pl-20">
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
        <div className="relative w-full py-6 flex flex-col sm:h-60 md:h-110 xl:h-120 2xl:h-150">
          {/* 지도 이미지 */}
          <div
            className="sm:w-[70%] bg-white rounded-2xl overflow-hidden pt-1/2 h-fit shadow-lg sm:absolute xl:left-10 xl:top-1/2 xl:-translate-y-1/2"
            style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)' }}
          >
            <img src={mapPage5} alt="멤버십 지도" className="brightness-100" />
          </div>

          {/* 설명 박스들 */}
          <div className="pt-4 sm:pt-0 select-none flex flex-col justify-center gap-2 sm:gap-4 sm:absolute sm:right-10 sm:top-[54%] w-full sm:w-fit xl:top-1/2 sm:-translate-y-1/2">
            <FadeInSection
              className={clsx(
                'bg-primaryGreen-80 text-white rounded-2xl flex items-center justify-center p-2 md:p-3 lg:p-6',
                'transition-all duration-700 ease-out',
                'sm:-translate-x-24',
                // visibleBoxes.includes(1)
                //   ? 'translate-y-0 opacity-100'
                //   : 'translate-y-12 opacity-0',
              )}
            >
              <p className="text-sm md:text-lg lg:text-2xl leading-normal">
                멤버십 지도에서 제휴 매장을
                <br />
                빠르게 찾아보세요!
              </p>
            </FadeInSection>
            <FadeInSection
              className={clsx(
                'bg-primaryGreen-80 text-white rounded-2xl flex items-center justify-center p-2 md:p-3 lg:p-6',
                'transition-all duration-700 ease-out',
                'sm:-translate-x-12',
                // visibleBoxes.includes(2)
                //   ? 'translate-y-0 opacity-100'
                //   : 'translate-y-12 opacity-0',
              )}
            >
              <p className="text-sm md:text-lg lg:text-2xl leading-normal">
                제휴 매장을 클릭하여
                <br />
                매장 및 혜택 정보를 확인해보세요!
              </p>
            </FadeInSection>
            <FadeInSection
              className={clsx(
                'bg-primaryGreen-80 text-white rounded-2xl flex items-center justify-center p-2 md:p-3 lg:p-6',
                'transition-all duration-700 ease-out',
                'sm:-translate-x-0',
                // visibleBoxes.includes(3)
                //   ? 'translate-y-0 opacity-100'
                //   : 'translate-y-12 opacity-0',
              )}
            >
              <p className="text-sm md:text-lg lg:text-2xl leading-normal">
                자주 가는 제휴 매장을 즐겨찾기하고
                <br />
                AI 추천 제휴처도 확인해보세요!
              </p>
            </FadeInSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapSection;
