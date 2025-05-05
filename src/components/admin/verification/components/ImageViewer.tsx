
import { useState, useEffect } from 'react';
import LoadingIndicator from '@/components/shared/LoadingIndicator';
import ImageViewerControls from './ImageViewerControls';
import ImageErrorState from './ImageErrorState';
import { supabase } from '@/integrations/supabase/client';

interface ImageViewerProps {
  imageUrl: string | null;
}

const ImageViewer = ({ imageUrl }: ImageViewerProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [retryCount, setRetryCount] = useState(0);
  const [directUrl, setDirectUrl] = useState<string | null>(null);

  const getSafeImageUrl = async (url: string | null) => {
    if (!url) return null;
    
    try {
      // Extract bucket name and path from URL
      // Format: https://pnkdbkjwrcnghhgmhzue.supabase.co/storage/v1/object/public/[bucket]/[path]
      const urlParts = url.split('/public/');
      if (urlParts.length !== 2) return url;
      
      const [prefix, pathWithBucket] = urlParts;
      const [bucket, ...pathParts] = pathWithBucket.split('/');
      const path = pathParts.join('/');
      
      console.log("Fetching from bucket:", bucket, "path:", path);
      
      // Get a fresh URL with a timestamp to avoid caching issues
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(path, {
          transform: {
            quality: 90,
          }
        });
      
      if (data?.publicUrl) {
        const timestamp = new Date().getTime();
        const cacheBuster = `?t=${timestamp}`;
        return data.publicUrl + cacheBuster;
      }
      
      // If extraction failed, add cache buster to original URL
      return url + `?t=${new Date().getTime()}`;
    } catch (err) {
      console.error("Error generating safe image URL:", err);
      // Return original URL with cache buster as fallback
      return url + `?t=${new Date().getTime()}`;
    }
  };

  useEffect(() => {
    const loadImage = async () => {
      if (!imageUrl) {
        setDirectUrl(null);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(false);
      
      try {
        const safeUrl = await getSafeImageUrl(imageUrl);
        console.log("Generated safe URL:", safeUrl);
        setDirectUrl(safeUrl);
      } catch (error) {
        console.error("Failed to get direct URL:", error);
        setError(true);
      }
    };
    
    loadImage();
  }, [imageUrl, retryCount]);

  const handleImageLoad = () => {
    console.log("Image loaded successfully");
    setLoading(false);
    setError(false);
  };

  const handleImageError = () => {
    console.error("Image failed to load:", directUrl);
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
    console.log("Retrying image load");
    setRetryCount(count => count + 1);
    setLoading(true);
    setError(false);
  };

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
      publicUrl={directUrl || imageUrl}
    />;
  }

  return (
    <div className="overflow-auto max-h-[70vh] relative">
      {directUrl && (
        <img 
          src={directUrl}
          alt="KTP Document" 
          className="mx-auto object-contain transition-transform duration-200"
          style={{ transform: `scale(${zoom / 100})` }}
          onLoad={handleImageLoad}
          onError={handleImageError}
          crossOrigin="anonymous"
        />
      )}
      
      <ImageViewerControls 
        zoom={zoom} 
        onZoomIn={handleZoomIn} 
        onZoomOut={handleZoomOut} 
      />
    </div>
  );
};

export default ImageViewer;
