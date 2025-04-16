
// Database-aligned service type
export interface Service {
  id: string;
  provider_id: string;
  title: string;
  description?: string;
  category?: string;
  price: number;
  location?: string;
  service_radius?: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
  
  // Frontend display properties (derived or computed)
  image?: string; // Main image URL from service_images
  providerName?: string; // From provider profile
  rating?: number; // Calculated from reviews
  distance?: number; // Calculated based on user location
  provider?: {
    full_name?: string;
    avatar_url?: string;
    bio?: string;
  };
}

// Service with images
export interface ServiceWithImages extends Service {
  images: ServiceImage[];
}

export interface ServiceImage {
  id: string;
  service_id?: string; // Made optional to accommodate database format
  image_url: string;
  sort_order?: number;
  created_at?: string;
}

// Service creation/update form data
export interface ServiceFormData {
  title: string;
  description: string;
  category: string;
  price: number;
  location: string;
  service_radius: number;
  images: File[];
}
