import { useState } from 'react';
import { Eye, EyeClosed } from 'lucide-react';
import { validateEmail } from '../utils/validation';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/Button';
import { useLogin } from '../hooks/useLogin';

const LoginForm = ({ onSignUpClick }: { onSignUpClick?: () => void }) => {
  // 이메일 상태 관리
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [emailTouched, setEmailTouched] = useState(false);

  // 비밀번호 상태 관리
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // 로딩 상태
  const { login, kakaoLogin, loading, error } = useLogin();

  const navigate = useNavigate();

  // 이메일 관련 핸들러들
  const handleEmailChange = (email: string) => {
    setEmail(email);
  };

  const validateEmailField = () => {
    const valid = validateEmail(email);
    setIsEmailValid(valid);
    return valid;
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
    if (email.trim() !== '') {
      validateEmailField();
    }
  };

  // 비밀번호 관련 핸들러들
  const handlePasswordChange = (password: string) => {
    setPassword(password);
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. 필수 필드 검증
    if (!email.trim() || !password.trim()) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    // 2. 이메일 유효성 검증
    if (!validateEmailField()) {
      alert('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    try {
      // 3. 로그인 API 호출
      await login({ email, password });

      alert('로그인이 완료되었습니다!');

      // 메인 페이지로 이동
      navigate('/');
    } catch (error) {
      console.error('로그인 실패:', error);
      // 에러는 useLogin 훅에서 이미 처리되므로 추가 알림 불필요
    }
  };

  // 카카오 로그인 핸들러
  const handleKakaoLogin = async () => {
    try {
      await kakaoLogin();
      alert('카카오 로그인이 완료되었습니다!');
      navigate('/');
    } catch (error) {
      console.error('카카오 로그인 실패:', error);
      // 에러는 useLogin 훅에서 이미 처리되므로 추가 알림 불필요
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-3xl shadow-lg p-4 md:p-8 w-full border-4 border-[#64A8CD]">
        <h1 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-center">
          로그인
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          {/* 이메일 */}
          <div>
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              onBlur={handleEmailBlur}
              className="w-full border-b-2 border-gray-300 pb-2 pr-[30%] text-sm md:text-base focus:border-[#64A8CD] focus:outline-none bg-transparent"
              required
            />
            <div className="h-4 mt-1">
              {!isEmailValid && emailTouched && email.trim() !== '' && (
                <div className="text-[10px] md:text-xs text-dangerRed">
                  올바른 이메일 형식을 입력해주세요
                </div>
              )}
            </div>
          </div>

          {/* 비밀번호 */}
          <div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="비밀번호"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                className="w-full border-b-2 border-gray-300 pb-2 pr-[35%] text-sm md:text-base focus:border-[#64A8CD] focus:outline-none bg-transparent"
                required
              />
              {/* 비밀번호 표시/숨김 토글 버튼 */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#64A8CD] transition-colors"
              >
                {showPassword ? (
                  <EyeClosed size={16} className="md:w-5 md:h-5" />
                ) : (
                  <Eye size={16} className="md:w-5 md:h-5" />
                )}
              </button>
            </div>
          </div>

          {/* 전역 에러 메시지 */}
          {error && (
            <div className="text-center">
              <div className="text-xs md:text-sm text-dangerRed">{error}</div>
            </div>
          )}

          {/* 로그인 버튼 */}
          <div className="mt-6 md:mt-8 pt-1">
            <Button
              type="submit"
              disabled={loading}
              variant="primary"
              size="lg"
              fullWidth
              className="!bg-[#64A8CD] hover:!bg-[#5B9BC4] disabled:!bg-[#B3D4EA] !text-sm md:!text-base"
            >
              {loading ? '처리중...' : '로그인'}
            </Button>
          </div>
        </form>

        {/* 회원가입 버튼 */}
        <div className="mt-4">
          <Button
            type="button"
            onClick={() =>
              onSignUpClick ? onSignUpClick() : navigate('/signup')
            }
            variant="primary"
            size="lg"
            fullWidth
            className="!bg-white !text-[#64A8CD] !border-2 !border-[#64A8CD] hover:!bg-[#64A8CD] hover:!text-white !text-sm md:!text-base"
          >
            회원가입
          </Button>
        </div>

        {/* 구분선 */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
        </div>

        {/* 카카오 로그인 버튼 */}
        <div className="mt-8">
          <Button
            type="button"
            onClick={handleKakaoLogin}
            size="lg"
            fullWidth
            className="!bg-[#FEE500] hover:!bg-[#FFEB3B] !text-black !text-sm md:!text-base font-medium rounded-full shadow-[0_4px_0_0_#d9b900]"
          >
            카카오 로그인
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
