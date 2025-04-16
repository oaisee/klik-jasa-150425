
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ServicesList from '@/components/ServicesList';
import { nearbyServices } from '@/data/mockData';
import SearchBar from '@/components/SearchBar';
import { Service } from '@/types/service';
import { ArrowLeft } from 'lucide-react';

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredServices, setFilteredServices] = useState<Service[]>(nearbyServices);
  
  useEffect(() => {
    document.title = 'Cari Jasa | KlikJasa';
  }, []);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query) {
      setFilteredServices(nearbyServices);
      return;
    }
    
    const lowercaseQuery = query.toLowerCase();
    const filtered = nearbyServices.filter(service => 
      service.title.toLowerCase().includes(lowercaseQuery) || 
      service.providerName?.toLowerCase().includes(lowercaseQuery) || false
    );
    
    setFilteredServices(filtered);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 animate-fade-in">
      <div className="bg-gradient-to-r from-blue-600 to-green-500 px-4 py-3 flex items-center shadow-sm z-10">
        <button 
          onClick={() => navigate('/')} 
          className="mr-3 text-white"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold text-left text-white">Cari Jasa</h1>
      </div>
      
      <div className="flex-1 p-4 pb-20 pt-5">
        <div className="mb-6">
          <SearchBar 
            onSearch={handleSearch} 
            placeholder="Cari jasa atau penyedia"
            className="z-0 shadow-lg"
          />
        </div>
        
        <div className="mt-6">
          <ServicesList 
            services={filteredServices} 
            title={searchQuery ? `Hasil Pencarian: "${searchQuery}"` : "Hasil Pencarian"} 
          />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
