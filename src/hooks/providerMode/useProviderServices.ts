
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useProviderServices = (userId: string | null) => {
  const [hasServices, setHasServices] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkUserServices = async () => {
    if (!userId) return;
    
    try {
      // Check if user has any services
      const { data: services, error: servicesError } = await supabase
        .from('services')
        .select('id')
        .eq('provider_id', userId)
        .limit(1);
        
      if (servicesError) throw servicesError;
      
      setHasServices(services && services.length > 0);
    } catch (error) {
      console.error('Error checking services:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (userId) {
      checkUserServices();
    }
  }, [userId]);

  return {
    hasServices,
    loading,
    checkUserServices
  };
};
