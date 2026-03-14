const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://uzvqreravzrefrucbraq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6dnFyZXJhdnpyZWZydWNicmFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4NzI4MDYsImV4cCI6MjA4ODQ0ODgwNn0.PT_wtR_-wpmLFz_YgezqwEXc6DGfKnPofEnz6zzDqX4';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function fetchSongData() {
    const { data, error } = await supabase
        .from('songs')
        .select('*')
        .eq('title', 'Dave')
        .eq('artist_id', 'dave')
        .single();

    if (error) {
        console.error('Error fetching song:', error.message);
        process.exit(1);
    }

    if (data) {
        console.log('---LYRICS_START---');
        console.log(data.lyrics);
        console.log('---LYRICS_END---');
        console.log('---METADATA---');
        console.log(JSON.stringify({
            id: data.id,
            title: data.title,
            artist_id: data.artist_id,
            year: data.year,
            genre: data.genre
        }));
    } else {
        console.log('Song not found.');
    }
}

fetchSongData().then(() => {
    setTimeout(() => process.exit(0), 100);
});
