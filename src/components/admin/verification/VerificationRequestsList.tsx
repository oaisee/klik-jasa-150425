
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import LoadingIndicator from '@/components/shared/LoadingIndicator';
import EmptyState from '@/components/shared/EmptyState';
import { FileX } from 'lucide-react';
import VerificationRequestItem from './VerificationRequestItem';
import ImagePreviewDialog from './ImagePreviewDialog';
import VerificationFilters from './VerificationFilters';
import VerificationSummary from './VerificationSummary';
import { useVerificationRequests } from '@/hooks/useVerificationRequests';
import { toast } from 'sonner';

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

  const handleOpenImagePreview = (url: string) => {
    setIsPreviewLoading(true);
    // Preload the image to avoid flickering
    const img = new Image();
    img.onload = () => {
      setIsPreviewLoading(false);
      setPreviewImage(url);
    };
    img.onerror = () => {
      setIsPreviewLoading(false);
      toast.error('Gagal memuat gambar dokumen');
    };
    img.src = url;
  };

  const handleCloseImagePreview = () => {
    setPreviewImage(null);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };

  // Log data for debugging
  console.log('Verification requests data:', { 
    filteredRequests, 
    loading, 
    hasActiveFilters, 
    totalRequests: requests.length 
  });

  // Force refresh on mount
  useEffect(() => {
    handleRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Permintaan Verifikasi</CardTitle>
        <CardDescription>Mengelola permintaan verifikasi KTP dari calon penyedia jasa</CardDescription>
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
          <LoadingIndicator />
        ) : filteredRequests.length > 0 ? (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <VerificationRequestItem
                key={request.id}
                request={request}
                onApprove={handleApprove}
                onReject={handleReject}
                onPreviewImage={() => handleOpenImagePreview(request.document_url)}
                processingId={processingId}
                isPreviewLoading={isPreviewLoading}
              />
            ))}
          </div>
        ) : (
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

      <ImagePreviewDialog
        isOpen={!!previewImage}
        onClose={handleCloseImagePreview}
        imageUrl={previewImage}
      />
    </Card>
  );
};

export default VerificationRequestsList;
