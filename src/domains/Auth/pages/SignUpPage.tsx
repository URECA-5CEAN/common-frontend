import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignUpForm from '../components/SignUpForm';
import SignUpAgreementForm from '../components/SignUpAgreementForm';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'agreement' | 'signup'>('agreement');

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const handleAgreementComplete = () => {
    setStep('signup');
  };

  const handleBackToAgreement = () => {
    setStep('agreement');
  };
  return (
    <div className="min-h-screen pt-[62px] md:pt-[86px] bg-white relative overflow-hidden">
      {/* Side Wave 배경 - 화면 오른쪽에서 시작해서 절반을 채움 */}
      <div className="absolute inset-0 z-0">
        {/* 모바일 버전 - Mobile Wave 배경 */}
        <div className="block md:hidden">
          {/* Mobile Wave 1 - 첫 번째 레이어 */}
          <div className="absolute left-0 bottom-0 w-full max-h-[60vh]">
            <img
              src="/src/assets/image/mobile-wave1.svg"
              alt="Mobile Wave 1"
              className="w-full h-auto max-h-[60vh] object-cover object-bottom"
            />
          </div>

          {/* Mobile Wave 2 - 두 번째 레이어 */}
          <div className="absolute left-0 bottom-0 w-full max-h-[50vh]">
            <img
              src="/src/assets/image/mobile-wave2.svg"
              alt="Mobile Wave 2"
              className="w-full h-auto max-h-[50vh] object-cover object-bottom"
            />
          </div>

          {/* Mobile Wave 3 - 세 번째 레이어 */}
          <div className="absolute left-0 bottom-0 w-full max-h-[50vh]">
            <img
              src="/src/assets/image/mobile-wave3.svg"
              alt="Mobile Wave 3"
              className="w-full h-auto max-h-[50vh] object-cover object-bottom"
            />
          </div>
        </div>

        {/* 데스크톱 버전 - Side Wave 배경 */}
        <div className="hidden md:block">
          {/* Side Wave 1 - 첫 번째 레이어 */}
          <div className="absolute right-0 top-0 w-3/5 h-screen">
            <img
              src="/src/assets/image/side-wave1.svg"
              alt="Side Wave 1"
              className="w-full h-full object-cover object-right transform scale-x-[-1]"
            />
          </div>

          {/* Side Wave 2 - 두 번째 레이어 */}
          <div className="absolute right-0 top-0 w-2/5 h-screen">
            <img
              src="/src/assets/image/side-wave2.svg"
              alt="Side Wave 2"
              className="w-full h-full object-cover object-right transform scale-x-[-1]"
            />
          </div>

          {/* Side Wave 3 - 세 번째 레이어 */}
          <div className="absolute right-0 top-0 w-1/5 h-screen">
            <img
              src="/src/assets/image/side-wave3.svg"
              alt="Side Wave 3"
              className="w-full h-full object-cover object-right transform scale-x-[-1]"
            />
          </div>
        </div>
      </div>

      {/* 폼 - 파도 위에 표시 */}
      <div className="relative z-[5] pt-20 md:pt-48 px-4">
        <div className="w-full max-w-[300px] md:max-w-[500px] mx-auto">
          {step === 'agreement' ? (
            <SignUpAgreementForm onNext={handleAgreementComplete} />
          ) : (
            <SignUpForm
              onBackToLogin={handleBackToLogin}
              onBack={handleBackToAgreement}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
