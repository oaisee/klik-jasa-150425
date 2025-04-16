
import { Avatar } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

export interface ChatListItemProps {
  id: string;
  name: string;
  message: string;
  time: string;
  unread: number;
  avatar: string;
  isOnline?: boolean;
  onClick: () => void;
}

const ChatListItem = ({ name, message, time, unread, avatar, isOnline = false, onClick }: ChatListItemProps) => {
  return (
    <Card className="mb-3 cursor-pointer hover:bg-gray-50 transition-colors border-gray-100" onClick={onClick}>
      <CardContent className="p-3 flex items-center">
        <div className="relative">
          <Avatar>
            <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover" />
          </Avatar>
          {isOnline && (
            <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></span>
          )}
        </div>
        <div className="ml-3 flex-1 overflow-hidden">
          <div className="flex justify-between items-center">
            <h3 className={`font-semibold ${unread > 0 ? 'text-gray-900' : 'text-gray-700'}`}>{name}</h3>
            <span className="text-xs text-gray-500 whitespace-nowrap">{time}</span>
          </div>
          <p className={`text-sm ${unread > 0 ? 'text-gray-800 font-medium' : 'text-gray-500'} truncate pr-2`}>
            {message}
          </p>
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
