/*
  # Initial Schema Setup

  1. Tables
    - profiles
      - id (uuid, references auth.users)
      - username (text, unique)
      - display_name (text)
      - avatar_url (text)
      - bio (text)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - tweets
      - id (uuid)
      - user_id (uuid, references profiles)
      - content (text)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - likes
      - id (uuid)
      - user_id (uuid, references profiles)
      - tweet_id (uuid, references tweets)
      - created_at (timestamp)
    
    - follows
      - follower_id (uuid, references profiles)
      - following_id (uuid, references profiles)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Profiles table
CREATE TABLE profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username text UNIQUE NOT NULL,
  display_name text,
  avatar_url text,
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tweets table
CREATE TABLE tweets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Likes table
CREATE TABLE likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
  tweet_id uuid REFERENCES tweets ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, tweet_id)
);

-- Follows table
CREATE TABLE follows (
  follower_id uuid REFERENCES profiles ON DELETE CASCADE,
  following_id uuid REFERENCES profiles ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (follower_id, following_id)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tweets ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Tweets policies
CREATE POLICY "Tweets are viewable by everyone"
  ON tweets FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own tweets"
  ON tweets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tweets"
  ON tweets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tweets"
  ON tweets FOR DELETE
  USING (auth.uid() = user_id);

-- Likes policies
CREATE POLICY "Likes are viewable by everyone"
  ON likes FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own likes"
  ON likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own likes"
  ON likes FOR DELETE
  USING (auth.uid() = user_id);

-- Follows policies
CREATE POLICY "Follows are viewable by everyone"
  ON follows FOR SELECT
  USING (true);

CREATE POLICY "Users can manage own follows"
  ON follows FOR ALL
  USING (auth.uid() = follower_id);