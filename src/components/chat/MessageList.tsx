
import { useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { CheckCheck } from 'lucide-react';

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
    return format(date, 'HH:mm');
  };

  const formatMessageDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Hari ini';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Kemarin';
    } else {
      return format(date, 'dd MMMM yyyy');
    }
  };

  // Group messages by date
  const groupedMessages: { [key: string]: Message[] } = {};
  messages.forEach(message => {
    const dateKey = formatMessageDate(message.timestamp);
    if (!groupedMessages[dateKey]) {
      groupedMessages[dateKey] = [];
    }
    groupedMessages[dateKey].push(message);
  });
  
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
      {Object.keys(groupedMessages).map(dateKey => (
        <div key={dateKey} className="space-y-3">
          <div className="flex justify-center">
            <span className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full">
              {dateKey}
            </span>
          </div>
          
          {groupedMessages[dateKey].map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`
                max-w-[85%] p-3 rounded-lg break-words overflow-hidden 
                ${message.sender === 'me' 
                  ? 'bg-marketplace-primary text-white rounded-tr-none' 
                  : 'bg-white text-gray-800 rounded-tl-none shadow-sm'}
              `}>
                <p className="whitespace-pre-wrap overflow-hidden text-wrap">{message.text}</p>
                <div className={`text-xs mt-1 flex justify-end items-center gap-1
                  ${message.sender === 'me' ? 'text-blue-100' : 'text-gray-500'}
                `}>
                  {formatTime(message.timestamp)}
                  {message.sender === 'me' && (
                    <CheckCheck 
                      size={14} 
                      className={message.read ? 'text-blue-300' : 'text-blue-200/60'} 
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
