import React from "react";
import { MessageCircle } from "lucide-react";
import { useChatContext } from "./ChatContext";

export const ChatSidebar: React.FC = () => {
  const { contacts, selectedContact, setSelectedContact } = useChatContext();

  return (
    <div className="w-1/4 p-4 bg-slate-700 border-r border-slate-600">
      <h2 className="flex items-center mb-4 text-xl font-bold text-white">
        <MessageCircle className="mr-2" /> 聊天列表
      </h2>
      {contacts.map((contact) => (
        <div
          key={contact.id}
          className={`p-3 mb-2 cursor-pointer rounded-md transition-colors ${
            selectedContact?.id === contact.id
              ? "bg-slate-900 text-white"
              : "text-slate-200 hover:bg-slate-600"
          }`}
          onClick={() => setSelectedContact(contact)}
        >
          {contact.name}
        </div>
      ))}
    </div>
  );
};
