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

export const kakaoLogin = async (): Promise<LoginResponse> => {
  return new Promise((resolve, reject) => {
    // 카카오 OAuth 인증 페이지를 팝업으로 열기
    const kakaoAuthUrl =
      'https://kauth.kakao.com/oauth/authorize?client_id=524aef0330795198299d52f0dfe98b0b&redirect_uri=http://15.164.81.45/api/auth/kakao/callback&response_type=code';

    const popup = window.open(
      kakaoAuthUrl,
      'kakaoLogin',
      'width=500,height=600,scrollbars=yes,resizable=yes',
    );

    if (!popup) {
      reject(new Error('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.'));
      return;
    }

    // 팝업에서 메시지를 받기 위한 이벤트 리스너
    const messageHandler = (event: MessageEvent) => {
      // 보안을 위해 origin 체크
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data.type === 'KAKAO_LOGIN_SUCCESS') {
        window.removeEventListener('message', messageHandler);
        popup.close();
        resolve(event.data.result);
      } else if (event.data.type === 'KAKAO_LOGIN_ERROR') {
        window.removeEventListener('message', messageHandler);
        popup.close();
        reject(new Error(event.data.error || '카카오 로그인에 실패했습니다.'));
      }
    };

    window.addEventListener('message', messageHandler);

    // 팝업이 닫힌 경우 처리
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        window.removeEventListener('message', messageHandler);
        reject(new Error('로그인이 취소되었습니다.'));
      }
    }, 1000);
  });
};
