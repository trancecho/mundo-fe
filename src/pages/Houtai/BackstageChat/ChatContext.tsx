import React, {
  createContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { Contact } from "./types";
import { getFriendsList } from "../../../router/api";

// 定义 ChatContext 的类型
interface ChatContextType {
  contacts: Contact[]; // 聊天联系人列表
  selectedContact: Contact | null; // 当前选中的联系人
  setSelectedContact: (contact: Contact | null) => void; // 设置选中的联系人
  handleSendMessage: (contactId: number, message: string) => void; // 发送消息的函数
  socketRef: React.RefObject<WebSocket | null>; // WebSocket 的引用
  connectedRef: React.RefObject<boolean>; // WebSocket 是否连接的状态
}

// 定义 Friend 类型
interface Friend {
  user_id: number;
  friend_id: number;
  status: number;
}

// 创建一个 Context，用于在组件树中传递数据
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// 定义 ChatProvider 的 props，包含 children，表示它包裹的子组件
interface ChatProviderProps {
  children: ReactNode;
}
const token = localStorage.getItem("longtoken");
const uid = token ? JSON.parse(atob(token.split(".")[1])).user_id : null;

const WebSocketUrl = "ws://116.198.207.159:12349/api/ws";

// ChatProvider 组件：提供所有的聊天状态和方法
export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  // 管理聊天状态
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // WebSocket 相关的引用
  const socketRef = useRef<WebSocket | null>(null);
  const connectedRef = useRef<boolean>(false);

  // 初始化联系人列表
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await getFriendsList(token as string);
        //console.log("接口返回数据：", response.data.friends);

        // 让 TypeScript 知道 `friends` 的类型
        const friends: Friend[] = response.data.friends;

        // 去重
        const uniqueFriends = Array.from(
          new Map(friends.map((friend) => [friend.friend_id, friend])).values()
        );

        const formattedContacts = uniqueFriends.map((friend) => ({
          id: friend.friend_id,
          name: `用户${friend.friend_id}`,
          messages: [] as any[],
        }));

        setContacts(formattedContacts);
        //console.log("联系人更新后：", formattedContacts);
      } catch (error) {
        console.error("获取联系人列表失败", error);
      }
    };

    fetchContacts();
  }, []);

  // 在 useEffect 中监听 selectedContact 的变化
  useEffect(() => {
    if (selectedContact) {
      // 清空当前联系人消息
      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact.id === selectedContact.id
            ? { ...contact, messages: [] } // 清空消息
            : contact
        )
      );
    }
  }, [selectedContact]); // 监听 selectedContact 变化

  // 设置 WebSocket 连接，当选中的联系人发生变化时重新连接 WebSocket
  useEffect(() => {
    // 如果没有选中的联系人，跳过 WebSocket 连接的创建
    if (!selectedContact?.id) return;

    const token = localStorage.getItem("longtoken");
    const socket = new WebSocket(
      `${WebSocketUrl}?toUid=${selectedContact.id}&token=${token}`
    );

    // WebSocket 连接成功的回调
    socket.onopen = () => {
      //console.log("WebSocket 已连接");
      connectedRef.current = true;
      socketRef.current = socket;
    };

    socket.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      //console.log("收到的WebSocket信息:", newMessage);
      if (!newMessage.from || !newMessage.content) {
        return;
      }
      const fromParts = newMessage.from.split("->");

      if (fromParts.length !== 2) {
        console.warn("无效的消息格式:", newMessage);
        return;
      }

      const [senderId, receiverId] = fromParts.map(Number); // 转换为数字
      const sender: "me" | "other" = senderId === uid ? "me" : "other";

      // 判断消息是发送给当前选中的联系人
      if (receiverId === uid) {
        // 如果消息是发送给当前选中的联系人，直接渲染
        setContacts((prevContacts) =>
          prevContacts.map((contact) =>
            contact.id === senderId
              ? {
                  ...contact,
                  messages: [
                    ...contact.messages,
                    { sender, text: newMessage.content },
                  ],
                }
              : contact
          )
        );
      } else {
        // 如果消息是发送给其他联系人，放到该联系人聊天记录中
        setContacts((prevContacts) =>
          prevContacts.map((contact) =>
            contact.id === receiverId
              ? {
                  ...contact,
                  messages: [
                    ...contact.messages,
                    { sender, text: newMessage.content },
                  ],
                }
              : contact
          )
        );
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket 连接出错", error);
      connectedRef.current = false;
    };

    socket.onclose = () => {
      //console.log("WebSocket 已关闭");
      connectedRef.current = false;
    };

    return () => {
      socket.close();
      connectedRef.current = false;
    };
  }, [selectedContact]);

  const handleSendMessage = (contactId: number, message: string) => {
    // 发送消息到 WebSocket 服务器
    if (socketRef.current) {
      const payload = { type: 1, content: message };
      socketRef.current.send(JSON.stringify(payload));
    }

    // 更新选中的联系人消息
    if (selectedContact && selectedContact.id === contactId) {
      setSelectedContact((prevSelectedContact) => ({
        ...prevSelectedContact!,
        messages: [
          ...prevSelectedContact!.messages,
          { sender: "me", text: message },
        ],
      }));
    }

    // 同步更新联系人列表中的消息
    setContacts((prevContacts) =>
      prevContacts.map((contact) =>
        contact.id === contactId
          ? {
              ...contact,
              messages: [...contact.messages, { sender: "me", text: message }],
            }
          : contact
      )
    );
  };

  return (
    <ChatContext.Provider
      value={{
        contacts,
        selectedContact,
        setSelectedContact,
        handleSendMessage,
        socketRef,
        connectedRef,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = React.useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
