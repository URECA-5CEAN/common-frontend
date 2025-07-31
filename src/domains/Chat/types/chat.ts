export type ChatRoom = {
  chatRoomId: string;
  me: string;
  other: string;
};

export type Message = {
  message: string;
  roomId: string | null;
  sender?: string; // 송신 시 포함됨
  time?: string; // 수신 시 포함됨
  name?: string; // 송신 시 포함됨
  userName?: string; // 수신 시 포함됨
};
