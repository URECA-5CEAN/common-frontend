import dolphinBeach from '@/assets/image/dolphin-beach.svg';
import starfish from '@/assets/image/starfish.svg';

const HeroSection = () => {
  return (
    <div className="w-full">
      <div className="w-full max-w-[1440px] mx-auto flex flex-col items-center text-center mt-40">
        <h1
          className="text-[48px] md:text-[70px] text-[#744B07] font-bold z-1"
          style={{
            WebkitTextStroke: '1px #744B07',
          }}
        >
          지중해
        </h1>
        <h2
          className="text-[20px] md:text-[40px] text-[#FFBF41] font-bold mb-4 md:mb-10 relative"
          style={{
            textShadow: '0px 4px 4px rgba(0,0,0,0.25)',
          }}
        >
          <img
            src={starfish}
            className="absolute -left-12 md:-left-32 bottom-0 transform translate-y-1/4 w-3 h-3 md:w-10 md:h-10"
          />
          <span className="text-[28px] md:text-[44px]">지</span>도 안의{' '}
          <span className="text-[28px] md:text-[44px]">중</span>
          요한 <span className="text-[28px] md:text-[44px]">혜</span>택
        </h2>
        {/* 텍스트 중앙 배치와 이미지 오른쪽 배치 */}
        <div className="relative w-full max-w-6xl">
          <p className="text-[14px] md:text-[24px] text-[#744B07] leading-relaxed text-center">
            숨겨진 보물 같은 멤버십 혜택들, <br />
            지도 위를 지금 항해해보세요!
          </p>
          <div className="absolute top-14 md:top-0 right-15">
            <img
              src={dolphinBeach}
              alt="돌고래"
              className="w-14 h-14 md:w-24 md:h-24 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
