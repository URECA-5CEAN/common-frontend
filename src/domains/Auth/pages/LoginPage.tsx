import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import mobileWave1 from '@/assets/image/mobile-wave1.svg';
import mobileWave2 from '@/assets/image/mobile-wave2.svg';
import mobileWave3 from '@/assets/image/mobile-wave3.svg';
import sideWave1 from '@/assets/image/side-wave1.svg';
import sideWave2 from '@/assets/image/side-wave2.svg';
import sideWave3 from '@/assets/image/side-wave3.svg';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen pt-[62px] md:pt-[86px] bg-white relative">
      <style>{`
        @keyframes waveSlide {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          50% {
            opacity: 0.7;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes mobileWaveSlide {
          0% {
            transform: translateY(100%);
            opacity: 0;
          }
          50% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .wave-animation-1 {
          animation: waveSlide 1s ease-out 0.1s both;
        }
        
        .wave-animation-2 {
          animation: waveSlide 1s ease-out 0.3s both;
        }
        
        .wave-animation-3 {
          animation: waveSlide 1s ease-out 0.5s both;
        }
        
        .mobile-wave-animation-1 {
          animation: mobileWaveSlide 1s ease-out 0.1s both;
        }
        
        .mobile-wave-animation-2 {
          animation: mobileWaveSlide 1s ease-out 0.3s both;
        }
        
        .mobile-wave-animation-3 {
          animation: mobileWaveSlide 1s ease-out 0.5s both;
        }
        
        @keyframes formSlideInDesktop {
          0% {
            opacity: 0;
            transform: translateX(-50px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes formSlideInMobile {
          0% {
            opacity: 0;
            transform: translateY(50px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .form-animation {
          animation: formSlideInMobile 0.8s ease-out 0.8s both;
        }
        
        @media (min-width: 768px) {
          .form-animation {
            animation: formSlideInDesktop 0.8s ease-out 0.8s both;
          }
        }
      `}</style>
      {/* Side Wave 배경 - 화면 오른쪽에서 시작해서 절반을 채움 */}
      <div className="absolute inset-0 z-0 min-h-full">
        {/* 모바일 버전 - Mobile Wave 배경 */}
        <div className="block md:hidden">
          {/* Mobile Wave 1 - 첫 번째 레이어 */}
          <div className="absolute left-0 bottom-0 w-full max-h-[60vh] mobile-wave-animation-1">
            <img
              src={mobileWave1}
              alt="Mobile Wave 1"
              className="w-full h-full object-cover object-bottom"
            />
          </div>

          {/* Mobile Wave 2 - 두 번째 레이어 */}
          <div className="absolute left-0 bottom-0 w-full max-h-[50vh] mobile-wave-animation-2">
            <img
              src={mobileWave2}
              alt="Mobile Wave 2"
              className="w-full h-full object-cover object-bottom"
            />
          </div>

          {/* Mobile Wave 3 - 세 번째 레이어 */}
          <div className="absolute left-0 bottom-0 w-full max-h-[50vh] mobile-wave-animation-3">
            <img
              src={mobileWave3}
              alt="Mobile Wave 3"
              className="w-full h-full object-cover object-bottom"
            />
          </div>
        </div>

        {/* 데스크톱 버전 - Side Wave 배경 */}
        <div className="hidden md:block min-h-full">
          {/* Side Wave 1 - 첫 번째 레이어 */}
          <div className="absolute left-0 top-0 w-3/5 min-h-screen h-full wave-animation-1">
            <img
              src={sideWave1}
              alt="Side Wave 1"
              className="w-full h-full min-h-screen object-cover object-right transform scale-x"
            />
          </div>

          {/* Side Wave 2 - 두 번째 레이어 */}
          <div className="absolute left-0 top-0 w-2/5 min-h-screen h-full wave-animation-2">
            <img
              src={sideWave2}
              alt="Side Wave 2"
              className="w-full h-full min-h-screen object-cover object-right transform scale-x"
            />
          </div>

          {/* Side Wave 3 - 세 번째 레이어 */}
          <div className="absolute left-0 top-0 w-1/5 min-h-screen h-full wave-animation-3">
            <img
              src={sideWave3}
              alt="Side Wave 3"
              className="w-full h-full min-h-screen object-cover object-right transform scale-x"
            />
          </div>
        </div>
      </div>

      {/* 로그인 폼 - 파도 위에 표시 */}
      <div className="relative z-[5] min-h-[calc(100vh-62px)] md:min-h-[calc(100vh-86px)] flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div
          className="w-[90%] 
            sm:w-[85%] 
            md:w-[75%] 
            lg:w-[65%] 
            xl:w-[55%] 
            2xl:w-[50%]
            max-w-[500px]
            form-animation"
        >
          <LoginForm onSignUpClick={handleSignUpClick} />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
