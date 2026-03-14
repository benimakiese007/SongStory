const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://uzvqreravzrefrucbraq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6dnFyZXJhdnpyZWZydWNicmFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4NzI4MDYsImV4cCI6MjA4ODQ0ODgwNn0.PT_wtR_-wpmLFz_YgezqwEXc6DGfKnPofEnz6zzDqX4';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function updateSongData() {
    console.log('Updating song record...');
    
    // First, find the 'Dave' entry to get its current ID if different
    const { data: oldSong } = await supabase
        .from('songs')
        .select('id')
        .eq('title', 'Dave')
        .eq('artist_id', 'dave')
        .single();

    if (!oldSong) {
        console.log('Old song entry not found. Maybe it was already updated?');
        return;
    }

    const { error } = await supabase
        .from('songs')
        .update({
            id: 'both-sides-of-a-smile',
            title: 'Both Sides Of A Smile',
            url: 'songs/dave/both-sides-of-a-smile.html',
            cover_url: 'images/covers/both-sides-of-a-smile-cover.webp',
            tags: ['Storytelling', 'James Blake']
        })
        .eq('id', oldSong.id);

    if (error) {
        console.error('Error updating song:', error.message);
        process.exit(1);
    }

    console.log('Song record updated successfully!');
}

updateSongData().then(() => {
    setTimeout(() => process.exit(0), 100);
});
