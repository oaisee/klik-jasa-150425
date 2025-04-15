
import { useState, useEffect } from 'react';
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

interface AdminDashboardContentProps {
  connectionStatus: { success: boolean; message: string } | null;
}

const AdminDashboardContent = ({ connectionStatus }: AdminDashboardContentProps) => {
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState({ totalUsers: 0, providers: 0, consumers: 0 });
  const [serviceStats, setServiceStats] = useState({ totalServices: 0, activeServices: 0, categories: {} });
  const [monthlyData, setMonthlyData] = useState<Array<{ name: string; bookings: number; revenue: number }>>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
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
      } finally {
        setLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);

  // Transform category data for pie chart
  const categoryData = Object.entries(serviceStats.categories).map(([name, value]) => ({ 
    name, 
    value: value as number 
  }));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-marketplace-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DashboardHeader />
      
      <ConnectionStatusAlert connectionStatus={connectionStatus} />
      
      <StatsGrid 
        userStats={userStats} 
        serviceStats={serviceStats} 
        monthlyData={monthlyData} 
      />
      
      <div className="grid gap-4 md:grid-cols-2 mb-4">
        <CategoryDistributionChart categoryData={categoryData} />
        <UserTypesChart providers={userStats.providers} consumers={userStats.consumers} />
      </div>
      
      <div className="grid gap-4 mb-6">
        <MonthlyTrendsChart monthlyData={monthlyData} />
      </div>
      
      <div className="grid gap-4 md:grid-cols-3 mb-4">
        <div className="md:col-span-2">
          <RecentActivitiesList />
        </div>
        <VerificationStatsWidget />
      </div>
      
      <div className="grid gap-4">
        <PopularServicesList />
      </div>
    </div>
  );
};

export default AdminDashboardContent;
