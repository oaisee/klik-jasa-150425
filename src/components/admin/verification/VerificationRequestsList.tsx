
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import LoadingIndicator from '@/components/shared/LoadingIndicator';
import EmptyState from '@/components/shared/EmptyState';
import { FileX, RefreshCw } from 'lucide-react';
import VerificationSummary from './VerificationSummary';
import VerificationFilters from './VerificationFilters';
import ImagePreviewDialog from './ImagePreviewDialog';
import { useVerificationRequests } from '@/hooks/useVerificationRequests';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import VerificationTable from './VerificationTable';

const VerificationRequestsList = () => {
  console.log('VerificationRequestsList rendering');
  
  const {
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
    hasActiveFilters,
    requests
  } = useVerificationRequests();
  
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Force refresh on mount
  useEffect(() => {
    console.log('VerificationRequestsList mounted - triggering initial refresh');
    handleRefresh().then(() => setInitialized(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenImagePreview = (url: string) => {
    console.log('Opening image preview with URL:', url);
    
    if (!url || url.trim() === '') {
      toast.error('URL dokumen tidak valid');
      return;
    }
    
    setIsPreviewLoading(true);
    setPreviewImage(url);
    
    // We'll let the ImagePreviewDialog component handle the loading state
    // This helps with race conditions between setting states
    setTimeout(() => {
      setIsPreviewLoading(false);
    }, 300);
  };

  const handleCloseImagePreview = () => {
    setPreviewImage(null);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };

  const handleManualRefresh = () => {
    toast.info('Menyegarkan data...');
    handleRefresh();
  };

  // Log data for debugging
  console.log('Verification requests data:', { 
    filteredRequests, 
    loading, 
    hasActiveFilters, 
    totalRequests: requests.length,
    initialized
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Permintaan Verifikasi</CardTitle>
          <CardDescription>Mengelola permintaan verifikasi KTP dari calon penyedia jasa</CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleManualRefresh}
          disabled={refreshing || loading}
          className="flex items-center gap-1"
        >
          <RefreshCw size={16} className={`${refreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{refreshing ? 'Menyegarkan...' : 'Segarkan Data'}</span>
        </Button>
      </CardHeader>
      
      <CardContent>
        {/* Search and filter controls */}
        <VerificationFilters 
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          onSearchChange={setSearchQuery}
          onStatusChange={setStatusFilter}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
        />
        
        {loading ? (
          <div className="py-10">
            <LoadingIndicator text="Memuat permintaan verifikasi..." />
          </div>
        ) : filteredRequests.length > 0 ? (
          <div className="mt-4">
            <VerificationTable 
              requests={filteredRequests}
              processingId={processingId}
              onApprove={handleApprove}
              onReject={handleReject}
              onPreviewImage={handleOpenImagePreview}
              isPreviewLoading={isPreviewLoading}
            />
          </div>
        ) : initialized ? (
          <div className="py-10">
            <EmptyState
              icon={FileX}
              title={
                hasActiveFilters
                  ? "Tidak ada permintaan verifikasi yang sesuai" 
                  : "Tidak ada permintaan verifikasi"
              }
              description={
                hasActiveFilters
                  ? "Coba ubah kata kunci pencarian atau filter status"
                  : "Tidak ada permintaan verifikasi saat ini"
              }
            />
          </div>
        ) : (
          <div className="py-10">
            <LoadingIndicator text="Memuat permintaan verifikasi..." />
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row gap-2">
        <VerificationSummary 
          filteredCount={filteredRequests.length}
          totalCount={requests.length}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      </CardFooter>

      {/* Image Preview Dialog */}
      <ImagePreviewDialog
        isOpen={!!previewImage}
        onClose={handleCloseImagePreview}
        imageUrl={previewImage}
      />
    </Card>
  );
};

export default VerificationRequestsList;
