import { Button } from '@/components/Button';
import { editUserInfo, getUserInfo } from '@/domains/MyPage/api/profile';
import { Breadcrumb } from '@/components/Breadcrumb';
import type { UserInfoApi } from '@/domains/MyPage/types/profile';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EditProfilePage = () => {
  const [userInfoApi, setUserInfoApi] = useState<UserInfoApi>();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const userInfoRes = await getUserInfo();

      setUserInfoApi(userInfoRes.data);
    }

    fetchData();
  }, []);

  const handleEditUserInfo = async () => {
    if (!userInfoApi) return;

    if (userInfoApi.nickname === '') {
      alert('닉네임을 입력해주세요.');
      return;
    }

    if (userInfoApi.address === '') {
      alert('주소를 입력해주세요.');
      return;
    }

    if (password === '') {
      alert('비밀번호를 입력해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await editUserInfo(userInfoApi.nickname, userInfoApi.address, password);
      navigate('/mypage/profile');
    } catch (error) {
      alert('수정에 실패했습니다. 다시 시도해주세요.' + error);
    }
  };

  const STYLES = {
    input: 'h-[50px] border-b border-gray-400 px-2 focus:outline-none w-full',
  } as const;

  return (
    <div className="w-full max-w-[1050px] m-6">
      <Breadcrumb title="마이페이지" subtitle="내 정보" />
      <div className="text-[32px]">내 정보</div>
      <div className="text-2xl">내 정보 수정</div>
      <div className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="닉네임"
          className={STYLES.input}
          value={userInfoApi?.nickname || ''}
          onChange={(e) =>
            setUserInfoApi((prev) =>
              prev ? { ...prev, nickname: e.target.value } : undefined,
            )
          }
        />

        <div className="relative">
          <input
            type="text"
            value={userInfoApi?.address}
            placeholder="주소"
            className={STYLES.input}
            onChange={(e) =>
              setUserInfoApi((prev) =>
                prev ? { ...prev, address: e.target.value } : undefined,
              )
            }
          />
          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            <Button width="150px" height="36px">
              주소 찾기
            </Button>
          </div>
        </div>

        <input
          type="text"
          placeholder="비밀번호"
          className={STYLES.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="text"
          placeholder="비밀번호 확인"
          className={STYLES.input}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <div className="flex gap-5">
          <Button
            fullWidth
            variant="secondary"
            height="42px"
            onClick={() => navigate('/mypage/profile')}
          >
            취소
          </Button>
          <Button fullWidth height="42px" onClick={handleEditUserInfo}>
            수정하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
