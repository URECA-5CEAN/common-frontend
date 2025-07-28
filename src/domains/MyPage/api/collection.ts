import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

export const getAllBrandList = async () => {
  const token = localStorage.getItem('authToken');
  const response = await axios.get(`${baseURL}/map/brand`, {
    headers: {
      Authorization: token,
    },
  });
  return response.data;
};
