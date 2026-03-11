/**
 * SongStory — Supabase Client Initialization
 * Replace YOUR_SUPABASE_URL and YOUR_SUPABASE_ANON_KEY with your project credentials.
 */

const SUPABASE_URL = 'https://uzvqreravzrefrucbraq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6dnFyZXJhdnpyZWZydWNicmFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4NzI4MDYsImV4cCI6MjA4ODQ0ODgwNn0.PT_wtR_-wpmLFz_YgezqwEXc6DGfKnPofEnz6zzDqX4';

// Check if supabase is loaded from CDN
if (typeof supabase === 'undefined') {
    console.error('Supabase library not loaded. Make sure to include it in your HTML: <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>');
}

const supabaseClient = typeof supabase !== 'undefined' ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// Export for use in other scripts
window.ss_supabase = supabaseClient;
