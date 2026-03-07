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

const dataPath = path.join(__dirname, '..', 'js', 'data.js');
const dataContent = fs.readFileSync(dataPath, 'utf8');

// Strip 'const' to allow global assignment in eval
const executableContent = dataContent
    .replace(/const SONGS_DATA/g, 'SONGS_DATA')
    .replace(/const ARTISTS_DATA/g, 'ARTISTS_DATA')
    .replace(/const GLOSSARY/g, 'GLOSSARY');

eval(executableContent);

const artists = global.ARTISTS_DATA.map(a => ({
    id: a.id,
    name: a.name,
    genre: a.genre,
    country: a.country,
    bio: a.bio,
    influence: a.influence,
    url: a.url,
    tags: a.tags
}));

const songs = global.SONGS_DATA.map(s => ({
    id: s.id,
    title: s.title,
    artist_id: s.artistId,
    genre: s.genre,
    year: s.year,
    tags: s.tags,
    description: s.description,
    url: s.url,
    audio_url: s.audio,
    spotify_id: s.spotifyId,
    apple_music_id: s.appleMusicId,
    album: s.album,
    duration: s.duration,
    bpm: s.bpm
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
