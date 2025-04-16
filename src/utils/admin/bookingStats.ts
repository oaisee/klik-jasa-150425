
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
