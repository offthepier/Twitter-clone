import { useState, useEffect } from 'react';
import { useMessageStore } from '../stores/messageStore';
import { useAuthStore } from '../stores/authStore';

export function useMessageThread(recipientId: string | undefined) {
  const { messages, fetchMessages } = useMessageStore();
  const { user } = useAuthStore();
  const [threadMessages, setThreadMessages] = useState<any[]>([]);

  useEffect(() => {
    if (recipientId && user) {
      fetchMessages();
    }
  }, [recipientId, user, fetchMessages]);

  useEffect(() => {
    if (recipientId && user) {
      const filtered = messages
        .filter(
          m => (m.sender_id === user.id && m.recipient_id === recipientId) ||
               (m.sender_id === recipientId && m.recipient_id === user.id)
        )
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      
      setThreadMessages(filtered);
    }
  }, [messages, recipientId, user]);

  return threadMessages;
}