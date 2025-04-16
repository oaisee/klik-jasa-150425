import { Users, Briefcase, FileText, Database } from 'lucide-react';
import StatCard from './StatCard';
import { formatRupiah } from '@/utils/admin';

interface StatsGridProps {
  userStats: { totalUsers: number; providers: number; consumers: number };
  serviceStats: { totalServices: number; activeServices: number; categories: Record<string, number> };
  monthlyData: Array<{ name: string; bookings: number; revenue: number }>;
}

const StatsGrid = ({ userStats, serviceStats, monthlyData }: StatsGridProps) => {
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
        value={monthlyData.length > 0 ? 
          monthlyData[monthlyData.length - 1].bookings.toString() : "0"}
        trend={monthlyData.length > 1 ? 
          `${Math.floor((monthlyData[monthlyData.length - 1].bookings - monthlyData[monthlyData.length - 2].bookings) / 
          monthlyData[monthlyData.length - 2].bookings * 100)}% dari bulan lalu` : ""}
        trendPositive={monthlyData.length > 1 ? 
          monthlyData[monthlyData.length - 1].bookings >= monthlyData[monthlyData.length - 2].bookings : true}
      />
      <StatCard
        icon={<Database className="h-8 w-8 text-amber-500" />}
        title="Total Komisi"
        value={monthlyData.length > 0 ? 
          formatRupiah(monthlyData.reduce((sum, item) => sum + item.revenue, 0) * 0.05) : "Rp 0"}
        trend="5% dari transaksi"
        trendPositive={true}
      />
    </div>
  );
};

export default StatsGrid;
