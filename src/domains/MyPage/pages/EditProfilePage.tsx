import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

import { Button } from '@/components/Button';
import { Breadcrumb } from '@/components/Breadcrumb';
import { editUserInfo, getUserInfo } from '@/domains/MyPage/api/profile';
import type { UserInfoApi } from '@/domains/MyPage/types/profile';
import { LoadingSpinner } from '@/domains/MyPage/components/LoadingSpinner';

interface FloatingInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  readOnly?: boolean;
  disabled?: boolean;
}

const FloatingInput = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  readOnly,
  disabled,
}: FloatingInputProps) => (
  <div>
    <div className="relative w-full group focus-within:text-gray-700">
      <input
        type={type}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        disabled={disabled}
        className={`peer w-full px-3 pt-5 placeholder-transparent focus:outline-none border-b border-gray-400 
        ${disabled ? 'bg-gray-100 cursor-not-allowed text-gray-500 h-[60px] pb-0' : 'pb-2 h-[50px]'}`}
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
  </div>
);

const EditProfilePage = () => {
  const [userInfoApi, setUserInfoApi] = useState<UserInfoApi>();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    nickname: '',
    // address: '',
    password: '',
    confirmPassword: '',
  });
  const [isValid, setIsValid] = useState(true);

  const navigate = useNavigate();

  // 초기 사용자 정보 로드
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const response = await getUserInfo();
        setUserInfoApi(response.data);
      } catch (error) {
        console.error('사용자 정보 로드 실패:', error);
        alert(
          '사용자 정보를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요',
        );
        navigate('/mypage/profile');
      }
    };

    loadUserInfo();
  }, []);
  console.log(userInfoApi);

  // 폼 유효성 검사
  const validateForm = useCallback((): boolean => {
    const newErrors = {
      nickname: '',
      address: '',
      password: '',
      confirmPassword: '',
    };

    let valid = true;

    if (!userInfoApi?.nickname.trim()) {
      newErrors.nickname = '닉네임을 입력해주세요.';
      valid = false;
    }

    if (!userInfoApi?.address.trim()) {
      newErrors.address = '주소를 입력해주세요.';
      valid = false;
    }

    if (!password.trim()) {
      newErrors.password = '비밀번호를 입력해주세요.';
      valid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
      valid = false;
    }

    setErrors(newErrors);
    setIsValid(valid); // 여기서 상태 업데이트
    return valid;
  }, [userInfoApi, password, confirmPassword]);

  useEffect(() => {
    validateForm();
  }, [userInfoApi, password, confirmPassword, validateForm]);

  // 사용자 정보 수정 처리
  const handleEditUserInfo = async () => {
    if (!userInfoApi) return;

    const isValid = validateForm();
    if (!isValid) return;

    setIsLoading(true);
    try {
      await editUserInfo(userInfoApi.nickname, userInfoApi.address, password);
      navigate('/mypage/profile');
    } catch (error) {
      console.error('사용자 정보 수정 실패:', error);
      alert('수정에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  // 닉네임 업데이트
  const handleNicknameChange = (value: string) => {
    setUserInfoApi((prev) => (prev ? { ...prev, nickname: value } : undefined));
  };

  // // 주소 업데이트 (향후 추가될 경우를 위해)
  // const handleAddressChange = (value: string) => {
  //   setUserInfoApi((prev) => (prev ? { ...prev, address: value } : undefined));
  // };

  // 이전 페이지로 이동
  const handleGoBack = () => {
    navigate('/mypage/profile');
  };

  return (
    <div className="w-full max-w-[1050px] m-6">
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
        <div className="flex flex-col gap-5 max-w-[700px] w-full">
          <FloatingInput
            id="email"
            label="이메일"
            value={userInfoApi?.email || ''}
            onChange={() => {}} // 변경 불가 처리
            readOnly
            disabled
          />

          {/* 닉네임 입력 */}
          <FloatingInput
            id="nickname"
            label="닉네임"
            value={userInfoApi?.nickname || ''}
            onChange={handleNicknameChange}
            error={errors.nickname}
          />

          {/* 주소 입력 (현재 코드에는 없지만 API에 있으므로 추가)
          <FloatingInput
            id="address"
            label="주소"
            value={userInfoApi?.address || ''}
            onChange={handleAddressChange}
            error={errors.address}
          /> */}

          {/* 비밀번호 입력 */}
          <FloatingInput
            id="password"
            label="새 비밀번호"
            type="password"
            value={password}
            onChange={setPassword}
            error={errors.password}
          />

          {/* 비밀번호 확인 입력 */}
          <FloatingInput
            id="confirmPassword"
            label="새 비밀번호 확인"
            type="password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            error={errors.confirmPassword}
          />

          {/* 버튼 그룹 */}
          <div className="flex gap-5">
            <Button
              fullWidth
              variant="secondary"
              height="42px"
              onClick={handleGoBack}
            >
              취소
            </Button>
            <Button
              fullWidth
              height="42px"
              onClick={handleEditUserInfo}
              disabled={isLoading || !isValid}
            >
              {isLoading ? <LoadingSpinner /> : '수정하기'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
