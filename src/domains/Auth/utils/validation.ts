//이메일 형식 검사. 올바르면 True, 아니면 false
export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

//비밀번호 유효성 검사. 올바르면 '' 반환
export const validatePassword = (password: string): string => {
  if (password.length < 8) {
    return '최소 8자 이상이어야 해요';
  }
  if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(password)) {
    return '영문자와 숫자 모두 포함되어야 해요';
  }
  if (!/[!@#$%^&*]/.test(password)) {
    return '특수문자 하나 이상 포함되어야 해요';
  }

  // 연속된 숫자 3자리 이상 체크 (ex: 123, 987...)
  for (let i = 0; i < password.length - 2; i++) {
    const char1 = password[i];
    const char2 = password[i + 1];
    const char3 = password[i + 2];

    if (/\d/.test(char1) && /\d/.test(char2) && /\d/.test(char3)) {
      const num1 = parseInt(char1);
      const num2 = parseInt(char2);
      const num3 = parseInt(char3);

      // 연속 증가 또는 연속 감소 체크
      if (
        (num2 === num1 + 1 && num3 === num2 + 1) ||
        (num2 === num1 - 1 && num3 === num2 - 1)
      ) {
        return '연속된 숫자 3자리 이상은 사용할 수 없어요';
      }
    }
  }

  return '';
};
