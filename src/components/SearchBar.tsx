
import { Search } from 'lucide-react';

const SearchBar = () => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Search for services..."
        className="w-full pl-10 pr-4 py-3.5 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-marketplace-primary focus:border-transparent shadow-sm"
      />
    </div>
  );
};

export default SearchBar;
