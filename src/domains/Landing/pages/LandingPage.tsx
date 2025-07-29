import MotionPathAnimation from '@/domains/Landing/pages/MotionPathAnimation';
import beach from '@/assets/image/beach.png';
import wave2 from '@/assets/image/LandingWave.svg';

const LandingPage = () => {
  return (
    <div className="">
      <img
        src={beach}
        alt="모래사장"
        className="absolute top-0 w-full h-[100vh]"
      />

      <div className="absolute top-[130px] h-full overflow-hidden w-full">
        <img src={wave2} alt="파도" className=" h-full min-w-[1654px]" />
      </div>
      <MotionPathAnimation />
      <div className="absolute top-0 h-full w-full">
        <div className="w-full flex flex-col items-center text-center mt-[140px]">
          <h1 className="text-[82px] text-[#744B07] font-bold">지중해</h1>
          <h2 className="text-[48px] text-[#FFBF41] font-bold mb-10">
            지도 안의 중요한 혜택
          </h2>
          <p className="text-[40px] text-[#744B07]">
            숨겨진 보물 같은 멤버십 혜택들, <br />
            지도 위를 지금 항해해보세요!
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
