
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ServicePopularityChart from './ServicePopularityChart';
import UserActivityChart from './UserActivityChart';
import BookingsGrowthChart from './BookingsGrowthChart';
import RegionalDistributionMap from './RegionalDistributionMap';
import TopPerformersTable from './TopPerformersTable';
import RevenueAnalysisChart from './RevenueAnalysisChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AnalyticsOverview = () => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Analitik KlikJasa</h2>
          <p className="text-muted-foreground">Analisis mendalam tentang aktivitas platform</p>
        </div>
        
        <Tabs defaultValue="all" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Semua</TabsTrigger>
            <TabsTrigger value="week">Minggu</TabsTrigger>
            <TabsTrigger value="month">Bulan</TabsTrigger>
            <TabsTrigger value="year">Tahun</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-4">
        <ServicePopularityChart />
        <UserActivityChart />
      </div>

      <div className="grid gap-4 mb-4">
        <BookingsGrowthChart />
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-4">
        <RegionalDistributionMap />
        <RevenueAnalysisChart />
      </div>

      <TopPerformersTable />
    </div>
  );
};

export default AnalyticsOverview;
