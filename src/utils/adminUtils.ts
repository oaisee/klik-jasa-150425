
import { supabase } from '@/integrations/supabase/client';

export const fetchUserStats = async () => {
  try {
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
    
    if (profilesError) throw profilesError;
    
    const totalUsers = profiles.length;
    const providers = profiles.filter(profile => profile.is_provider).length;
    const consumers = totalUsers - providers;
    
    return { totalUsers, providers, consumers };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return { totalUsers: 0, providers: 0, consumers: 0 };
  }
};

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

export const generateMonthlyData = () => {
  // This would ideally fetch real transaction data from the database
  // For now we'll generate sample data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  
  return months.slice(0, currentMonth + 1).map(month => ({
    name: month,
    bookings: Math.floor(Math.random() * 50) + 10,
    revenue: Math.floor(Math.random() * 5000) + 1000,
  }));
};

export const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};
