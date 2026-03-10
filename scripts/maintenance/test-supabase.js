
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://obcgvgaazxhiiyopfhwq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iY2d2Z2FhenhoaWl5b3BmaHdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4Mzk4NDIsImV4cCI6MjA4ODQxNTg0Mn0.FvlNm8l-bu_7yL2SFDJ7PaFwRVkJJkwhVQ541WCDYCI';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function test() {
    console.log('Testing Supabase connection...');

    const { data: glossary, error: gError } = await supabase.from('glossary').select('*').limit(1);
    if (gError) {
        console.error('Error fetching glossary:', gError.message);
    } else {
        console.log('Glossary table exists. Rows found:', glossary.length);
    }

    const { data: contrib, error: cError } = await supabase.from('contributions').select('*').limit(1);
    if (cError) {
        console.error('Error fetching contributions:', cError.message);
    } else {
        console.log('Contributions table exists. Rows found:', contrib.length);
    }

    const tables = ['artists', 'songs', 'song_contents'];
    for (const table of tables) {
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (error) {
            console.error(`Error fetching ${table}:`, error.message);
        } else {
            console.log(`${table} table exists. Rows found:`, data.length);
        }
    }
}

test();
