
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { VerificationRequest } from '@/types/database';
import { filterVerificationRequests } from '@/utils/verificationFilters';
import { supabase } from '@/integrations/supabase/client';

export const useVerificationRequests = () => {
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchVerificationRequests = useCallback(async (showToasts = true) => {
    if (refreshing) return;
    
    showToasts ? setRefreshing(true) : null;
    setLoading(loading && showToasts);
    
    try {
      const { data, error } = await supabase
        .from('verification_requests')
        .select(`
          id,
          user_id,
          document_url,
          document_type,
          status,
          notes,
          created_at,
          updated_at,
          profiles:profiles(id, full_name, phone)
        `)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }

      // Transform the data to match our VerificationRequest type
      const mappedData: VerificationRequest[] = (data || []).map(req => ({
        id: req.id,
        user_id: req.user_id || '',
        document_url: req.document_url,
        document_type: req.document_type,
        status: (req.status as 'pending' | 'approved' | 'rejected'),
        notes: req.notes || undefined,
        created_at: req.created_at || undefined,
        updated_at: req.updated_at || undefined,
        profile: req.profiles || undefined
      }));
      
      setRequests(mappedData);
      setFilteredRequests(mappedData);
      
      if (showToasts && mappedData.length > 0) {
        const pendingCount = mappedData.filter(r => r.status === 'pending').length;
        if (pendingCount > 0) {
          toast.info(`${pendingCount} permintaan verifikasi menunggu review`);
        }
        toast.success(`${mappedData.length} permintaan verifikasi dimuat`);
      }
    } catch (error) {
      console.error('Error in fetchVerificationRequests:', error);
      if (showToasts) {
        toast.error('Gagal memuat permintaan verifikasi');
      }
    } finally {
      setLoading(false);
      if (showToasts) {
        setRefreshing(false);
      } else {
        setTimeout(() => setRefreshing(false), 500);
      }
    }
  }, [refreshing, loading]);

  useEffect(() => {
    console.log('useVerificationRequests hook initialized');
    fetchVerificationRequests();

    const intervalId = setInterval(() => {
      console.log('Auto-refreshing verification requests');
      fetchVerificationRequests(false);
    }, 30000);

    return () => clearInterval(intervalId);
  }, [fetchVerificationRequests]);

  useEffect(() => {
    const filtered = filterVerificationRequests(requests, searchQuery, statusFilter);
    setFilteredRequests(filtered);
  }, [searchQuery, statusFilter, requests]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchVerificationRequests();
    } catch (error) {
      console.error('Error refreshing verification requests:', error);
      toast.error('Gagal menyegarkan data');
    } finally {
      setRefreshing(false);
    }
  };

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      const requestData = requests.find(req => req.id === id);
      if (!requestData) {
        throw new Error('Request not found');
      }
      
      // Update verification request status
      const { error: verificationError } = await supabase
        .from('verification_requests')
        .update({ 
          status: 'approved',
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);

      if (verificationError) {
        throw verificationError;
      }
      
      // Update user profile to mark as provider
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ is_provider: true })
        .eq('id', requestData.user_id);

      if (profileError) {
        throw profileError;
      }
      
      toast.success('Verifikasi berhasil disetujui');
      fetchVerificationRequests();
    } catch (error) {
      console.error('Error approving verification:', error);
      toast.error('Gagal menyetujui verifikasi');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string, notes?: string) => {
    setProcessingId(id);
    try {
      const { error } = await supabase
        .from('verification_requests')
        .update({ 
          status: 'rejected',
          notes: notes || null,
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);

      if (error) {
        throw error;
      }
      
      toast.success('Verifikasi berhasil ditolak');
      fetchVerificationRequests();
    } catch (error) {
      console.error('Error rejecting verification:', error);
      toast.error('Gagal menolak verifikasi');
    } finally {
      setProcessingId(null);
    }
  };

  return {
    requests,
    filteredRequests,
    loading,
    refreshing,
    processingId,
    searchQuery,
    statusFilter,
    setSearchQuery,
    setStatusFilter,
    handleRefresh,
    handleApprove,
    handleReject,
    hasActiveFilters: searchQuery.trim() !== '' || statusFilter !== 'all'
  };
};
