-- ERYA GOLD SUPABASE SETUP (IDEMPOTENT)

-- 1. Tables
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  role TEXT DEFAULT 'client' CHECK (role IN ('client', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.designs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  material TEXT,
  price TEXT,
  image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'draft', 'out_of_stock')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.wishlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  design_id UUID REFERENCES public.designs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, design_id)
);

CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  design_id UUID REFERENCES public.designs(id) ON DELETE SET NULL,
  subject TEXT,
  message TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'replied', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  audience TEXT DEFAULT 'all',
  status TEXT DEFAULT 'sent',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.featured_collections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.collection_designs (
  collection_id UUID REFERENCES public.featured_collections(id) ON DELETE CASCADE,
  design_id UUID REFERENCES public.designs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (collection_id, design_id)
);

-- 2. Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.featured_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_designs ENABLE ROW LEVEL SECURITY;

-- 3. Idempotent Policies (Drop if exists then create)

-- Profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Admins can delete any profile." ON public.profiles;
CREATE POLICY "Admins can delete any profile." ON public.profiles FOR DELETE USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Designs
DROP POLICY IF EXISTS "Designs are viewable by everyone." ON public.designs;
CREATE POLICY "Designs are viewable by everyone." ON public.designs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can modify designs." ON public.designs;
CREATE POLICY "Only admins can modify designs." ON public.designs FOR ALL 
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Wishlists
DROP POLICY IF EXISTS "Users can view own wishlist." ON public.wishlists;
CREATE POLICY "Users can view own wishlist." ON public.wishlists FOR SELECT USING (auth.uid() = profile_id);

DROP POLICY IF EXISTS "Users can insert into own wishlist." ON public.wishlists;
CREATE POLICY "Users can insert into own wishlist." ON public.wishlists FOR INSERT WITH CHECK (auth.uid() = profile_id);

DROP POLICY IF EXISTS "Users can delete from own wishlist." ON public.wishlists;
CREATE POLICY "Users can delete from own wishlist." ON public.wishlists FOR DELETE USING (auth.uid() = profile_id);

-- Inquiries
DROP POLICY IF EXISTS "Users can view own inquiries." ON public.inquiries;
CREATE POLICY "Users can view own inquiries." ON public.inquiries FOR SELECT USING (auth.uid() = profile_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Users can insert own inquiries." ON public.inquiries;
CREATE POLICY "Users can insert own inquiries." ON public.inquiries FOR INSERT WITH CHECK (auth.uid() = profile_id);

DROP POLICY IF EXISTS "Only admins can update inquiries." ON public.inquiries;
CREATE POLICY "Only admins can update inquiries." ON public.inquiries FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Notifications
DROP POLICY IF EXISTS "Everyone can view notifications." ON public.notifications;
CREATE POLICY "Everyone can view notifications." ON public.notifications FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can insert notifications." ON public.notifications;
CREATE POLICY "Only admins can insert notifications." ON public.notifications FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Categories
DROP POLICY IF EXISTS "Categories are viewable by everyone." ON public.categories;
CREATE POLICY "Categories are viewable by everyone." ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can modify categories." ON public.categories;
CREATE POLICY "Only admins can modify categories." ON public.categories FOR ALL 
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Collections
DROP POLICY IF EXISTS "Collections are viewable by everyone." ON public.featured_collections;
CREATE POLICY "Collections are viewable by everyone." ON public.featured_collections FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can modify collections." ON public.featured_collections;
CREATE POLICY "Only admins can modify collections." ON public.featured_collections FOR ALL 
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Collection Designs
DROP POLICY IF EXISTS "Collection designs are viewable by everyone." ON public.collection_designs;
CREATE POLICY "Collection designs are viewable by everyone." ON public.collection_designs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can modify collection designs." ON public.collection_designs;
CREATE POLICY "Only admins can modify collection designs." ON public.collection_designs FOR ALL 
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- 4. Storage (Bucket Policies)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('jewellery-images', 'jewellery-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'jewellery-images');

DROP POLICY IF EXISTS "Admin Upload" ON storage.objects;
CREATE POLICY "Admin Upload" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'jewellery-images' AND 
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

DROP POLICY IF EXISTS "Admin Delete" ON storage.objects;
CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE USING (
  bucket_id = 'jewellery-images' AND 
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- 5. Trigger Function & Trigger (Handle New User)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'role', 'client')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- DROP then CREATE trigger (Must specify relation)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
