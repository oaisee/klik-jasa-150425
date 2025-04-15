
import { useRef, useEffect } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: Date;
  read: boolean;
}

interface MessageListProps {
  messages: Message[];
}

const MessageList = ({ messages }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div 
          key={message.id} 
          className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
        >
          <div className={`
            max-w-[80%] p-3 rounded-lg break-words overflow-hidden
            ${message.sender === 'me' 
              ? 'bg-marketplace-primary text-white rounded-tr-none' 
              : 'bg-white text-gray-800 rounded-tl-none shadow-sm'}
          `}>
            <p className="whitespace-pre-wrap overflow-hidden text-wrap">{message.text}</p>
            <div className={`text-xs mt-1 flex justify-end
              ${message.sender === 'me' ? 'text-blue-100' : 'text-gray-500'}
            `}>
              {formatTime(message.timestamp)}
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
