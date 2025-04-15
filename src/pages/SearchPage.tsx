
import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ServicesList from '@/components/ServicesList';
import { nearbyServices } from '@/data/mockData';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    document.title = 'Cari Jasa | KlikJasa';
  }, []);
  
  return (
    <div className="px-4 py-4 pb-20 animate-fade-in">
      <h1 className="text-xl font-bold mb-4">Cari Jasa</h1>
      
      <div className="relative mb-6">
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
      
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Kategori Populer</h2>
        <div className="flex flex-wrap gap-2">
          {['Bersih Rumah', 'Tukang', 'Fotografi', 'Salon', 'Bimbel'].map(tag => (
            <span 
              key={tag} 
              className="bg-gray-100 px-3 py-1.5 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="mt-6">
        <ServicesList services={nearbyServices} title="Hasil Pencarian" />
      </div>
    </div>
  );
};

export default SearchPage;
