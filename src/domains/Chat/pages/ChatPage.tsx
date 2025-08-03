import { getChatMessages, getChatRooms } from '../api/chat';
import type { ChatRoom, Message } from '../types/chat';

import { useEffect, useState } from 'react';
import { getUserInfo } from '@/domains/MyPage/api/profile';
import { useLocation, useNavigate } from 'react-router-dom';
import ChatContent from './ChatContent';

const ChatPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name?: string;
  } | null>(null);

  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  // 유저 정보 로딩
  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUserInfo();
      setCurrentUser({
        id: user.data.id,
        name: user.data.name,
      });
    };
    fetchUser();
  }, []);

  // 채팅방 목록 + 쿼리에서 roomId 읽기
  useEffect(() => {
    const fetchChatRooms = async () => {
      const data = await getChatRooms();
      const rooms = data.data;

      const messagesByRoom: Record<string, Message[]> = {};
      await Promise.all(
        rooms.map(async (room: ChatRoom) => {
          const res = await getChatMessages(room.chatRoomId);
          messagesByRoom[room.chatRoomId] = res.data;
        }),
      );

      const processedRooms = rooms.map((room: ChatRoom) => {
        const roomMessages = messagesByRoom[room.chatRoomId] || [];
        const lastMessage = roomMessages[0];
        if (!lastMessage) {
          return {
            ...room,
            lastMessage: '',
            lastMessageTime: '',
          };
        }
        return {
          ...room,
          lastMessage: lastMessage?.message ?? '',
          lastMessageTime: lastMessage?.time ?? '',
        };
      });

      setChatRooms(processedRooms);

      const params = new URLSearchParams(location.search);
      const roomIdFromURL = params.get('roomId');

      if (roomIdFromURL) {
        setSelectedRoomId(roomIdFromURL);
      } else if (data.data.length > 0) {
        setSelectedRoomId(data.data[0].chatRoomId);
        navigate(`/chat?roomId=${data.data[0].chatRoomId}`);
      }
    };

    fetchChatRooms();
  }, [location.search, navigate]);

  if (!currentUser || !selectedRoomId) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-110px)]">
        <span className="text-gray-500">로딩중...</span>
      </div>
    );
  }

  return (
    <div className="flex m-6 mt-[62px] sm:mt-[86px] h-[calc(100vh-110px)] w-full max-w-[1340px] mx-auto">
      <ChatContent
        chatRooms={chatRooms}
        selectedRoomId={selectedRoomId}
        currentUser={currentUser}
      />
    </div>
  );
};

export default ChatPage;
