import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getChatRooms, getChatMessages } from '../api/chat';
import type { ChatRoom, Message } from '../types/chat';
import { getUserInfo } from '@/domains/MyPage/api/profile';
import { Button } from '@/components/Button';
import dolphinFind from '@/assets/image/dolphin_find.png';
import { Send } from 'lucide-react';

const ChatPage = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    nickname: string;
    name?: string;
  } | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // 1. 유저 정보 로딩
  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUserInfo();
      setCurrentUser({
        id: user.data.id,
        nickname: user.data.nickname,
        name: user.data.name,
      });
    };
    fetchUser();
  }, []);

  // 2. 채팅방 목록 불러오기 + 쿼리에서 roomId 읽기
  useEffect(() => {
    const fetchChatRooms = async () => {
      const data = await getChatRooms();
      setChatRooms(data.data);

      const params = new URLSearchParams(location.search);
      const roomIdFromURL = params.get('roomId');

      if (roomIdFromURL) {
        setSelectedRoomId(roomIdFromURL);
      } else if (data.data.length > 0) {
        setSelectedRoomId(data.data[0].chatRoomId);
      }
    };

    fetchChatRooms();
  }, [location.search]);

  // 3-1. 메시지 불러오기 (초기 로드)
  useEffect(() => {
    if (!selectedRoomId) return;

    const fetchMessages = async () => {
      try {
        const data = await getChatMessages(selectedRoomId);
        setMessages(data.data.reverse());
      } catch (error) {
        console.error('메시지 로딩 실패:', error);
      }
    };

    fetchMessages();
  }, [selectedRoomId]);

  // 3-2. WebSocket 연결 (실시간 메시지)
  useEffect(() => {
    if (!selectedRoomId || !currentUser) return;

    const connectWebSocket = () => {
      const socket = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log('웹소켓 연결됨');
        const joinMessage = {
          type: 'join',
          roomId: selectedRoomId,
          sender: currentUser.id,
        };
        socket.send(JSON.stringify(joinMessage));
      };

      socket.onmessage = (event) => {
        let raw = event.data;
        if (raw.startsWith('Echo: ')) raw = raw.slice(6);

        try {
          const msg = JSON.parse(raw);
          console.log('🎁 받은 메시지:', msg);

          if (msg.roomId === selectedRoomId) {
            setMessages((prev) => [...prev, msg]);
          }
        } catch (e) {
          console.error('메시지 파싱 실패:', e);
        }
      };

      socket.onclose = () => {
        console.log('웹소켓 연결 종료');
      };

      socket.onerror = (err) => {
        console.error('웹소켓 오류:', err);
      };
    };

    connectWebSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [selectedRoomId, currentUser]);

  // 4. 본인 메시지 비교 함수
  const isMyMessage = (message: Message) => {
    if (!currentUser) return false;

    return (
      message.userName === currentUser?.name ||
      message.sender === currentUser?.name
    );
  };

  // 5. 메시지 전송
  const sendMessage = () => {
    if (
      !messageInput.trim() ||
      !selectedRoomId ||
      !socketRef.current ||
      !currentUser
    )
      return;

    const message = {
      type: 'chat',
      roomId: selectedRoomId,
      sender: currentUser.id,
      message: messageInput,
      userName: currentUser.nickname,
    };

    console.log('🎈 전송 메시지:', message);
    socketRef.current.send(JSON.stringify(message));
    setMessageInput('');
  };

  return (
    <div className="flex justify-center mt-[62px] sm:mt-[86px] h-[calc(100vh-86px)] w-full max-w-[1050px]">
      {/* 채팅방 목록 */}
      <aside className="w-1/4 border-r p-4 overflow-y-auto">
        <h1>개발 테스트 중입니다...</h1>
        <h2 className="font-bold mb-4">채팅 목록</h2>
        {chatRooms.length === 0 && (
          <p className="text-gray-500">채팅방이 없습니다.</p>
        )}
        <ul className="space-y-2">
          {chatRooms.map((room) => (
            <li
              key={room.chatRoomId}
              className={`cursor-pointer p-2 rounded ${
                selectedRoomId === room.chatRoomId
                  ? 'bg-blue-100'
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => {
                setSelectedRoomId(room.chatRoomId);
                navigate(`/chat?roomId=${room.chatRoomId}`);
              }}
            >
              채팅방 {room.chatRoomId.slice(0, 5)}...
            </li>
          ))}
        </ul>
      </aside>

      {/* 채팅창 */}
      {chatRooms.length > 0 ? (
        <main className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.map((msg, idx) => {
              const myMessage = isMyMessage(msg);
              return (
                <div key={idx} className="mb-3">
                  {/* 실제 메시지 */}
                  <div
                    className={`flex ${myMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-3 py-2 rounded-t-lg ${
                        myMessage
                          ? 'bg-[#A7E8F3] text-gray-800 rounded-bl-lg'
                          : 'bg-gray-200 text-gray-800 rounded-br-lg'
                      }`}
                    >
                      <div>{msg.message}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="border-t p-4 flex gap-2">
            <input
              type="text"
              className="flex-1 border rounded p-2"
              placeholder="메시지를 입력하세요"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') sendMessage();
              }}
            />
            <button className="p-4 rounded" onClick={sendMessage}>
              <Send />
            </button>
          </div>
        </main>
      ) : (
        <main className="flex-1 flex flex-col items-center justify-center gap-y-3 p-4">
          <img src={dolphinFind} alt="Dolphin" className="w-32 h-32" />
          <p className="text-gray-500">혜택 나누기에서 채팅을 시작해 보세요</p>
          <Button onClick={() => navigate('/explore/share')}>
            혜택 나누기 페이지로 이동
          </Button>
        </main>
      )}
    </div>
  );
};

export default ChatPage;
