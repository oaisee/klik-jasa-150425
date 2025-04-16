
import { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import CategoryList from '@/components/CategoryList';
import ServicesList from '@/components/ServicesList';
import { Service } from '@/types/service';

interface HomeContentProps {
  services: Service[];
  selectedCategory: string | null;
  searchQuery: string;
  onCategoryClick: (category: string) => void;
  onSearch: (query: string) => void;
}

const HomeContent = ({ 
  services, 
  selectedCategory, 
  searchQuery, 
  onCategoryClick, 
  onSearch 
}: HomeContentProps) => {
  
  const getServicesTitle = () => {
    if (selectedCategory) {
      return `Layanan ${selectedCategory}`;
    }
    if (searchQuery) {
      return `Hasil Pencarian: "${searchQuery}"`;
    }
    return "Penyedia Jasa Terdekat";
  };

  return (
    <>
      <div className="mb-6">
        <SearchBar 
          onSearch={onSearch} 
          placeholder="Cari layanan atau penyedia..." 
          className="rounded-xl shadow-md"
        />
      </div>
      
      <div className="mb-6">
        <CategoryList onCategoryClick={onCategoryClick} />
      </div>
      
      <ServicesList services={services} title={getServicesTitle()} />
    </>
  );
};

export default HomeContent;
