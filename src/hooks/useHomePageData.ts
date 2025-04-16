
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useServices } from './useServices';
import { Service } from '@/types/service';

export const useHomePageData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [hasNotifications, setHasNotifications] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { services, loading: servicesLoading, fetchServices } = useServices();
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error checking auth:', error);
        return;
      }
      
      setIsAuthenticated(!!data.session);
      
      if (data.session) {
        // Fetch wallet balance
        const { data: profileData } = await supabase
          .from('profiles')
          .select('wallet_balance')
          .eq('id', data.session.user.id)
          .single();
          
        setWalletBalance(profileData?.wallet_balance || 0);
        
        // Check for notifications (mock for now)
        setHasNotifications(Math.random() > 0.5);
      }
    };
    
    const init = async () => {
      await checkAuth();
      setIsLoading(false);
    };
    
    init();
  }, []);
  
  useEffect(() => {
    fetchServices(selectedCategory, searchQuery);
  }, [selectedCategory, searchQuery]);
  
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(prevCategory => prevCategory === category ? null : category);
  };
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  return {
    isLoading: isLoading || servicesLoading,
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
