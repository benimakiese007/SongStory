-- SongStory: User Annotations & Votes Schema

-- 1. Table for Annotations
CREATE TABLE IF NOT EXISTS public.user_annotations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    song_id TEXT NOT NULL, -- Corresponds to data.js ID (e.g., 'not-like-us')
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_name TEXT,
    content TEXT NOT NULL,
    quote TEXT, -- The selected text being annotated
    line_index INTEGER, -- Optional: helps positioning
    status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Table for Votes on Annotations
CREATE TABLE IF NOT EXISTS public.annotation_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    annotation_id UUID REFERENCES public.user_annotations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    vote_type INTEGER DEFAULT 1, -- 1 for upvote, -1 for downvote
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(annotation_id, user_id)
);

-- 3. Row Level Security (RLS)
ALTER TABLE public.user_annotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.annotation_votes ENABLE ROW LEVEL SECURITY;

-- Policies for Annotations
CREATE POLICY "Anyone can view approved annotations" 
    ON public.user_annotations FOR SELECT 
    USING (status = 'approved');

CREATE POLICY "Users can view their own pending annotations" 
    ON public.user_annotations FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create annotations" 
    ON public.user_annotations FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

-- Policies for Votes
CREATE POLICY "Anyone can view votes" 
    ON public.annotation_votes FOR SELECT 
    USING (true);

CREATE POLICY "Authenticated users can vote" 
    ON public.annotation_votes FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own votes" 
    ON public.annotation_votes FOR UPDATE 
    USING (auth.uid() = user_id);
