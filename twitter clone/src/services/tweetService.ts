import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type Tweet = Database['public']['Tables']['tweets']['Row'];

export async function fetchTweets() {
  const { data: tweets, error } = await supabase
    .from('tweets')
    .select(`
      *,
      profiles (
        id,
        username,
        display_name,
        avatar_url
      ),
      likes (
        user_id
      ),
      retweets (
        user_id
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return tweets;
}

export async function createTweet(content: string, imageUrl?: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: tweet, error } = await supabase
    .from('tweets')
    .insert({ 
      content, 
      image_url: imageUrl,
      user_id: user.id 
    })
    .select(`
      *,
      profiles (
        id,
        username,
        display_name,
        avatar_url
      )
    `)
    .single();

  if (error) throw error;
  return tweet;
}

export async function updateTweet(id: string, content: string, imageUrl?: string) {
  const { data: tweet, error } = await supabase
    .from('tweets')
    .update({ 
      content, 
      image_url: imageUrl,
      updated_at: new Date().toISOString() 
    })
    .eq('id', id)
    .select(`
      *,
      profiles (
        id,
        username,
        display_name,
        avatar_url
      )
    `)
    .single();

  if (error) throw error;
  return tweet;
}

export async function deleteTweet(id: string) {
  const { error } = await supabase
    .from('tweets')
    .delete()
    .eq('id', id);

  if (error) throw error;
}