
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { VerificationRequest } from '@/types/database';

export const useVerificationRequests = () => {
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchVerificationRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [searchQuery, statusFilter, requests]);

  const filterRequests = () => {
    let filtered = [...requests];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(req => req.status === statusFilter);
    }
    
    // Apply search filter (case insensitive)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(req => 
        (req.profile?.full_name?.toLowerCase().includes(query) || false) ||
        (req.profile?.phone?.toLowerCase().includes(query) || false)
      );
    }
    
    setFilteredRequests(filtered);
  };

  const fetchVerificationRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('verification_requests')
        .select('*, profile:profiles(id, full_name, phone)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Map the data to match VerificationRequest type
      const mappedRequests = (data || []).map(req => ({
        ...req,
        profile: req.profile || undefined
      }));

      setRequests(mappedRequests as VerificationRequest[]);
      setFilteredRequests(mappedRequests as VerificationRequest[]);
    } catch (error) {
      console.error('Error fetching verification requests:', error);
      toast.error('Gagal memuat permintaan verifikasi');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchVerificationRequests();
      toast.success('Data berhasil disegarkan');
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
      // Find the request to get user_id
      const requestData = requests.find(req => req.id === id);
      if (!requestData) throw new Error('Request not found');

      // Update verification status to approved
      const { error: verificationError } = await supabase
        .from('verification_requests')
        .update({ 
          status: 'approved', 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);

      if (verificationError) throw verificationError;

      // Update user is_provider status to true in profiles table only
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ is_provider: true })
        .eq('id', requestData.user_id);

      if (profileError) throw profileError;

      toast.success('Verifikasi berhasil disetujui');
      fetchVerificationRequests(); // Refresh the list
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

      if (error) throw error;
      toast.success('Verifikasi berhasil ditolak');
      fetchVerificationRequests(); // Refresh the list
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
