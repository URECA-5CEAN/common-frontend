import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

import { Button } from '@/components/Button';
import { Breadcrumb } from '@/components/Breadcrumb';
import {
  editUserInfo,
  getNicknameDuplicate,
  getUserInfo,
} from '@/domains/MyPage/api/profile';
import type { UserInfoApi } from '@/domains/MyPage/types/profile';
import { Ring } from 'ldrs/react';
import 'ldrs/react/Ring.css';

// 상수 정의
const VALIDATION_RULES = {
  NICKNAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 10,
  },
  PASSWORD: {
    MIN_LENGTH: 4,
    MAX_LENGTH: 16,
  },
} as const;

const MEMBERSHIP_TYPES = ['우수', 'VIP', 'VVIP'] as const;

const ERROR_MESSAGES = {
  NICKNAME_REQUIRED: '닉네임을 입력해주세요.',
  NICKNAME_TOO_SHORT: '닉네임을 2자 이상 입력해주세요.',
  NICKNAME_DUPLICATE: '이미 사용중인 닉네임이에요',
  NICKNAME_AVAILABLE: '사용 가능한 닉네임이에요',
  PASSWORD_REQUIRED: '비밀번호를 입력해주세요.',
  PASSWORD_TOO_SHORT: '비밀번호를 4자 이상 입력해주세요.',
  PASSWORD_MISMATCH: '비밀번호가 일치하지 않습니다.',
  LOAD_USER_INFO_FAILED:
    '사용자 정보를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요',
  EDIT_USER_INFO_FAILED: '수정에 실패했습니다. 다시 시도해주세요.',
} as const;

// 타입 정의
interface ValidationResult {
  isValid: boolean;
  errorMessage: string;
}

interface FormErrors {
  nickname: string;
  password: string;
  confirmPassword: string;
}

interface FloatingInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  readOnly?: boolean;
  disabled?: boolean;
  maxLength?: number;
  nicknameDupMsg?: string;
}

// 컴포넌트 분리
const FloatingInput = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  readOnly,
  disabled,
  maxLength,
  nicknameDupMsg,
}: FloatingInputProps) => (
  <div>
    <div className="relative w-full group focus-within:text-gray-700">
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        disabled={disabled}
        className={`peer w-full px-3 pt-5 placeholder-transparent focus:outline-none border-b border-gray-400 
        ${disabled ? 'bg-gray-100 cursor-not-allowed text-gray-500 h-[60px] pb-0' : 'pb-2 h-[50px]'}`}
        placeholder={label}
        maxLength={maxLength}
      />

      <label
        htmlFor={id}
        className={`absolute left-3 top-0 text-gray-500 text-xs transition-all peer-placeholder-shown:top-[14px] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-xs cursor-text 
        ${disabled ? 'top-2' : ''}`}
      >
        {label}
      </label>
      <div className="absolute bottom-0 left-0 h-0.5 w-full bg-[#1CB0F7] transform scale-x-0 origin-center transition-transform duration-300 ease-in-out group-focus-within:scale-x-100" />
    </div>
    {error && <p className="text-red-500 text-sm mt-1 ml-1">{error}</p>}
    {nicknameDupMsg && (
      <p className="text-primaryGreen-80 text-sm mt-1 ml-1">{nicknameDupMsg}</p>
    )}
  </div>
);

const MembershipSelector = ({
  selectedMembership,
  onMembershipChange,
}: {
  selectedMembership?: string;
  onMembershipChange: (membership: string) => void;
}) => (
  <div className="flex gap-2 md:gap-4">
    {MEMBERSHIP_TYPES.map((membership) => (
      <button
        key={membership}
        type="button"
        className={`flex-1 py-1 px-3 md:px-6 rounded-xl border-2 text-sm md:text-base font-medium transition-colors cursor-pointer ${
          selectedMembership === membership
            ? 'bg-primaryGreen text-white border-primaryGreen hover:bg-[#75b5c0] hover:border-[#75b5c0]'
            : 'border-gray-200 text-gray-400 bg-white hover:bg-gray-100'
        }`}
        onClick={() => onMembershipChange(membership)}
      >
        {membership}
      </button>
    ))}
  </div>
);

const NicknameField = ({
  nickname,
  error,
  nicknameDupMsg,
  isNicknameValid,
  isNicknameLoading,
  onNicknameChange,
  onCheckNickname,
}: {
  nickname: string;
  error: string;
  nicknameDupMsg: string;
  isNicknameValid: boolean;
  isNicknameLoading: boolean;
  onNicknameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCheckNickname: () => void;
}) => (
  <div className="relative">
    <FloatingInput
      id="nickname"
      label={`닉네임 (${VALIDATION_RULES.NICKNAME.MIN_LENGTH}~${VALIDATION_RULES.NICKNAME.MAX_LENGTH}자 이내)`}
      value={nickname}
      onChange={onNicknameChange}
      error={error}
      maxLength={VALIDATION_RULES.NICKNAME.MAX_LENGTH}
      nicknameDupMsg={nicknameDupMsg}
    />
    <div className="absolute right-3 top-3">
      <Button
        width="84px"
        height="28px"
        type="button"
        onClick={onCheckNickname}
        disabled={!isNicknameValid || isNicknameLoading}
        loading={!isNicknameValid || isNicknameLoading}
        className={`text-xs md:text-sm ${
          !isNicknameValid
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-primaryGreen text-white hover:bg-[#0ea5e9]'
        }`}
      >
        {isNicknameLoading ? (
          <div className="flex">
            <Ring size="16" stroke="3" bgOpacity="0" speed="2" color="white" />
          </div>
        ) : (
          '중복확인'
        )}
      </Button>
    </div>
  </div>
);

// 유틸리티 함수들
const createValidationResult = (
  isValid: boolean,
  errorMessage: string = '',
): ValidationResult => ({
  isValid,
  errorMessage,
});

const validateNicknameInput = (
  nickname: string,
  originalNickname: string,
): ValidationResult => {
  if (!nickname.trim()) {
    return createValidationResult(false, ERROR_MESSAGES.NICKNAME_REQUIRED);
  }

  if (nickname.length < VALIDATION_RULES.NICKNAME.MIN_LENGTH) {
    return createValidationResult(false, ERROR_MESSAGES.NICKNAME_TOO_SHORT);
  }

  if (originalNickname === nickname) {
    return createValidationResult(true);
  }

  return createValidationResult(true);
};

const validatePasswordInput = (password: string): ValidationResult => {
  if (!password.trim()) {
    return createValidationResult(false, ERROR_MESSAGES.PASSWORD_REQUIRED);
  }

  if (password.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
    return createValidationResult(false, ERROR_MESSAGES.PASSWORD_TOO_SHORT);
  }

  return createValidationResult(true);
};

const validateConfirmPasswordInput = (
  password: string,
  confirmPassword: string,
): ValidationResult => {
  if (password !== confirmPassword) {
    return createValidationResult(false, ERROR_MESSAGES.PASSWORD_MISMATCH);
  }

  return createValidationResult(true);
};

const shouldShowNicknameDuplicateButton = (
  nickname: string,
  originalNickname: string,
): boolean => {
  return (
    nickname !== originalNickname &&
    nickname.trim() !== '' &&
    nickname.length >= VALIDATION_RULES.NICKNAME.MIN_LENGTH
  );
};

// 메인 컴포넌트
const EditProfilePage = () => {
  // 상태 관리
  const [userInfo, setUserInfo] = useState<UserInfoApi>();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({
    nickname: '',
    password: '',
    confirmPassword: '',
  });
  const [isNicknameValid, setIsNicknameValid] = useState(false);
  const [originalNickname, setOriginalNickname] = useState('');
  const [nicknameDuplicateMessage, setNicknameDuplicateMessage] = useState('');
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  const [isKakao, setIsKakao] = useState(false);

  const navigate = useNavigate();

  // 사용자 정보 로드
  const loadUserInfo = async () => {
    try {
      const response = await getUserInfo();
      setUserInfo(response.data);
      setOriginalNickname(response.data.nickname);
    } catch (error) {
      console.error('사용자 정보 로드 실패:', error);
      alert(ERROR_MESSAGES.LOAD_USER_INFO_FAILED);
      navigate('/mypage/profile');
    }
  };

  // 에러 상태 업데이트
  const updateFormError = (field: keyof FormErrors, message: string) => {
    setFormErrors((prev) => ({ ...prev, [field]: message }));
  };

  // 닉네임 검증
  const validateAndUpdateNickname = (nickname: string) => {
    const validation = validateNicknameInput(nickname, originalNickname);
    const shouldShowButton = shouldShowNicknameDuplicateButton(
      nickname,
      originalNickname,
    );

    updateFormError('nickname', validation.errorMessage);
    setIsNicknameValid(shouldShowButton && validation.isValid);

    // 에러가 있으면 성공 메시지는 지우기
    if (validation.errorMessage) {
      setNicknameDuplicateMessage('');
    }

    return validation.isValid;
  };

  // 비밀번호 검증
  const validateAndUpdatePassword = (password: string) => {
    const validation = validatePasswordInput(password);
    updateFormError('password', validation.errorMessage);
    return validation.isValid;
  };

  // 비밀번호 확인 검증
  const validateAndUpdateConfirmPassword = (confirmPassword: string) => {
    const validation = validateConfirmPasswordInput(password, confirmPassword);
    updateFormError('confirmPassword', validation.errorMessage);
    return validation.isValid;
  };

  // 닉네임 중복 체크
  const checkNicknameDuplicate = async (): Promise<boolean> => {
    if (!userInfo?.nickname) return false;

    if (originalNickname === userInfo.nickname) {
      setIsNicknameValid(false);
      return true;
    }

    setIsCheckingNickname(true);

    try {
      const response = await getNicknameDuplicate(userInfo.nickname);

      if (response.data === true) {
        updateFormError('nickname', ERROR_MESSAGES.NICKNAME_DUPLICATE);
        return false;
      } else if (response.data === false) {
        setNicknameDuplicateMessage(ERROR_MESSAGES.NICKNAME_AVAILABLE);
        return true;
      }
    } catch (error) {
      console.error('닉네임 중복 체크 실패:', error);
      alert(ERROR_MESSAGES.EDIT_USER_INFO_FAILED);
    } finally {
      setIsCheckingNickname(false);
    }

    return false;
  };

  // 폼 제출 검증
  const validateForm = async (): Promise<boolean> => {
    if (!userInfo) return false;

    const isNicknameValid = validateAndUpdateNickname(userInfo.nickname);
    const isPasswordValid = validateAndUpdatePassword(password);
    const isConfirmPasswordValid =
      validateAndUpdateConfirmPassword(confirmPassword);
    const isNicknameDuplicateValid = await checkNicknameDuplicate();

    return (
      isNicknameValid &&
      isPasswordValid &&
      isConfirmPasswordValid &&
      isNicknameDuplicateValid
    );
  };

  // 사용자 정보 수정
  const submitUserInfoEdit = async () => {
    if (!userInfo) return;

    setIsSubmitting(true);

    try {
      await editUserInfo({
        nickname: userInfo.nickname,
        address: userInfo.address,
        password,
        membership: userInfo.membership,
      });
      navigate('/mypage/profile');
    } catch (error) {
      console.error('사용자 정보 수정 실패:', error);
      alert(ERROR_MESSAGES.EDIT_USER_INFO_FAILED);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 이벤트 핸들러들
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userInfo) return false;
    if (isKakao) {
      if (!userInfo) return;

      setIsSubmitting(true);
      try {
        await editUserInfo({
          membership: userInfo.membership,
        });
        navigate('/mypage/profile');
      } catch (error) {
        console.error('사용자 정보 수정 실패:', error);
        alert(ERROR_MESSAGES.EDIT_USER_INFO_FAILED);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      const isFormValid = await validateForm();
      if (isFormValid) {
        await submitUserInfoEdit();
      }
    }
  };

  const handleMembershipChange = (membership: string) => {
    setUserInfo((prev) => (prev ? { ...prev, membership } : undefined));
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNickname = e.target.value;
    setUserInfo((prev) =>
      prev ? { ...prev, nickname: newNickname } : undefined,
    );
    setNicknameDuplicateMessage('');
    validateAndUpdateNickname(newNickname);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validateAndUpdatePassword(newPassword);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    validateAndUpdateConfirmPassword(newConfirmPassword);
  };

  const handleGoBack = () => {
    navigate('/mypage/profile');
  };

  // 초기화
  useEffect(() => {
    loadUserInfo();
    const getIsKakao = localStorage.getItem('isKakao');

    if (originalNickname.includes('[Kakao]') || !!getIsKakao) {
      setIsKakao(!!getIsKakao);
    }
  }, [originalNickname]);

  return (
    <div className="w-[calc(100%-48px)] md:w-[80%] max-w-[1050px] mb-50 md:mb-50">
      <Breadcrumb title="마이페이지" subtitle="내 정보" />

      {/* 헤더 */}
      <div className="flex items-center mb-5 gap-2">
        <button
          className="p-2 cursor-pointer hover:bg-gray-200 rounded-lg transition-colors"
          onClick={handleGoBack}
          aria-label="이전 페이지로 이동"
        >
          <ChevronLeft />
        </button>
        <h1 className="text-2xl mt-3 mb-2 font-bold">내 정보 수정</h1>
      </div>

      {/* 폼 컨테이너 */}
      <div className="w-full flex justify-center">
        <form
          onSubmit={handleFormSubmit}
          className="flex flex-col gap-5 max-w-[700px] w-full"
        >
          <FloatingInput
            id="email"
            label="이메일"
            value={userInfo?.email || ''}
            onChange={() => {}}
            readOnly
            disabled
          />

          <MembershipSelector
            selectedMembership={userInfo?.membership}
            onMembershipChange={handleMembershipChange}
          />

          {isKakao ? (
            <FloatingInput
              id="nickname"
              label="닉네임"
              value={userInfo?.nickname || ''}
              onChange={() => {}}
              readOnly
              disabled
            />
          ) : (
            <NicknameField
              nickname={userInfo?.nickname || ''}
              error={formErrors.nickname}
              nicknameDupMsg={nicknameDuplicateMessage}
              isNicknameValid={isNicknameValid}
              isNicknameLoading={isCheckingNickname}
              onNicknameChange={handleNicknameChange}
              onCheckNickname={checkNicknameDuplicate}
            />
          )}

          {!isKakao && (
            <>
              <FloatingInput
                id="password"
                label={`새 비밀번호 (${VALIDATION_RULES.PASSWORD.MIN_LENGTH}~${VALIDATION_RULES.PASSWORD.MAX_LENGTH}자 이내)`}
                type="password"
                value={password}
                onChange={handlePasswordChange}
                error={formErrors.password}
                maxLength={VALIDATION_RULES.PASSWORD.MAX_LENGTH}
              />

              <FloatingInput
                id="confirmPassword"
                label="새 비밀번호 확인"
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                error={formErrors.confirmPassword}
                maxLength={VALIDATION_RULES.PASSWORD.MAX_LENGTH}
              />
            </>
          )}

          <div className="flex gap-5">
            <Button
              fullWidth
              variant="secondary"
              height="42px"
              onClick={handleGoBack}
              type="button"
            >
              취소
            </Button>
            <Button
              fullWidth
              height="42px"
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex">
                  <Ring
                    size="20"
                    stroke="3"
                    bgOpacity="0"
                    speed="2"
                    color="white"
                  />
                </div>
              ) : (
                '수정하기'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
