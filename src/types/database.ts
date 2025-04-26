
// Add verification request type to existing types
export interface VerificationRequest {
  id: string;
  user_id: string;
  document_url: string;
  document_type: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  created_at?: string;
  updated_at?: string;
  profile?: {
    id?: string;
    full_name?: string;
    phone?: string;
    email?: string;
  };
}

// Add Service and Profile types to fix build errors
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
}

export interface Profile {
  id: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  address?: string;
  is_provider?: boolean;
  wallet_balance?: number;
  created_at?: string;
  updated_at?: string;
}

// Updated Transaction type to match our Transaction interface
export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'topup' | 'commission' | 'payout' | string;  // Updated to allow any string
  status: string;
  description: string;
  created_at: string;
}
