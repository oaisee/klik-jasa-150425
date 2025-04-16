
import { useState, useEffect, useCallback } from 'react';
import { fetchUserStats, fetchServiceStats, generateMonthlyData } from '@/utils/adminUtils';
import DashboardHeader from './DashboardHeader';
import ConnectionStatusAlert from './ConnectionStatusAlert';
import StatsGrid from './StatsGrid';
import CategoryDistributionChart from './charts/CategoryDistributionChart';
import UserTypesChart from './charts/UserTypesChart';
import MonthlyTrendsChart from './charts/MonthlyTrendsChart';
import RecentActivitiesList from './RecentActivitiesList';
import PopularServicesList from './PopularServicesList';
import VerificationStatsWidget from './verification/VerificationStatsWidget';
import LoadingIndicator from '@/components/shared/LoadingIndicator';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface AdminDashboardContentProps {
  connectionStatus: { success: boolean; message: string } | null;
}

const AdminDashboardContent = ({ connectionStatus }: AdminDashboardContentProps) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userStats, setUserStats] = useState({ totalUsers: 0, providers: 0, consumers: 0 });
  const [serviceStats, setServiceStats] = useState({ totalServices: 0, activeServices: 0, categories: {} });
  const [monthlyData, setMonthlyData] = useState<Array<{ name: string; bookings: number; revenue: number }>>([]);
  const [componentsKey, setComponentsKey] = useState(Date.now());

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const users = await fetchUserStats();
      const services = await fetchServiceStats();
      const monthly = await generateMonthlyData();
      
      setUserStats(users);
      setServiceStats(services);
      setMonthlyData(monthly);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.error("Gagal memuat data dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadDashboardData();
      // Force re-render children by updating key
      setComponentsKey(Date.now());
      toast.success("Data dashboard berhasil disegarkan");
    } catch (error) {
      console.error("Error refreshing dashboard data:", error);
      toast.error("Gagal menyegarkan data dashboard");
    } finally {
      setRefreshing(false);
    }
  };

  // Transform category data for pie chart
  const categoryData = Object.entries(serviceStats.categories).map(([name, value]) => ({ 
    name, 
    value: value as number 
  }));

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <LoadingIndicator size="lg" />
        <p className="text-gray-500">Memuat data dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <DashboardHeader />
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh} 
          disabled={refreshing}
          className="flex items-center gap-1"
        >
          <RefreshCw size={16} className={`${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Menyegarkan...' : 'Segarkan Data'}</span>
        </Button>
      </div>
      
      <ConnectionStatusAlert connectionStatus={connectionStatus} />
      
      <StatsGrid 
        userStats={userStats} 
        serviceStats={serviceStats} 
        monthlyData={monthlyData} 
      />
      
      <div className="grid gap-4 md:grid-cols-2 mb-4">
        <CategoryDistributionChart key={`category-${componentsKey}`} categoryData={categoryData} />
        <UserTypesChart key={`users-${componentsKey}`} providers={userStats.providers} consumers={userStats.consumers} />
      </div>
      
      <div className="grid gap-4 mb-6">
        <MonthlyTrendsChart key={`monthly-${componentsKey}`} monthlyData={monthlyData} />
      </div>
      
      <div className="grid gap-4 md:grid-cols-3 mb-4">
        <div className="md:col-span-2">
          <RecentActivitiesList key={`activities-${componentsKey}`} />
        </div>
        <VerificationStatsWidget key={`verification-${componentsKey}`} />
      </div>
      
      <div className="grid gap-4">
        <PopularServicesList key={`services-${componentsKey}`} />
      </div>
    </div>
  );
};

export default AdminDashboardContent;
