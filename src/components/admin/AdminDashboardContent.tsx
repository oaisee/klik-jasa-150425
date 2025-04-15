
import { useState, useEffect } from 'react';
import { Users, Briefcase, FileText, Database, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import StatCard from './StatCard';
import RecentActivitiesList from './RecentActivitiesList';
import PopularServicesList from './PopularServicesList';
import { fetchUserStats, fetchServiceStats, generateMonthlyData, formatRupiah } from '@/utils/adminUtils';

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
        const monthly = generateMonthlyData();
        
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
  const categoryData = Object.entries(serviceStats.categories).map(([name, value]) => ({ name, value }));
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  // Chart config
  const chartConfig = {
    categories: { label: 'Kategori Layanan' },
    userType: { label: 'Jenis Pengguna' },
    bookings: { label: 'Booking Bulanan' },
    revenue: { label: 'Pendapatan Bulanan' },
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-sm text-gray-500">
          {new Date().toLocaleDateString('id-ID', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>
      
      {/* Connection Status */}
      {connectionStatus && (
        <Alert variant={connectionStatus.success ? "default" : "destructive"}>
          <div className="flex items-center">
            {connectionStatus.success ? (
              <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2" />
            )}
            <AlertTitle>
              {connectionStatus.success ? "Supabase Terhubung" : "Koneksi Supabase Gagal"}
            </AlertTitle>
          </div>
          <AlertDescription className="mt-2">
            {connectionStatus.message}
          </AlertDescription>
        </Alert>
      )}
      
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
      
      <div className="grid gap-4 md:grid-cols-2 mb-4">
        {/* Category Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Kategori Layanan</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <ChartContainer className="h-80" config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="flex justify-center items-center h-80 text-gray-500">
                Tidak ada data kategori layanan
              </div>
            )}
          </CardContent>
        </Card>
      
        {/* User Types Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Jenis Pengguna</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-80" config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Penyedia Jasa', value: userStats.providers },
                      { name: 'Pengguna Biasa', value: userStats.consumers }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    <Cell fill="#00C49F" />
                    <Cell fill="#0088FE" />
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 mb-6">
        {/* Monthly Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Tren Bulanan</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-80" config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="bookings" 
                    name="Booking" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="revenue" 
                    name="Pendapatan (Rp)" 
                    stroke="#82ca9d" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <RecentActivitiesList />
        <PopularServicesList />
      </div>
    </div>
  );
};

export default AdminDashboardContent;
