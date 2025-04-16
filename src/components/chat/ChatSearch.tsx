
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ChatSearchProps {
  searchQuery: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ChatSearch = ({ searchQuery, onChange }: ChatSearchProps) => {
  const handleClearSearch = () => {
    const event = {
      target: { value: '' }
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(event);
  };
  
  return (
    <div className="relative mb-6">
      <Input
        type="text"
        placeholder="Cari nama atau isi pesan..."
        value={searchQuery}
        onChange={onChange}
        className="pl-10 pr-10 bg-gray-50 border-gray-200"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      
      {searchQuery && (
        <Button 
          variant="ghost" 
          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0" 
          onClick={handleClearSearch}
        >
          <X size={16} className="text-gray-400" />
        </Button>
      )}
    </div>
  );
};

export default ChatSearch;
