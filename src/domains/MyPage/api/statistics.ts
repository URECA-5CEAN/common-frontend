import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

export const getSavings = async () => {
  const token = localStorage.getItem('authToken');
  const response = await axios.get(`${baseURL}/map/stat/savings`, {
    headers: {
      Authorization: token,
    },
  });
  return response.data;
};

export const getDaily = async () => {
  const token = localStorage.getItem('authToken');
  const response = await axios.get(`${baseURL}/map/stat/daily`, {
    headers: {
      Authorization: token,
    },
    params: {
      num: 10,
    },
  });
  return response.data;
};

export const getWeekly = async () => {
  const token = localStorage.getItem('authToken');
  const response = await axios.get(`${baseURL}/map/stat/weekly`, {
    headers: {
      Authorization: token,
    },
    params: {
      num: 10,
    },
  });
  return response.data;
};

export const getMonthly = async () => {
  const token = localStorage.getItem('authToken');
  const response = await axios.get(`${baseURL}/map/stat/monthly`, {
    headers: {
      Authorization: token,
    },
    params: {
      num: 5,
    },
  });
  return response.data;
};

export const getCategory = async (period: string) => {
  const token = localStorage.getItem('authToken');
  const response = await axios.get(`${baseURL}/map/stat/category`, {
    headers: {
      Authorization: token,
    },
    params: {
      period,
    },
  });
  return response.data;
};

export const getRegion = async (period: string) => {
  const token = localStorage.getItem('authToken');
  const response = await axios.get(`${baseURL}/map/stat/region`, {
    headers: {
      Authorization: token,
    },
    params: {
      period,
    },
  });
  return response.data;
};

export const getWeekday = async (period: string) => {
  const token = localStorage.getItem('authToken');
  const response = await axios.get(`${baseURL}/map/stat/weekday`, {
    headers: {
      Authorization: token,
    },
    params: {
      period,
    },
  });
  return response.data;
};

export const getHourly = async (period: string) => {
  const token = localStorage.getItem('authToken');
  const response = await axios.get(`${baseURL}/map/stat/hourly`, {
    headers: {
      Authorization: token,
    },
    params: {
      period,
    },
  });
  return response.data;
};

export const getBrand = async (period: string) => {
  const token = localStorage.getItem('authToken');
  const response = await axios.get(`${baseURL}/map/stat/brand`, {
    headers: {
      Authorization: token,
    },
    params: {
      period,
    },
  });
  return response.data;
};

export const getStore = async (period: string) => {
  const token = localStorage.getItem('authToken');
  const response = await axios.get(`${baseURL}/map/stat/store`, {
    headers: {
      Authorization: token,
    },
    params: {
      period,
    },
  });
  return response.data;
};
