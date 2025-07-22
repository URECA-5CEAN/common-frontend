import axios from 'axios';

export const checkEmailDuplicate = async (email: string) => {
  const res = await axios.get(`/api/check-email?email=${email}`);
  return res.data as { isDuplicate: boolean };
};

export const checkNicknameDuplicate = async (nickname: string) => {
  const res = await axios.get(`/api/user?nickname=${nickname}`);
  return res.data as { statusCode: number; message: string; data: boolean }; //true는 중복, false는 중복 아님
};
