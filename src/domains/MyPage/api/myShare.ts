import type { PostWriteRequest } from '@/domains/Explore/types/share';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

export const getMyPostList = async () => {
  const token = localStorage.getItem('authToken');
  const response = await axios.get(`${baseURL}/user/article/myPost`, {
    headers: {
      Authorization: token,
    },
  });

  return response.data;
};

export const updateMySharePost = async (
  postData: PostWriteRequest,
  postId: string,
) => {
  const token = localStorage.getItem('authToken');
  await axios.put(`${baseURL}/user/article`, postData, {
    params: { postId },
    headers: {
      Authorization: token,
    },
  });
};

export const deleteMySharePost = async (postId: string) => {
  const token = localStorage.getItem('authToken');
  await axios.delete(`${baseURL}/user/article`, {
    params: { postId },
    headers: {
      Authorization: token,
    },
  });
};
