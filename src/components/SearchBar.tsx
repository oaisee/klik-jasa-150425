import { Search } from 'lucide-react';
import { useState } from 'react';
interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string; // Add className prop for additional styling
}
const SearchBar = ({
  onSearch,
  placeholder = "Search for services...",
  className = ""
}: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (onSearch) {
        onSearch(searchQuery);
      }
    }
  };
  return;
};
export default SearchBar;