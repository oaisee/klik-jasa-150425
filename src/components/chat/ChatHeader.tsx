
import { ArrowLeft, MoreVertical, Phone, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface ChatHeaderProps {
  chatPartner: {
    name: string;
    avatar: string;
    isOnline?: boolean;
  } | null;
}

const ChatHeader = ({ chatPartner }: ChatHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white px-4 py-3 flex items-center shadow-sm sticky top-0 z-10">
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
            <div className="relative">
              <Avatar className="h-10 w-10 mr-3">
                <img src={chatPartner.avatar} alt={chatPartner.name} className="object-cover" />
              </Avatar>
              {chatPartner.isOnline && (
                <span className="absolute bottom-0 right-3 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></span>
              )}
            </div>
            <div>
              <h2 className="font-semibold">{chatPartner.name}</h2>
              <p className="text-xs text-gray-500">
                {chatPartner.isOnline ? 'Online' : 'Terakhir dilihat 2 jam yang lalu'}
              </p>
            </div>
          </>
        )}
      </div>
      
      <div className="flex">
        <Button variant="ghost" size="icon" aria-label="Panggilan" className="text-gray-600">
          <Phone size={20} />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Video" className="text-gray-600">
          <Video size={20} />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Menu" className="text-gray-600">
          <MoreVertical size={20} />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
