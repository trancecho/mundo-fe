import { useState, useRef } from "react";
import { longtoken, deleteChatHistory } from "@/router/api";

const STORAGE_KEY = "chat_history";

type Message = { sender: "user" | "customer"; text: string };

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const storedMessages = localStorage.getItem(STORAGE_KEY);
    return storedMessages ? JSON.parse(storedMessages) : [];
  });

  const socketRef = useRef<WebSocket | null>(null);
  const connectedRef = useRef<boolean>(false);

  const connectWebSocket = () => {
    if (connectedRef.current) return; // 避免重复连接
    const socketUrl = `ws://116.198.207.159:12349/api/ws?toUid=9&token=${longtoken}&service=mundo`;
    const ws = new WebSocket(socketUrl);
    ws.onopen = () => {
      console.log("WebSocket 已连接");
      connectedRef.current = true;
      socketRef.current = ws;
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(message);

      setMessages((prevMessages) => {
        const newMessage: Message = {
          sender: message.from ? "user" : "customer",
          text: message.content,
        };

        if (
          !prevMessages.some(
            (msg) =>
              msg.sender === newMessage.sender && msg.text === newMessage.text
          )
        ) {
          const newMessages = [...prevMessages, newMessage];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newMessages));
          return newMessages;
        }

        return prevMessages;
      });
    };

    ws.onerror = (error) => {
      console.error("WebSocket 连接出错", error);
      connectedRef.current = false;
    };

    ws.onclose = () => {
      console.log("WebSocket 已关闭");
      localStorage.removeItem(STORAGE_KEY);
      connectedRef.current = false;
    };
    socketRef.current = ws;
  };

  const disconnectWebSocket = () => {
    if (socketRef.current) {
      socketRef.current.close();
      connectedRef.current = false;
    }
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage = { type: 1, content: text };

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(userMessage));
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", text },
      ]);
    } else {
      console.error("WebSocket 未连接");
    }
  };

  const clearHistory = async () => {
    try {
      await deleteChatHistory();
      setMessages([]);
      localStorage.removeItem(STORAGE_KEY);
      alert("聊天记录已删除");
    } catch (error) {
      console.error("Failed to delete chat history", error);
    }
  };

  return {
    messages,
    sendMessage,
    clearHistory,
    connectWebSocket,
    disconnectWebSocket,
  };
};
