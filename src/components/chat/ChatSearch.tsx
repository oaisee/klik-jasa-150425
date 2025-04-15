
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ChatSearchProps {
  searchQuery: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ChatSearch = ({ searchQuery, onChange }: ChatSearchProps) => {
  return (
    <div className="relative mb-6">
      <Input
        type="text"
        placeholder="Cari pesan"
        value={searchQuery}
        onChange={onChange}
        className="pl-10"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
    </div>
  );
};

export default ChatSearch;
