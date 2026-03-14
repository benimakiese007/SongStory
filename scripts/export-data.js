/**
 * Script to extract data from js/data.js and format it for Supabase import.
 * Run this with: node scripts/export-data.js
 */

const fs = require('fs');
const path = require('path');

// Mock browser environment for data.js
global.SONGS_DATA = [];
global.ARTISTS_DATA = [];
global.GLOSSARY = {};
global.window = { location: { pathname: '' }, addEventListener: () => {} };
global.document = { addEventListener: () => {} };

const dataPath = path.join(__dirname, '..', 'public', 'js', 'data.js');
const dataContent = fs.readFileSync(dataPath, 'utf8');

// Strip 'const' or 'let' to allow global assignment in eval
const executableContent = dataContent
    .replace(/^(const|let|var)\s+SONGS_DATA/gm, 'global.SONGS_DATA')
    .replace(/^(const|let|var)\s+ARTISTS_DATA/gm, 'global.ARTISTS_DATA')
    .replace(/^(const|let|var)\s+GLOSSARY/gm, 'global.GLOSSARY');

try {
    eval(executableContent);
} catch (e) {
    console.warn("Eval partially failed, but data might be loaded:", e.message);
}
// Fallback check
if (global.SONGS_DATA.length === 0 && typeof SONGS_DATA !== 'undefined') global.SONGS_DATA = SONGS_DATA;
if (global.ARTISTS_DATA.length === 0 && typeof ARTISTS_DATA !== 'undefined') global.ARTISTS_DATA = ARTISTS_DATA;
if (Object.keys(global.GLOSSARY).length === 0 && typeof GLOSSARY !== 'undefined') global.GLOSSARY = GLOSSARY;

const artists = global.ARTISTS_DATA.map(a => ({
    id: a.id,
    name: a.name,
    genre: a.genre,
    country: a.country,
    bio: a.bio,
    photo_url: a.photo_url,
    url: a.url
}));

const songs = global.SONGS_DATA.map(s => ({
    id: s.id,
    title: s.title,
    artist_id: s.artist_id,
    genre: s.genre,
    year: s.year,
    cover_url: s.cover_url,
    tags: s.tags,
    description: s.description,
    url: s.url,
    audio_url: s.audio,
    spotify_id: s.spotifyId,
    apple_music_id: s.appleMusicId,
    duration: s.duration
}));

const songContents = [];
global.SONGS_DATA.forEach(s => {
    if (s.content) {
        s.content.forEach((c, idx) => {
            songContents.push({
                song_id: s.id,
                time: c.time,
                lyrics: c.lyrics,
                analysis: c.analysis,
                display_order: idx
            });
        });
    }
});

const glossary = Object.entries(global.GLOSSARY).map(([term, definition]) => ({
    term,
    definition
}));

const outputDir = path.join(__dirname, '..', 'tmp', 'supabase_export');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

fs.writeFileSync(path.join(outputDir, 'artists.json'), JSON.stringify(artists, null, 2));
fs.writeFileSync(path.join(outputDir, 'songs.json'), JSON.stringify(songs, null, 2));
fs.writeFileSync(path.join(outputDir, 'song_contents.json'), JSON.stringify(songContents, null, 2));
fs.writeFileSync(path.join(outputDir, 'glossary.json'), JSON.stringify(glossary, null, 2));

console.log('Export complete! Files generated in tmp/supabase_export/');
