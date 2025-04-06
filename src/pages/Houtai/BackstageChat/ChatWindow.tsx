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
    <div className="flex-grow flex flex-col bg-slate-800">
      <div className="bg-slate-700 p-4 font-bold text-white border-b border-slate-600">
        {selectedContact?.name || "请选择联系人"}
      </div>

      <div className="flex-grow overflow-y-auto p-4 bg-slate-800">
        {selectedContact?.messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 p-3 rounded-lg max-w-md ${
              msg.sender === "me"
                ? "bg-slate-900 text-white self-end ml-auto"
                : "bg-slate-600 text-white mr-auto"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="p-4 flex bg-slate-700 border-t border-slate-600">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow mr-2 p-2 border bg-slate-800 text-white border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400"
          placeholder="输入消息..."
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-slate-900 text-white p-2 rounded-md flex items-center hover:bg-slate-800 transition-colors"
        >
          <Send className="mr-2" size={18} /> 发送
        </button>
      </div>
    </div>
  );
};
