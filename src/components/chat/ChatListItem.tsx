
import { Avatar } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

export interface ChatListItemProps {
  id: string;
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

export default ChatListItem;
