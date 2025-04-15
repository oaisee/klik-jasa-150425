
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ServicesList from '@/components/ServicesList';
import { nearbyServices } from '@/data/mockData';
import CategoryList from '@/components/CategoryList';

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    document.title = 'Cari Jasa | KlikJasa';
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search logic would go here
  };
  
  return (
    <div className="px-4 py-4 pb-20 animate-fade-in">
      <h1 className="text-xl font-bold mb-4">Cari Jasa</h1>
      
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <Input
            type="text"
            placeholder="Cari jasa atau penyedia"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-12 pl-4 py-3 rounded-lg"
          />
          <Button 
            className="absolute right-1 top-1 bottom-1 px-3"
            variant="ghost"
            type="submit"
          >
            Cari
          </Button>
        </div>
      </form>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Kategori</h2>
        <CategoryList />
      </div>
      
      <div className="mt-6">
        <ServicesList services={nearbyServices} title="Hasil Pencarian" />
      </div>
    </div>
  );
};

export default SearchPage;
