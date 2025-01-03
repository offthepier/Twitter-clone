import React, { useEffect } from 'react';
import { useMessageStore } from '../../stores/messageStore';
import { MessageCard } from './MessageCard';

export function MessageList() {
  const { conversations, loading, fetchMessages } = useMessageStore();

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  if (loading) {
    return <div className="p-4 text-center text-twitter-gray">Loading messages...</div>;
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-twitter-border">
      {conversations.map((conversation) => (
        <MessageCard 
          key={conversation.partnerId} 
          conversation={conversation} 
        />
      ))}
      {conversations.length === 0 && (
        <div className="p-4 text-center text-twitter-gray">
          No messages yet
        </div>
      )}
    </div>
  );
}