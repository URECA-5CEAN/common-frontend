export interface SignUpData {
  name: string;
  nickname: string;
  email: string;
  password: string;
  gender: 'male' | 'female';
}

export interface SignUpSuccessResponse {
  statusCode: number;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    address: string;
    gender: string;
    title: string | null;
    membership: string;
    nickname: string;
  };
}

export interface SignUpErrorResponse {
  statusCode: number;
  message: string;
  data: {
    statusCode: number;
    statusCodeName: string;
    detailMessage: string;
  };
}

export const checkNicknameDuplicate = async (nickname: string) => {
  try {
    const API_URL = import.meta.env.VITE_API_URL;
    const response = await fetch(
      `${API_URL}/user/isDupNickname?nickname=${nickname}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error('닉네임 중복 확인 요청 실패');
    }

    const data = await response.json();
    return data as { statusCode: number; message: string; data: boolean }; // true는 중복, false는 중복 아님
  } catch (error) {
    console.error('닉네임 중복 확인 API 오류:', error);
    throw error;
  }
};

export const checkEmailDuplicate = async (email: string) => {
  try {
    const API_URL = import.meta.env.VITE_API_URL;
    const encodedEmail = encodeURIComponent(email);
    const response = await fetch(
      `${API_URL}/user/isDupEmail?email=${encodedEmail}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error('이메일 중복 확인 요청 실패');
    }

    const data = await response.json();
    return data as { statusCode: number; message: string; data: boolean }; // true는 중복, false는 중복 아님
  } catch (error) {
    console.error('이메일 중복 확인 API 오류:', error);
    throw error;
  }
};

export const signUp = async (
  signUpData: SignUpData,
): Promise<SignUpSuccessResponse> => {
  try {
    const API_URL = import.meta.env.VITE_API_URL;
    const response = await fetch(`${API_URL}/user/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signUpData),
    });

    const data = await response.json();

    if (response.ok && data.statusCode === 200) {
      return data as SignUpSuccessResponse;
    } else {
      // 에러 응답 처리
      const errorData = data as SignUpErrorResponse;
      throw new Error(
        errorData.data?.detailMessage ||
          errorData.message ||
          '회원가입에 실패했습니다.',
      );
    }
  } catch (error) {
    console.error('회원가입 API 오류:', error);
    throw error;
  }
};
