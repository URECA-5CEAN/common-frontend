import { getChatMessages, getChatRooms } from '../api/chat';
import type { ChatRoom, Message } from '../types/chat';

import { useEffect, useState } from 'react';
import { getUserInfo } from '@/domains/MyPage/api/profile';
import { useLocation, useNavigate } from 'react-router-dom';
import ChatContent from './ChatContent';
import ChatRoomList from '../components/ChatRoomList';
import { Button } from '@/components/Button';
import dolphinFind from '@/assets/image/dolphin_find.png';
import { Grid } from 'ldrs/react';

const ChatPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name?: string;
  } | null>(null);

  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showChatList, setShowChatList] = useState(true);

  const [isUserLoading, setIsUserLoading] = useState(true);
  const [isChatRoomLoading, setIsChatRoomLoading] = useState(true);

  // 화면 크기 감지
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setShowChatList(true);
      }
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // 유저 정보 로딩
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUserInfo();
        setCurrentUser({
          id: user.data.id,
          name: user.data.name,
        });
      } catch (e) {
        console.error('유저 정보 로딩 실패:', e);
      } finally {
        setIsUserLoading(false);
      }
    };
    fetchUser();
  }, []);

  // 채팅방 목록 + 메시지
  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
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
          if (isMobile) setShowChatList(false);
        } else {
          setSelectedRoomId(null);
          if (isMobile) setShowChatList(true);
        }
      } catch (e) {
        console.error('채팅방 로딩 실패:', e);
      } finally {
        setIsChatRoomLoading(false);
      }
    };

    fetchChatRooms();
  }, [location.search, navigate, isMobile]);

  if (isUserLoading || isChatRoomLoading) {
    return (
      <div className="flex flex-col gap-4 justify-center items-center h-[calc(100vh-110px)] text-gray-500 animate-pulse">
        <Grid size="100" speed="1.5" color="#6fc3d1" />
        채팅 정보를 불러오고 있어요...
      </div>
    );
  }

  const handleRoomSelect = (roomId: string) => {
    setSelectedRoomId(roomId);
    navigate(`/chat?roomId=${roomId}`);
    if (isMobile) {
      setShowChatList(false);
    }
  };

  const handleBackToList = () => {
    setShowChatList(true);
    setSelectedRoomId(null);
    navigate('/chat');
  };

  const handleLeaveRoom = (roomId: string) => {
    setChatRooms((prev) => prev.filter((room) => room.chatRoomId !== roomId));
    setSelectedRoomId(null);
    navigate('/chat');
  };

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-110px)]">
        <span className="text-gray-500">로딩중...</span>
      </div>
    );
  }

  // 모바일 버전
  if (isMobile) {
    return (
      <div className="h-[calc(100vh-60px)] w-full mt-15">
        {showChatList ? (
          <ChatRoomList
            chatRooms={chatRooms}
            selectedRoomId={selectedRoomId}
            onRoomSelect={handleRoomSelect}
          />
        ) : (
          selectedRoomId && (
            <ChatContent
              chatRooms={chatRooms}
              selectedRoomId={selectedRoomId}
              currentUser={currentUser}
              isMobile={isMobile}
              onBackToList={handleBackToList}
              onLeaveRoom={handleLeaveRoom}
            />
          )
        )}
      </div>
    );
  }

  return (
    <>
      <ChatRoomList
        chatRooms={chatRooms}
        selectedRoomId={selectedRoomId}
        onRoomSelect={handleRoomSelect}
      />
      <div className="md:ml-[240px] flex justify-center">
        <div className="flex m-6 mt-[62px] sm:mt-[86px] h-[calc(100vh-110px)] w-full max-w-[1340px] justify-center">
          {chatRooms.length === 0 ? (
            <div className="flex-1 flex items-center flex-col gap-2 justify-center">
              <img src={dolphinFind} alt="Dolphin" className="w-32 h-32" />
              <p className="text-gray-500">
                혜택 나누기에서 채팅을 시작해 보세요
              </p>
              <Button onClick={() => navigate('/explore/share')}>
                혜택 나누기 페이지로 이동
              </Button>
            </div>
          ) : selectedRoomId ? (
            <ChatContent
              chatRooms={chatRooms}
              selectedRoomId={selectedRoomId}
              currentUser={currentUser}
              onLeaveRoom={handleLeaveRoom}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <span className="text-gray-500">채팅방을 선택해주세요.</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatPage;
