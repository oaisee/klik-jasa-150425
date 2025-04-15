
export interface Profile {
  id: string;
  full_name?: string | null;
  phone?: string | null;
  address?: string | null;
  bio?: string | null;
  is_provider?: boolean;
  wallet_balance?: number;
  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Service {
  id: string;
  provider_id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  location: string;
  service_radius: number;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface ServiceImage {
  id: string;
  service_id: string;
  image_url: string;
  sort_order: number;
  created_at?: string;
}
