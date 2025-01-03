/*
  # Add storage bucket for tweet images
  
  1. Storage Setup
    - Creates storage bucket for tweet images
    - Sets up RLS policies for secure access
*/

-- Create storage bucket if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'tweet-images'
  ) THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('tweet-images', 'tweet-images', true);
  END IF;
END $$;

-- Drop existing policies if they exist
DO $$
BEGIN
  -- Clean up any existing policies
  DROP POLICY IF EXISTS "Authenticated users can upload tweet images" ON storage.objects;
  DROP POLICY IF EXISTS "Anyone can view tweet images" ON storage.objects;
  DROP POLICY IF EXISTS "Users can update their own images" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete their own images" ON storage.objects;
END $$;

-- Create new policies
CREATE POLICY "Authenticated users can upload tweet images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'tweet-images');

CREATE POLICY "Anyone can view tweet images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'tweet-images');

CREATE POLICY "Users can update their own images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'tweet-images' AND owner = auth.uid());

CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'tweet-images' AND owner = auth.uid());