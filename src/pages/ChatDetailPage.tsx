
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Image, Paperclip, MoreVertical } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import LoadingIndicator from '@/components/shared/LoadingIndicator';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: Date;
  read: boolean;
}

const ChatDetailPage = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [chatPartner, setChatPartner] = useState<{ name: string; avatar: string } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  useEffect(() => {
    document.title = chatPartner ? `Chat dengan ${chatPartner.name} | KlikJasa` : 'Chat | KlikJasa';
  }, [chatPartner]);
  
  useEffect(() => {
    const fetchChatData = async () => {
      setLoading(true);
      
      // Check if user is logged in
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Silakan login terlebih dahulu");
        navigate('/login');
        return;
      }
      
      // In a real app, we would fetch chat partner details and messages from database
      // For now, use mock data
      const mockChatData = chatListData.find(chat => chat.id === chatId);
      
      if (mockChatData) {
        setChatPartner({
          name: mockChatData.name,
          avatar: mockChatData.avatar
        });
        
        // Generate mock messages
        const mockMessages: Message[] = [
          {
            id: '1',
            text: 'Halo, saya tertarik dengan jasa yang Anda tawarkan',
            sender: 'me',
            timestamp: new Date(Date.now() - 3600000 * 5), // 5 hours ago
            read: true
          },
          {
            id: '2',
            text: 'Terima kasih telah menghubungi. Ada yang bisa saya bantu?',
            sender: 'other',
            timestamp: new Date(Date.now() - 3600000 * 4), // 4 hours ago
            read: true
          },
          {
            id: '3',
            text: 'Saya ingin booking untuk hari Jumat mendatang. Apakah tersedia?',
            sender: 'me',
            timestamp: new Date(Date.now() - 3600000 * 3), // 3 hours ago
            read: true
          },
          {
            id: '4',
            text: mockChatData.lastMessage,
            sender: 'other',
            timestamp: new Date(Date.now() - 3600000 * 1), // 1 hour ago
            read: false
          }
        ];
        
        setMessages(mockMessages);
      } else {
        toast.error("Chat tidak ditemukan");
        navigate('/chat');
      }
      
      setLoading(false);
    };
    
    fetchChatData();
  }, [chatId, navigate]);
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Add new message to list
    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'me',
      timestamp: new Date(),
      read: false
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
    
    // In a real app, we would save the message to the database
    // and potentially trigger a notification
    
    // Simulate reply after 1 second
    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Pesan diterima, terima kasih!',
        sender: 'other',
        timestamp: new Date(),
        read: false
      };
      
      setMessages(prev => [...prev, reply]);
    }, 1000);
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingIndicator size="lg" />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center shadow-sm">
        <button 
          onClick={() => navigate('/chat')} 
          className="mr-3"
          aria-label="Kembali"
        >
          <ArrowLeft size={24} />
        </button>
        
        <div className="flex items-center flex-1">
          {chatPartner && (
            <>
              <Avatar className="h-10 w-10 mr-3">
                <img src={chatPartner.avatar} alt={chatPartner.name} className="object-cover" />
              </Avatar>
              <div>
                <h2 className="font-semibold">{chatPartner.name}</h2>
                <p className="text-xs text-gray-500">Online</p>
              </div>
            </>
          )}
        </div>
        
        <Button variant="ghost" size="icon" aria-label="Menu">
          <MoreVertical size={20} />
        </Button>
      </div>
      
      {/* Messages */}
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
      
      {/* Input */}
      <div className="p-3 bg-white border-t">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="text-gray-500">
            <Paperclip size={20} />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-500">
            <Image size={20} />
          </Button>
          
          <Input
            type="text"
            placeholder="Ketik pesan..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 mx-2"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          
          <Button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            size="icon"
            className="bg-marketplace-primary text-white hover:bg-marketplace-primary/90"
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Mock data (same as in ChatPage)
const chatListData = [
  {
    id: '1',
    name: 'Budi Santoso',
    lastMessage: 'Saya akan datang tepat waktu besok pagi',
    time: '10:23',
    unread: 2,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    id: '2',
    name: 'Siti Nuraini',
    lastMessage: 'Terima kasih atas pelayanannya',
    time: '09:15',
    unread: 0,
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    id: '3',
    name: 'Ahmad Rizki',
    lastMessage: 'Apakah Anda masih tersedia untuk hari Jumat?',
    time: 'Kemarin',
    unread: 0,
    avatar: 'https://randomuser.me/api/portraits/men/55.jpg'
  }
];

export default ChatDetailPage;
