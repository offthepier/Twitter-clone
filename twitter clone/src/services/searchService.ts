import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Tweet = Database['public']['Tables']['tweets']['Row'];

export async function searchUsers(query: string): Promise<Profile[]> {
  // Remove @ symbol if present at the start
  const cleanQuery = query.startsWith('@') ? query.slice(1) : query;
  
  const { data: users, error } = await supabase
    .from('profiles')
    .select()
    .or(`username.ilike.${cleanQuery}%,display_name.ilike.%${cleanQuery}%`)
    .order('username');

  if (error) throw error;
  return users || [];
}

export async function searchTweets(query: string): Promise<Tweet[]> {
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
      likes (user_id),
      retweets (user_id)
    `)
    .textSearch('content', query)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return tweets || [];
}