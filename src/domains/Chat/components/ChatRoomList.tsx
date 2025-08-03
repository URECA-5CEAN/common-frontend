import type { ChatRoom } from '../types/chat';
import { timeLabel } from '../utils/chat';

const ChatRoomList = ({
  chatRooms,
  selectedRoomId,
  onRoomSelect,
}: {
  chatRooms: ChatRoom[];
  selectedRoomId: string | null;
  onRoomSelect: (roomId: string) => void;
}) => {
  return (
    <div className="flex-1 md:max-w-sm bg-gray-50 h-full">
      {/* 헤더 */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <h1 className="text-xl font-bold text-gray-900">채팅</h1>
      </div>

      {/* 채팅방 목록 */}
      <div className="overflow-y-auto h-[calc(100%-73px)]">
        {chatRooms.length === 0 ? (
          <div className="p-4">
            <p className="text-gray-500 text-center">채팅방이 없습니다.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {chatRooms.map((room) => (
              <li
                key={room.chatRoomId}
                className={`cursor-pointer rounded ${
                  selectedRoomId === room.chatRoomId
                    ? 'bg-blue-100'
                    : 'hover:bg-gray-200'
                }`}
                onClick={() => onRoomSelect(room.chatRoomId)}
              >
                <div className="flex items-center gap-3 p-4">
                  {/* 프로필 이미지 */}
                  <div className="w-12 h-12 rounded object-cover bg-gray-300"></div>

                  {/* 채팅방 정보 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-semibold text-sm text-gray-900 truncate">
                        {room.postResponseDto.author.nickname}
                      </h3>
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {timeLabel(room.lastMessageTime || '')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {room.lastMessage || '메시지가 없습니다'}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ChatRoomList;
