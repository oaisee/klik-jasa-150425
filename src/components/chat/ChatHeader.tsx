
import { ArrowLeft, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface ChatHeaderProps {
  chatPartner: {
    name: string;
    avatar: string;
  } | null;
}

const ChatHeader = ({ chatPartner }: ChatHeaderProps) => {
  const navigate = useNavigate();
  
  return (
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
  );
};

export default ChatHeader;
