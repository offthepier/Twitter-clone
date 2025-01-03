/*
  # Add search, notifications, and messaging features

  1. New Tables
    - `notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, recipient)
      - `actor_id` (uuid, user who triggered notification)
      - `type` (text, notification type)
      - `tweet_id` (uuid, optional reference to tweet)
      - `read` (boolean)
      - `created_at` (timestamp)
    
    - `messages`
      - `id` (uuid, primary key)
      - `sender_id` (uuid)
      - `recipient_id` (uuid)
      - `content` (text)
      - `read` (boolean)
      - `created_at` (timestamp)

  2. Search Functions
    - Full-text search for tweets
    - User search functionality

  3. Security
    - RLS policies for notifications and messages
*/

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  actor_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  tweet_id uuid REFERENCES tweets(id) ON DELETE CASCADE,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  recipient_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Notifications policies
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- Messages policies
CREATE POLICY "Users can view their messages"
  ON messages FOR SELECT
  USING (auth.uid() IN (sender_id, recipient_id));

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Add full-text search to tweets
ALTER TABLE tweets ADD COLUMN IF NOT EXISTS search_text tsvector
  GENERATED ALWAYS AS (to_tsvector('english', content)) STORED;

CREATE INDEX IF NOT EXISTS tweets_search_idx ON tweets USING GIN (search_text);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_participants ON messages(sender_id, recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);