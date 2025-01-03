import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type Message = Database['public']['Tables']['messages']['Row'] & {
  sender: Database['public']['Tables']['profiles']['Row'];
  recipient: Database['public']['Tables']['profiles']['Row'];
};

export async function getMessages(userId: string): Promise<Message[]> {
  const { data: messages, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:profiles!sender_id (
        id,
        username,
        display_name,
        avatar_url
      ),
      recipient:profiles!recipient_id (
        id,
        username,
        display_name,
        avatar_url
      )
    `)
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return messages || [];
}

export async function sendMessage(recipientId: string, content: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('messages')
    .insert({
      sender_id: user.id,
      recipient_id: recipientId,
      content,
      read: false
    });

  if (error) {
    console.error('Error sending message:', error);
    throw new Error('Failed to send message');
  }
}

export async function markMessageAsRead(messageId: string) {
  const { error } = await supabase
    .from('messages')
    .update({ read: true })
    .eq('id', messageId);

  if (error) throw error;
}