import axios from 'axios';
import type { Post, PostWriteRequest } from '../types/share';

const baseURL = import.meta.env.VITE_API_URL;

export const getCategories = async () => {
  const token = localStorage.getItem('authToken');

  const response = await axios.get(`${baseURL}/map/distinctCategory`, {
    headers: { Authorization: token },
  });

  return response.data.data;
};

export const getBrands = async (category: string) => {
  const token = localStorage.getItem('authToken');

  const response = await axios.get(`${baseURL}/map/brandByCategory`, {
    params: { category },
    headers: { Authorization: token },
  });

  return response.data.data;
};

export const getBenefitType = async (brandId: string) => {
  const token = localStorage.getItem('authToken');

  const response = await axios.get(`${baseURL}/map/benefit/${brandId}`, {
    headers: { Authorization: token },
  });

  return response.data.data;
};

export const createSharePost = async (postData: PostWriteRequest) => {
  const token = localStorage.getItem('authToken');

  await axios.post(`${baseURL}/user/article`, postData, {
    headers: {
      Authorization: token,
    },
  });
};

export const getSharePostList = async (
  page: number,
  location?: string,
): Promise<Post[]> => {
  const token = localStorage.getItem('authToken');

  const response = await axios.get(`${baseURL}/user/article`, {
    params: { page, location },
    headers: { Authorization: token },
  });

  return response.data.data.postList;
};

export const getSharePostById = async (postId: string): Promise<Post> => {
  const token = localStorage.getItem('authToken');

  const response = await axios.get(`${baseURL}/user/article/detail`, {
    params: { postId },
    headers: { Authorization: token },
  });

  return response.data.data;
};

export const getShareLocations = async (): Promise<string[]> => {
  const response = await axios.get(`${baseURL}/user/article/locations`);
  return response.data.data;
};

export const createChatRoom = async (postId: string) => {
  const token = localStorage.getItem('authToken');

  const response = await axios.post(
    `${baseURL}/user/chatRoom`,
    { postId },
    {
      headers: { Authorization: token },
    },
  );

  return response.data;
};
