import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import { Link } from 'react-router-dom';

interface MessageCardProps {
  conversation: {
    partnerId: string;
    partner: {
      id: string;
      username: string;
      display_name: string | null;
      avatar_url: string | null;
    };
    lastMessage: {
      content: string;
      created_at: string;
      read: boolean;
      sender_id: string;
    };
    unreadCount: number;
  };
}

export function MessageCard({ conversation }: MessageCardProps) {
  const { user } = useAuthStore();
  const { partner, lastMessage, unreadCount } = conversation;
  const isCurrentUser = user?.id === lastMessage.sender_id;

  return (
    <Link to={`/messages/${partner.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 hover:bg-gray-50 dark:hover:bg-twitter-darker cursor-pointer"
      >
        <div className="flex items-start space-x-3">
          <img
            src={partner.avatar_url || `https://api.dicebear.com/7.x/avatars/svg?seed=${partner.id}`}
            alt={partner.username}
            className="w-12 h-12 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2 min-w-0 flex-1 mr-4">
                <span className="font-bold text-black dark:text-white truncate">
                  {partner.display_name || partner.username}
                </span>
                <span className="text-twitter-gray truncate">@{partner.username}</span>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                <span className="text-sm text-twitter-gray whitespace-nowrap">
                  {formatDistanceToNow(new Date(lastMessage.created_at))} ago
                </span>
                {!lastMessage.read && !isCurrentUser && (
                  <div className="w-2 h-2 rounded-full bg-twitter-blue" />
                )}
              </div>
            </div>
            <p className={`text-black dark:text-white truncate ${
              !lastMessage.read && !isCurrentUser ? 'font-semibold' : ''
            }`}>
              {isCurrentUser && 'You: '}{lastMessage.content}
            </p>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}