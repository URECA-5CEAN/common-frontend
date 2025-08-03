import { useEffect, useRef, useState } from 'react';
import type { ChatRoom, Message } from '../types/chat';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/Button';
import { Send } from 'lucide-react';
import useWebSocket from '../hooks/useWebSocket';
import { timeLabel } from '../utils/chat';
import { convertTimeFormat } from '@/domains/Explore/utils/datetimeUtils';

const ChatContent = ({
  chatRooms,
  selectedRoomId,
  currentUser,
}: {
  chatRooms: ChatRoom[];
  selectedRoomId: string;
  currentUser: { id: string; name?: string };
}) => {
  const navigate = useNavigate();
  const [messageInput, setMessageInput] = useState('');
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const { messages, sendMessage, isLoading } = useWebSocket(
    selectedRoomId,
    currentUser.id,
  );

  const handleSend = () => {
    if (messageInput.trim()) {
      sendMessage(messageInput);
      setMessageInput('');
    }
  };

  const isMyMessage = (message: Message) => {
    if (!currentUser) return false;
    return (
      message.userName === currentUser?.name ||
      message.sender === currentUser?.name
    );
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selectedRoom = chatRooms.find(
    (room) => room.chatRoomId === selectedRoomId,
  );

  return (
    <div className="flex-1 flex">
      <aside className="flex-1 p-4 overflow-y-auto bg-gray-100">
        {chatRooms.length === 0 && (
          <p className="text-gray-500">채팅방이 없습니다.</p>
        )}
        <ul className="space-y-2">
          {chatRooms.map((room) => (
            <li
              key={room.chatRoomId}
              className={`cursor-pointer rounded flex items-center gap-3 px-4 py-3 ${
                selectedRoomId === room.chatRoomId
                  ? 'bg-blue-100'
                  : 'hover:bg-gray-200'
              }`}
              onClick={() => {
                navigate(`/chat?roomId=${room.chatRoomId}`);
              }}
            >
              <div className="w-12 h-12 rounded object-cover bg-gray-300"></div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <div className="font-semibold text-sm truncate">
                    {room.postResponseDto.author.nickname}
                  </div>
                  <div className="text-xs text-gray-400">
                    {timeLabel(room.lastMessageTime || '')}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600 truncate">
                    {room.lastMessage}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </aside>

      <main className="flex-3 flex flex-col max-w-[1050px]">
        {selectedRoom && (
          <div className="relative border-b border-gray-200 px-6 py-4 bg-white shadow-sm flex gap-3">
            <div className="w-20 h-20 rounded object-cover bg-gray-300"></div>
            <div>
              <div className="font-semibold text-lg">
                {selectedRoom.postResponseDto.title}
              </div>
              <div className="text-sm text-gray-500">
                {selectedRoom.postResponseDto.author.nickname} ·{' '}
                {selectedRoom.postResponseDto.location}
              </div>
            </div>
            <div ref={dropdownRef}>
              <Button
                variant={'ghost'}
                onClick={() =>
                  navigate(
                    `/explore/share/${selectedRoom.postResponseDto.postId}`,
                  )
                }
              >
                게시물 바로가기
              </Button>
            </div>
          </div>
        )}

        <div className="flex-2 overflow-y-auto p-4 space-y-2">
          {isLoading ? (
            <div className="flex justify-center items-center h-full"></div>
          ) : (
            <>
              {messages.map((msg, idx) => {
                const myMessage = isMyMessage(msg);
                return (
                  <div key={idx} className="mb-3">
                    <div
                      className={`flex gap-1.5 ${myMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      {myMessage && (
                        <span className="text-xs text-gray-400 ml-2 self-end">
                          {convertTimeFormat(msg.time || '')}
                        </span>
                      )}

                      <div
                        className={`max-w-xs lg:max-w-md px-3 py-2 rounded-t-lg ${
                          myMessage
                            ? 'bg-[#A7E8F3] text-gray-800 rounded-bl-lg'
                            : 'bg-gray-200 text-gray-800 rounded-br-lg'
                        }`}
                      >
                        <div>{msg.message}</div>
                      </div>

                      {!myMessage && (
                        <span className="text-xs text-gray-400 mr-2 self-end">
                          {convertTimeFormat(msg.time || '')}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        <div className="flex gap-2 border border-gray-200 rounded-3xl py-3 px-4 ml-4 mr-4">
          <input
            type="text"
            className="flex-1 border-none outline-none"
            placeholder="메시지를 입력하세요"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button className="p-2 rounded" onClick={handleSend}>
            <Send className="text-gray-600" />
          </button>
        </div>
      </main>
    </div>
  );
};

export default ChatContent;
