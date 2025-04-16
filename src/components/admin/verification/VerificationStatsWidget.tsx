
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { 
  UserCheck, 
  UserX, 
  Clock, 
  Users,
  RefreshCw,
  TrendingUp,
  CalendarDays
} from 'lucide-react';
import LoadingIndicator from '@/components/shared/LoadingIndicator';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface VerificationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  lastWeek: number;
}

const VerificationStatsWidget = () => {
  const [stats, setStats] = useState<VerificationStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    lastWeek: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchVerificationStats();
  }, []);

  const fetchVerificationStats = async () => {
    setLoading(true);
    try {
      // Create a date for one week ago
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const oneWeekAgoStr = oneWeekAgo.toISOString();

      // Fetch all verification requests
      const { data, error } = await supabase
        .from('verification_requests')
        .select('id, status, created_at');
      
      if (error) throw error;
      
      if (data) {
        const total = data.length;
        const pending = data.filter(req => req.status === 'pending').length;
        const approved = data.filter(req => req.status === 'approved').length;
        const rejected = data.filter(req => req.status === 'rejected').length;
        
        // Count requests created in the last week
        const lastWeek = data.filter(req => {
          return req.created_at && new Date(req.created_at) >= oneWeekAgo;
        }).length;
        
        setStats({ total, pending, approved, rejected, lastWeek });
      }
    } catch (error) {
      console.error('Error fetching verification stats:', error);
      toast.error('Gagal memuat statistik verifikasi');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchVerificationStats();
      toast.success('Statistik berhasil disegarkan');
    } catch (error) {
      console.error('Error refreshing verification stats:', error);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Statistik Verifikasi</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingIndicator />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Statistik Verifikasi</CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleRefresh}
          disabled={refreshing}
          className="h-8 w-8 p-0"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span className="sr-only">Refresh stats</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center justify-center p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-600">Total</span>
            </div>
            <span className="text-2xl font-bold text-blue-700">{stats.total}</span>
            <div className="mt-1 flex items-center gap-1">
              <CalendarDays className="h-3 w-3 text-blue-400" />
              <span className="text-xs text-blue-600">
                {stats.lastWeek} dalam 7 hari terakhir
              </span>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center p-3 bg-amber-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-5 w-5 text-amber-500" />
              <span className="text-sm font-medium text-gray-600">Menunggu</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-2xl font-bold text-amber-700">{stats.pending}</span>
              {stats.pending > 0 && stats.total > 0 && (
                <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                  {Math.round((stats.pending / stats.total) * 100)}%
                </Badge>
              )}
            </div>
            <div className="mt-1 flex items-center gap-1">
              {stats.pending > 0 ? (
                <TrendingUp className="h-3 w-3 text-amber-400" />
              ) : (
                <Clock className="h-3 w-3 text-amber-400" />
              )}
              <span className="text-xs text-amber-600">
                {stats.pending > 0 
                  ? 'Memerlukan verifikasi' 
                  : 'Tidak ada yang menunggu'}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <UserCheck className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-gray-600">Disetujui</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-2xl font-bold text-green-700">{stats.approved}</span>
              {stats.approved > 0 && stats.total > 0 && (
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                  {Math.round((stats.approved / stats.total) * 100)}%
                </Badge>
              )}
            </div>
            <div className="mt-1 flex items-center gap-1">
              <UserCheck className="h-3 w-3 text-green-400" />
              <span className="text-xs text-green-600">
                {stats.approved} penyedia jasa aktif
              </span>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center p-3 bg-red-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <UserX className="h-5 w-5 text-red-500" />
              <span className="text-sm font-medium text-gray-600">Ditolak</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-2xl font-bold text-red-700">{stats.rejected}</span>
              {stats.rejected > 0 && stats.total > 0 && (
                <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                  {Math.round((stats.rejected / stats.total) * 100)}%
                </Badge>
              )}
            </div>
            <div className="mt-1 flex items-center gap-1">
              <UserX className="h-3 w-3 text-red-400" />
              <span className="text-xs text-red-600">
                {stats.rejected > 0 
                  ? 'Ditolak karena masalah dokumen' 
                  : 'Tidak ada yang ditolak'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VerificationStatsWidget;
