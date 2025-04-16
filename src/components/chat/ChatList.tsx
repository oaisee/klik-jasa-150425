
import { Smile, MessageSquareOff } from 'lucide-react';
import LoadingIndicator from '@/components/shared/LoadingIndicator';
import EmptyState from '@/components/shared/EmptyState';
import ChatListItem, { ChatListItemProps } from './ChatListItem';
import { Button } from '@/components/ui/button';

interface ChatItemData {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  isOnline?: boolean;
}

interface ChatListProps {
  loading: boolean;
  chats: ChatItemData[];
  searchQuery: string;
  onChatClick: (chatId: string) => void;
}

const ChatList = ({ loading, chats, searchQuery, onChatClick }: ChatListProps) => {
  if (loading) {
    return (
      <div className="py-10 flex justify-center">
        <LoadingIndicator size="lg" />
      </div>
    );
  }

  if (chats.length === 0) {
    if (searchQuery) {
      return (
        <EmptyState 
          icon={MessageSquareOff}
          title="Tidak ada hasil"
          description={`Tidak ada percakapan yang cocok dengan "${searchQuery}"`}
          action={
            <Button variant="outline" size="sm" onClick={() => {
              const event = { target: { value: '' } } as React.ChangeEvent<HTMLInputElement>;
              // We need to pass this to the parent component
            }}>
              Hapus pencarian
            </Button>
          }
        />
      );
    }
    
    return (
      <EmptyState 
        icon={Smile}
        title="Belum ada percakapan"
        description="Mulai percakapan dengan penyedia jasa atau pelanggan"
      />
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center px-1 mb-2">
        <h2 className="text-sm font-medium text-gray-500">Percakapan Terbaru</h2>
        <span className="text-xs text-gray-400">{chats.length} percakapan</span>
      </div>
      
      {chats.map((chat) => (
        <ChatListItem 
          key={chat.id}
          id={chat.id}
          name={chat.name}
          message={chat.lastMessage}
          time={chat.time}
          unread={chat.unread}
          avatar={chat.avatar}
          isOnline={chat.isOnline}
          onClick={() => onChatClick(chat.id)}
        />
      ))}
    </div>
  );
};

export default ChatList;
