import axios from 'axios';
import type { UserRank } from '@/domains/Explore/components/ranking/UserTotalRanking';

const baseURL = import.meta.env.VITE_API_URL;

export const getUserRank = async (): Promise<UserRank[]> => {
  const token = localStorage.getItem('authToken');
  const response = await axios.get<{ data: UserRank[] }>(
    `${baseURL}/map/user/rank`,
    {
      headers: {
        Authorization: token,
      },
    },
  );

  return response.data.data;
};
