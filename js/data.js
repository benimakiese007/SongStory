/**
 * SongStory — Dynamic Data Store via Supabase
 * Single source of truth for all songs and artists, fetched dynamically.
 */

let SONGS_DATA = [];
let ARTISTS_DATA = [];
let GLOSSARY = {};

window.loadAppDataFromSupabase = async function () {
    if (!window.ss_supabase) {
        console.warn('Supabase not initialized.');
        return;
    }

    try {
        const [artistsRes, songsRes, contentsRes, glossaryRes] = await Promise.all([
            window.ss_supabase.from('artists').select('*'),
            window.ss_supabase.from('songs').select('*').order('year', { ascending: false }),
            window.ss_supabase.from('song_contents').select('*').order('display_order', { ascending: true }),
            window.ss_supabase.from('glossary').select('*')
        ]);

        ARTISTS_DATA = artistsRes.data || [];

        const glossaryData = glossaryRes.data || [];
        GLOSSARY = glossaryData.reduce((acc, curr) => {
            acc[curr.term] = curr.definition;
            return acc;
        }, {});

        const rawSongs = songsRes.data || [];
        const rawContents = contentsRes.data || [];

        SONGS_DATA = rawSongs.map(song => {
            const artistObj = ARTISTS_DATA.find(a => a.id === song.artist_id);
            const artistName = artistObj ? artistObj.name : 'Artiste inconnu';

            const songContents = rawContents
                .filter(c => c.song_id === song.id)
                .map(c => ({
                    time: c.time,
                    lyrics: c.lyrics || [],
                    analysis: c.analysis || ''
                }));

            return {
                id: song.id,
                title: song.title,
                artist: artistName,
                artistId: song.artist_id,
                genre: song.genre,
                year: song.year,
                tags: song.tags || [],
                description: song.description,
                url: song.url,
                artistUrl: artistObj ? artistObj.url : '#',
                audio: song.audio_url,
                spotifyId: song.spotify_id,
                appleMusicId: song.apple_music_id,
                album: song.album,
                duration: song.duration,
                bpm: song.bpm,
                content: songContents
            };
        });

        console.log('✅ SongStory Data Loaded from Supabase');
    } catch (err) {
        console.error('Error loading data from Supabase:', err);
    }
};
