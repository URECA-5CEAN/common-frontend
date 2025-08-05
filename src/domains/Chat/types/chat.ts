import type { Post } from '@/domains/Explore/types/share';

export interface ChatRoom {
  chatRoomId: string;
  me: string;
  other: string;
  lastMessage?: string;
  lastMessageTime?: string;
  postResponseDto: Post;
  otherNickname: string;
}

export interface Message {
  roomId: string;
  sender: string;
  message: string;
  time?: string;
  userName?: string;
}
