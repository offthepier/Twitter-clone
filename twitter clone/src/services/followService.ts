import { supabase } from '../lib/supabase';
import { createNotification } from './notificationService';

export async function followUser(userId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('follows')
    .insert({
      follower_id: user.id,
      following_id: userId
    });

  if (error && error.code !== '23505') { // Ignore duplicate follows
    throw error;
  }

  // Create notification for the followed user
  await createNotification(userId, user.id, 'follow');
}

export async function unfollowUser(userId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('follows')
    .delete()
    .eq('follower_id', user.id)
    .eq('following_id', userId);

  if (error) throw error;
}

export async function isFollowing(userId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from('follows')
    .select()
    .eq('follower_id', user.id)
    .eq('following_id', userId)
    .maybeSingle();

  if (error) throw error;
  return !!data;
}