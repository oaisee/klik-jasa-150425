
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import LoadingIndicator from '@/components/shared/LoadingIndicator';
import ChatHeader from '@/components/chat/ChatHeader';
import MessageList from '@/components/chat/MessageList';
import MessageInput from '@/components/chat/MessageInput';
import { chatListData } from '@/data/chatData';

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
  
  useEffect(() => {
    // Set document title based on chat partner
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
  
  const handleSendMessage = (newMessageText: string) => {
    // Add new message to list
    const message: Message = {
      id: Date.now().toString(),
      text: newMessageText,
      sender: 'me',
      timestamp: new Date(),
      read: false
    };
    
    setMessages([...messages, message]);
    
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
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingIndicator size="lg" />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <ChatHeader chatPartner={chatPartner} />
      <MessageList messages={messages} />
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatDetailPage;
