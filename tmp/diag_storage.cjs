const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://uzvqreravzrefrucbraq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6dnFyZXJhdnpyZWZydWNicmFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4NzI4MDYsImV4cCI6MjA4ODQ0ODgwNn0.PT_wtR_-wpmLFz_YgezqwEXc6DGfKnPofEnz6zzDqX4';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkStorage() {
    console.log('--- Checking Supabase Storage ---');

    // 1. List Buckets
    const { data: buckets, error: bError } = await supabase.storage.listBuckets();
    if (bError) {
        console.error('Error listing buckets:', bError.message);
    } else {
        console.log('Buckets found:', buckets.map(b => `${b.name} (Public: ${b.public})`).join(', '));
        const mediaBucket = buckets.find(b => b.name === 'media');
        if (!mediaBucket) {
            console.error('CRITICAL: "media" bucket NOT found!');
        } else if (!mediaBucket.public) {
            console.warn('WARNING: "media" bucket is NOT public. Image URLs might fail.');
        }
    }

    // 2. Try a dummy upload
    console.log('\n--- Testing dummy upload to "media/test/" ---');
    const dummyContent = 'Hello SongStory';
    const fileName = `test-${Date.now()}.txt`;
    const filePath = `test/${fileName}`;

    const { data: uploadData, error: uError } = await supabase.storage
        .from('media')
        .upload(filePath, dummyContent, {
            contentType: 'text/plain',
            upsert: true
        });

    if (uError) {
        console.error('Upload FAILED:', uError.message);
        console.log('Reason might be RLS (Row Level Security) on storage.objects or missing bucket.');
    } else {
        console.log('Upload SUCCESSFUL:', uploadData.path);

        // 3. Try to get public URL
        const { data: urlData } = supabase.storage
            .from('media')
            .getPublicUrl(filePath);
        console.log('Public URL:', urlData.publicUrl);

        // 4. Try to delete test file
        const { error: dError } = await supabase.storage
            .from('media')
            .remove([filePath]);
        if (dError) {
            console.error('Cleanup FAILED:', dError.message);
        } else {
            console.log('Cleanup successful.');
        }
    }
}

checkStorage().then(() => {
    setTimeout(() => process.exit(0), 100);
});
