import dolphinBeach from '@/assets/image/dolphin-beach.svg';
import starfish from '@/assets/image/starfish.svg';

const HeroSection = () => {
  return (
    <div className="absolute top-0 h-[40vh] md:h-[80vh] w-full">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center mt-[140px]">
        <h1
          className="text-[32px] md:text-[72px] text-[#744B07] font-black"
          style={{
            WebkitTextStroke: '1px #744B07',
          }}
        >
          지중해
        </h1>
        <h2
          className="text-[20px] md:text-[48px] text-[#FFBF41] font-bold mb-10 relative"
          style={{
            textShadow: '0px 4px 4px rgba(0,0,0,0.25)',
          }}
        >
          <img
            src={starfish}
            className="absolute -left-20 md:-left-40 bottom-0 transform translate-y-1/4 w-4 h-4 md:w-12 md:h-12"
          />
          <span className="text-[24px] md:text-[52px]">지</span>도 안의{' '}
          <span className="text-[24px] md:text-[52px]">중</span>요한{' '}
          <span className="text-[24px] md:text-[52px]">혜</span>택
        </h2>
        {/* 텍스트 중앙 배치와 이미지 오른쪽 배치 */}
        <div className="relative w-full max-w-6xl">
          <p className="text-[16px] md:text-[28px] text-[#744B07] leading-relaxed text-center">
            숨겨진 보물 같은 멤버십 혜택들, <br />
            지도 위를 지금 항해해보세요!
          </p>
          <div className="absolute top-0 right-0">
            <img
              src={dolphinBeach}
              alt="돌고래"
              className="w-12 h-12 md:w-32 md:h-32 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
