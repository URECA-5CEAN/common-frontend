import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

export const getUserAttendance = async (year: number, month: number) => {
  const token = localStorage.getItem('authToken');
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
  const token = localStorage.getItem('authToken');
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

export const getMyMission = async () => {
  const token = localStorage.getItem('authToken');
  const response = await axios.get(`${baseURL}/user/mission/my`, {
    headers: {
      Authorization: token,
    },
  });

  return response.data;
};

export const setMissionCompleted = async (id: string) => {
  const token = localStorage.getItem('authToken');

  const response = await axios.get(`${baseURL}/user/mission/complete`, {
    params: { missionId: id },
    headers: {
      Authorization: token,
    },
  });

  return response.data;
};

export const increaseUserExp = async (expChange: number) => {
  const token = localStorage.getItem('authToken');

  const response = await axios.put(
    `${baseURL}/user/stat`,
    { expChange },
    {
      headers: {
        Authorization: token,
      },
    },
  );

  return response.data;
};
