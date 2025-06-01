import React, { useState } from 'react'
import { Send } from 'lucide-react'
import { useChatContext } from './ChatContext'

export const ChatWindow: React.FC = () => {
  const { selectedContact, handleSendMessage } = useChatContext()
  const [message, setMessage] = useState('')

  const handleSend = () => {
    if (message.trim() && selectedContact) {
      handleSendMessage(selectedContact.id, message)
      setMessage('')
    }
  }

  return (
    <div className='flex flex-col flex-grow bg-slate-800'>
      <div className='p-4 font-bold text-white border-b bg-slate-700 border-slate-600'>
        {selectedContact?.name || '请选择联系人'}
      </div>

      <div className='flex-grow p-4 overflow-y-auto bg-slate-800'>
        {selectedContact?.messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 p-3 rounded-lg max-w-md ${
              msg.sender === 'me'
                ? 'bg-slate-900 text-white self-end ml-auto'
                : 'bg-slate-600 text-white mr-auto'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className='flex p-4 border-t bg-slate-700 border-slate-600'>
        <input
          type='text'
          value={message}
          onChange={e => setMessage(e.target.value)}
          className='flex-grow p-2 mr-2 text-white border rounded-md bg-slate-800 border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400'
          placeholder='输入消息...'
          onKeyPress={e => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          className='flex items-center p-2 text-white transition-colors rounded-md bg-slate-900 hover:bg-slate-800'
        >
          <Send className='mr-2' size={18} /> 发送
        </button>
      </div>
    </div>
  )
}
