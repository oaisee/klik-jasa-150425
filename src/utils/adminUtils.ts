
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
    // Since we can't query the bookings table yet, return mock data
    // We'll simulate random data for demonstration purposes
    const totalBookings = Math.floor(Math.random() * 500) + 50;
    const completedBookings = Math.floor(totalBookings * 0.7);
    const pendingBookings = totalBookings - completedBookings;
    
    // Calculate total revenue and commission
    const avgBookingPrice = 250000; // 250k IDR average
    const totalRevenue = totalBookings * avgBookingPrice;
    const totalCommission = totalRevenue * 0.05; // 5% commission
    
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
    // Get real data if available
    const { data: transactions, error } = await supabase
      .from('wallet_transactions')
      .select('amount, created_at, type')
      .order('created_at', { ascending: true });
      
    if (error) throw error;
    
    if (transactions && transactions.length > 0) {
      // Process real transaction data
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentYear = new Date().getFullYear();
      const monthlyData: Record<string, { bookings: number, revenue: number }> = {};
      
      // Initialize all months up to current month
      const currentMonth = new Date().getMonth();
      for (let i = 0; i <= currentMonth; i++) {
        monthlyData[months[i]] = { bookings: 0, revenue: 0 };
      }
      
      // Aggregate transaction data by month
      transactions.forEach(transaction => {
        const date = new Date(transaction.created_at);
        // Only include current year data
        if (date.getFullYear() === currentYear) {
          const month = months[date.getMonth()];
          if (monthlyData[month]) {
            if (transaction.type === 'commission') {
              monthlyData[month].bookings += 1;
            }
            monthlyData[month].revenue += transaction.amount;
          }
        }
      });
      
      // Convert to array format for charts
      return Object.entries(monthlyData).map(([name, data]) => ({
        name,
        bookings: data.bookings,
        revenue: data.revenue
      }));
    } else {
      // Generate mock data if no real data available
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentMonth = new Date().getMonth();
      
      // Create mock data for each month with gradually increasing values
      return months.slice(0, currentMonth + 1).map((month, index) => {
        // Base values that grow over time
        const baseBookings = 10 + (index * 5);
        const baseRevenue = 1000000 + (index * 200000);
        
        // Add some randomness
        const randomFactor = 0.8 + (Math.random() * 0.4); // 0.8 to 1.2
        
        return {
          name: month,
          bookings: Math.floor(baseBookings * randomFactor),
          revenue: Math.floor(baseRevenue * randomFactor),
        };
      });
    }
  } catch (error) {
    console.error('Error generating monthly data:', error);
    
    // Fallback to simple data if there's an error
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    return months.slice(0, currentMonth + 1).map(month => ({
      name: month,
      bookings: Math.floor(Math.random() * 50) + 10,
      revenue: Math.floor(Math.random() * 5000000) + 1000000,
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

// New utility function to compare dates and format them
export const formatDate = (dateString?: string, format: 'short' | 'long' = 'long') => {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    
    if (format === 'short') {
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
    
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

// New utility function for time ago formatting
export const formatTimeAgo = (dateString: string) => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffDay > 30) {
      return formatDate(dateString, 'short');
    } else if (diffDay > 0) {
      return `${diffDay} hari lalu`;
    } else if (diffHour > 0) {
      return `${diffHour} jam lalu`;
    } else if (diffMin > 0) {
      return `${diffMin} menit lalu`;
    } else {
      return 'Baru saja';
    }
  } catch (error) {
    console.error('Error calculating time ago:', error);
    return dateString;
  }
};
