import axios from 'axios';

// axios 기본 설정
const API_URL = import.meta.env.VITE_API_URL;

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  nickname: string;
  phoneNumber: string;
  birth: string;
}

export interface SignUpResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    name: string;
    nickname: string;
  };
}

export const checkNicknameDuplicate = async (nickname: string) => {
  const res = await axios.get(
    `${API_URL}/user/isDupNickname?nickname=${nickname}`,
  );
  return res.data as { statusCode: number; message: string; data: boolean }; //true는 중복, false는 중복 아님
};

export const signUp = async (
  signUpData: SignUpData,
): Promise<SignUpResponse> => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, signUpData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('회원가입 API 오류:', error);
    throw error;
  }
};
