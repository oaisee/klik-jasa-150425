
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
    setImageData(null); // Clear previous data
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
        // Priority 1: If it's a signed URL, use it directly
        if (imageUrl.includes('token=')) {
          setImageData(imageUrl);
          setLoading(false);
          return;
        }
        
        // Extract bucket and path from the URL if it's a Supabase storage URL
        let bucket = '';
        let filePath = '';
        
        if (imageUrl.includes('/storage/v1/object/public/')) {
          const urlParts = imageUrl.split('/storage/v1/object/public/');
          if (urlParts.length === 2) {
            const pathWithParams = urlParts[1];
            const pathParts = pathWithParams.split('?')[0].split('/');
            bucket = pathParts[0];
            filePath = pathParts.slice(1).join('/');
          }
        }

        // Priority 2: Try to create a signed URL (most reliable approach)
        if (bucket && filePath) {
          try {
            const { data: signedUrlData, error: signedUrlError } = await supabase.storage
              .from(bucket)
              .createSignedUrl(filePath, 60 * 60); // 1 hour expiry
              
            if (!signedUrlError && signedUrlData?.signedUrl) {
              setImageData(signedUrlData.signedUrl);
              setLoading(false);
              return;
            }
          } catch (signedUrlError) {
            console.warn("Signed URL creation failed:", signedUrlError);
          }
        }
        
        // Priority 3: Try direct fetch with cache control
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
            setImageData(objectUrl);
            setLoading(false);
            return;
          }
        } catch (fetchError) {
          console.warn("Direct fetch failed:", fetchError);
        }
        
        // Priority 4: Try Supabase download if we have bucket and path
        if (bucket && filePath) {
          try {
            const { data, error: downloadError } = await supabase.storage
              .from(bucket)
              .download(filePath);
              
            if (!downloadError && data) {
              const objectUrl = URL.createObjectURL(data);
              setImageData(objectUrl);
              setLoading(false);
              return;
            }
          } catch (supabaseError) {
            console.warn("Supabase download failed:", supabaseError);
          }
        }
        
        // Priority 5: Use original URL as last resort
        setImageData(imageUrl);
        setLoading(false);
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
