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

export const editUserInfo = async (data: {
  nickname?: string;
  address?: string;
  password?: string;
  membership?: string;
  title?: string;
}) => {
  const token = localStorage.getItem('authToken');
  const response = await axios.put(`${baseURL}/user`, data, {
    headers: {
      Authorization: token,
    },
  });

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

export const getNicknameDuplicate = async (nickname: string) => {
  const response = await axios.get(`${baseURL}/user/isDupNickname`, {
    params: { nickname },
  });

  return response.data;
};

export const getTitles = async () => {
  const token = localStorage.getItem('authToken');
  const response = await axios.get(`${baseURL}/ai/recommend/title`, {
    headers: {
      Authorization: token,
    },
  });

  return response.data;
};
