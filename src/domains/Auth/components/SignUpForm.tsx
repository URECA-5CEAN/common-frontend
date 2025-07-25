import { useState } from 'react';
import { ArrowLeft, CircleCheck, Eye, EyeClosed } from 'lucide-react';
import { validateEmail, validatePassword } from '../utils/validation';
import { useSignUp } from '../hooks/useSignUp';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/Button';

const SignUpForm = ({
  onBackToLogin,
  onBack,
}: {
  onBackToLogin?: () => void;
  onBack?: () => void;
}) => {
  // 기본 정보 상태
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | null>(null);

  // 이메일 상태
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [emailTouched, setEmailTouched] = useState(false);
  const [isEmailDuplicate, setIsEmailDuplicate] = useState(false);
  const [emailCheckLoading, setEmailCheckLoading] = useState(false);
  const [emailChecked, setEmailChecked] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');

  // 닉네임 상태
  const [nickname, setNickname] = useState('');
  const [isNicknameDuplicate, setIsNicknameDuplicate] = useState(false);
  const [nicknameTouched, setNicknameTouched] = useState(false);
  const [nicknameCheckLoading, setNicknameCheckLoading] = useState(false);
  const [nicknameChecked, setNicknameChecked] = useState(false);

  // 비밀번호 상태
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 외부 훅 및 유틸리티
  const {
    signUp: handleSignUpAPI,
    checkNickname,
    checkEmail,
    loading,
  } = useSignUp();
  const navigate = useNavigate();

  // 계산된 값들
  const isPasswordMatch = password !== '' && password === confirmPassword;
  const isConfirmPasswordDisabled = passwordError !== '' || password === '';

  // 이메일 핸들러
  const checkEmailDuplicate = async (showAlert = false) => {
    if (!email.trim()) {
      if (showAlert) {
        setEmailErrorMessage('이메일을 입력해주세요.');
      }
      return;
    }

    // 이메일 형식 검증
    if (!validateEmail(email)) {
      if (showAlert) {
        setEmailErrorMessage('올바른 이메일 형식을 입력해주세요.');
      }
      return;
    }

    try {
      if (showAlert) {
        setEmailCheckLoading(true);
        setEmailErrorMessage('');
      }
      const res = await checkEmail(email);
      setIsEmailDuplicate(res.data);
      setEmailTouched(true);

      if (showAlert) {
        setEmailChecked(true);
        if (res.data) {
          setEmailErrorMessage(
            '이미 사용중인 이메일입니다. 다른 이메일을 입력해주세요.',
          );
        } else {
          setEmailErrorMessage('');
        }
      }
    } catch (error) {
      console.error('이메일 중복 확인 오류:', error);
      if (showAlert) {
        setEmailErrorMessage(
          '이메일 중복 확인 중 오류가 발생했습니다. 다시 시도해주세요.',
        );
      }
    } finally {
      if (showAlert) {
        setEmailCheckLoading(false);
      }
    }
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
    const valid = validateEmail(email);
    setIsEmailValid(valid);
    checkEmailDuplicate(false);
  };

  const handleEmailCheck = () => {
    checkEmailDuplicate(true);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setEmailChecked(false);
    setIsEmailDuplicate(false);
    setEmailErrorMessage('');
  };

  // 닉네임 핸들러
  const checkNicknameDuplicate = async (showAlert = false) => {
    if (!nickname.trim()) {
      return;
    }

    try {
      if (showAlert) {
        setNicknameCheckLoading(true);
      }
      const res = await checkNickname(nickname);
      setIsNicknameDuplicate(res.data);
      setNicknameTouched(true);

      if (showAlert) {
        setNicknameChecked(true);
      }
    } catch (error) {
      console.error('닉네임 중복 확인 오류:', error);
    } finally {
      if (showAlert) {
        setNicknameCheckLoading(false);
      }
    }
  };

  const handleNicknameCheck = () => {
    checkNicknameDuplicate(true);
  };

  const handleNicknameChange = (value: string) => {
    setNickname(value);
    setNicknameChecked(false);
    setIsNicknameDuplicate(false);
  };

  // 비밀번호 핸들러
  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val.replace(/\s/g, ''));
  };

  const handlePasswordBlur = () => {
    setPasswordTouched(true);
    const error = validatePassword(password);
    setPasswordError(error);
  };

  const handleConfirmPasswordChange = (val: string) => {
    setConfirmPassword(val.replace(/\s/g, ''));
  };

  const handleConfirmPasswordBlur = () => {
    setConfirmPasswordTouched(true);
  };

  // 폼 검증
  const validateAllFields = () => {
    if (
      !name ||
      !gender ||
      !email ||
      !nickname ||
      !password ||
      !confirmPassword
    ) {
      return false;
    }

    if (!emailChecked || !nicknameChecked) {
      return false;
    }

    if (!emailTouched) {
      setEmailTouched(true);
      const valid = validateEmail(email);
      setIsEmailValid(valid);
      if (!valid) return false;
    }

    if (!passwordTouched) {
      setPasswordTouched(true);
      const error = validatePassword(password);
      setPasswordError(error);
      if (error) return false;
    }

    if (!confirmPasswordTouched) {
      setConfirmPasswordTouched(true);
    }

    return !(
      !isEmailValid ||
      isEmailDuplicate ||
      isNicknameDuplicate ||
      passwordError ||
      !isPasswordMatch
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAllFields()) return;

    try {
      await handleSignUpAPI({
        name,
        gender: gender as 'male' | 'female',
        email,
        nickname,
        password,
      });

      if (onBackToLogin) {
        onBackToLogin();
      } else {
        navigate('/login');
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : '회원가입 중 오류가 발생했습니다.';
      alert(errorMessage);
    }
  };

  return (
    <div className="w-full flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-lg p-4 md:p-8 w-full border-4 border-[#64A8CD]">
        <h1 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-center text-gray-700">
          회원가입
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 md:space-y-6"
          noValidate
        >
          {/* 이름 */}
          <div>
            <input
              type="text"
              placeholder="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-b-[3px] border-gray-300 pb-2 pr-[30%] text-sm md:text-base focus:border-[#1CB0F7] focus:outline-none bg-transparent transition-all duration-200"
            />
          </div>

          {/* 성별 선택 버튼 */}
          <div className="flex gap-2 md:gap-4">
            <button
              type="button"
              className={`flex-1 py-2 md:py-3 px-3 md:px-6 rounded-xl border-2 text-sm md:text-base font-medium transition-colors ${
                gender === 'male'
                  ? 'bg-[#64A8CD] text-white border-[#64A8CD]'
                  : 'border-[#64A8CD] text-[#64A8CD] bg-white'
              }`}
              onClick={() => setGender('male')}
            >
              남자
            </button>
            <button
              type="button"
              className={`flex-1 py-2 md:py-3 px-3 md:px-6 rounded-xl border-2 text-sm md:text-base font-medium transition-colors ${
                gender === 'female'
                  ? 'bg-[#64A8CD] text-white border-[#64A8CD]'
                  : 'border-[#64A8CD] text-[#64A8CD] bg-white'
              }`}
              onClick={() => setGender('female')}
            >
              여자
            </button>
          </div>

          {/* 이메일 입력 필드 - 중복 확인 포함 */}
          <div>
            <div className="relative">
              <input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                onBlur={handleEmailBlur}
                className="w-full border-b-[3px] border-gray-300 pb-2 pr-[35%] text-sm md:text-base focus:border-[#1CB0F7] focus:outline-none bg-transparent transition-all duration-200"
              />
              <button
                type="button"
                onClick={handleEmailCheck}
                disabled={emailCheckLoading || !email.trim()}
                className={`absolute right-0 top-0 text-xs md:text-sm px-3 py-1 rounded ${
                  emailCheckLoading || !email.trim()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#1CB0F7] text-white hover:bg-[#0ea5e9]'
                }`}
              >
                {emailCheckLoading ? '확인중...' : '중복확인'}
              </button>
            </div>
            <div className="h-4 mt-1">
              {!isEmailValid &&
                emailTouched &&
                email.trim() !== '' &&
                !emailErrorMessage && (
                  <div className="text-[10px] md:text-xs text-dangerRed">
                    올바른 이메일 형식을 입력해주세요
                  </div>
                )}
              {emailChecked &&
                !isEmailDuplicate &&
                email.trim() !== '' &&
                isEmailValid &&
                !emailErrorMessage && (
                  <div className="text-[10px] md:text-xs text-green-600">
                    사용 가능한 이메일입니다
                  </div>
                )}
              {emailErrorMessage && (
                <div className="text-[10px] md:text-xs text-dangerRed">
                  {emailErrorMessage}
                </div>
              )}
            </div>
          </div>

          {/* 닉네임 입력 필드 - 중복 확인 포함 */}
          <div>
            <div className="relative">
              <input
                type="text"
                placeholder="닉네임"
                value={nickname}
                onChange={(e) => handleNicknameChange(e.target.value)}
                className="w-full border-b-[3px] border-gray-300 pb-2 pr-[35%] text-sm md:text-base focus:border-[#1CB0F7] focus:outline-none bg-transparent transition-all duration-200"
              />
              <button
                type="button"
                onClick={handleNicknameCheck}
                disabled={nicknameCheckLoading || !nickname.trim()}
                className={`absolute right-0 top-0 text-xs md:text-sm px-3 py-1 rounded ${
                  nicknameCheckLoading || !nickname.trim()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#1CB0F7] text-white hover:bg-[#0ea5e9]'
                }`}
              >
                {nicknameCheckLoading ? '확인중...' : '중복확인'}
              </button>
            </div>
            <div className="h-4 mt-1">
              {isNicknameDuplicate &&
                nicknameTouched &&
                nickname.trim() !== '' && (
                  <div className="text-[10px] md:text-xs text-dangerRed">
                    사용중인 닉네임이에요
                  </div>
                )}
              {nicknameChecked &&
                !isNicknameDuplicate &&
                nickname.trim() !== '' && (
                  <div className="text-[10px] md:text-xs text-green-600">
                    사용 가능한 닉네임입니다
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
                onBlur={handlePasswordBlur}
                autoComplete="off"
                className="w-full border-b-[3px] border-gray-300 pb-2 pr-[35%] text-sm md:text-base focus:border-[#1CB0F7] focus:outline-none bg-transparent transition-all duration-200"
              />
              {/* 비밀번호 표시/숨김 토글 버튼 */}
              <button
                type="button"
                onClick={() => togglePasswordVisibility('password')}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#64A8CD] transition-colors"
              >
                {showPassword ? (
                  <Eye size={16} className="md:w-5 md:h-5" />
                ) : (
                  <EyeClosed size={16} className="md:w-5 md:h-5" />
                )}
              </button>
            </div>
            <div className="h-4 mt-1">
              {passwordError && passwordTouched && password.trim() !== '' && (
                <div className="text-[10px] md:text-xs text-dangerRed">
                  {passwordError}
                </div>
              )}
            </div>
          </div>

          {/* 비밀번호 확인 입력 필드 - 일치 여부 확인 포함 */}
          <div>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="비밀번호 확인"
                value={confirmPassword}
                onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                onBlur={handleConfirmPasswordBlur}
                disabled={isConfirmPasswordDisabled}
                autoComplete="off"
                className={`w-full border-b-[3px] pb-2 pr-[35%] text-sm md:text-base focus:outline-none bg-transparent transition-all duration-200 ${
                  isConfirmPasswordDisabled
                    ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'border-gray-300 focus:border-[#1CB0F7]'
                }`}
              />
              {/* 비밀번호 확인 표시/숨김 토글 버튼 - 비밀번호가 일치하지 않을 때만 표시 */}
              {!(isPasswordMatch && confirmPassword && !passwordError) && (
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirmPassword')}
                  disabled={isConfirmPasswordDisabled}
                  className={`absolute right-0 top-1/2 -translate-y-1/2 transition-colors ${
                    isConfirmPasswordDisabled
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-400 hover:text-[#64A8CD]'
                  }`}
                >
                  {showConfirmPassword ? (
                    <Eye size={16} className="md:w-5 md:h-5" />
                  ) : (
                    <EyeClosed size={16} className="md:w-5 md:h-5" />
                  )}
                </button>
              )}
              {/* 비밀번호 일치 시 체크 아이콘 표시 */}
              {isPasswordMatch && confirmPassword && !passwordError && (
                <CircleCheck
                  className="text-[#64A8CD] absolute right-0 top-1/2 -translate-y-1/2"
                  size={16}
                />
              )}
            </div>
            <div className="h-4 mt-1">
              {/* 비밀번호 불일치 시 오류 메시지 표시 - 필드 아래에 배치 */}
              {!isPasswordMatch &&
                confirmPassword &&
                confirmPasswordTouched &&
                confirmPassword.trim() !== '' && (
                  <div className="text-[10px] md:text-xs text-dangerRed">
                    비밀번호가 일치하지 않아요
                  </div>
                )}
            </div>
          </div>

          {/* 회원가입 버튼 */}
          <div className="mt-6 md:mt-8 pt-1">
            <Button
              type="submit"
              disabled={loading}
              variant="primary"
              size="lg"
              fullWidth
              className="!bg-[#64A8CD] hover:!bg-[#5B9BC4] disabled:!bg-[#B3D4EA] !text-sm md:!text-base"
            >
              {loading ? '처리중...' : '회원가입'}
            </Button>
          </div>
        </form>

        {/* 로그인 페이지로 이동 링크 */}
        <div className="flex items-center justify-center gap-2 md:gap-8 mt-4 md:mt-6">
          {/* 이용약관으로 돌아가기 버튼 */}
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1 text-[#64A8CD] hover:text-[#5B9BC4] hover:bg-gray-200 transition-colors p-1 md:p-2 rounded-md"
              title="이용약관으로 돌아가기"
            >
              <ArrowLeft size={14} className="md:w-5 md:h-5" />
              <span className="text-xs md:text-sm whitespace-nowrap">
                뒤로가기
              </span>
            </button>
          )}

          <div className="text-center">
            <span className="text-gray-600 text-xs md:text-sm">
              이미 회원이신가요?{' '}
            </span>
            <button
              type="button"
              onClick={() =>
                onBackToLogin ? onBackToLogin() : navigate('/login')
              }
              className="text-[#64A8CD] underline text-xs md:text-sm bg-transparent border-none cursor-pointer hover:bg-gray-200 transition-colors px-2 py-2 rounded-md"
            >
              로그인하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
