-- ============================================
-- SongStory CMS — Supabase Schema Setup
-- Execute this in your Supabase SQL Editor
-- ============================================

-- 1. Songs table
CREATE TABLE IF NOT EXISTS songs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  artist_id TEXT NOT NULL,
  genre TEXT DEFAULT 'Rap',
  year INT DEFAULT 2024,
  duration TEXT,
  cover_url TEXT,
  tags TEXT[] DEFAULT '{}',
  description TEXT,
  url TEXT,
  audio_url TEXT,
  spotify_id TEXT,
  apple_music_id TEXT,
  lyrics TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
 );

-- 2. Artists table
CREATE TABLE IF NOT EXISTS artists (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  genre TEXT,
  country TEXT,
  bio TEXT,
  photo_url TEXT,
  songs TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Enable Row Level Security
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;

-- 4. Public read access
CREATE POLICY "Public read songs" ON songs FOR SELECT USING (true);
CREATE POLICY "Public read artists" ON artists FOR SELECT USING (true);

-- 5. Authenticated users can insert/update/delete
CREATE POLICY "Auth insert songs" ON songs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update songs" ON songs FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete songs" ON songs FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth insert artists" ON artists FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update artists" ON artists FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete artists" ON artists FOR DELETE USING (auth.role() = 'authenticated');

-- 6. Storage bucket (run this separately or create via Dashboard)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);
