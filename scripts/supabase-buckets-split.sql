-- ============================================
-- SongStory CMS — Split Storage Buckets Setup
-- Execute this in your Supabase SQL Editor
-- ============================================

-- 1. Create the 'covers' bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('covers', 'covers', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Create the 'artists' bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('artists', 'artists', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Policies for 'covers' bucket
CREATE POLICY "Public Read Covers" ON storage.objects FOR SELECT USING (bucket_id = 'covers');
CREATE POLICY "Auth Insert Covers" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'covers' AND auth.role() = 'authenticated');
CREATE POLICY "Auth Update Covers" ON storage.objects FOR UPDATE USING (bucket_id = 'covers' AND auth.role() = 'authenticated');
CREATE POLICY "Auth Delete Covers" ON storage.objects FOR DELETE USING (bucket_id = 'covers' AND auth.role() = 'authenticated');

-- 4. Policies for 'artists' bucket
CREATE POLICY "Public Read Artists" ON storage.objects FOR SELECT USING (bucket_id = 'artists');
CREATE POLICY "Auth Insert Artists" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'artists' AND auth.role() = 'authenticated');
CREATE POLICY "Auth Update Artists" ON storage.objects FOR UPDATE USING (bucket_id = 'artists' AND auth.role() = 'authenticated');
CREATE POLICY "Auth Delete Artists" ON storage.objects FOR DELETE USING (bucket_id = 'artists' AND auth.role() = 'authenticated');

-- Note: You can delete the old 'media' bucket once you've moved existing files, 
-- or just keep it as a legacy folder.
