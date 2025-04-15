
import { Smile } from 'lucide-react';
import LoadingIndicator from '@/components/shared/LoadingIndicator';
import EmptyState from '@/components/shared/EmptyState';
import ChatListItem, { ChatListItemProps } from './ChatListItem';

interface ChatItemData {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
}

interface ChatListProps {
  loading: boolean;
  chats: ChatItemData[];
  onChatClick: (chatId: string) => void;
}

const ChatList = ({ loading, chats, onChatClick }: ChatListProps) => {
  if (loading) {
    return (
      <div className="py-10 flex justify-center">
        <LoadingIndicator size="lg" />
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <EmptyState 
        icon={Smile}
        title="Belum ada percakapan"
        description="Mulai percakapan dengan penyedia jasa atau pelanggan"
      />
    );
  }

  return (
    <>
      {chats.map((chat) => (
        <ChatListItem 
          key={chat.id}
          id={chat.id}
          name={chat.name}
          message={chat.lastMessage}
          time={chat.time}
          unread={chat.unread}
          avatar={chat.avatar}
          onClick={() => onChatClick(chat.id)}
        />
      ))}
    </>
  );
};

export default ChatList;
