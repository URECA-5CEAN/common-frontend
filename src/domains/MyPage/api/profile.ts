import type {
  UserInfoResponse,
  UserStatResponse,
} from '@/domains/MyPage/types/profile';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;
const token = import.meta.env.VITE_AUTH_TOKEN;

export const getUserInfo = async (): Promise<UserInfoResponse> => {
  const response = await axios.post<UserInfoResponse>(
    `${baseURL}/user/currentUserInfo`,
    {},
    {
      headers: {
        Authorization: token,
      },
    },
  );
  return response.data;
};

export const editUserInfo = async (
  nickname: string,
  address: string,
  password: string,
) => {
  const response = await axios.put(
    `${baseURL}/user`,
    { nickname, address, password },
    {
      headers: {
        Authorization: token,
      },
    },
  );

  return response.data;
};

export const getUserStat = async (): Promise<UserStatResponse> => {
  const response = await axios.get<UserStatResponse>(`${baseURL}/user/stat`, {
    headers: {
      Authorization: token,
    },
  });

  return response.data;
};

export const getUsageHistory = async () => {
  const response = await axios.get(`${baseURL}/map/usage`, {
    headers: {
      Authorization: token,
    },
  });

  return response.data;
};
