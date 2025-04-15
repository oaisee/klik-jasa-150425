
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import Layout from '@/components/Layout';

const ChatPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.title = 'Pesan | KlikJasa';
  }, []);
  
  return (
    <Layout>
      <div className="px-4 py-4 animate-fade-in">
        <h1 className="text-xl font-bold mb-4">Pesan</h1>
        
        <div className="relative mb-6">
          <Input
            type="text"
            placeholder="Cari pesan"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
        
        {chatListData.map((chat) => (
          <ChatListItem 
            key={chat.id}
            name={chat.name}
            message={chat.lastMessage}
            time={chat.time}
            unread={chat.unread}
            avatar={chat.avatar}
          />
        ))}
        
        {chatListData.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
            <p>Belum ada percakapan</p>
            <Button variant="outline" className="mt-4">Mulai Percakapan</Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

interface ChatListItemProps {
  name: string;
  message: string;
  time: string;
  unread: number;
  avatar: string;
}

const ChatListItem = ({ name, message, time, unread, avatar }: ChatListItemProps) => {
  return (
    <Card className="mb-3 cursor-pointer hover:bg-gray-50 transition-colors">
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
