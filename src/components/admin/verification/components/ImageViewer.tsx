
import { useState, useEffect } from 'react';
import LoadingIndicator from '@/components/shared/LoadingIndicator';
import ImageViewerControls from './ImageViewerControls';
import ImageErrorState from './ImageErrorState';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ImageViewerProps {
  imageUrl: string | null;
}

const ImageViewer = ({ imageUrl }: ImageViewerProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [retryCount, setRetryCount] = useState(0);
  const [imageData, setImageData] = useState<string | null>(null);

  // Directly fetch the image using the Supabase storage API
  const fetchImageDirectly = async (url: string) => {
    try {
      setLoading(true);
      setError(false);
      
      console.log("Attempting to fetch image from URL:", url);
      
      // Extract path from Supabase URL
      // Format: https://[project-ref].supabase.co/storage/v1/object/public/[bucket]/[path]
      const urlParts = url.split('/public/');
      if (urlParts.length !== 2) {
        console.error("Invalid Supabase URL format:", url);
        throw new Error("Invalid URL format");
      }
      
      const [_, pathWithBucket] = urlParts;
      const bucketAndPath = pathWithBucket.split('/');
      const bucket = bucketAndPath[0];
      const path = bucketAndPath.slice(1).join('/');
      
      console.log("Parsed URL - Bucket:", bucket, "Path:", path);
      
      // Download the file directly from Supabase storage
      const { data, error: downloadError } = await supabase.storage
        .from(bucket)
        .download(path);
        
      if (downloadError) {
        console.error("Supabase download error:", downloadError);
        throw downloadError;
      }
      
      if (!data) {
        console.error("No data returned from download");
        throw new Error("Failed to download image");
      }
      
      // Convert blob to data URL
      const url = URL.createObjectURL(data);
      console.log("Image loaded and converted to object URL");
      setImageData(url);
      return url;
    } catch (err) {
      console.error("Error fetching image directly:", err);
      setError(true);
      toast.error("Gagal memuat gambar", {
        description: "Coba muat ulang atau periksa URL gambar"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Alternative method: Get public URL with cache busting
  const getPublicUrl = async (url: string) => {
    try {
      const urlParts = url.split('/public/');
      if (urlParts.length !== 2) return url;
      
      const [_, pathWithBucket] = urlParts;
      const bucketAndPath = pathWithBucket.split('/');
      const bucket = bucketAndPath[0];
      const path = bucketAndPath.slice(1).join('/');
      
      console.log("Getting fresh public URL - Bucket:", bucket, "Path:", path);
      
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);
      
      if (data?.publicUrl) {
        const cacheBuster = `?t=${new Date().getTime()}`;
        return data.publicUrl + cacheBuster;
      }
      
      return url;
    } catch (err) {
      console.error("Error generating public URL:", err);
      return url;
    }
  };

  useEffect(() => {
    const loadImage = async () => {
      if (!imageUrl) {
        setImageData(null);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(false);
      
      try {
        // Try direct download first
        const result = await fetchImageDirectly(imageUrl);
        
        // If direct download fails, try public URL
        if (!result) {
          const publicUrl = await getPublicUrl(imageUrl);
          console.log("Using public URL as fallback:", publicUrl);
          setImageData(publicUrl);
        }
      } catch (error) {
        console.error("Failed to load image:", error);
        setError(true);
        
        // Try public URL as fallback
        try {
          const publicUrl = await getPublicUrl(imageUrl);
          setImageData(publicUrl);
        } catch (e) {
          console.error("Fallback failed too:", e);
          setError(true);
        }
      }
    };
    
    loadImage();
    
    // Cleanup function to avoid memory leaks
    return () => {
      if (imageData && imageData.startsWith('blob:')) {
        URL.revokeObjectURL(imageData);
      }
    };
  }, [imageUrl, retryCount]);

  const handleImageLoad = () => {
    console.log("Image loaded successfully");
    setLoading(false);
    setError(false);
  };

  const handleImageError = () => {
    console.error("Image failed to load:", imageData);
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
      publicUrl={imageData || imageUrl}
    />;
  }

  return (
    <div className="overflow-auto max-h-[70vh] relative">
      {imageData && (
        <img 
          src={imageData}
          alt="KTP Document" 
          className="mx-auto object-contain transition-transform duration-200"
          style={{ transform: `scale(${zoom / 100})` }}
          onLoad={handleImageLoad}
          onError={handleImageError}
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
