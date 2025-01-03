import { supabase } from '../lib/supabase';

export type NotificationType = 'like' | 'retweet' | 'follow' | 'mention';

export async function getNotifications() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: notifications, error } = await supabase
    .from('notifications')
    .select(`
      *,
      actor:profiles!actor_id (
        id,
        username,
        display_name,
        avatar_url
      ),
      tweet:tweets (
        id,
        content
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return notifications || [];
}

export async function createNotification(
  userId: string,
  actorId: string,
  type: NotificationType,
  tweetId?: string
) {
  const { error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      actor_id: actorId,
      type,
      tweet_id: tweetId,
      read: false
    });

  if (error) {
    console.error('Error creating notification:', error);
    throw new Error('Failed to create notification');
  }
}

export async function markNotificationAsRead(id: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', id);

  if (error) throw error;
}