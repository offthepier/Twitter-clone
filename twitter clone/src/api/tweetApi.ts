import { supabase } from '../lib/supabase';
import * as tweetService from '../services/tweetService';
import * as likeService from '../services/likeService';
import * as retweetService from '../services/retweetService';

export async function getCurrentUserId() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  return user.id;
}

export const {
  fetchTweets,
  createTweet,
  updateTweet,
  deleteTweet
} = tweetService;

export async function toggleLike(tweetId: string) {
  const userId = await getCurrentUserId();
  const existingLike = await likeService.getLike(tweetId, userId);

  if (existingLike) {
    await likeService.deleteLike(tweetId, userId);
  } else {
    await likeService.createLike(tweetId, userId);
  }
}

export async function toggleRetweet(tweetId: string) {
  const userId = await getCurrentUserId();
  const existingRetweet = await retweetService.getRetweet(tweetId, userId);

  if (existingRetweet) {
    await retweetService.deleteRetweet(tweetId, userId);
  } else {
    await retweetService.createRetweet(tweetId, userId);
  }
}