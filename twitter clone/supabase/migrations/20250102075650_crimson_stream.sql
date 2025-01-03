/*
  # Fix profile policies and add trigger

  1. Changes
    - Add policy for users to insert their own profile
    - Add trigger to ensure profile exists on auth.users insert
    - Add policy for profile updates
  
  2. Security
    - Maintains RLS while allowing proper profile creation
    - Ensures profiles can only be created/updated by matching user
*/

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create auth trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', 'user_' || substr(md5(random()::text), 0, 8)),
    COALESCE(new.raw_user_meta_data->>'display_name', 'New User'),
    'https://api.dicebear.com/7.x/avatars/svg?seed=' || new.id
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user profiles
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();