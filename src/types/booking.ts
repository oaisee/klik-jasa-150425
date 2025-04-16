
export interface Booking {
  id: string;
  user_id: string;
  service_id: string;
  provider_id: string;
  status: BookingStatus;
  booking_date: string;
  service_date: string;
  location: string;
  price: number;
  notes?: string;
  commission_amount: number;
  created_at: string;
  updated_at?: string;
  
  // Joined data
  service?: {
    title: string;
    category?: string;
    image?: string;
  };
  provider?: {
    full_name?: string;
    phone?: string;
    avatar_url?: string;
  };
  user?: {
    full_name?: string;
    phone?: string;
    avatar_url?: string;
  };
}

export type BookingStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled';

export interface BookingFormData {
  service_id: string;
  service_date: string;
  location: string;
  notes?: string;
}
