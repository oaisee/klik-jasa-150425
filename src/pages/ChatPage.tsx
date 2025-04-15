
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { chatListData } from '@/data/chatData';
import ChatPageHeader from '@/components/chat/ChatPageHeader';
import ChatSearch from '@/components/chat/ChatSearch';
import ChatList from '@/components/chat/ChatList';

const ChatPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [chats, setChats] = useState(chatListData);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Pesan | KlikJasa';
    
    // Check if user is logged in
    const checkAuth = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Silakan login terlebih dahulu");
        navigate('/login');
        return;
      }
      
      setUserId(session.user.id);
      
      // In a real app, we would fetch chats from database here
      // const { data, error } = await supabase
      //   .from('chats')
      //   .select('*')
      //   .eq('user_id', session.user.id);
      
      // if (error) {
      //   console.error('Error fetching chats:', error);
      //   toast.error('Gagal memuat pesan');
      // } else {
      //   setChats(data);
      // }
      
      setLoading(false);
    };
    
    checkAuth();
  }, [navigate]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query) {
      const filtered = chatListData.filter(chat => 
        chat.name.toLowerCase().includes(query) || 
        chat.lastMessage.toLowerCase().includes(query)
      );
      setChats(filtered);
    } else {
      setChats(chatListData);
    }
  };
  
  const handleChatClick = (chatId: string) => {
    navigate(`/chat/${chatId}`);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 animate-fade-in">
      <ChatPageHeader />
      
      <div className="flex-1 p-4 pb-20">
        <ChatSearch 
          searchQuery={searchQuery} 
          onChange={handleSearch} 
        />
        
        <ChatList 
          loading={loading}
          chats={chats}
          onChatClick={handleChatClick}
        />
      </div>
    </div>
  );
};

export default ChatPage;
