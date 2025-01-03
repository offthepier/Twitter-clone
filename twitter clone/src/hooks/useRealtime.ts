import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useTweetStore } from '../stores/tweetStore';
import { useNotificationStore } from '../stores/notificationStore';
import { useMessageStore } from '../stores/messageStore';
import { useAuthStore } from '../stores/authStore';

export function useRealtimeTweets() {
  const { tweets, addTweet, updateTweetInStore, deleteTweetFromStore } = useTweetStore();
  const { addNotification } = useNotificationStore();
  const { addMessage } = useMessageStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('realtime-updates')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'tweets',
      }, (payload) => {
        addTweet(payload.new);
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'tweets',
      }, (payload) => {
        updateTweetInStore(payload.new);
      })
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'tweets',
      }, (payload) => {
        deleteTweetFromStore(payload.old.id);
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        addNotification(payload.new);
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `recipient_id=eq.${user.id}`,
      }, (payload) => {
        addMessage(payload.new);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);
}