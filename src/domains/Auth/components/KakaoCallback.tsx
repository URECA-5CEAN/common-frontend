import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const KakaoCallback = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleKakaoCallback = async () => {
      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
          console.error('카카오 로그인 에러:', error);
          // 부모 창에 에러 메시지 전송
          if (window.opener) {
            window.opener.postMessage(
              {
                type: 'KAKAO_LOGIN_ERROR',
                error: '카카오 로그인 중 오류가 발생했습니다.',
              },
              window.location.origin,
            );
          }
          window.close();
          return;
        }

        if (!code) {
          console.error('인증 코드가 없습니다.');
          if (window.opener) {
            window.opener.postMessage(
              {
                type: 'KAKAO_LOGIN_ERROR',
                error: '인증 코드가 없습니다.',
              },
              window.location.origin,
            );
          }
          window.close();
          return;
        }

        // 서버로 인증 코드 전송하여 토큰 받기
        const API_URL = import.meta.env.VITE_API_URL;
        const response = await fetch(`${API_URL}/auth/kakao/callback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          throw new Error('카카오 로그인 처리 실패');
        }

        const data = await response.json();

        if (data.statusCode === 200) {
          // 부모 창에 성공 결과 전송
          if (window.opener) {
            window.opener.postMessage(
              {
                type: 'KAKAO_LOGIN_SUCCESS',
                result: data,
              },
              window.location.origin,
            );
          }
          window.close();
        } else {
          throw new Error(data.message || '카카오 로그인에 실패했습니다.');
        }
      } catch (error) {
        console.error('카카오 로그인 처리 오류:', error);
        if (window.opener) {
          window.opener.postMessage(
            {
              type: 'KAKAO_LOGIN_ERROR',
              error:
                error instanceof Error
                  ? error.message
                  : '카카오 로그인 중 오류가 발생했습니다.',
            },
            window.location.origin,
          );
        }
        window.close();
      }
    };

    handleKakaoCallback();
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1CB0F7] mx-auto mb-4"></div>
        <p className="text-gray-600">카카오 로그인 처리 중...</p>
      </div>
    </div>
  );
};

export default KakaoCallback;
