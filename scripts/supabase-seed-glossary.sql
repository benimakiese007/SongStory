-- ============================================
-- SongStory CMS — Glossary Table & Seed
-- Execute this in your Supabase SQL Editor
-- ============================================

-- Create Glossary table
CREATE TABLE IF NOT EXISTS glossary (
  term TEXT PRIMARY KEY,
  definition TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE glossary ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Public read glossary" ON glossary FOR SELECT USING (true);

-- Auth write
CREATE POLICY "Auth insert glossary" ON glossary FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update glossary" ON glossary FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete glossary" ON glossary FOR DELETE USING (auth.role() = 'authenticated');

-- Seed Data
INSERT INTO glossary (term, definition)
VALUES
  ('beef', 'Un conflit ouvert entre deux ou plusieurs artistes, s''exprimant généralement à travers des diss tracks.'),
  ('diss track', 'Un morceau de musique spécifiquement créé pour attaquer ou ridiculiser un autre artiste.'),
  ('flow', 'Le rythme, la cadence et l''articulation d''un rappeur sur une instru.'),
  ('ghostwriter', 'Une personne qui écrit des paroles pour un autre artiste sans être créditée publiquement.'),
  ('storytelling', 'L''art de raconter une histoire à travers les paroles d''une chanson.'),
  ('punchline', 'Une phrase forte, souvent humoristique ou percutante, destinée à marquer l''auditeur.')
ON CONFLICT (term) DO NOTHING;
