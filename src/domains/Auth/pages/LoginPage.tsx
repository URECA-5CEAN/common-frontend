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
      {/* Side Wave 배경 - 화면 오른쪽에서 시작해서 절반을 채움 */}
      <div className="absolute inset-0 z-0 min-h-full">
        {/* 모바일 버전 - Mobile Wave 배경 */}
        <div className="block md:hidden">
          {/* Mobile Wave 1 - 첫 번째 레이어 */}
          <div
            className="absolute left-0 w-full h-[60vh]"
            style={{
              bottom: '-8px',
              animation:
                'slideUpMobile 1s ease-out 0.1s both, gentleFloat1 4s ease-in-out infinite 1.1s',
              transform: 'translateY(10px)',
            }}
          >
            <img
              src={mobileWave1}
              alt="Mobile Wave 1"
              className="w-full h-full object-cover object-bottom"
            />
          </div>

          {/* Mobile Wave 2 - 두 번째 레이어 */}
          <div
            className="absolute left-0 w-full h-[50vh]"
            style={{
              bottom: '-5px',
              animation:
                'slideUpMobile 1s ease-out 0.3s both, gentleFloat2 5s ease-in-out infinite 1.3s',
              transform: 'translateY(8px)',
            }}
          >
            <img
              src={mobileWave2}
              alt="Mobile Wave 2"
              className="w-full h-full object-cover object-bottom"
            />
          </div>

          {/* Mobile Wave 3 - 세 번째 레이어 */}
          <div
            className="absolute left-0 w-full h-[50vh]"
            style={{
              bottom: '-5px',
              animation:
                'slideUpMobile 1s ease-out 0.5s both, gentleFloat3 6s ease-in-out infinite 1.5s',
              transform: 'translateY(8px)',
            }}
          >
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
          <div
            className="absolute top-0 w-[60%] min-h-screen h-full"
            style={{
              left: '-12px',
              animation:
                'slideRightDesktop 1s ease-out 0.1s both, gentleFloatSide1 5s ease-in-out infinite 1.1s',
              transform: 'translateX(10px)',
            }}
          >
            <img
              src={sideWave1}
              alt="Side Wave 1"
              className="w-full h-full min-h-screen object-cover object-right transform scale-x"
            />
          </div>

          {/* Side Wave 2 - 두 번째 레이어 */}
          <div
            className="absolute top-0 w-[40%] min-h-screen h-full"
            style={{
              left: '-8px',
              animation:
                'slideRightDesktop 1s ease-out 0.3s both, gentleFloatSide2 6s ease-in-out infinite 1.3s',
              transform: 'translateX(8px)',
            }}
          >
            <img
              src={sideWave2}
              alt="Side Wave 2"
              className="w-full h-full min-h-screen object-cover object-right transform scale-x"
            />
          </div>

          {/* Side Wave 3 - 세 번째 레이어 */}
          <div
            className="absolute top-0 w-[25%] min-h-screen h-full"
            style={{
              left: '-5px',
              animation:
                'slideRightDesktop 1s ease-out 0.5s both, gentleFloatSide3 7s ease-in-out infinite 1.5s',
              transform: 'translateX(6px)',
            }}
          >
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
            max-w-[500px]"
          style={{
            animation: 'fadeInForm 0.8s ease-out 0.8s both',
          }}
        >
          <LoginForm onSignUpClick={handleSignUpClick} />
        </div>
      </div>

      <style>{`
        @keyframes slideUpMobile {
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
        
        @keyframes slideRightDesktop {
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
        
        @keyframes fadeInForm {
          0% {
            opacity: 0;
            transform: translateX(-50px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        /* 모바일 파도 애니메이션 - 상하로만 움직임 */
        @keyframes gentleFloat1 {
          0%, 100% {
            transform: translateY(0);
          }
          25% {
            transform: translateY(-8px);
          }
          50% {
            transform: translateY(-3px);
          }
          75% {
            transform: translateY(-6px);
          }
        }
        
        @keyframes gentleFloat2 {
          0%, 100% {
            transform: translateY(0);
          }
          33% {
            transform: translateY(-6px);
          }
          66% {
            transform: translateY(-8px);
          }
        }
        
        @keyframes gentleFloat3 {
          0%, 100% {
            transform: translateY(0);
          }
          20% {
            transform: translateY(-4px);
          }
          40% {
            transform: translateY(-8px);
          }
          60% {
            transform: translateY(-6px);
          }
          80% {
            transform: translateY(-3px);
          }
        }
        
        /* 데스크톱 파도 애니메이션 - 좌우로만 움직임 */
        @keyframes gentleFloatSide1 {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(6px);
          }
          50% {
            transform: translateX(-4px);
          }
          75% {
            transform: translateX(5px);
          }
        }
        
        @keyframes gentleFloatSide2 {
          0%, 100% {
            transform: translateX(0);
          }
          30% {
            transform: translateX(-6px);
          }
          70% {
            transform: translateX(5px);
          }
        }
        
        @keyframes gentleFloatSide3 {
          0%, 100% {
            transform: translateX(0);
          }
          20% {
            transform: translateX(4px);
          }
          40% {
            transform: translateX(-5px);
          }
          60% {
            transform: translateX(7px);
          }
          80% {
            transform: translateX(-4px);
          }
        }
        
        @media (max-width: 767px) {
          @keyframes fadeInForm {
            0% {
              opacity: 0;
              transform: translateY(50px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
