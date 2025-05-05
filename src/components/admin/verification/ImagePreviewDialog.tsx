
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState, useEffect, useCallback } from 'react';
import LoadingIndicator from '@/components/shared/LoadingIndicator';
import { AlertTriangle, ZoomIn, ZoomOut, RefreshCw, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';

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
  const [finalUrl, setFinalUrl] = useState<string | null>(null);

  // Process and prepare the URL when dialog opens or imageUrl changes
  useEffect(() => {
    if (isOpen && imageUrl) {
      setLoading(true);
      setError(false);
      setZoom(100);
      
      // Add cache-busting parameter directly to the URL
      const timestamp = Date.now();
      const cacheBuster = imageUrl.includes('?') ? `&t=${timestamp}` : `?t=${timestamp}`;
      
      const newUrl = `${imageUrl}${cacheBuster}`;
      console.log('Prepared image URL with cache buster:', newUrl);
      setFinalUrl(newUrl);
    }
  }, [isOpen, imageUrl, retryCount]);

  const handleImageLoad = () => {
    setLoading(false);
    setError(false);
    console.log('Image loaded successfully');
  };

  const handleImageError = () => {
    setLoading(false);
    setError(true);
    console.error('Failed to load image from URL:', finalUrl);
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
  
  const openDirectlySameTab = () => {
    if (!imageUrl) return;
    
    // Force image to open in the same tab to avoid popup blockers
    window.location.href = imageUrl;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Dokumen KTP</DialogTitle>
        </DialogHeader>
        
        <div className="relative">
          {finalUrl ? (
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
                      onClick={() => window.open(imageUrl || '', '_blank')}
                    >
                      <ExternalLink size={16} /> Buka di Tab Baru
                    </Button>
                    
                    <Button 
                      variant="default"
                      className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                      onClick={openDirectlySameTab}
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
                    src={finalUrl}
                    alt="KTP Document" 
                    className={`mx-auto object-contain transition-transform duration-200 ${loading ? 'hidden' : 'block'}`}
                    style={{ transform: `scale(${zoom / 100})` }}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    crossOrigin="anonymous"
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
