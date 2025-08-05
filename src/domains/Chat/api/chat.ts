import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

export const getChatRooms = async () => {
  const token = localStorage.getItem('authToken');
  const response = await axios.get(`${baseURL}/user/chatRoom`, {
    headers: { Authorization: token },
  });

  return response.data;
};

export const getChatMessages = async (chatRoomId: string) => {
  const token = localStorage.getItem('authToken');
  const response = await axios.get(`${baseURL}/user/chatRoom/messages`, {
    params: { chatRoomId },
    headers: { Authorization: token },
  });

  return response.data;
};

export const leaveChatRoom = async (chatRoomId: string) => {
  const token = localStorage.getItem('authToken');
  const response = await axios.delete(`${baseURL}/user/chatRoom`, {
    params: { chatRoomId },
    headers: { Authorization: token },
  });

  return response.data;
};
