
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
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      console.log(`${bucketName} bucket does not exist, creating it now`);
      const { error: createBucketError } = await supabase.storage.createBucket(bucketName, {
        public: false
      });
      
      if (createBucketError) {
        console.error(`Error creating ${bucketName} bucket:`, createBucketError);
        return false;
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
    
    const { error: storageError, data: uploadData } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '0',
        upsert: false
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
    
    return publicUrlData?.publicUrl || null;
  } catch (error) {
    console.error(`Error uploading file to ${bucketName}:`, error);
    return null;
  }
};
