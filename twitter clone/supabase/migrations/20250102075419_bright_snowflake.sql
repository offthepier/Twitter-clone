/*
  # Add retweets and update tweets schema

  1. New Tables
    - `retweets`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `tweet_id` (uuid, references tweets)
      - `created_at` (timestamptz)

  2. Changes
    - Add `image_url` to tweets table
    - Update RLS policies
*/

-- Add image_url to tweets
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tweets' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE tweets ADD COLUMN image_url text;
  END IF;
END $$;

-- Create retweets table if it doesn't exist
CREATE TABLE IF NOT EXISTS retweets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  tweet_id uuid REFERENCES tweets(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, tweet_id)
);

-- Enable RLS
ALTER TABLE retweets ENABLE ROW LEVEL SECURITY;

-- Retweets policies
CREATE POLICY "Retweets are viewable by everyone"
  ON retweets FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own retweets"
  ON retweets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own retweets"
  ON retweets FOR DELETE
  USING (auth.uid() = user_id);

-- Update tweets policies to include user_id check
CREATE POLICY "Users can insert tweets with user_id"
  ON tweets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_tweets_created_at ON tweets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_likes_tweet_id ON likes(tweet_id);
CREATE INDEX IF NOT EXISTS idx_retweets_tweet_id ON retweets(tweet_id);