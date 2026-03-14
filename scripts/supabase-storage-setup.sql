-- ============================================
-- SongStory CMS — Storage Policies Setup
-- Execute this in your Supabase SQL Editor
-- ============================================

-- 1. Ensure policies for the 'media' bucket are set properly
-- We assume the bucket 'media' already exists (Public: Yes)

-- Allow public access to read files (Necessary for the site to show images)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' AND policyname = 'Public Access'
    ) THEN
        CREATE POLICY "Public Access"
        ON storage.objects FOR SELECT
        USING ( bucket_id = 'media' );
    END IF;
END $$;

-- Allow authenticated users to upload files (Necessary for the CMS)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' AND policyname = 'Allow Authenticated Uploads'
    ) THEN
        CREATE POLICY "Allow Authenticated Uploads"
        ON storage.objects FOR INSERT
        WITH CHECK (
          bucket_id = 'media' AND
          auth.role() = 'authenticated'
        );
    END IF;
END $$;

-- Allow authenticated users to update files (upsert)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' AND policyname = 'Allow Authenticated Updates'
    ) THEN
        CREATE POLICY "Allow Authenticated Updates"
        ON storage.objects FOR UPDATE
        USING (
          bucket_id = 'media' AND
          auth.role() = 'authenticated'
        );
    END IF;
END $$;

-- Allow authenticated users to delete files
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' AND policyname = 'Allow Authenticated Deletions'
    ) THEN
        CREATE POLICY "Allow Authenticated Deletions"
        ON storage.objects FOR DELETE
        USING (
          bucket_id = 'media' AND
          auth.role() = 'authenticated'
        );
    END IF;
END $$;
