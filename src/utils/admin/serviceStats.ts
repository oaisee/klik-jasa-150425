
import { supabase } from '@/integrations/supabase/client';

export const fetchServiceStats = async () => {
  try {
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('*');
    
    if (servicesError) throw servicesError;
    
    // Count services by category
    const categories: Record<string, number> = {};
    services.forEach(service => {
      const category = service.category || 'uncategorized';
      categories[category] = (categories[category] || 0) + 1;
    });
    
    return { 
      totalServices: services.length,
      activeServices: services.filter(service => service.status === 'active').length,
      categories
    };
  } catch (error) {
    console.error('Error fetching service stats:', error);
    return { totalServices: 0, activeServices: 0, categories: {} };
  }
};
