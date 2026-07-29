-- ============================================
-- AOTCHI Waitlist - Supabase Schema
-- ============================================
-- Execute this in Supabase SQL Editor after creating your project

-- 1. Create waitlist table
CREATE TABLE waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  source TEXT DEFAULT 'landing-page'
);

-- 2. Enable Row Level Security
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- 3. Allow anyone to INSERT (join the waitlist)
CREATE POLICY "Allow insert for everyone" ON waitlist
  FOR INSERT WITH CHECK (true);

-- 4. Create a function to get the count (public, no auth needed)
CREATE OR REPLACE FUNCTION get_waitlist_count()
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER FROM waitlist;
$$ LANGUAGE sql SECURITY DEFINER;

-- 5. Allow anonymous access to the count function
GRANT EXECUTE ON FUNCTION get_waitlist_count() TO anon;

-- 6. Optional: Create an index for faster email lookups
CREATE INDEX idx_waitlist_email ON waitlist (email);

-- ============================================
-- After running this, get your credentials from:
-- Settings → API in Supabase Dashboard
-- ============================================
