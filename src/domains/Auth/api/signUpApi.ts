import axios from 'axios';

export const checkNicknameDuplicate = async (nickname: string) => {
  const res = await axios.get(`/api/user/isDupNickname?nickname=${nickname}`);
  return res.data as { statusCode: number; message: string; data: boolean }; //true는 중복, false는 중복 아님
};
