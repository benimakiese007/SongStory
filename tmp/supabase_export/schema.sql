
-- Schema for SongStory

-- Artists Table
CREATE TABLE IF NOT EXISTS artists (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    genre TEXT,
    country TEXT,
    bio TEXT,
    influence TEXT,
    url TEXT,
    tags TEXT[]
);

-- Songs Table
CREATE TABLE IF NOT EXISTS songs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    artist_id TEXT REFERENCES artists(id),
    genre TEXT,
    year INTEGER,
    tags TEXT[],
    description TEXT,
    url TEXT,
    audio_url TEXT,
    spotify_id TEXT,
    apple_music_id TEXT,
    album TEXT,
    duration TEXT,
    bpm TEXT
);

-- Song Contents (Lyrics & Analysis)
CREATE TABLE IF NOT EXISTS song_contents (
    id BIGSERIAL PRIMARY KEY,
    song_id TEXT REFERENCES songs(id),
    time INTEGER NOT NULL,
    lyrics TEXT[] NOT NULL,
    analysis TEXT,
    display_order INTEGER DEFAULT 0
);

-- Glossary Table
CREATE TABLE IF NOT EXISTS glossary (
    term TEXT PRIMARY KEY,
    definition TEXT NOT NULL
);

-- Contributions Table
CREATE TABLE IF NOT EXISTS contributions (
    id TEXT PRIMARY KEY,
    song_id TEXT,
    line_ref TEXT,
    type TEXT,
    text TEXT,
    author TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Optional, but recommended for production)
-- ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE song_contents ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE glossary ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;

-- Simple policy for public read if RLS enabled
-- CREATE POLICY "Public Access" ON artists FOR SELECT USING (true);
-- CREATE POLICY "Public Access" ON songs FOR SELECT USING (true);
-- CREATE POLICY "Public Access" ON song_contents FOR SELECT USING (true);
-- CREATE POLICY "Public Access" ON glossary FOR SELECT USING (true);
-- CREATE POLICY "Public Access" ON contributions FOR SELECT USING (true);
-- CREATE POLICY "Public Insert" ON contributions FOR INSERT WITH CHECK (true);
