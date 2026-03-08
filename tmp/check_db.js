
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://uzvqreravzrefrucbraq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6dnFyZXJhdnpyZWZydWNicmFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4NzI4MDYsImV4cCI6MjA4ODQ0ODgwNn0.PT_wtR_-wpmLFz_YgezqwEXc6DGfKnPofEnz6zzDqX4';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkSong() {
    const { data: song, error: songError } = await supabase.from('songs').select('id, title').eq('id', 'family-matters').single();
    if (songError) {
        console.log('SONG_NOT_FOUND');
    } else {
        console.log('SONG_FOUND:', song.title);
        const { data: content, error: contentError } = await supabase.from('song_contents').select('id').eq('song_id', 'family-matters');
        console.log('CONTENT_COUNT:', content ? content.length : 0);
    }
}

checkSong();
