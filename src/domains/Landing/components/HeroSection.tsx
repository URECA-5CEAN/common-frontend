import dolphinBeach from '@/assets/image/dolphin-beach.svg';
import starfish from '@/assets/image/starfish.svg';

const HeroSection = () => {
  return (
    <div className="absolute top-0 h-[45vh] sm:h-[55vh] md:h-[70vh] lg:h-[80vh] w-full">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center mt-[80px] sm:mt-[100px] md:mt-[140px] lg:mt-[160px]">
        <h1
          className="text-[28px] sm:text-[40px] md:text-[60px] lg:text-[72px] text-[#744B07] font-black"
          style={{
            WebkitTextStroke: '1px #744B07',
          }}
        >
          지중해
        </h1>
        <h2
          className="text-[18px] sm:text-[24px] md:text-[40px] lg:text-[48px] text-[#FFBF41] font-bold mb-6 sm:mb-8 lg:mb-10 relative"
          style={{
            textShadow: '0px 4px 4px rgba(0,0,0,0.25)',
          }}
        >
          <img
            src={starfish}
            className="absolute -left-12 sm:-left-16 md:-left-32 lg:-left-40 bottom-0 transform translate-y-1/4 w-3 h-3 sm:w-4 sm:h-4 md:w-10 md:h-10 lg:w-12 lg:h-12"
          />
          <span className="text-[20px] sm:text-[28px] md:text-[44px] lg:text-[52px]">
            지
          </span>
          도 안의{' '}
          <span className="text-[20px] sm:text-[28px] md:text-[44px] lg:text-[52px]">
            중
          </span>
          요한{' '}
          <span className="text-[20px] sm:text-[28px] md:text-[44px] lg:text-[52px]">
            혜
          </span>
          택
        </h2>
        {/* 텍스트 중앙 배치와 이미지 오른쪽 배치 */}
        <div className="relative w-full max-w-6xl">
          <p className="text-[14px] sm:text-[16px] md:text-[24px] lg:text-[28px] text-[#744B07] leading-relaxed text-center">
            숨겨진 보물 같은 멤버십 혜택들, <br />
            지도 위를 지금 항해해보세요!
          </p>
          <div className="absolute top-0 right-0">
            <img
              src={dolphinBeach}
              alt="돌고래"
              className="w-8 h-8 sm:w-12 sm:h-12 md:w-24 md:h-24 lg:w-32 lg:h-32 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
