import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;
const token = import.meta.env.VITE_AUTH_TOKEN;

export const getFavorites = async () => {
  const response = await axios.get(`${baseURL}/map/bookmark`, {
    headers: {
      Authorization: token,
    },
  });

  return response.data;
};
