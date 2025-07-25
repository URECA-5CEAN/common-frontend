import { useState } from 'react';
import {
  signUp,
  checkNicknameDuplicate,
  checkEmailDuplicate,
} from '../api/signUpApi';
import type { SignUpData } from '../api/signUpApi';

export const useSignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (formData: SignUpData) => {
    try {
      setLoading(true);
      setError(null);

      const result = await signUp(formData);

      if (result.statusCode === 200) {
        return result;
      } else {
        throw new Error(result.message || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : '회원가입 중 오류가 발생했습니다.';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleCheckNickname = async (nickname: string) => {
    try {
      setLoading(true);
      setError(null);

      const result = await checkNicknameDuplicate(nickname);
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : '닉네임 중복 확인 중 오류가 발생했습니다.';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleCheckEmail = async (email: string) => {
    try {
      setLoading(true);
      setError(null);

      const result = await checkEmailDuplicate(email);
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : '이메일 중복 확인 중 오류가 발생했습니다.';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    signUp: handleSignUp,
    checkNickname: handleCheckNickname,
    checkEmail: handleCheckEmail,
    loading,
    error,
  };
};
