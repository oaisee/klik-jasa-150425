
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
      } finally {
        setLoading(false);
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

  return {
    imageData,
    loading,
    error,
    retryCount,
    handleRetry
  };
};

// Directly fetch the image using the Supabase storage API
export const fetchImageDirectly = async (imageUrl: string) => {
  try {
    console.log("Attempting to fetch image from URL:", imageUrl);
    
    // Extract path from Supabase URL
    // Format: https://[project-ref].supabase.co/storage/v1/object/public/[bucket]/[path]
    const urlParts = imageUrl.split('/public/');
    if (urlParts.length !== 2) {
      console.error("Invalid Supabase URL format:", imageUrl);
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
    const objectUrl = URL.createObjectURL(data);
    console.log("Image loaded and converted to object URL");
    return objectUrl;
  } catch (err) {
    console.error("Error fetching image directly:", err);
    toast.error("Gagal memuat gambar", {
      description: "Coba muat ulang atau periksa URL gambar"
    });
    return null;
  }
};

// Alternative method: Get public URL with cache busting
export const getPublicUrl = async (imageUrl: string) => {
  try {
    const urlParts = imageUrl.split('/public/');
    if (urlParts.length !== 2) return imageUrl;
    
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
    
    return imageUrl;
  } catch (err) {
    console.error("Error generating public URL:", err);
    return imageUrl;
  }
};
