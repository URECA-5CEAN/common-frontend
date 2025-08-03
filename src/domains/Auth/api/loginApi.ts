import axios from 'axios';

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  statusCode: number;
  message: string;
  data: {
    result: string;
    token: string;
    userDto: unknown | null;
  };
}

export const login = async (loginData: LoginData): Promise<LoginResponse> => {
  try {
    const API_URL = import.meta.env.VITE_API_URL;
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      throw new Error('로그인 요청 실패');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('로그인 API 오류:', error);
    throw error;
  }
};

export const openKakaoLogin = () => {
  const clientId = '524aef0330795198299d52f0dfe98b0b';
  const redirectUri = 'https://15.164.81.45/api/auth/kakao/callback';
  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`;

  window.open(kakaoAuthUrl, '_blank', 'width=600,height=700');
};

const baseURL = import.meta.env.VITE_API_URL;
export const openKakaoSignup = async (accessToken: string) => {
  const response = await axios.post(`${baseURL}/auth/kakao/signup`, null, {
    params: { accessToken },
  });

  return response.data;
};
