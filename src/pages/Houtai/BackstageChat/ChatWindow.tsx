import React, { useState } from "react";
import { Send } from "lucide-react";
import { useChatContext } from "./ChatContext";

export const ChatWindow: React.FC = () => {
  const { selectedContact, handleSendMessage } = useChatContext();
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() && selectedContact) {
      handleSendMessage(selectedContact.id, message);
      setMessage("");
    }
  };

  return (
    <div className="flex-grow flex flex-col">
      <div className="bg-gray-100 p-4 font-bold">{selectedContact?.name}</div>

      <div className="flex-grow overflow-y-auto p-4">
        {selectedContact?.messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded max-w-md ${
              msg.sender === "me"
                ? "bg-blue-500 text-white self-end ml-auto"
                : "bg-gray-200 text-black mr-auto"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="p-4 flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow mr-2 p-2 border rounded"
          placeholder="Type a message..."
          onKeyUp={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white p-2 rounded flex items-center"
        >
          <Send className="mr-2" /> Send
        </button>
      </div>
    </div>
  );
};
