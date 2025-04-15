
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { 
  UserCheck, 
  UserX, 
  Clock, 
  Users
} from 'lucide-react';
import LoadingIndicator from '@/components/shared/LoadingIndicator';

interface VerificationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

const VerificationStatsWidget = () => {
  const [stats, setStats] = useState<VerificationStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVerificationStats();
  }, []);

  const fetchVerificationStats = async () => {
    setLoading(true);
    try {
      // Fetch all verification requests
      const { data, error } = await supabase
        .from('verification_requests')
        .select('status');
      
      if (error) throw error;
      
      if (data) {
        const total = data.length;
        const pending = data.filter(req => req.status === 'pending').length;
        const approved = data.filter(req => req.status === 'approved').length;
        const rejected = data.filter(req => req.status === 'rejected').length;
        
        setStats({ total, pending, approved, rejected });
      }
    } catch (error) {
      console.error('Error fetching verification stats:', error);
    } finally {
      setLoading(false);
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
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Statistik Verifikasi</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center justify-center p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-600">Total</span>
            </div>
            <span className="text-2xl font-bold text-blue-700">{stats.total}</span>
          </div>
          
          <div className="flex flex-col items-center justify-center p-3 bg-amber-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-5 w-5 text-amber-500" />
              <span className="text-sm font-medium text-gray-600">Menunggu</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-2xl font-bold text-amber-700">{stats.pending}</span>
              {stats.pending > 0 && (
                <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                  {Math.round((stats.pending / stats.total) * 100)}%
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <UserCheck className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-gray-600">Disetujui</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-2xl font-bold text-green-700">{stats.approved}</span>
              {stats.approved > 0 && (
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                  {Math.round((stats.approved / stats.total) * 100)}%
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center p-3 bg-red-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <UserX className="h-5 w-5 text-red-500" />
              <span className="text-sm font-medium text-gray-600">Ditolak</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-2xl font-bold text-red-700">{stats.rejected}</span>
              {stats.rejected > 0 && (
                <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                  {Math.round((stats.rejected / stats.total) * 100)}%
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VerificationStatsWidget;
