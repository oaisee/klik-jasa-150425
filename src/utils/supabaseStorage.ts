
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Ensures a specific storage bucket exists
 * @param bucketName Name of the bucket to check/create
 * @returns Boolean indicating success
 */
export const ensureBucketExists = async (bucketName: string): Promise<boolean> => {
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error(`Error listing buckets:`, listError);
      return false;
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      console.log(`${bucketName} bucket does not exist, creating it now`);
      // Create the bucket with public access
      const { error: createBucketError } = await supabase.storage.createBucket(bucketName, {
        public: true, // Make bucket public to allow direct access
        fileSizeLimit: 5242880 // 5MB limit for KTP images
      });
      
      if (createBucketError) {
        console.error(`Error creating ${bucketName} bucket:`, createBucketError);
        return false;
      }
      
      // Set security policies for the bucket (allow public access for reading)
      try {
        const { error: policyError } = await supabase.storage.from(bucketName).setPublic();
        if (policyError) {
          console.error(`Error setting ${bucketName} bucket public:`, policyError);
        }
      } catch (policyError) {
        console.error(`Error setting bucket policies:`, policyError);
      }
    }
    
    return true;
  } catch (error) {
    console.error(`Error checking/creating ${bucketName} bucket:`, error);
    return false;
  }
};

/**
 * Uploads a file to a Supabase storage bucket
 * @param bucketName Name of the bucket
 * @param filePath Path within the bucket
 * @param file File to upload
 * @returns URL of the uploaded file or null if failed
 */
export const uploadFileToBucket = async (
  bucketName: string,
  filePath: string,
  file: File
): Promise<string | null> => {
  try {
    console.log(`Uploading to bucket: ${bucketName}, path: ${filePath}`);
    
    // Upload the file
    const { error: storageError, data: uploadData } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '0', // No caching
        upsert: false,
        contentType: file.type // Explicitly set content type
      });
      
    if (storageError) {
      console.error('Storage upload error:', storageError);
      throw storageError;
    }
    
    console.log('Upload successful:', uploadData);
    
    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
    
    const publicUrl = publicUrlData?.publicUrl || null;
    
    // Log the URL for debugging
    if (publicUrl) {
      console.log('Generated public URL:', publicUrl);
    } else {
      console.error('Failed to generate public URL');
    }
    
    return publicUrl;
  } catch (error) {
    console.error(`Error uploading file to ${bucketName}:`, error);
    return null;
  }
};
