
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface VerificationStatsData {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  lastWeek: number;
}

export const fetchVerificationStatsApi = async (): Promise<VerificationStatsData> => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const oneWeekAgoStr = oneWeekAgo.toISOString();

    const { data, error } = await supabase
      .from('verification_requests')
      .select('id, status, created_at');
    
    if (error) throw error;
    
    if (!data) {
      return {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        lastWeek: 0
      };
    }
    
    const total = data.length;
    const pending = data.filter(req => req.status === 'pending').length;
    const approved = data.filter(req => req.status === 'approved').length;
    const rejected = data.filter(req => req.status === 'rejected').length;
    const lastWeek = data.filter(req => req.created_at >= oneWeekAgoStr).length;
    
    return { total, pending, approved, rejected, lastWeek };
  } catch (error) {
    console.error('Error fetching verification stats:', error);
    throw error;
  }
};
