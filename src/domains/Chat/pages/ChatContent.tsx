import { useEffect, useRef, useState } from 'react';
import type { ChatRoom, Message } from '../types/chat';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/Button';
import { Send, ArrowLeft, MoreVertical } from 'lucide-react';
import useWebSocket from '../hooks/useWebSocket';
import {
  convertTimeFormat,
  fromISOStringToDateTime,
} from '@/domains/Explore/utils/datetimeUtils';

const ChatContent = ({
  chatRooms,
  selectedRoomId,
  currentUser,
  isMobile = false,
  onBackToList,
}: {
  chatRooms: ChatRoom[];
  selectedRoomId: string;
  currentUser: { id: string; name?: string };
  isMobile?: boolean;
  onBackToList?: () => void;
}) => {
  const navigate = useNavigate();
  const [messageInput, setMessageInput] = useState('');
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [menuOpen, setMenuOpen] = useState(false);
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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedRoom = chatRooms.find(
    (room) => room.chatRoomId === selectedRoomId,
  );

  if (!selectedRoom) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <span className="text-gray-500">채팅방을 찾을 수 없습니다.</span>
      </div>
    );
  }

  const { title, author, location, promiseDate, postId, brandImgUrl } =
    selectedRoom.postResponseDto;

  const promiseDateObj = fromISOStringToDateTime(promiseDate);

  return (
    <main
      className={`flex flex-col h-full ${isMobile ? 'w-full' : 'flex-1'} sm:max-w-[1050px]`}
    >
      {/* 채팅방 헤더 */}
      <div className="relative border-b border-gray-200 px-4 py-4 shadow-sm flex flex-col gap-3">
        {/* 모바일에서만 뒤로가기 버튼 표시 */}
        {isMobile && onBackToList && (
          <button
            onClick={onBackToList}
            className="hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
        )}
        <div className="flex gap-4 justify-between items-start">
          {/* 프로필 이미지 */}
          <div className="flex gap-4">
            {brandImgUrl ? (
              <img
                src={brandImgUrl}
                alt="브랜드이미지"
                className="w-12 h-12 sm:w-20 sm:h-20 rounded object-cover"
              />
            ) : (
              <div className="w-12 h-12 sm:w-20 sm:h-20 rounded object-cover bg-gray-300"></div>
            )}
            {/* 채팅방 정보 */}
            <div className="min-w-0">
              <h2 className="font-semibold text-lg text-gray-900 truncate">
                {title}
              </h2>
              <p className="flex text-sm text-gray-500 flex-wrap gap-1">
                <span>{author.nickname}</span>·<span>{location}</span>·
                <span>{`${promiseDateObj.date}, ${promiseDateObj.time.period} ${promiseDateObj.time.hour}:${promiseDateObj.time.minute}`}</span>
              </p>
            </div>
            {/* 게시물 바로가기 버튼 */}
            <div ref={dropdownRef}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/explore/share/${postId}`)}
              >
                게시물 바로가기
              </Button>
            </div>
          </div>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="p-2 rounded hover:bg-gray-100"
          >
            <MoreVertical size={20} />
          </button>
          {menuOpen && (
            <ul className="absolute right-6 top-12 w-40 bg-white border border-gray-200 rounded shadow-lg z-10">
              <li
                onClick={() => {
                  alert('대화방에서 나갔습니다.');
                  setMenuOpen(false);
                }}
                className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
              >
                대화방 나가기
              </li>
            </ul>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4 space-y-3">
        {isLoading ? (
          <div className="flex justify-center items-center h-full"></div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <span className="text-gray-500">아직 메시지가 없습니다.</span>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => {
              const myMessage = isMyMessage(msg);
              return (
                <div key={idx}>
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

      <div className="flex gap-2 border border-gray-200 rounded-3xl py-3 px-4 mb-4 sm:mb-0 ml-4 mr-4">
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
  );
};

export default ChatContent;
