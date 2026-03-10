
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://uzvqreravzrefrucbraq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6dnFyZXJhdnpyZWZydWNicmFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4NzI4MDYsImV4cCI6MjA4ODQ0ODgwNn0.PT_wtR_-wpmLFz_YgezqwEXc6DGfKnPofEnz6zzDqX4';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkSong() {
    const { data, error } = await supabase.from('songs').select('id, title').eq('id', 'family-matters').single();
    if (error) {
        console.log('NOT_FOUND');
    } else {
        console.log('FOUND:', data.title);
    }
}

checkSong();
