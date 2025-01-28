import React from 'react';
import { ChatSidebar } from './ChatSidebar';
import { ChatWindow } from './ChatWindow';
import { ChatProvider } from './ChatContext';
import style from './BackstageChat.module.css';

const MultiPersonChat: React.FC = () => {
  return (
    <ChatProvider>
      <div className={style.container}>
        <ChatSidebar />
        <ChatWindow />
      </div>
    </ChatProvider>
  );
};

export default MultiPersonChat;
