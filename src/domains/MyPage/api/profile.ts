import type {
  UserInfoResponse,
  UserStatResponse,
} from '@/domains/MyPage/types/profile';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

export const getUserInfo = async (): Promise<UserInfoResponse> => {
  const token = localStorage.getItem('authToken');
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
  const token = localStorage.getItem('authToken');
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
  const token = localStorage.getItem('authToken');
  const response = await axios.get<UserStatResponse>(`${baseURL}/user/stat`, {
    headers: {
      Authorization: token,
    },
  });

  return response.data;
};

export const getUsageHistory = async () => {
  const token = localStorage.getItem('authToken');
  const response = await axios.get(`${baseURL}/map/usage`, {
    headers: {
      Authorization: token,
    },
  });

  return response.data;
};
