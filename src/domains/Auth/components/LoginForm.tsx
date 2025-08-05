import { useEffect, useState } from 'react';
import { Eye, EyeClosed } from 'lucide-react';
import { validateEmail } from '../utils/validation';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/Button';
import { useLogin } from '../hooks/useLogin';
import { useAuthStore } from '@/store/useAuthStore';
import { openKakaoLogin, openKakaoSignup } from '@/domains/Auth/api/loginApi';
import { Modal } from '@/components/Modal';
import { Ring } from 'ldrs/react';
import 'ldrs/react/Ring.css';

const LoginForm = ({ onSignUpClick }: { onSignUpClick?: () => void }) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  // 폼 상태 통합 관리
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  // 유효성 검사 상태
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [emailTouched, setEmailTouched] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isKakaoSubmit, setIsKakaoSubmit] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);
  const [kakaoSignupToken, setKakaoSignupToken] = useState('');

  // 로그인 관련
  const { login, loading } = useLogin();

  // 통합 폼 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrorMessage(''); // 전역 에러 메시지 초기화

    // 각 필드별 에러 메시지 초기화
    if (name === 'email') {
      setEmailError('');
    } else if (name === 'password') {
      setPasswordError('');
    }
  };

  const validateEmailField = () => {
    const valid = validateEmail(form.email);
    setIsEmailValid(valid);
    if (!valid && form.email.trim() !== '') {
      setEmailError('올바른 이메일 형식을 입력해주세요');
    } else {
      setEmailError('');
    }
    return valid;
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
    if (form.email.trim() !== '') {
      validateEmailField();
    }
  };

  const location = useLocation();

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 에러 상태 초기화
    setEmailError('');
    setPasswordError('');
    setErrorMessage('');

    let hasError = false;

    // 1. 필수 필드 검증
    if (!form.email.trim()) {
      setEmailError('이메일을 입력해주세요.');
      hasError = true;
    } else if (!validateEmailField()) {
      setEmailError('올바른 이메일 형식을 입력해주세요.');
      hasError = true;
    }

    if (!form.password.trim()) {
      setPasswordError('비밀번호를 입력해주세요.');
      hasError = true;
    }

    // 에러가 있으면 제출 중단
    if (hasError) {
      return;
    }

    try {
      const result = await login({
        email: form.email,
        password: form.password,
      });

      // 로그인 성공 시 Zustand 상태 변경
      useAuthStore.getState().setIsLoggedIn(true);
      useAuthStore.getState().setToken(result.data.token);
      const params = new URLSearchParams(location.search);
      const redirectPath = params.get('redirect') || '/map';
      setTimeout(() => navigate(redirectPath, { replace: true }), 0);
    } catch (error) {
      console.error('로그인 실패:', error);
      setErrorMessage(
        '로그인에 실패했어요. 이메일과 비밀번호를 다시 확인해주세요',
      );
    }
  };

  useEffect(() => {
    if (!isKakaoSubmit) return;
    const messageHandler = async (event: MessageEvent) => {
      try {
        if (event.data?.token) {
          if (event.data.result === 'login success') {
            localStorage.setItem('authToken', event.data.token);
            localStorage.setItem('isKakao', 'true');
            useAuthStore.getState().setIsLoggedIn(true);
            useAuthStore.getState().setToken(event.data.token);
            navigate('/');
          } else if (event.data.result === 'signup required') {
            setKakaoSignupToken(event?.data.token);
            handleKakaoSignup();
          }
        } else if (event.data.statusCode === 20003) {
          setErrorMessage(
            '이미 카카오 계정과 같은 이메일로 가입된 계정이 있어요.',
          );
        }
      } catch (error) {
        setErrorMessage(
          '카카오 로그인 중 오류가 발생했어요. 잠시 후 다시 시도해주세요',
        );
        console.error(error);

        setIsKakaoSubmit(false);
      }
    };

    window.addEventListener('message', messageHandler);

    return () => {
      window.removeEventListener('message', messageHandler);
    };
  }, [isKakaoSubmit, navigate]);

  // 카카오 로그인 핸들러
  const handleKakaoLogin = async () => {
    await openKakaoLogin();
    setIsKakaoSubmit(true);
  };

  const handleKakaoSignup = async () => {
    setIsOpen(true);
  };

  const onConfirm = async () => {
    setIsConfirmLoading(true);
    try {
      const res = await openKakaoSignup(kakaoSignupToken);
      localStorage.setItem('authToken', res.data.token);
      localStorage.setItem('isKakao', 'true');
      useAuthStore.getState().setIsLoggedIn(true);
      useAuthStore.getState().setToken(res.data.token);
      navigate('/');
    } catch (err) {
      console.error('카카오 회원가입 실패:', err);
      setErrorMessage(
        '카카오 회원가입에 실패했어요. 잠시 후 다시 시도해주세요',
      );
    } finally {
      setIsConfirmLoading(false);
      setIsOpen(false);
    }
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="w-full flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-lg p-4 md:p-8 w-full border-4 border-[#64A8CD]">
        <h1 className="text-xl md:text-2xl font-bold mb-3 text-center text-gray-700">
          로그인
        </h1>

        {/* 로그인 실패 에러 메시지 - 고정 공간 */}
        <div className="h-6 mb-3 flex items-center justify-center">
          {errorMessage && (
            <div className="text-xs md:text-sm text-dangerRed text-center px-4">
              {errorMessage}
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 md:space-y-6"
          noValidate
        >
          {/* 이메일 */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="이메일"
              value={form.email}
              onChange={handleChange}
              onBlur={handleEmailBlur}
              className="w-full border-b-[3px] border-gray-300 pb-2 pr-[30%] text-sm md:text-base focus:border-[#1CB0F7] focus:outline-none bg-transparent transition-all duration-200"
            />
            {/* 에러 메시지를 위한 고정 공간 (16px 높이) */}
            <div className="h-4 mt-1">
              {(emailError ||
                (!isEmailValid &&
                  emailTouched &&
                  form.email.trim() !== '')) && (
                <div className="text-[10px] md:text-xs text-dangerRed">
                  {emailError || '올바른 이메일 형식을 입력해주세요'}
                </div>
              )}
            </div>
          </div>

          {/* 비밀번호 */}
          <div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="비밀번호"
                autoComplete="off"
                value={form.password}
                onChange={handleChange}
                className="w-full border-b-[3px] border-gray-300 pb-2 pr-[35%] text-sm md:text-base focus:border-[#1CB0F7] focus:outline-none bg-transparent transition-all duration-200"
              />
              {/* 비밀번호 표시/숨김 토글 버튼 */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#64A8CD] transition-colors"
              >
                {showPassword ? (
                  <Eye size={16} className="md:w-5 md:h-5" />
                ) : (
                  <EyeClosed size={16} className="md:w-5 md:h-5" />
                )}
              </button>
            </div>
            {/* 에러 메시지를 위한 고정 공간 (16px 높이) */}
            <div className="h-4 mt-1">
              {passwordError && (
                <div className="text-[10px] md:text-xs text-dangerRed">
                  {passwordError}
                </div>
              )}
            </div>
          </div>

          {/* 로그인 버튼 */}
          <div className="pt-1">
            <Button
              type="submit"
              disabled={loading}
              variant="primary"
              size="lg"
              fullWidth
              shadowColor="bg-[#538CAC]"
              className="!bg-[#64A8CD] hover:!bg-[#5B9BC4] disabled:!bg-[#B3D4EA] !text-sm md:!text-base"
            >
              {loading ? '로그인 중...' : '로그인'}
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
            shadowColor="bg-[#538CAC]"
            className="!bg-white !text-[#64A8CD] !border-2 !border-[#64A8CD] hover:!bg-gray-100 hover:!text-[#64A8CD] !text-sm md:!text-base !h-[44px]"
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
            variant="primary"
            size="lg"
            fullWidth
            shadowColor="bg-[#CAB700]"
            className="!bg-[#FEE500] hover:!bg-[#FFEB3B] !text-gray-700 !text-sm md:!text-base font-medium"
          >
            카카오 로그인
          </Button>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="카카오 회원가입"
        description={
          <>
            처음 카카오 계정으로 로그인 하시는군요!
            <br />
            회원가입 하기 버튼을 누르면 회원가입이 자동으로 진행돼요.
          </>
        }
        actions={
          <>
            <Button variant="secondary" fullWidth onClick={onClose}>
              취소
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={onConfirm}
              disabled={isConfirmLoading}
              loading={isConfirmLoading}
            >
              {isConfirmLoading ? (
                <div className="flex">
                  <Ring
                    size="24"
                    stroke="3"
                    bgOpacity="0"
                    speed="2"
                    color="white"
                  />
                </div>
              ) : (
                '회원가입 하기'
              )}
            </Button>
          </>
        }
      ></Modal>
    </div>
  );
};

export default LoginForm;
