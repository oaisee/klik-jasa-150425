
import { Send, Image, Paperclip } from 'lucide-react';
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
    <div className="p-3 bg-white border-t">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="text-gray-500">
          <Paperclip size={20} />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-500">
          <Image size={20} />
        </Button>
        
        <Input
          type="text"
          placeholder="Ketik pesan..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 mx-2"
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
