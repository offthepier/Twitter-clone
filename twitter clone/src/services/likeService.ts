import { supabase } from '../lib/supabase';
import { createNotification } from './notificationService';

export async function getLike(tweetId: string, userId: string) {
  const { data, error } = await supabase
    .from('likes')
    .select()
    .eq('tweet_id', tweetId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data;
}

export async function createLike(tweetId: string, userId: string) {
  // First get the tweet to know who to notify
  const { data: tweet, error: tweetError } = await supabase
    .from('tweets')
    .select('user_id')
    .eq('id', tweetId)
    .single();

  if (tweetError) throw tweetError;

  // Create the like
  const { error } = await supabase
    .from('likes')
    .insert({ tweet_id: tweetId, user_id: userId });

  if (error) throw error;

  // Create notification for tweet author if it's not their own tweet
  if (tweet.user_id !== userId) {
    await createNotification(tweet.user_id, userId, 'like', tweetId);
  }
}

export async function deleteLike(tweetId: string, userId: string) {
  const { error } = await supabase
    .from('likes')
    .delete()
    .eq('tweet_id', tweetId)
    .eq('user_id', userId);

  if (error) throw error;
}