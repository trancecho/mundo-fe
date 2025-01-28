import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useChatContext } from './ChatContext';

export const ChatSidebar: React.FC = () => {
  const { contacts, selectedContact, setSelectedContact } = useChatContext();

  return (
    <div className="w-1/4 bg-gray-100 p-4">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <MessageCircle className="mr-2" /> Chats
      </h2>
      {contacts.map(contact => (
        <div 
          key={contact.id} 
          className={`p-3 mb-2 cursor-pointer rounded ${
            selectedContact?.id === contact.id 
              ? 'bg-blue-500 text-white' 
              : 'hover:bg-gray-200'
          }`}
          onClick={() => setSelectedContact(contact)}
        >
          {contact.name}
        </div>
      ))}
    </div>
  );
};
