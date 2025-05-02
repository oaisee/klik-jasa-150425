
import { useState } from 'react';
import { toast } from 'sonner';
import { fetchVerificationStatsApi, VerificationStatsData } from '@/api/verificationStats';

export const useVerificationStats = () => {
  const [stats, setStats] = useState<VerificationStatsData>({
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
      const statsData = await fetchVerificationStatsApi();
      setStats(statsData);
      
      if (showToasts) {
        toast.success('Statistik berhasil dimuat');
      }
    } catch (error) {
      console.error('Error in fetchStats:', error);
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

export type { VerificationStatsData } from '@/api/verificationStats';
