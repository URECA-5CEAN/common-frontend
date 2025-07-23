import { useState } from 'react';
import { login, kakaoLogin } from '../api/loginApi';
import type { LoginData } from '../api/loginApi';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (loginData: LoginData) => {
    try {
      setLoading(true);
      setError(null);

      const result = await login(loginData);

      if (result.success) {
        // 토큰을 로컬 스토리지에 저장 (실제 프로젝트에서는 보안 고려)
        if (result.token) {
          localStorage.setItem('authToken', result.token);
        }

        // 사용자 정보를 로컬 스토리지에 저장
        if (result.user) {
          localStorage.setItem('userData', JSON.stringify(result.user));
        }

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

  const handleKakaoLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await kakaoLogin();

      if (result.success) {
        // 토큰을 로컬 스토리지에 저장
        if (result.token) {
          localStorage.setItem('authToken', result.token);
        }

        // 사용자 정보를 로컬 스토리지에 저장
        if (result.user) {
          localStorage.setItem('userData', JSON.stringify(result.user));
        }

        return result;
      } else {
        throw new Error(result.message || '카카오 로그인에 실패했습니다.');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : '카카오 로그인 중 오류가 발생했습니다.';
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
    kakaoLogin: handleKakaoLogin,
  };
};
