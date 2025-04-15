
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Send, Smile } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import LoadingIndicator from '@/components/shared/LoadingIndicator';
import EmptyState from '@/components/shared/EmptyState';

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
    <div className="px-4 py-4 pb-20 animate-fade-in">
      <h1 className="text-xl font-bold mb-4">Pesan</h1>
      
      <div className="relative mb-6">
        <Input
          type="text"
          placeholder="Cari pesan"
          value={searchQuery}
          onChange={handleSearch}
          className="pl-10"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      </div>
      
      {loading ? (
        <div className="py-10 flex justify-center">
          <LoadingIndicator size="lg" />
        </div>
      ) : chats.length > 0 ? (
        chats.map((chat) => (
          <ChatListItem 
            key={chat.id}
            name={chat.name}
            message={chat.lastMessage}
            time={chat.time}
            unread={chat.unread}
            avatar={chat.avatar}
            onClick={() => handleChatClick(chat.id)}
          />
        ))
      ) : (
        <EmptyState 
          icon={Smile}
          title="Belum ada percakapan"
          description="Mulai percakapan dengan penyedia jasa atau pelanggan"
        />
      )}
    </div>
  );
};

interface ChatListItemProps {
  name: string;
  message: string;
  time: string;
  unread: number;
  avatar: string;
  onClick: () => void;
}

const ChatListItem = ({ name, message, time, unread, avatar, onClick }: ChatListItemProps) => {
  return (
    <Card className="mb-3 cursor-pointer hover:bg-gray-50 transition-colors" onClick={onClick}>
      <CardContent className="p-3 flex">
        <Avatar>
          <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover" />
        </Avatar>
        <div className="ml-3 flex-1">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">{name}</h3>
            <span className="text-xs text-gray-500">{time}</span>
          </div>
          <p className="text-sm text-gray-600 truncate">{message}</p>
        </div>
        {unread > 0 && (
          <div className="flex items-start ml-2">
            <span className="bg-marketplace-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unread}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

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

export default ChatPage;
