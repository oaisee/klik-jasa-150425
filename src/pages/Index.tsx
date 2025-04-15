
import SearchBar from '@/components/SearchBar';
import CategoryList from '@/components/CategoryList';
import ServicesList from '@/components/ServicesList';
import { nearbyServices, popularServices } from '@/data/mockData';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  // Set document title
  useEffect(() => {
    document.title = 'KlikJasa - Temukan Jasa Lokal';
    
    // Log to verify the component is rendering
    console.log("Index page mounted");
    
    // Check auth status for debugging
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      console.log("Index page auth check:", data.session ? "Authenticated" : "Not authenticated");
    };
    
    checkAuth();
  }, []);

  return (
    <div className="px-4 py-4 animate-fade-in">
      <div className="flex items-center mb-5">
        <div className="w-10 h-10 mr-2">
          <img src="/lovable-uploads/3e7ce3dd-6c4b-47e9-971d-7483e3d4ab64.png" alt="KlikJasa Logo" className="w-full h-full" />
        </div>
        <h1 className="text-xl font-bold text-marketplace-dark">KlikJasa</h1>
      </div>

      <div className="mb-6">
        <SearchBar />
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Kategori</h2>
        <CategoryList />
      </div>

      <div className="mb-8">
        <ServicesList services={nearbyServices} title="Jasa Terdekat" />
      </div>

      <div className="mb-8">
        <ServicesList services={popularServices} title="Jasa Populer" />
      </div>
    </div>
  );
};

export default Index;
