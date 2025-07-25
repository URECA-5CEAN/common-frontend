import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

export const getFavorites = async () => {
  const token = localStorage.getItem('authToken');
  const response = await axios.get(`${baseURL}/map/bookmark`, {
    headers: {
      Authorization: token,
    },
  });

  return response.data;
};
