const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://uzvqreravzrefrucbraq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6dnFyZXJhdnpyZWZydWNicmFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4NzI4MDYsImV4cCI6MjA4ODQ0ODgwNn0.PT_wtR_-wpmLFz_YgezqwEXc6DGfKnPofEnz6zzDqX4';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function updateDave() {
    console.log('Updating Dave bio in database...');
    const { data, error } = await supabase
        .from('artists')
        .update({ bio: "Le prodige de Streatham, connu pour son intelligence lyricale hors norme et ses récits poignants sur la société et l'identité." })
        .eq('id', 'dave');

    if (error) {
        console.error('Error updating Dave:', error);
    } else {
        console.log('Dave successfully updated!');
    }
}

updateDave();
