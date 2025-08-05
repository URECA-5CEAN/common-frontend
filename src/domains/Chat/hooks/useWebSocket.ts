import { useEffect, useRef, useState } from 'react';
import { getChatMessages } from '../api/chat';
import type { Message } from '../types/chat';

const useChatSocket = (roomId: string, senderId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const socketRef = useRef<WebSocket | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!roomId) return;

    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const data = await getChatMessages(roomId);

        setMessages(data.data.reverse());
      } catch (error) {
        console.error('메시지 로딩 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [roomId]);

  useEffect(() => {
    if (!roomId || !senderId) return;

    if (socketRef.current) {
      socketRef.current.close(); // 이전 소켓 종료
    }

    const socket = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL);
    socketRef.current = socket;

    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          type: 'join',
          roomId,
          sender: senderId,
        }),
      );
    };

    socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        const msgWithTime = {
          ...msg,
          time: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, msgWithTime]);
      } catch (e) {
        console.error('메시지 파싱 실패:', e);
      }
    };

    socket.onerror = (error) => {
      console.error('웹소켓 오류 발생:', error);
    };

    return () => {
      socket.close();
    };
  }, [roomId, senderId]);

  const sendMessage = (message: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: 'chat',
          roomId,
          sender: senderId,
          message,
        }),
      );
    }
  };

  return { messages, sendMessage, isLoading };
};

export default useChatSocket;
