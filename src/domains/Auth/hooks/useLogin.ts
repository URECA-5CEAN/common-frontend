import { useState } from 'react';
import { login } from '../api/loginApi';
import type { LoginData } from '../api/loginApi';
import { useAuthStore } from '@/store/useAuthStore';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (loginData: LoginData) => {
    try {
      setLoading(true);
      setError(null);

      const result = await login(loginData);

      if (result.statusCode === 200) {
        // 토큰을 로컬 스토리지에 저장
        if (result.data.token) {
          localStorage.setItem('authToken', result.data.token);
          useAuthStore.getState().setToken(result.data.token);
        }

        // userDto가 있다면 사용자 정보 저장 (현재는 null이지만 향후 사용 가능)
        if (result.data.userDto) {
          localStorage.setItem('userInfo', JSON.stringify(result.data.userDto));
        }

        useAuthStore.getState().setIsLoggedIn(true);

        return result;
      } else {
        throw new Error(result.message || '로그인에 실패했습니다.');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : '로그인 중 오류가 발생했습니다.';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    login: handleLogin,
  };
};
