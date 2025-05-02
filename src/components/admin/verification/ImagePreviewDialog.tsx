
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import LoadingIndicator from '@/components/shared/LoadingIndicator';
import { AlertTriangle, ZoomIn, ZoomOut, RefreshCw, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ImagePreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
}

const ImagePreviewDialog = ({ isOpen, onClose, imageUrl }: ImagePreviewDialogProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [zoom, setZoom] = useState(100); // Zoom percentage
  const [retryCount, setRetryCount] = useState(0);

  // Reset loading, error, and zoom state when dialog opens or image changes
  useEffect(() => {
    if (isOpen && imageUrl) {
      setLoading(true);
      setError(false);
      setZoom(100);
    }
  }, [isOpen, imageUrl]);

  const handleImageLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleImageError = () => {
    setLoading(false);
    setError(true);
    console.error(`Failed to load image from URL: ${imageUrl}`);
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
    
    // Add a cache-busting parameter to force reload
    toast.info("Mencoba memuat ulang gambar...");
  };

  // Check if the URL is a valid supabase storage URL and could be transformed
  const possiblySupabaseStorageUrl = imageUrl && (
    imageUrl.includes('storage.googleapis.com') || 
    imageUrl.includes('supabase') ||
    imageUrl.includes('storage.app')
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Dokumen KTP</DialogTitle>
        </DialogHeader>
        
        <div className="relative">
          {imageUrl && (
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
                    URL mungkin tidak valid atau gambar telah dihapus.
                    {possiblySupabaseStorageUrl && (
                      <span className="block mt-1">
                        Dokumen mungkin memerlukan autentikasi atau telah kedaluwarsa.
                      </span>
                    )}
                  </p>
                  
                  <div className="flex gap-2 mt-4">
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
                      onClick={() => window.open(imageUrl, '_blank')}
                    >
                      <ExternalLink size={16} /> Buka di Tab Baru
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="overflow-auto max-h-[70vh] relative">
                  <img 
                    src={`${imageUrl}${retryCount > 0 ? `?_cb=${Date.now()}` : ''}`}
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
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImagePreviewDialog;
