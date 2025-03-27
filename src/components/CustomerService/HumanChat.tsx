import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import styles from "./AnswerWindow.module.css";
import { deleteChatHistory } from "@/router/api";
import { longtoken } from "@/router/api";
const HumanChat: React.FC = () => {
  const [messages, setMessages] = useState<
    { sender: "user" | "customer"; text: string }[]
  >([]);
  const [inputText, setInputText] = useState<string>("");
  const socketRef = useRef<WebSocket | null>(null); // WebSocket reference
  const connectedRef = useRef<boolean>(false); // WebSocket connection status

  useEffect(() => {
    const socketUrl = `ws://116.198.207.159:12349/api/ws?toUid=8&token=${longtoken}&service=mundo`;

    const connectWebSocket = () => {
      const ws = new WebSocket(socketUrl);
      ws.onopen = () => {
        //console.log("WebSocket 已连接");
        connectedRef.current = true;
        socketRef.current = ws;
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);

        if (message.from === "" && message?.content) {
          // 收到客服消息
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: "customer", text: message.content },
          ]);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket 连接出错", error);
        connectedRef.current = false;
      };

      ws.onclose = () => {
        //console.log("WebSocket 已关闭");
        connectedRef.current = false;
      };
    };

    connectWebSocket();

    return () => {
      // 清理 WebSocket 连接
      socketRef.current?.close();
      connectedRef.current = false;
    };
  }, []);

  // 发送用户消息
  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage = {
      type: 1,
      content: inputText,
    };

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      //Json序列化
      socketRef.current.send(JSON.stringify(userMessage));
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", text: inputText },
      ]);
      setInputText("");
    } else {
      console.error("WebSocket 未连接");
    }
  };
  // 删除聊天记录
  const handleDeleteChatHistory = async () => {
    try {
      await deleteChatHistory();
      setMessages([]); // 清空消息列表
      alert("聊天记录已删除");
    } catch (error) {
      console.error("Failed to delete chat history", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className={styles.box_styles_touchable}>
          <div className={styles.font_styles}>什么烂ai?转人工！</div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>人工客服</DialogTitle>
          <DialogDescription>
            你可以与我们亲切的客服人员进行实时对话。
          </DialogDescription>
        </DialogHeader>
        <ScrollArea>
          {/* 聊天区 */}
          <div className="flex flex-col space-y-2 max-h-[300px] overflow-y-auto mb-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                } gap-2`}
              >
                <div
                  className={`p-3 rounded-lg max-w-xs ${
                    message.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-800"
                  }`}
                >
                  <strong>
                    {message.sender === "user" ? "你: " : "客服: "}
                  </strong>
                  <span>{message.text}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* 输入框和发送按钮 */}
        <div className="flex items-center space-x-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 p-2 border rounded-md"
            placeholder="请输入你的问题..."
          />
          <Button
            onClick={handleSendMessage}
            className="text-white bg-blue-500 hover:bg-blue-600"
          >
            发送
          </Button>
          <Button onClick={handleDeleteChatHistory} variant="destructive">
            删除聊天记录
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HumanChat;
