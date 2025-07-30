import axios from 'axios';
import type { UserRank } from '@/domains/Explore/types/rank';
import type { StoreRank } from '@/domains/Explore/types/rank';

const baseURL = import.meta.env.VITE_API_URL;

export const getUserRank = async (): Promise<UserRank[]> => {
  const response = await axios.get<{ data: UserRank[] }>(
    `${baseURL}/map/user/rank`,
  );

  return response.data.data;
};

export const getStoreRank = async (): Promise<StoreRank[]> => {
  const response = await axios.get<{ data: StoreRank[] }>(
    `${baseURL}/map/store/rank`,
  );

  return response.data.data;
};
