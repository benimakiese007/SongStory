const SUPABASE_URL = 'https://uzvqreravzrefrucbraq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6dnFyZXJhdnpyZWZydWNicmFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4NzI4MDYsImV4cCI6MjA4ODQ0ODgwNn0.PT_wtR_-wpmLFz_YgezqwEXc6DGfKnPofEnz6zzDqX4';

async function deleteDuplicate() {
    try {
        const url = `${SUPABASE_URL}/rest/v1/artists?id=eq.2pac`;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });

        if (response.ok) {
            console.log('Successfully deleted the duplicate artist with ID "2pac".');
        } else {
            console.error('Failed to delete:', response.status, await response.text());
        }
    } catch (e) {
        console.error('Error:', e);
    }
}

deleteDuplicate();
