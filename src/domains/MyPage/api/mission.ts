import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;
const token = import.meta.env.VITE_AUTH_TOKEN;

export const getUserAttendance = async (year: number, month: number) => {
  const response = await axios.get(`${baseURL}/user/attendance`, {
    params: {
      year,
      month,
    },
    headers: {
      Authorization: token,
    },
  });

  return response.data;
};

export const checkInAttendance = async () => {
  const response = await axios.post(
    `${baseURL}/user/attendance`,
    {},
    {
      headers: {
        Authorization: token,
      },
    },
  );

  return response.data;
};
