
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UseSupabaseImageResult {
  imageData: string | null;
  loading: boolean;
  error: boolean;
  retryCount: number;
  handleRetry: () => void;
}

export const useSupabaseImage = (imageUrl: string | null): UseSupabaseImageResult => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [imageData, setImageData] = useState<string | null>(null);

  // Reset image data and trigger retry
  const handleRetry = () => {
    console.log("Retrying image load");
    setRetryCount(count => count + 1);
    setLoading(true);
    setError(false);
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
        console.log(`Attempting to load image (attempt ${retryCount + 1}):`, imageUrl);
        
        // Strategy 1: Try direct fetch with cache control headers
        try {
          const timestamp = new Date().getTime();
          const cacheBustUrl = imageUrl.includes('?') 
            ? `${imageUrl}&t=${timestamp}` 
            : `${imageUrl}?t=${timestamp}`;
            
          const response = await fetch(cacheBustUrl, {
            method: 'GET',
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            }
          });
          
          if (response.ok) {
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            console.log("Image loaded successfully via direct fetch");
            setImageData(objectUrl);
            setLoading(false);
            return;
          } else {
            console.warn("Direct fetch responded with status:", response.status);
          }
        } catch (fetchError) {
          console.warn("Direct fetch failed:", fetchError);
        }
        
        // Strategy 2: Try using Supabase storage API
        try {
          // Extract bucket and path from the URL
          const urlParts = imageUrl.split('/public/');
          if (urlParts.length === 2) {
            const [_, pathWithBucket] = urlParts;
            const bucketAndPath = pathWithBucket.split('/');
            const bucket = bucketAndPath[0];
            const path = bucketAndPath.slice(1).join('/').split('?')[0]; // Remove query params
            
            console.log("Attempting Supabase download - Bucket:", bucket, "Path:", path);
            
            const { data, error: downloadError } = await supabase.storage
              .from(bucket)
              .download(path);
              
            if (downloadError) {
              console.warn("Supabase download error:", downloadError);
            } else if (data) {
              const objectUrl = URL.createObjectURL(data);
              console.log("Image loaded successfully via Supabase API");
              setImageData(objectUrl);
              setLoading(false);
              return;
            }
          }
        } catch (supabaseError) {
          console.warn("Supabase download failed:", supabaseError);
        }
        
        // Strategy 3: Fallback to using a public URL with cache busting
        try {
          const timestamp = new Date().getTime();
          const publicUrl = imageUrl.includes('?') 
            ? `${imageUrl}&cb=${timestamp}` 
            : `${imageUrl}?cb=${timestamp}`;
          
          console.log("Using public URL as fallback:", publicUrl);
          setImageData(publicUrl);
          setLoading(false);
        } catch (fallbackError) {
          console.error("All loading strategies failed:", fallbackError);
          setError(true);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error loading image:", error);
        setError(true);
        setLoading(false);
      }
    };
    
    loadImage();
    
    // Cleanup function to revoke object URLs
    return () => {
      if (imageData && imageData.startsWith('blob:')) {
        URL.revokeObjectURL(imageData);
      }
    };
  }, [imageUrl, retryCount]);

  return {
    imageData,
    loading,
    error,
    retryCount,
    handleRetry
  };
};
