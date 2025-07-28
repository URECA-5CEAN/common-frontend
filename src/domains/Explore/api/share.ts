import axios from 'axios';
import type { PostWriteRequest } from '../types/share';

const baseURL = import.meta.env.VITE_API_URL;
const token = import.meta.env.VITE_AUTH_TOKEN;

export const getCategories = async () => {
  const response = await axios.get(`${baseURL}/map/distinctCategory`, {
    headers: { Authorization: token },
  });

  return response.data.data;
};

export const getBrands = async (category: string) => {
  const response = await axios.get(`${baseURL}/map/brandByCategory`, {
    params: { category },
    headers: { Authorization: token },
  });

  return response.data.data;
};

export const getBenefitType = async (brandId: string) => {
  const response = await axios.get(`${baseURL}/map/benefit/${brandId}`, {
    headers: { Authorization: token },
  });

  return response.data.data;
};

export const createSharePost = async (postData: PostWriteRequest) => {
  await axios.post(`${baseURL}/user/article`, postData, {
    headers: {
      Authorization: token,
    },
  });
};
