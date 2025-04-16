
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { VerificationRequest } from '@/types/database';
import LoadingIndicator from '@/components/shared/LoadingIndicator';
import EmptyState from '@/components/shared/EmptyState';
import { FileX, RefreshCw, Filter, Search } from 'lucide-react';
import VerificationRequestItem from './VerificationRequestItem';
import ImagePreviewDialog from './ImagePreviewDialog';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const VerificationRequestsList = () => {
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
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

      // Update user is_provider status to true
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

  const handleOpenImagePreview = (url: string) => {
    setPreviewImage(url);
  };

  const handleCloseImagePreview = () => {
    setPreviewImage(null);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Permintaan Verifikasi</CardTitle>
        <CardDescription>Mengelola permintaan verifikasi KTP dari calon penyedia jasa</CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* Search and filter controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari berdasarkan nama atau nomor telepon..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="w-full sm:w-48">
            <Select 
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="pending">Menunggu</SelectItem>
                <SelectItem value="approved">Disetujui</SelectItem>
                <SelectItem value="rejected">Ditolak</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {(searchQuery || statusFilter !== 'all') && (
            <Button 
              variant="ghost" 
              onClick={handleClearFilters}
              className="w-full sm:w-auto"
            >
              Reset Filter
            </Button>
          )}
        </div>
        
        {loading ? (
          <LoadingIndicator />
        ) : filteredRequests.length > 0 ? (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <VerificationRequestItem
                key={request.id}
                request={request}
                onApprove={handleApprove}
                onReject={handleReject}
                onPreviewImage={handleOpenImagePreview}
                processingId={processingId}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={FileX}
            title={
              searchQuery || statusFilter !== 'all' 
                ? "Tidak ada permintaan verifikasi yang sesuai" 
                : "Tidak ada permintaan verifikasi"
            }
            description={
              searchQuery || statusFilter !== 'all'
                ? "Coba ubah kata kunci pencarian atau filter status"
                : "Tidak ada permintaan verifikasi saat ini"
            }
          />
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row gap-2">
        <div className="text-sm text-gray-500 w-full sm:w-auto">
          Total: {filteredRequests.length} dari {requests.length} permintaan
        </div>
        <div className="flex-1"></div>
        <Button 
          variant="outline" 
          className="w-full sm:w-auto" 
          onClick={handleRefresh}
          disabled={refreshing}
        >
          {refreshing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Memuat Ulang...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Muat Ulang Data
            </>
          )}
        </Button>
      </CardFooter>

      <ImagePreviewDialog
        isOpen={!!previewImage}
        onClose={handleCloseImagePreview}
        imageUrl={previewImage}
      />
    </Card>
  );
};

export default VerificationRequestsList;
