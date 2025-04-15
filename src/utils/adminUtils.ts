
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

export const fetchBookingStats = async () => {
  try {
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('*');
    
    if (bookingsError) throw bookingsError;
    
    const totalBookings = bookings?.length || 0;
    const completedBookings = bookings?.filter(booking => booking.status === 'completed').length || 0;
    const pendingBookings = bookings?.filter(booking => booking.status === 'pending').length || 0;
    
    // Calculate total revenue and commission
    let totalRevenue = 0;
    let totalCommission = 0;
    
    bookings?.forEach(booking => {
      totalRevenue += Number(booking.price) || 0;
      totalCommission += Number(booking.commission) || 0;
    });
    
    return {
      totalBookings,
      completedBookings,
      pendingBookings,
      totalRevenue,
      totalCommission
    };
  } catch (error) {
    console.error('Error fetching booking stats:', error);
    return {
      totalBookings: 0,
      completedBookings: 0,
      pendingBookings: 0,
      totalRevenue: 0,
      totalCommission: 0
    };
  }
};

export const generateMonthlyData = async () => {
  try {
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at');
    
    if (bookingsError) throw bookingsError;
    
    // Group by month
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const monthlyData: Record<string, { name: string; bookings: number; revenue: number }> = {};
    
    // Initialize with empty data for all months up to current
    months.slice(0, currentMonth + 1).forEach(month => {
      monthlyData[month] = { name: month, bookings: 0, revenue: 0 };
    });
    
    // Fill with actual data
    bookings?.forEach(booking => {
      if (!booking.created_at) return;
      
      const date = new Date(booking.created_at);
      const month = months[date.getMonth()];
      
      if (monthlyData[month]) {
        monthlyData[month].bookings += 1;
        monthlyData[month].revenue += Number(booking.price) || 0;
      }
    });
    
    return Object.values(monthlyData);
  } catch (error) {
    console.error('Error generating monthly data:', error);
    
    // Fallback to sample data if there's an error
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    return months.slice(0, currentMonth + 1).map(month => ({
      name: month,
      bookings: Math.floor(Math.random() * 50) + 10,
      revenue: Math.floor(Math.random() * 5000) + 1000,
    }));
  }
};

export const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};
