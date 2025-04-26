
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface VerificationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  lastWeek: number;
}

export const useVerificationStats = () => {
  const [stats, setStats] = useState<VerificationStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    lastWeek: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async (showToasts = true) => {
    setRefreshing(true);
    try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const oneWeekAgoStr = oneWeekAgo.toISOString();

      const { data, error } = await supabase
        .from('verification_requests')
        .select('id, status, created_at');
      
      if (error) throw error;
      
      if (data) {
        const total = data.length;
        const pending = data.filter(req => req.status === 'pending').length;
        const approved = data.filter(req => req.status === 'approved').length;
        const rejected = data.filter(req => req.status === 'rejected').length;
        const lastWeek = data.filter(req => req.created_at >= oneWeekAgoStr).length;
        
        setStats({ total, pending, approved, rejected, lastWeek });
        if (showToasts) {
          toast.success('Statistik berhasil dimuat');
        }
      }
    } catch (error) {
      console.error('Error fetching verification stats:', error);
      if (showToasts) {
        toast.error('Gagal memuat statistik');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  return {
    stats,
    loading,
    refreshing,
    fetchStats
  };
};
