import { useState } from 'react';
import { CircleCheck, Eye, EyeClosed } from 'lucide-react';
import { validateEmail, validatePassword } from '../utils/validation';
import { checkNicknameDuplicate } from '../api/signUpApi';
import { useSignUp } from '../hooks/useSignUp';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/Button';

const SignUpForm = ({ onBackToLogin }: { onBackToLogin?: () => void }) => {
  //이름, 성별 정보 상태 관리
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | null>(null);

  //이메일 상태 관리
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [emailTouched, setEmailTouched] = useState(false); // 사용자가 필드를 건드린 상태 추적

  //닉네임 상태 관리
  const [nickname, setNickname] = useState('');
  const [isNicknameDuplicate, setIsNicknameDuplicate] = useState(false);
  const [nicknameTouched, setNicknameTouched] = useState(false);

  //비밀번호 상태 관리
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 비밀번호 표시/숨김 상태
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // 비밀번호 확인 표시/숨김 상태

  //외부 훅 및 유틸리티
  const { signUp, loading } = useSignUp();
  const navigate = useNavigate();

  const isPasswordMatch = password !== '' && password === confirmPassword;
  const isConfirmPasswordDisabled = passwordError !== '' || password === '';

  // === 이메일 관련 핸들러들 ===
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
    validateEmailField();
  };

  // === 닉네임 관련 핸들러들 ===
  const handleNicknameBlur = async () => {
    setNicknameTouched(true);
    const res = await checkNicknameDuplicate(nickname);
    setIsNicknameDuplicate(res.data);
  };

  // === 비밀번호 관련 핸들러들 ===
  const handlePasswordChange = (val: string) => {
    const trimmedValue = val.replace(/\s/g, '');
    setPassword(trimmedValue);
  };

  const validatePasswordField = () => {
    const error = validatePassword(password);
    setPasswordError(error);
    return !error;
  };

  const handlePasswordBlur = () => {
    setPasswordTouched(true);
    validatePasswordField();
  };

  // === 비밀번호 확인 관련 핸들러들 ===
  const handleConfirmPasswordChange = (val: string) => {
    const trimmedValue = val.replace(/\s/g, '');
    setConfirmPassword(trimmedValue);
  };

  const handleConfirmPasswordBlur = () => {
    setConfirmPasswordTouched(true);
  };

  //폼 제출 핸들러
  // - 모든 필드의 유효성을 최종 검증
  // - 서버에 회원가입 요청 전송
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. 필수 필드 검증
    if (
      !name ||
      !gender ||
      !email ||
      !nickname ||
      !password ||
      !confirmPassword
    ) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    // 2. 아직 검증되지 않은 필드들을 검증 (사용자가 blur 이벤트 없이 제출한 경우)
    if (!emailTouched) {
      setEmailTouched(true);
      if (!validateEmailField()) {
        alert('이메일 형식이 올바르지 않아요.');
        return;
      }
    }

    if (!passwordTouched) {
      setPasswordTouched(true);
      if (!validatePasswordField()) {
        alert(
          '비밀번호가 조건을 만족하지 않습니다. 최소 8자 이상, 영문자, 숫자, 특수문자를 포함하고 연속된 숫자 3개 이상은 사용할 수 없습니다.',
        );
        return;
      }
    }

    if (!confirmPasswordTouched) {
      setConfirmPasswordTouched(true);
    }

    // 3. 최종 유효성 검사
    if (
      !isEmailValid ||
      isNicknameDuplicate ||
      passwordError ||
      !isPasswordMatch
    ) {
      alert('입력값을 다시 확인해주세요.');
      return;
    }

    // 4. 회원가입 API 호출
    try {
      await signUp({ name, gender, email, nickname, password });
      alert('회원가입이 완료되었습니다!');
      if (onBackToLogin) {
        onBackToLogin();
      } else {
        navigate('/login');
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center py-8">
      <div className="bg-white rounded-3xl shadow-lg p-4 md:p-8 w-full border-4 border-[#64A8CD]">
        <h1 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-center">
          회원가입
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          {/* 이름 */}
          <div>
            <input
              type="text"
              placeholder="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-b-2 border-gray-300 pb-2 pr-[30%] text-sm md:text-base focus:border-[#64A8CD] focus:outline-none bg-transparent"
              required
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

          {/* 이메일 */}
          <div>
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              onBlur={handleEmailBlur}
              className="w-full border-b-2 border-gray-300 pb-2 pr-[30%] text-sm md:text-base focus:border-[#64A8CD] focus:outline-none bg-transparent"
            />
            <div className="h-4 mt-1">
              {!isEmailValid && emailTouched && email.trim() !== '' && (
                <div className="text-[10px] md:text-xs text-dangerRed">
                  올바른 이메일 형식을 입력해주세요
                </div>
              )}
            </div>
          </div>

          {/* 닉네임 입력 필드 - 중복 확인 포함 */}
          <div>
            <input
              type="text"
              placeholder="닉네임"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onBlur={handleNicknameBlur}
              className="w-full border-b-2 border-gray-300 pb-2 pr-[30%] text-sm md:text-base focus:border-[#64A8CD] focus:outline-none bg-transparent"
            />
            <div className="h-4 mt-1">
              {isNicknameDuplicate &&
                nicknameTouched &&
                nickname.trim() !== '' && (
                  <div className="text-[10px] md:text-xs text-dangerRed">
                    사용중인 닉네임이에요
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
                className="w-full border-b-2 border-gray-300 pb-2 pr-[35%] text-sm md:text-base focus:border-[#64A8CD] focus:outline-none bg-transparent"
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
                className={`w-full border-b-2 pb-2 pr-[35%] text-sm md:text-base focus:outline-none bg-transparent ${
                  isConfirmPasswordDisabled
                    ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'border-gray-300 focus:border-[#64A8CD]'
                }`}
              />
              {/* 비밀번호 확인 표시/숨김 토글 버튼 - 비밀번호가 일치하지 않을 때만 표시 */}
              {!(isPasswordMatch && confirmPassword && !passwordError) && (
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isConfirmPasswordDisabled}
                  className={`absolute right-0 top-1/2 -translate-y-1/2 transition-colors ${
                    isConfirmPasswordDisabled
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-400 hover:text-[#64A8CD]'
                  }`}
                >
                  {showConfirmPassword ? (
                    <EyeClosed size={16} className="md:w-5 md:h-5" />
                  ) : (
                    <Eye size={16} className="md:w-5 md:h-5" />
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
        <div className="text-center mt-4 md:mt-6">
          <span className="text-gray-600 text-xs md:text-sm">
            이미 회원이신가요?{' '}
          </span>
          <button
            type="button"
            onClick={() =>
              onBackToLogin ? onBackToLogin() : navigate('/login')
            }
            className="text-[#64A8CD] underline text-xs md:text-sm bg-transparent border-none cursor-pointer"
          >
            로그인하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
