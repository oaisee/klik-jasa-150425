
import { Users, Briefcase, FileText, Database, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import StatCard from './StatCard';
import RecentActivitiesList from './RecentActivitiesList';
import PopularServicesList from './PopularServicesList';

interface AdminDashboardContentProps {
  connectionStatus: { success: boolean; message: string } | null;
}

const AdminDashboardContent = ({ connectionStatus }: AdminDashboardContentProps) => {
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
          value="128"
          trend="+12% dari bulan lalu"
          trendPositive={true}
        />
        <StatCard
          icon={<Briefcase className="h-8 w-8 text-green-500" />}
          title="Layanan Aktif"
          value="85"
          trend="+7% dari bulan lalu"
          trendPositive={true}
        />
        <StatCard
          icon={<FileText className="h-8 w-8 text-purple-500" />}
          title="Transaksi Bulan Ini"
          value="36"
          trend="-3% dari bulan lalu"
          trendPositive={false}
        />
        <StatCard
          icon={<Database className="h-8 w-8 text-amber-500" />}
          title="Total Komisi"
          value="Rp 2.4jt"
          trend="+18% dari bulan lalu"
          trendPositive={true}
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <RecentActivitiesList />
        <PopularServicesList />
      </div>
    </div>
  );
};

export default AdminDashboardContent;
