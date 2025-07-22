import { useState } from 'react';
import axios from 'axios';

interface SignUpFormData {
  name: string;
  gender: 'male' | 'female';
  email: string;
  nickname: string;
  password: string;
}

interface SignUpSuccessResponse {
  statusCode: number;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    password: null;
  };
}

interface SignUpErrorResponse {
  statusCode: number;
  message: string;
  data: {
    statusCode: number;
    statusCodeName: string;
    detailMessage: string;
  };
}

export const useSignUp = () => {
  const [loading, setLoading] = useState(false);

  const signUp = async (formData: SignUpFormData) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/user/signup', formData);
      return response.data as SignUpSuccessResponse;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data as SignUpErrorResponse;
        if (errorData?.data?.statusCode === 20002) {
          throw new Error(
            errorData.data.detailMessage || '해당 사용자가 이미 있습니다.',
          );
        }
        throw new Error(errorData?.data?.detailMessage || '회원가입 실패');
      } else {
        throw new Error('알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    signUp,
    loading,
  };
};
