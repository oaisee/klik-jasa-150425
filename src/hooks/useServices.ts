
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Service, ServiceWithImages, ServiceImage } from '@/types/service';
import { toast } from 'sonner';

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchServices = async (category?: string | null, searchQuery?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Start building the query
      let query = supabase
        .from('services')
        .select(`
          *,
          service_images!inner(id, image_url, sort_order),
          provider:profiles!inner(full_name, avatar_url)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      // Add category filter if provided
      if (category) {
        query = query.eq('category', category);
      }
      
      // Add search filter if provided
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }
      
      const { data, error: fetchError } = await query;
      
      if (fetchError) throw fetchError;
      
      // Transform data to match the Service interface
      const transformedServices: Service[] = data?.map((item) => {
        // Find the main image (lowest sort_order)
        const mainImage = item.service_images.sort((a: any, b: any) => 
          (a.sort_order || 0) - (b.sort_order || 0)
        )[0];
        
        return {
          id: item.id,
          provider_id: item.provider_id,
          title: item.title,
          description: item.description,
          category: item.category,
          price: item.price,
          location: item.location,
          service_radius: item.service_radius,
          status: item.status,
          created_at: item.created_at,
          updated_at: item.updated_at,
          image: mainImage?.image_url,
          providerName: item.provider?.full_name,
          // Mock data for demo purposes
          rating: 4.5 + (Math.random() * 0.5),
          distance: Math.floor(Math.random() * 5) + 1,
          provider: {
            full_name: item.provider?.full_name,
            avatar_url: item.provider?.avatar_url,
          }
        };
      }) || [];
      
      setServices(transformedServices);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Gagal memuat layanan');
      toast.error('Gagal memuat data layanan');
    } finally {
      setLoading(false);
    }
  };
  
  const getServiceDetail = async (serviceId: string): Promise<ServiceWithImages | null> => {
    try {
      // Fetch service details
      const { data: service, error: serviceError } = await supabase
        .from('services')
        .select(`
          *,
          provider:profiles(full_name, avatar_url, bio),
          service_images(id, image_url, sort_order)
        `)
        .eq('id', serviceId)
        .single();
      
      if (serviceError) throw serviceError;
      if (!service) return null;
      
      // Sort images by sort_order
      const sortedImages = service.service_images.sort((a: any, b: any) => 
        (a.sort_order || 0) - (b.sort_order || 0)
      );

      // Transform service_images to ServiceImage type
      const formattedImages: ServiceImage[] = sortedImages.map((img: any) => ({
        id: img.id,
        service_id: service.id,
        image_url: img.image_url,
        sort_order: img.sort_order,
      }));
      
      // Transform to ServiceWithImages
      const serviceWithImages: ServiceWithImages = {
        ...service,
        image: formattedImages[0]?.image_url,
        rating: 4.5 + (Math.random() * 0.5), // Mock rating
        distance: Math.floor(Math.random() * 5) + 1, // Mock distance
        providerName: service.provider?.full_name,
        images: formattedImages,
      };
      
      return serviceWithImages;
    } catch (err) {
      console.error('Error fetching service details:', err);
      toast.error('Gagal memuat detail layanan');
      return null;
    }
  };
  
  useEffect(() => {
    fetchServices();
  }, []);
  
  return {
    services,
    loading,
    error,
    fetchServices,
    getServiceDetail
  };
};
