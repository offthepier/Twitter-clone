import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useMessageThread } from '../../hooks/useMessageThread';
import { useProfileStore } from '../../stores/profileStore';
import { MessageComposer } from './MessageComposer';
import { formatDistanceToNow } from 'date-fns';
import { useAuthStore } from '../../stores/authStore';

export function MessageThread() {
  const { recipientId } = useParams();
  const navigate = useNavigate();
  const threadMessages = useMessageThread(recipientId);
  const { profile: recipient, fetchProfile } = useProfileStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (recipientId) {
      fetchProfile(recipientId);
    }
  }, [recipientId, fetchProfile]);

  if (!recipient || !user) return null;

  return (
    <div className="flex flex-col h-screen">
      <div className="sticky top-0 z-10 bg-white dark:bg-twitter-dark border-b border-gray-200 dark:border-twitter-border p-4">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/messages')}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-twitter-darker"
          >
            <ArrowLeft className="w-5 h-5 text-twitter-blue" />
          </button>
          <div>
            <h2 className="font-bold text-black dark:text-white">
              {recipient.display_name || recipient.username}
            </h2>
            <p className="text-sm text-twitter-gray">@{recipient.username}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-twitter-dark">
        <div className="space-y-4">
          {threadMessages.map((message) => {
            const isCurrentUser = message.sender_id === user.id;
            return (
              <div
                key={message.id}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl p-3 ${
                    isCurrentUser
                      ? 'bg-twitter-blue text-white'
                      : 'bg-gray-100 dark:bg-twitter-darker text-black dark:text-white'
                  }`}
                >
                  <p className="break-words">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {formatDistanceToNow(new Date(message.created_at))} ago
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <MessageComposer recipientId={recipientId!} />
    </div>
  );
}