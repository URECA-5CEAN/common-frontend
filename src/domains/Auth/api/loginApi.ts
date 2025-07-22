export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    name: string;
    nickname: string;
  };
  token?: string;
}

export const login = async (loginData: LoginData): Promise<LoginResponse> => {
  try {
    // TODO: 실제 API 엔드포인트로 교체
    const response = await fetch('/api/auth/login', {
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

export const kakaoLogin = async (): Promise<LoginResponse> => {
  try {
    // TODO: 카카오 로그인 API 엔드포인트로 교체
    const response = await fetch('/api/auth/kakao-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('카카오 로그인 요청 실패');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('카카오 로그인 API 오류:', error);
    throw error;
  }
};
