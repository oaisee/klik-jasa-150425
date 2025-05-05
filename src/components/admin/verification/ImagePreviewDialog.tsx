
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import LoadingIndicator from '@/components/shared/LoadingIndicator';
import { AlertTriangle, ZoomIn, ZoomOut, RefreshCw, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ImagePreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
}

const ImagePreviewDialog = ({ isOpen, onClose, imageUrl }: ImagePreviewDialogProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [retryCount, setRetryCount] = useState(0);
  
  // Clean up the URL to ensure it's directly accessible
  const getCleanUrl = (url: string | null) => {
    if (!url) return null;
    
    // Try to ensure we have a direct public URL
    if (url.includes('verifications') && !url.includes('/storage/v1/object/public/')) {
      // Convert to public URL format if it's not already
      const bucketPath = url.split('verifications/')[1];
      if (bucketPath) {
        return `https://pnkdbkjwrcnghhgmhzue.supabase.co/storage/v1/object/public/verifications/${bucketPath}`;
      }
    }
    
    // Add cache busting parameter
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}t=${Date.now()}`;
  };

  const handleImageLoad = () => {
    console.log('Image loaded successfully');
    setLoading(false);
    setError(false);
  };

  const handleImageError = () => {
    console.error('Failed to load image');
    setLoading(false);
    setError(true);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 20, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 20, 60));
  };

  const handleRetry = () => {
    if (!imageUrl) return;
    
    setLoading(true);
    setError(false);
    setRetryCount(count => count + 1);
    
    toast.info("Mencoba memuat ulang gambar...");
  };
  
  const openDirectly = (target: '_blank' | '_self' = '_blank') => {
    if (!imageUrl) return;
    
    // Use the original URL for direct opening
    if (target === '_self') {
      window.location.href = imageUrl;
    } else {
      window.open(imageUrl, '_blank');
    }
  };

  // Reset state when dialog opens or image URL changes
  useEffect(() => {
    if (isOpen && imageUrl) {
      setLoading(true);
      setError(false);
      setZoom(100);
    }
  }, [isOpen, imageUrl, retryCount]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Dokumen KTP</DialogTitle>
        </DialogHeader>
        
        <div className="relative">
          {imageUrl ? (
            <>
              {loading && (
                <div className="flex justify-center items-center h-[70vh] w-full">
                  <LoadingIndicator size="lg" text="Memuat gambar..." />
                </div>
              )}
              
              {error ? (
                <div className="flex flex-col justify-center items-center h-[70vh] w-full text-red-500">
                  <AlertTriangle size={32} />
                  <p className="mt-2 font-medium">Gagal memuat gambar</p>
                  <p className="text-sm text-gray-500 mt-1 text-center max-w-md">
                    Coba gunakan tombol "Buka Langsung" untuk mengakses gambar secara langsung.
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mt-4 justify-center">
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-1"
                      onClick={handleRetry}
                    >
                      <RefreshCw size={16} /> Coba Lagi
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="flex items-center gap-1"
                      onClick={() => openDirectly('_blank')}
                    >
                      <ExternalLink size={16} /> Buka di Tab Baru
                    </Button>
                    
                    <Button 
                      variant="default"
                      className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                      onClick={() => openDirectly('_self')}
                    >
                      <ExternalLink size={16} /> Buka Langsung
                    </Button>
                  </div>
                  
                  <Alert className="mt-4 w-full max-w-md bg-gray-50">
                    <AlertDescription>
                      <p className="text-xs text-gray-600 truncate">URL: {imageUrl}</p>
                      <p className="text-xs text-gray-600">Percobaan ke-{retryCount + 1}</p>
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <div className="overflow-auto max-h-[70vh] relative">
                  <img 
                    src={getCleanUrl(imageUrl)}
                    alt="KTP Document" 
                    className={`mx-auto object-contain transition-transform duration-200 ${loading ? 'hidden' : 'block'}`}
                    style={{ transform: `scale(${zoom / 100})` }}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                  />
                  
                  {!loading && !error && (
                    <div className="absolute bottom-4 right-4 flex gap-2 bg-white/80 rounded-lg p-1 shadow-md">
                      <Button variant="ghost" size="icon" onClick={handleZoomOut} disabled={zoom <= 60}>
                        <ZoomOut size={18} />
                      </Button>
                      <span className="flex items-center text-sm font-medium px-1">
                        {zoom}%
                      </span>
                      <Button variant="ghost" size="icon" onClick={handleZoomIn} disabled={zoom >= 200}>
                        <ZoomIn size={18} />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col justify-center items-center h-[70vh] w-full text-gray-500">
              <p>Tidak ada URL gambar yang valid</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImagePreviewDialog;
