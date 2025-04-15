
-- This is the SQL we need to run on Supabase to set up our database
-- This file is for reference only and should be executed in the Supabase SQL editor

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  bio TEXT,
  avatar_url TEXT,
  is_provider BOOLEAN DEFAULT FALSE,
  wallet_balance DECIMAL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create a trigger to create profile when a user signs up
CREATE OR REPLACE FUNCTION public.create_profile_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, is_provider, created_at, updated_at)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'full_name', 
    NEW.raw_user_meta_data->>'phone', 
    COALESCE((NEW.raw_user_meta_data->>'is_provider')::boolean, false),
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile after user signup
DROP TRIGGER IF EXISTS create_profile_after_signup ON auth.users;
CREATE TRIGGER create_profile_after_signup
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.create_profile_on_signup();

-- Create services table
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  price DECIMAL NOT NULL,
  location TEXT,
  service_radius INTEGER DEFAULT 5,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create service images table
CREATE TABLE IF NOT EXISTS public.service_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create storage buckets for avatars and service images
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('services', 'services', true) ON CONFLICT DO NOTHING;

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_images ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profiles" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Services policies
CREATE POLICY "Services are viewable by everyone" ON public.services FOR SELECT USING (true);
CREATE POLICY "Providers can insert their own services" ON public.services FOR INSERT WITH CHECK (auth.uid() = provider_id);
CREATE POLICY "Providers can update their own services" ON public.services FOR UPDATE USING (auth.uid() = provider_id);
CREATE POLICY "Providers can delete their own services" ON public.services FOR DELETE USING (auth.uid() = provider_id);

-- Service images policies
CREATE POLICY "Service images are viewable by everyone" ON public.service_images FOR SELECT USING (true);
CREATE POLICY "Providers can insert service images" ON public.service_images FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.services 
    WHERE id = service_id 
    AND provider_id = auth.uid()
  )
);
CREATE POLICY "Providers can update their service images" ON public.service_images FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.services 
    WHERE id = service_id 
    AND provider_id = auth.uid()
  )
);
CREATE POLICY "Providers can delete their service images" ON public.service_images FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.services 
    WHERE id = service_id 
    AND provider_id = auth.uid()
  )
);

-- Storage policies for avatars
CREATE POLICY "Avatar images are viewable by everyone" ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatars" ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own avatars" ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Storage policies for service images
CREATE POLICY "Service images are viewable by everyone" ON storage.objects FOR SELECT
USING (bucket_id = 'services');

CREATE POLICY "Providers can upload service images" ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'services' AND
  EXISTS (
    SELECT 1 FROM public.services 
    WHERE id::text = (storage.foldername(name))[1] 
    AND provider_id = auth.uid()
  )
);

CREATE POLICY "Providers can update service images" ON storage.objects FOR UPDATE
USING (
  bucket_id = 'services' AND
  EXISTS (
    SELECT 1 FROM public.services 
    WHERE id::text = (storage.foldername(name))[1] 
    AND provider_id = auth.uid()
  )
);
