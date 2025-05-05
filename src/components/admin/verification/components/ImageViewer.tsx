
import { useState, useEffect } from 'react';
import LoadingIndicator from '@/components/shared/LoadingIndicator';
import ImageViewerControls from './ImageViewerControls';
import ImageErrorState from './ImageErrorState';

interface ImageViewerProps {
  imageUrl: string | null;
}

const ImageViewer = ({ imageUrl }: ImageViewerProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [retryCount, setRetryCount] = useState(0);

  // Convert any Supabase URL to a direct public URL format
  const getPublicUrl = (url: string | null) => {
    if (!url) return null;
    
    // If it's already a public URL with storage/v1/object/public, use it
    if (url.includes('/storage/v1/object/public/')) {
      return url;
    }
    
    // Try to extract the bucket and path
    const bucketMatch = url.match(/\/([^\/]+)\/([^\/]+)\/(.*)/);
    if (bucketMatch) {
      const bucket = bucketMatch[2];
      const path = bucketMatch[3];
      const publicUrl = `https://pnkdbkjwrcnghhgmhzue.supabase.co/storage/v1/object/public/${bucket}/${path}`;
      return publicUrl;
    }
    
    // If we can't parse it, return the original URL
    return url;
  };

  // Add cache busting parameter to force reload
  const getCacheBustedUrl = (url: string | null) => {
    if (!url) return null;
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}t=${Date.now()}`;
  };

  const handleImageLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleImageError = () => {
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
  };

  // Reset state when image URL changes
  useEffect(() => {
    if (imageUrl) {
      setLoading(true);
      setError(false);
      setZoom(100);
    }
  }, [imageUrl, retryCount]);

  const publicUrl = getPublicUrl(imageUrl);
  const cacheBustedUrl = getCacheBustedUrl(publicUrl);

  if (!imageUrl) {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh] w-full text-gray-500">
        <p>Tidak ada URL gambar yang valid</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh] w-full">
        <LoadingIndicator size="lg" text="Memuat gambar..." />
      </div>
    );
  }

  if (error) {
    return <ImageErrorState 
      onRetry={handleRetry} 
      retryCount={retryCount} 
      publicUrl={publicUrl}
    />;
  }

  return (
    <div className="overflow-auto max-h-[70vh] relative">
      <img 
        src={cacheBustedUrl}
        alt="KTP Document" 
        className="mx-auto object-contain transition-transform duration-200"
        style={{ transform: `scale(${zoom / 100})` }}
        onLoad={handleImageLoad}
        onError={handleImageError}
        crossOrigin="anonymous"
      />
      
      <ImageViewerControls 
        zoom={zoom} 
        onZoomIn={handleZoomIn} 
        onZoomOut={handleZoomOut} 
      />
    </div>
  );
};

export default ImageViewer;
