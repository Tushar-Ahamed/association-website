-- ============================================================================
-- Jhenaidah Zila Somiti - Rajshahi University (RU)
-- Production Supabase Database Schema, Security (RLS), Triggers & Initial Seeds
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CUSTOM ENUMS
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('super_admin', 'teacher', 'student', 'alumni', 'upazila_admin', 'committee_member', 'visitor');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE account_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE upazila_name AS ENUM ('jhenaidah_sadar', 'kaliganj', 'kotchandpur', 'maheshpur', 'shailkupa', 'harinakunda');
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

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
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

-- 2. UPAZILA ADMIN ASSIGNMENTS
CREATE TABLE IF NOT EXISTS public.upazila_admin_assignments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  upazila upazila_name NOT NULL,
  assigned_by TEXT REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_upazila_admin UNIQUE (user_id, upazila)
);

-- 3. COMMITTEES TABLE
CREATE TABLE IF NOT EXISTS public.committees (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title_bn TEXT NOT NULL,
  title_en TEXT NOT NULL,
  term_years TEXT NOT NULL,
  level committee_level NOT NULL DEFAULT 'district',
  upazila upazila_name,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. COMMITTEE MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.committee_members (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  committee_id TEXT NOT NULL REFERENCES public.committees(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  position_bn TEXT NOT NULL,
  position_en TEXT NOT NULL,
  rank_order INTEGER NOT NULL DEFAULT 99,
  assigned_by TEXT REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_committee_user UNIQUE (committee_id, user_id)
);

-- 5. POSTS TABLE
CREATE TABLE IF NOT EXISTS public.posts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  author_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. POST REACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.post_reactions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  post_id TEXT NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reaction reaction_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_post_user_reaction UNIQUE (post_id, user_id)
);

-- 7. POST COMMENTS TABLE
CREATE TABLE IF NOT EXISTS public.post_comments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  post_id TEXT NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. NOTICES TABLE
CREATE TABLE IF NOT EXISTS public.notices (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category notice_category NOT NULL DEFAULT 'general',
  file_url TEXT,
  is_pinned BOOLEAN DEFAULT FALSE,
  published_by TEXT REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  banner_url TEXT,
  created_by TEXT REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. GALLERY IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.gallery_images (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  uploaded_by TEXT REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  actor_id TEXT REFERENCES public.profiles(id),
  actor_name TEXT,
  action TEXT NOT NULL,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR OPTIMIZATION
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
-- HELPER FUNCTIONS FOR SECURITY & RBAC
-- ============================================================================

-- Helper 1: Check if user is Super Admin
CREATE OR REPLACE FUNCTION public.is_super_admin(p_user_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = p_user_id AND role = 'super_admin' AND account_status = 'approved'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper 2: Check if user is Upazila Admin for a specific upazila (Unambiguous parameters)
CREATE OR REPLACE FUNCTION public.is_upazila_admin_for(p_user_id TEXT, p_target_upazila upazila_name)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.upazila_admin_assignments
    WHERE user_id = p_user_id AND upazila = p_target_upazila
  ) OR EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = p_user_id AND role = 'upazila_admin' AND upazila = p_target_upazila AND account_status = 'approved'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- AUTH TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, email, full_name_bn, full_name_en, role, account_status, upazila, department, session_years
  )
  VALUES (
    NEW.id::text,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name_bn', 'ব্যবহারকারী'),
    COALESCE(NEW.raw_user_meta_data->>'full_name_en', 'User'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student'::user_role),
    'approved'::account_status,
    COALESCE((NEW.raw_user_meta_data->>'upazila')::upazila_name, 'jhenaidah_sadar'::upazila_name),
    COALESCE(NEW.raw_user_meta_data->>'department', 'সাধারণ'),
    COALESCE(NEW.raw_user_meta_data->>'session_years', '2023-2024')
  )
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- STRICT ROW LEVEL SECURITY (RLS) POLICIES - LEAST PRIVILEGE PRINCIPLE
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

-- 1. PROFILES POLICIES
DROP POLICY IF EXISTS "Public read approved profiles" ON public.profiles;
DROP POLICY IF EXISTS "User insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "User or Admin update profile" ON public.profiles;
DROP POLICY IF EXISTS "Super Admin delete profile" ON public.profiles;

CREATE POLICY "Public read approved profiles" ON public.profiles
  FOR SELECT USING (account_status = 'approved' OR auth.uid()::text = id OR public.is_super_admin(auth.uid()::text));

CREATE POLICY "User insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid()::text = id OR public.is_super_admin(auth.uid()::text));

CREATE POLICY "User or Admin update profile" ON public.profiles
  FOR UPDATE USING (
    auth.uid()::text = id OR 
    public.is_super_admin(auth.uid()::text) OR 
    public.is_upazila_admin_for(auth.uid()::text, upazila)
  );

CREATE POLICY "Super Admin delete profile" ON public.profiles
  FOR DELETE USING (public.is_super_admin(auth.uid()::text));

-- 2. UPAZILA ADMIN ASSIGNMENTS POLICIES
DROP POLICY IF EXISTS "Public read upazila admin assignments" ON public.upazila_admin_assignments;
DROP POLICY IF EXISTS "Super Admin manage upazila admin assignments" ON public.upazila_admin_assignments;

CREATE POLICY "Public read upazila admin assignments" ON public.upazila_admin_assignments
  FOR SELECT USING (true);

CREATE POLICY "Super Admin manage upazila admin assignments" ON public.upazila_admin_assignments
  FOR ALL USING (public.is_super_admin(auth.uid()::text));

-- 3. COMMITTEES POLICIES
DROP POLICY IF EXISTS "Public read committees" ON public.committees;
DROP POLICY IF EXISTS "Super Admin manage committees" ON public.committees;

CREATE POLICY "Public read committees" ON public.committees
  FOR SELECT USING (true);

CREATE POLICY "Super Admin manage committees" ON public.committees
  FOR ALL USING (public.is_super_admin(auth.uid()::text));

-- 4. COMMITTEE MEMBERS POLICIES
DROP POLICY IF EXISTS "Public read committee members" ON public.committee_members;
DROP POLICY IF EXISTS "Super Admin manage committee members" ON public.committee_members;

CREATE POLICY "Public read committee members" ON public.committee_members
  FOR SELECT USING (true);

CREATE POLICY "Super Admin manage committee members" ON public.committee_members
  FOR ALL USING (public.is_super_admin(auth.uid()::text));

-- 5. POSTS POLICIES
DROP POLICY IF EXISTS "Public read posts" ON public.posts;
DROP POLICY IF EXISTS "Authenticated user create post" ON public.posts;
DROP POLICY IF EXISTS "Author or Admin update post" ON public.posts;
DROP POLICY IF EXISTS "Author or Admin delete post" ON public.posts;

CREATE POLICY "Public read posts" ON public.posts
  FOR SELECT USING (true);

CREATE POLICY "Authenticated user create post" ON public.posts
  FOR INSERT WITH CHECK (auth.uid()::text = author_id);

CREATE POLICY "Author or Admin update post" ON public.posts
  FOR UPDATE USING (auth.uid()::text = author_id OR public.is_super_admin(auth.uid()::text));

CREATE POLICY "Author or Admin delete post" ON public.posts
  FOR DELETE USING (auth.uid()::text = author_id OR public.is_super_admin(auth.uid()::text));

-- 6. POST REACTIONS POLICIES
DROP POLICY IF EXISTS "Public read reactions" ON public.post_reactions;
DROP POLICY IF EXISTS "User create reaction" ON public.post_reactions;
DROP POLICY IF EXISTS "User manage reaction" ON public.post_reactions;

CREATE POLICY "Public read reactions" ON public.post_reactions
  FOR SELECT USING (true);

CREATE POLICY "User create reaction" ON public.post_reactions
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "User manage reaction" ON public.post_reactions
  FOR ALL USING (auth.uid()::text = user_id OR public.is_super_admin(auth.uid()::text));

-- 7. POST COMMENTS POLICIES
DROP POLICY IF EXISTS "Public read comments" ON public.post_comments;
DROP POLICY IF EXISTS "User create comment" ON public.post_comments;
DROP POLICY IF EXISTS "Author or Admin manage comment" ON public.post_comments;

CREATE POLICY "Public read comments" ON public.post_comments
  FOR SELECT USING (true);

CREATE POLICY "User create comment" ON public.post_comments
  FOR INSERT WITH CHECK (auth.uid()::text = author_id);

CREATE POLICY "Author or Admin manage comment" ON public.post_comments
  FOR ALL USING (auth.uid()::text = author_id OR public.is_super_admin(auth.uid()::text));

-- 8. NOTICES POLICIES
DROP POLICY IF EXISTS "Public read notices" ON public.notices;
DROP POLICY IF EXISTS "Super Admin or Teacher manage notices" ON public.notices;

CREATE POLICY "Public read notices" ON public.notices
  FOR SELECT USING (true);

CREATE POLICY "Super Admin or Teacher manage notices" ON public.notices
  FOR ALL USING (
    public.is_super_admin(auth.uid()::text) OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid()::text AND role = 'teacher' AND account_status = 'approved'
    )
  );

-- 9. EVENTS POLICIES
DROP POLICY IF EXISTS "Public read events" ON public.events;
DROP POLICY IF EXISTS "Super Admin manage events" ON public.events;

CREATE POLICY "Public read events" ON public.events
  FOR SELECT USING (true);

CREATE POLICY "Super Admin manage events" ON public.events
  FOR ALL USING (public.is_super_admin(auth.uid()::text));

-- 10. GALLERY IMAGES POLICIES
DROP POLICY IF EXISTS "Public read gallery" ON public.gallery_images;
DROP POLICY IF EXISTS "Super Admin manage gallery" ON public.gallery_images;

CREATE POLICY "Public read gallery" ON public.gallery_images
  FOR SELECT USING (true);

CREATE POLICY "Super Admin manage gallery" ON public.gallery_images
  FOR ALL USING (public.is_super_admin(auth.uid()::text));

-- 11. CONTACT MESSAGES POLICIES (Public Insert, Admin View Only)
DROP POLICY IF EXISTS "Anyone submit contact message" ON public.contact_messages;
DROP POLICY IF EXISTS "Super Admin manage contact messages" ON public.contact_messages;

CREATE POLICY "Anyone submit contact message" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Super Admin manage contact messages" ON public.contact_messages
  FOR ALL USING (public.is_super_admin(auth.uid()::text));

-- 12. AUDIT LOGS POLICIES (Strict Actor Check / Admin View Only)
DROP POLICY IF EXISTS "Insert audit log" ON public.audit_logs;
DROP POLICY IF EXISTS "Super Admin view audit logs" ON public.audit_logs;

CREATE POLICY "Authenticated user insert own audit log" ON public.audit_logs
  FOR INSERT WITH CHECK (
    actor_id IS NULL OR actor_id = auth.uid()::text OR public.is_super_admin(auth.uid()::text)
  );

CREATE POLICY "Super Admin view audit logs" ON public.audit_logs
  FOR SELECT USING (public.is_super_admin(auth.uid()::text));

-- SEED DATA
INSERT INTO public.profiles (
  id, email, full_name_bn, full_name_en, phone, role, account_status, upazila, department, session_years, is_verified
) VALUES 
('super-admin-1', 'admin1@jhenaidah-ru.org', 'সেন্ট্রাল এডমিন ১', 'Central Admin 1', '01700000001', 'super_admin', 'approved', 'jhenaidah_sadar', 'সেন্ট্রাল এডমিন', '2020-2021', true),
('super-admin-2', 'admin2@jhenaidah-ru.org', 'সেন্ট্রাল এডমিন ২', 'Central Admin 2', '01700000002', 'super_admin', 'approved', 'kaliganj', 'সেন্ট্রাল এডমিন', '2020-2021', true),
('super-admin-3', 'admin3@jhenaidah-ru.org', 'সেন্ট্রাল এডমিন ৩', 'Central Admin 3', '01700000003', 'super_admin', 'approved', 'shailkupa', 'সেন্ট্রাল এডমিন', '2020-2021', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.committees (
  id, title_bn, title_en, term_years, level, is_active
) VALUES (
  'comm-district-2025', 'জেলা কার্যনির্বাহী কমিটি ২০২৫-২০২৬', 'District Executive Committee 2025-2026', '2025-2026', 'district', true
)
ON CONFLICT (id) DO NOTHING;
