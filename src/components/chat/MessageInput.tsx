
import { Send, Image, Paperclip, Smile, Mic } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

const MessageInput = ({ onSendMessage }: MessageInputProps) => {
  const [newMessage, setNewMessage] = useState('');
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    onSendMessage(newMessage);
    setNewMessage('');
  };
  
  return (
    <div className="p-3 bg-white border-t sticky bottom-0">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100">
          <Paperclip size={20} />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100">
          <Image size={20} />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100">
          <Mic size={20} />
        </Button>
        
        <Input
          type="text"
          placeholder="Ketik pesan..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border-gray-200 focus:ring-marketplace-primary"
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        
        <Button 
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
          size="icon"
          className="bg-marketplace-primary text-white hover:bg-marketplace-primary/90"
        >
          <Send size={18} />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
