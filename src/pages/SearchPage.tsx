
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ServicesList from '@/components/ServicesList';
import { nearbyServices } from '@/data/mockData';
import CategoryList from '@/components/CategoryList';
import SearchBar from '@/components/SearchBar';
import { Service } from '@/types/service';
import { ArrowLeft } from 'lucide-react';
import { getCategoryByName } from '@/utils/categories';

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredServices, setFilteredServices] = useState<Service[]>(nearbyServices);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  useEffect(() => {
    document.title = 'Cari Jasa | KlikJasa';
  }, []);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query && !selectedCategory) {
      setFilteredServices(nearbyServices);
      return;
    }
    
    let filtered = nearbyServices;
    
    if (query) {
      const lowercaseQuery = query.toLowerCase();
      filtered = filtered.filter(service => 
        service.title.toLowerCase().includes(lowercaseQuery) || 
        service.providerName?.toLowerCase().includes(lowercaseQuery) || false
      );
    }
    
    if (selectedCategory) {
      // Match either by category name or by title containing the category
      const category = getCategoryByName(selectedCategory);
      filtered = filtered.filter(service => 
        service.category === selectedCategory || 
        service.title.includes(selectedCategory)
      );
    }
    
    setFilteredServices(filtered);
  };
  
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(prevCategory => prevCategory === category ? null : category);
    
    // Apply filtering based on the selected category
    if (selectedCategory === category) {
      // If clicking the same category, clear the filter
      setFilteredServices(nearbyServices);
    } else {
      // Filter by the new selected category
      const filtered = nearbyServices.filter(service => 
        service.category === category || 
        service.title.includes(category)
      );
      setFilteredServices(filtered);
    }
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
        
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 text-left bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">Kategori</h2>
          <CategoryList 
            layout="row" 
            onCategoryClick={handleCategoryClick} 
            selectedCategory={selectedCategory}
          />
        </div>
        
        <div className="mt-6">
          <ServicesList 
            services={filteredServices} 
            title={selectedCategory ? `Kategori: ${selectedCategory}` : (searchQuery ? `Hasil Pencarian: "${searchQuery}"` : "Hasil Pencarian")} 
          />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
