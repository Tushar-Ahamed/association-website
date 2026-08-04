-- ============================================================================
-- Jhenaidah Zila Somiti - Rajshahi University (RU)
-- Production Supabase Database Schema, Security (RLS), Triggers & RBAC
-- ============================================================================

-- 1. EXTENSIONS & CUSTOM ENUMS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM (
    'super_admin',
    'teacher',
    'student',
    'alumni',
    'upazila_admin',
    'committee_member',
    'visitor'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE account_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE upazila_name AS ENUM (
    'jhenaidah_sadar',
    'kaliganj',
    'kotchandpur',
    'maheshpur',
    'shailkupa',
    'harinakunda'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE committee_level AS ENUM ('district', 'upazila');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE reaction_type AS ENUM ('like', 'love', 'congrats', 'support');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE notice_category AS ENUM ('general', 'academic', 'event', 'urgent', 'scholarship');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name_bn TEXT NOT NULL,
  full_name_en TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'student',
  account_status account_status NOT NULL DEFAULT 'approved',
  upazila upazila_name NOT NULL DEFAULT 'jhenaidah_sadar',
  union_ward TEXT,
  village TEXT,
  department TEXT NOT NULL,
  session_years TEXT NOT NULL,
  passing_year INTEGER,
  student_id TEXT,
  hall_name TEXT,
  blood_group TEXT,
  occupation TEXT,
  organization TEXT,
  bio TEXT,
  facebook_url TEXT,
  linkedin_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. UPAZILA ADMIN ASSIGNMENTS (Max 3 per upazila)
CREATE TABLE IF NOT EXISTS public.upazila_admin_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  upazila upazila_name NOT NULL,
  assigned_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_upazila_admin UNIQUE (user_id, upazila)
);

-- 4. COMMITTEES TABLE
CREATE TABLE IF NOT EXISTS public.committees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_bn TEXT NOT NULL,
  title_en TEXT NOT NULL,
  term_years TEXT NOT NULL, -- e.g., "2025-2026"
  level committee_level NOT NULL DEFAULT 'district',
  upazila upazila_name, -- NULL for district level
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. COMMITTEE MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.committee_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  committee_id UUID NOT NULL REFERENCES public.committees(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  position_bn TEXT NOT NULL, -- e.g., 'সভাপতি', 'সাধারণ সম্পাদক'
  position_en TEXT NOT NULL,
  rank_order INTEGER NOT NULL DEFAULT 99,
  assigned_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_committee_user UNIQUE (committee_id, user_id)
);

-- 6. POSTS TABLE (Social Feed)
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. POST REACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.post_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reaction reaction_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_post_user_reaction UNIQUE (post_id, user_id)
);

-- 8. POST COMMENTS TABLE
CREATE TABLE IF NOT EXISTS public.post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. NOTICES TABLE
CREATE TABLE IF NOT EXISTS public.notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category notice_category NOT NULL DEFAULT 'general',
  file_url TEXT,
  is_pinned BOOLEAN DEFAULT FALSE,
  published_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  banner_url TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. GALLERY TABLE
CREATE TABLE IF NOT EXISTS public.gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  uploaded_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. AUDIT & ACTIVITY LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_upazila ON public.profiles(upazila);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(account_status);
CREATE INDEX IF NOT EXISTS idx_committee_members_committee ON public.committee_members(committee_id);
CREATE INDEX IF NOT EXISTS idx_posts_author ON public.posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_created ON public.posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_reactions_post ON public.post_reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_post ON public.post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_notices_pinned ON public.notices(is_pinned, created_at DESC);

-- ============================================================================
-- AUTOMATED FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function 1: Enforce Max 3 Upazila Admins Per Upazila
CREATE OR REPLACE FUNCTION check_upazila_admin_limit()
RETURNS TRIGGER AS $$
DECLARE
  admin_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO admin_count
  FROM public.upazila_admin_assignments
  WHERE upazila = NEW.upazila;

  IF admin_count >= 3 THEN
    RAISE EXCEPTION 'Constraint Error: Upazila % already has maximum 3 designated Upazila Admins.', NEW.upazila;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_upazila_admin_limit ON public.upazila_admin_assignments;
CREATE TRIGGER trigger_upazila_admin_limit
  BEFORE INSERT ON public.upazila_admin_assignments
  FOR EACH ROW
  EXECUTE FUNCTION check_upazila_admin_limit();

-- Function 2: Enforce Max 3 Super Admin Limit
CREATE OR REPLACE FUNCTION check_super_admin_limit()
RETURNS TRIGGER AS $$
DECLARE
  super_count INTEGER;
BEGIN
  IF NEW.role = 'super_admin' AND (OLD.role IS NULL OR OLD.role != 'super_admin') THEN
    SELECT COUNT(*) INTO super_count
    FROM public.profiles
    WHERE role = 'super_admin';

    IF super_count >= 3 THEN
      RAISE EXCEPTION 'Constraint Error: System allows exactly 3 Super Admin accounts.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_super_admin_limit ON public.profiles;
CREATE TRIGGER trigger_super_admin_limit
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION check_super_admin_limit();

-- Function 3: New User Registration & Profile Automation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name_bn,
    full_name_en,
    role,
    account_status,
    upazila,
    department,
    session_years
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name_bn', NEW.raw_user_meta_data->>'full_name', 'ব্যবহারকারী'),
    COALESCE(NEW.raw_user_meta_data->>'full_name_en', NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student'::user_role),
    CASE 
      WHEN (NEW.raw_user_meta_data->>'role') = 'teacher' THEN 'pending'::account_status
      ELSE 'approved'::account_status
    END,
    COALESCE((NEW.raw_user_meta_data->>'upazila')::upazila_name, 'jhenaidah_sadar'::upazila_name),
    COALESCE(NEW.raw_user_meta_data->>'department', 'সাধারণ'),
    COALESCE(NEW.raw_user_meta_data->>'session_years', '2022-2023')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.upazila_admin_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.committees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.committee_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper Function: Check if user is Super Admin
CREATE OR REPLACE FUNCTION public.is_super_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role = 'super_admin' AND account_status = 'approved'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Public profiles read access" ON public.profiles
  FOR SELECT USING (account_status = 'approved');

CREATE POLICY "User update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Super admin manage all profiles" ON public.profiles
  FOR ALL USING (public.is_super_admin(auth.uid()));

-- Posts Policies
CREATE POLICY "Approved members view posts" ON public.posts
  FOR SELECT USING (true);

CREATE POLICY "Approved members create posts" ON public.posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Author edit own posts" ON public.posts
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Author or Super Admin delete posts" ON public.posts
  FOR DELETE USING (auth.uid() = author_id OR public.is_super_admin(auth.uid()));

-- Notices & Events Policies
CREATE POLICY "Public read notices" ON public.notices FOR SELECT USING (true);
CREATE POLICY "Public read events" ON public.events FOR SELECT USING (true);

CREATE POLICY "Super Admin and Teacher publish notices" ON public.notices
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('super_admin', 'teacher') AND account_status = 'approved'
    )
  );

CREATE POLICY "Super Admin manage events" ON public.events
  FOR ALL USING (public.is_super_admin(auth.uid()));

-- Contact Messages Policies
CREATE POLICY "Anyone can submit contact message" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Super Admin view contact messages" ON public.contact_messages
  FOR SELECT USING (public.is_super_admin(auth.uid()));

-- ============================================================================
-- STORAGE BUCKETS SETUP
-- ============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true),
       ('gallery', 'gallery', true),
       ('notices', 'notices', true),
       ('feed_images', 'feed_images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public storage read" ON storage.objects FOR SELECT USING (true);
CREATE POLICY "Authenticated users upload files" ON storage.objects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
