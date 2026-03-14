const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://uzvqreravzrefrucbraq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6dnFyZXJhdnpyZWZydWNicmFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4NzI4MDYsImV4cCI6MjA4ODQ0ODgwNn0.PT_wtR_-wpmLFz_YgezqwEXc6DGfKnPofEnz6zzDqX4';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkFinalData() {
    console.log('--- Checking Dave Data ---');
    
    const { data: artist } = await supabase
        .from('artists')
        .select('*')
        .eq('id', 'dave')
        .single();
    
    const { data: song } = await supabase
        .from('songs')
        .select('*')
        .eq('id', 'both-sides-of-a-smile')
        .single();

    console.log('Artist Photo URL:', artist?.photo_url);
    console.log('Song Cover URL:', song?.cover_url);
}

checkFinalData().then(() => {
    setTimeout(() => process.exit(0), 100);
});
