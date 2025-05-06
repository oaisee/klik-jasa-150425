
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
        console.log(`Attempting to load image (attempt ${retryCount + 1}):`, imageUrl);
        
        // For signed URLs, use directly without any processing
        if (imageUrl.includes('token=')) {
          console.log("Detected signed URL, using directly");
          setImageData(imageUrl);
          setLoading(false);
          return;
        }
        
        // Extract bucket and path from the URL if it's a Supabase storage URL
        let bucket = '';
        let filePath = '';
        
        if (imageUrl.includes('/storage/v1/object/public/')) {
          try {
            const urlParts = imageUrl.split('/storage/v1/object/public/');
            if (urlParts.length === 2) {
              const pathWithParams = urlParts[1];
              const pathParts = pathWithParams.split('?')[0].split('/');
              bucket = pathParts[0];
              filePath = pathParts.slice(1).join('/');
              console.log("Extracted bucket:", bucket, "and path:", filePath);
            }
          } catch (parseError) {
            console.warn("Failed to parse Supabase URL:", parseError);
          }
        }

        // Strategy 1: Try direct fetch with cache control headers
        try {
          const timestamp = new Date().getTime();
          const cacheBustUrl = imageUrl.includes('?') 
            ? `${imageUrl}&t=${timestamp}` 
            : `${imageUrl}?t=${timestamp}`;
            
          console.log("Attempting direct fetch with cache busting:", cacheBustUrl);
          
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
            console.warn("Direct fetch responded with status:", response.status, response.statusText);
            const responseText = await response.text();
            console.warn("Response body:", responseText);
          }
        } catch (fetchError) {
          console.warn("Direct fetch failed:", fetchError);
        }
        
        // Strategy 2: If we have bucket and path, try using Supabase storage API
        if (bucket && filePath) {
          try {
            console.log("Attempting Supabase download - Bucket:", bucket, "Path:", filePath);
            
            const { data, error: downloadError } = await supabase.storage
              .from(bucket)
              .download(filePath);
              
            if (downloadError) {
              console.warn("Supabase download error:", downloadError);
            } else if (data) {
              const objectUrl = URL.createObjectURL(data);
              console.log("Image loaded successfully via Supabase API");
              setImageData(objectUrl);
              setLoading(false);
              return;
            }
          } catch (supabaseError) {
            console.warn("Supabase download failed:", supabaseError);
          }
        }
        
        // Strategy 3: Try to create a signed URL if we have bucket and path
        if (bucket && filePath) {
          try {
            console.log("Attempting to create signed URL");
            const { data: signedUrlData, error: signedUrlError } = await supabase.storage
              .from(bucket)
              .createSignedUrl(filePath, 60 * 60); // 1 hour expiry
              
            if (signedUrlError) {
              console.warn("Failed to create signed URL:", signedUrlError);
            } else if (signedUrlData?.signedUrl) {
              console.log("Using signed URL:", signedUrlData.signedUrl);
              setImageData(signedUrlData.signedUrl);
              setLoading(false);
              return;
            }
          } catch (signedUrlError) {
            console.warn("Signed URL creation failed:", signedUrlError);
          }
        }
        
        // Strategy 4: Fallback to using original URL directly
        console.log("Using original URL as fallback:", imageUrl);
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
