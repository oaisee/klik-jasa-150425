
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ServicesList from '@/components/ServicesList';
import { nearbyServices } from '@/data/mockData';
import CategoryList from '@/components/CategoryList';
import SearchBar from '@/components/SearchBar';

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredServices, setFilteredServices] = useState(nearbyServices);
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
        service.providerName.toLowerCase().includes(lowercaseQuery)
      );
    }
    
    if (selectedCategory) {
      // Assuming services have a category property
      // This is a mock implementation since the original data doesn't have categories
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
      // This is a mock implementation
      const filtered = nearbyServices.filter(service => 
        service.category === category || 
        service.title.includes(category)
      );
      setFilteredServices(filtered);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 animate-fade-in">
      <div className="bg-white px-4 py-3 flex items-center shadow-sm z-10">
        <h1 className="text-lg font-semibold">Cari Jasa</h1>
      </div>
      
      <div className="flex-1 p-4 pb-20 pt-5">
        <div className="mb-6">
          <SearchBar 
            onSearch={handleSearch} 
            placeholder="Cari jasa atau penyedia"
            className="z-0"
          />
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Kategori</h2>
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
