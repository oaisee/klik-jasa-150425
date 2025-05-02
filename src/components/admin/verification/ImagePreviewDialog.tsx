
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import LoadingIndicator from '@/components/shared/LoadingIndicator';
import { AlertTriangle, ZoomIn, ZoomOut, RefreshCw, ExternalLink, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ImagePreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
}

const ImagePreviewDialog = ({ isOpen, onClose, imageUrl }: ImagePreviewDialogProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100); // Zoom percentage
  const [retryCount, setRetryCount] = useState(0);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  // Reset states when dialog opens or image changes
  useEffect(() => {
    if (isOpen && imageUrl) {
      setLoading(true);
      setError(false);
      setErrorDetails(null);
      setZoom(100);
      setDebugInfo(`Original URL: ${imageUrl}`);
      processImageUrl();
    }
  }, [isOpen, imageUrl]);

  const processImageUrl = async () => {
    if (!imageUrl) {
      setError(true);
      setErrorDetails("URL gambar tidak tersedia");
      setLoading(false);
      return;
    }
    
    try {
      console.log('Processing image URL:', imageUrl);
      setDebugInfo(prev => `${prev}\nAttempting to process URL...`);
      
      // Check if this is a Supabase storage URL that needs special handling
      if (imageUrl.includes('supabase') && imageUrl.includes('/storage/v1/')) {
        console.log('Detected Supabase storage URL');
        setDebugInfo(prev => `${prev}\nDetected Supabase storage URL`);
        
        // Extract the path and bucket from the URL
        let bucket = 'verifications';
        let filePath = '';
        
        if (imageUrl.includes('/public/verifications/')) {
          const urlParts = imageUrl.split('/public/verifications/');
          if (urlParts.length === 2) {
            filePath = urlParts[1];
            console.log('Extracted file path:', filePath);
            setDebugInfo(prev => `${prev}\nExtracted path: ${filePath}`);
          }
        } else if (imageUrl.includes('/object/')) {
          // Handle direct object URLs
          const objectUrlParts = imageUrl.split('/object/');
          if (objectUrlParts.length === 2) {
            const pathPart = objectUrlParts[1];
            // The path might include the bucket name and actual path
            const pathSegments = pathPart.split('/');
            if (pathSegments.length > 1) {
              bucket = pathSegments[0];
              filePath = pathSegments.slice(1).join('/');
              console.log('Extracted bucket:', bucket, 'and path:', filePath);
              setDebugInfo(prev => `${prev}\nExtracted bucket: ${bucket} and path: ${filePath}`);
            }
          }
        }
        
        if (filePath) {
          // First try to get a signed URL (more reliable)
          console.log(`Getting signed URL for ${bucket}/${filePath}`);
          setDebugInfo(prev => `${prev}\nAttempting to get signed URL for ${bucket}/${filePath}`);
          
          const { data: signedUrlData, error: signedUrlError } = await supabase.storage
            .from(bucket)
            .createSignedUrl(filePath, 60); // 60 seconds expiry
            
          if (signedUrlData && !signedUrlError) {
            console.log('Got signed URL:', signedUrlData.signedUrl);
            setDebugInfo(prev => `${prev}\nSuccessfully got signed URL`);
            setProcessedUrl(signedUrlData.signedUrl);
          } else {
            console.error('Error getting signed URL:', signedUrlError);
            setDebugInfo(prev => `${prev}\nFailed to get signed URL: ${signedUrlError?.message}`);
            
            // Fallback to public URL
            console.log('Falling back to public URL');
            setDebugInfo(prev => `${prev}\nFalling back to public URL`);
            
            const { data: publicUrlData } = supabase.storage
              .from(bucket)
              .getPublicUrl(filePath);
              
            if (publicUrlData && publicUrlData.publicUrl) {
              console.log('Got public URL:', publicUrlData.publicUrl);
              setDebugInfo(prev => `${prev}\nGot public URL: ${publicUrlData.publicUrl}`);
              setProcessedUrl(publicUrlData.publicUrl);
            } else {
              // If we can't get a public URL either, use the original
              console.warn('Could not get public URL, using original');
              setDebugInfo(prev => `${prev}\nCould not get public URL, using original`);
              setProcessedUrl(imageUrl);
            }
          }
        } else {
          console.warn('Could not extract file path from URL, using original');
          setDebugInfo(prev => `${prev}\nCould not extract file path, using original URL`);
          setProcessedUrl(imageUrl);
        }
      } else {
        // Not a Supabase URL, use as-is
        console.log('Not a Supabase URL, using as-is');
        setDebugInfo(prev => `${prev}\nNot a Supabase URL, using original`);
        setProcessedUrl(imageUrl);
      }
    } catch (err) {
      console.error('Error processing image URL:', err);
      setDebugInfo(prev => `${prev}\nError: ${err instanceof Error ? err.message : String(err)}`);
      // Fall back to original URL
      setProcessedUrl(imageUrl);
    }
  };

  const handleImageLoad = () => {
    setLoading(false);
    setError(false);
    console.log('Image loaded successfully');
    setDebugInfo(prev => `${prev}\nImage loaded successfully`);
  };

  const handleImageError = () => {
    setLoading(false);
    setError(true);
    const errorMsg = `Failed to load image from URL: ${processedUrl || imageUrl}`;
    console.error(errorMsg);
    setErrorDetails(errorMsg);
    setDebugInfo(prev => `${prev}\nImage load failed`);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 20, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 20, 60));
  };

  const handleRetry = async () => {
    if (!imageUrl) return;
    
    setLoading(true);
    setError(false);
    setRetryCount(count => count + 1);
    setDebugInfo(`Retry attempt ${retryCount + 1}\nOriginal URL: ${imageUrl}`);
    await processImageUrl();
    
    toast.info("Mencoba memuat ulang gambar...");
  };

  const toggleDebugInfo = () => {
    setShowDebugInfo(!showDebugInfo);
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
          {(imageUrl && processedUrl) && (
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
                    <span className="block mt-1">
                      Dokumen mungkin memerlukan autentikasi atau telah kedaluwarsa.
                    </span>
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
                      onClick={() => window.open(processedUrl, '_blank')}
                    >
                      <ExternalLink size={16} /> Buka di Tab Baru
                    </Button>

                    <Button
                      variant="ghost"
                      className="flex items-center gap-1"
                      onClick={toggleDebugInfo}
                    >
                      <Info size={16} /> {showDebugInfo ? 'Sembunyikan' : 'Info Debug'}
                    </Button>
                  </div>

                  {showDebugInfo && debugInfo && (
                    <Alert className="mt-4 w-full max-w-md bg-gray-50">
                      <AlertDescription>
                        <pre className="whitespace-pre-wrap text-xs text-gray-600 max-h-40 overflow-auto">
                          {debugInfo}
                        </pre>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ) : (
                <div className="overflow-auto max-h-[70vh] relative">
                  <img 
                    src={`${processedUrl}${retryCount > 0 ? `?_cb=${Date.now()}` : ''}`}
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
