import { supabase } from '../lib/supabase';
import { createNotification } from './notificationService';

export async function getRetweet(tweetId: string, userId: string) {
  const { data, error } = await supabase
    .from('retweets')
    .select()
    .eq('tweet_id', tweetId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data;
}

export async function createRetweet(tweetId: string, userId: string) {
  // First get the tweet to know who to notify
  const { data: tweet, error: tweetError } = await supabase
    .from('tweets')
    .select('user_id')
    .eq('id', tweetId)
    .single();

  if (tweetError) throw tweetError;

  // Create the retweet
  const { error } = await supabase
    .from('retweets')
    .insert({ tweet_id: tweetId, user_id: userId });

  if (error) throw error;

  // Create notification for tweet author if it's not their own tweet
  if (tweet.user_id !== userId) {
    await createNotification(tweet.user_id, userId, 'retweet', tweetId);
  }
}

export async function deleteRetweet(tweetId: string, userId: string) {
  const { error } = await supabase
    .from('retweets')
    .delete()
    .eq('tweet_id', tweetId)
    .eq('user_id', userId);

  if (error) throw error;
}