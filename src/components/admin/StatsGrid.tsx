
import { Users, Briefcase, FileText, Database } from 'lucide-react';
import StatCard from './StatCard';
import { formatRupiah } from '@/utils/admin';

interface StatsGridProps {
  userStats: { totalUsers: number; providers: number; consumers: number };
  serviceStats: { totalServices: number; activeServices: number; categories: Record<string, number> };
  monthlyData: Array<{ name: string; bookings: number; revenue: number }>;
}

const StatsGrid = ({ userStats, serviceStats, monthlyData }: StatsGridProps) => {
  // Calculate monthly bookings growth
  const calculateBookingsGrowth = () => {
    if (monthlyData.length < 2) return { value: 0, positive: true };
    
    const currentMonthBookings = monthlyData[monthlyData.length - 1].bookings;
    const previousMonthBookings = monthlyData[monthlyData.length - 2].bookings;
    
    if (previousMonthBookings === 0) return { value: 100, positive: true };
    
    const growthPercentage = Math.round(
      ((currentMonthBookings - previousMonthBookings) / previousMonthBookings) * 100
    );
    
    return { 
      value: Math.abs(growthPercentage), 
      positive: growthPercentage >= 0 
    };
  };
  
  // Calculate total commission (5% of all revenue)
  const calculateTotalCommission = () => {
    const totalRevenue = monthlyData.reduce((sum, item) => sum + item.revenue, 0);
    return totalRevenue * 0.05; // 5% commission
  };
  
  const bookingsGrowth = calculateBookingsGrowth();
  const totalCommission = calculateTotalCommission();
  
  // Get current month bookings
  const currentMonthBookings = monthlyData.length > 0 
    ? monthlyData[monthlyData.length - 1].bookings 
    : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon={<Users className="h-8 w-8 text-blue-500" />}
        title="Total Pengguna"
        value={userStats.totalUsers.toString()}
        trend={`${userStats.providers} penyedia jasa`}
        trendPositive={true}
      />
      <StatCard
        icon={<Briefcase className="h-8 w-8 text-green-500" />}
        title="Layanan Aktif"
        value={serviceStats.activeServices.toString()}
        trend={`dari ${serviceStats.totalServices} layanan`}
        trendPositive={true}
      />
      <StatCard
        icon={<FileText className="h-8 w-8 text-purple-500" />}
        title="Transaksi Bulan Ini"
        value={currentMonthBookings.toString()}
        trend={monthlyData.length > 1 
          ? `${bookingsGrowth.value}% ${bookingsGrowth.positive ? 'naik' : 'turun'} dari bulan lalu` 
          : "Data bulan sebelumnya tidak tersedia"}
        trendPositive={bookingsGrowth.positive}
      />
      <StatCard
        icon={<Database className="h-8 w-8 text-amber-500" />}
        title="Total Komisi"
        value={formatRupiah(totalCommission)}
        trend="5% dari total transaksi"
        trendPositive={true}
      />
    </div>
  );
};

export default StatsGrid;
