
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Service } from '@/types/service';

// Define mock services data
const mockServices = [{
  id: '1',
  image: '/placeholder.svg',
  title: 'Cleaning Service',
  providerName: 'Budi Santoso',
  rating: 4.8,
  price: 150000,
  distance: 0.8,
  category: 'Kebersihan'
}, {
  id: '2',
  image: '/placeholder.svg',
  title: 'Plumbing Repair',
  providerName: 'Ahmad Wijaya',
  rating: 4.5,
  price: 200000,
  distance: 1.2,
  category: 'Perbaikan'
}, {
  id: '3',
  image: '/placeholder.svg',
  title: 'Electrical Service',
  providerName: 'Siti Rahayu',
  rating: 4.7,
  price: 250000,
  distance: 1.5,
  category: 'Perbaikan'
}, {
  id: '4',
  image: '/placeholder.svg',
  title: 'Home Painting',
  providerName: 'Dewi Kusuma',
  rating: 4.6,
  price: 300000,
  distance: 2.0,
  category: 'Kreatif'
}, {
  id: '5',
  image: '/placeholder.svg',
  title: 'Kursus Matematika',
  providerName: 'Arief Wibowo',
  rating: 4.9,
  price: 350000,
  distance: 1.7,
  category: 'Pendidikan'
}, {
  id: '6',
  image: '/placeholder.svg',
  title: 'Jasa Angkut Barang',
  providerName: 'Joko Susilo',
  rating: 4.3,
  price: 175000,
  distance: 3.0,
  category: 'Transportasi'
}];

export const useHomePageData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [hasNotifications, setHasNotifications] = useState(false);
  const [services, setServices] = useState<Service[]>(mockServices);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.title = 'KlikJasa - Temukan Penyedia Jasa Terbaik';

    // Check authentication status and get profile data
    const checkAuthAndGetProfile = async () => {
      try {
        const {
          data: {
            session
          }
        } = await supabase.auth.getSession();
        if (session) {
          setIsAuthenticated(true);
          console.info("Index page auth check: Authenticated");

          // Get user profile including wallet balance
          const {
            data: profile,
            error
          } = await supabase.from('profiles').select('wallet_balance').eq('id', session.user.id).single();
          if (error) throw error;
          if (profile) {
            setWalletBalance(profile.wallet_balance);
          }

          // Check for notifications (placeholder for real notification system)
          // This could be replaced with a real notification check from the database
          setHasNotifications(true);
        } else {
          console.info("Index page auth check: Not authenticated");
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthAndGetProfile();
  }, []);

  useEffect(() => {
    // Filter services based on selected category and search query
    let filtered = mockServices;
    
    if (selectedCategory) {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        service => 
          service.title.toLowerCase().includes(query) || 
          service.providerName.toLowerCase().includes(query) ||
          service.category.toLowerCase().includes(query)
      );
    }
    
    setServices(filtered);
  }, [selectedCategory, searchQuery]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(prevCategory => prevCategory === category ? null : category);
  };
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return {
    isLoading,
    isAuthenticated,
    walletBalance,
    hasNotifications,
    services,
    selectedCategory,
    searchQuery,
    handleCategoryClick,
    handleSearch
  };
};
