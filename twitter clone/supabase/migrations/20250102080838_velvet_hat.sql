/*
  # Add storage bucket for tweet images
  
  1. New Storage Bucket
    - Creates a new public bucket for storing tweet images
    - Sets appropriate security policies
*/

-- Enable storage
INSERT INTO storage.buckets (id, name, public)
VALUES ('tweet-images', 'tweet-images', true);

-- Set up storage policy for authenticated users
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