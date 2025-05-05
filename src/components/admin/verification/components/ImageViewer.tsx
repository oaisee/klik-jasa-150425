
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

  const handleDirectImageLoad = async (url: string | null) => {
    if (!url) return null;
    
    try {
      // If the URL already contains the bucket name, extract it
      const bucketMatch = url.match(/\/([^\/]+)\/([^\/]+)\/(.*)/);
      if (!bucketMatch) return url;
      
      const bucket = bucketMatch[2];
      const path = bucketMatch[3];
      
      console.log("Fetching direct URL from Supabase for bucket:", bucket, "path:", path);
      
      // Use Supabase storage API to get a fresh URL with current time to avoid cache issues
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(path, {
          download: false,
          transform: {
            width: 1200,
            quality: 80,
          }
        });
      
      if (data?.publicUrl) {
        console.log("Got direct public URL:", data.publicUrl);
        // Add cache-busting parameter
        const cacheBuster = `?t=${Date.now()}`;
        return data.publicUrl + cacheBuster;
      }
    } catch (err) {
      console.error("Error getting direct URL:", err);
    }
    
    // Fallback to original URL with cache buster
    const cacheBuster = `?t=${Date.now()}`;
    return url + cacheBuster;
  };

  useEffect(() => {
    const loadDirectUrl = async () => {
      if (!imageUrl) {
        setDirectUrl(null);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      
      try {
        const url = await handleDirectImageLoad(imageUrl);
        setDirectUrl(url);
      } catch (error) {
        console.error("Failed to get direct URL:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    loadDirectUrl();
  }, [imageUrl, retryCount]);

  const handleImageLoad = () => {
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
