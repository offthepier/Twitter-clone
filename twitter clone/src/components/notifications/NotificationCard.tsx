import React from 'react';
import { Heart, Repeat2, UserPlus, AtSign } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

const notificationIcons = {
  like: Heart,
  retweet: Repeat2,
  follow: UserPlus,
  mention: AtSign,
};

const notificationColors = {
  like: 'text-pink-500',
  retweet: 'text-green-500',
  follow: 'text-blue-500',
  mention: 'text-purple-500',
};

interface NotificationCardProps {
  notification: any;
  onRead: () => void;
}

export function NotificationCard({ notification, onRead }: NotificationCardProps) {
  const Icon = notificationIcons[notification.type as keyof typeof notificationIcons];
  const colorClass = notificationColors[notification.type as keyof typeof notificationColors];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 border-b border-gray-200 dark:border-twitter-border hover:bg-gray-50 dark:hover:bg-twitter-darker ${
        !notification.read ? 'bg-blue-50 dark:bg-twitter-blue/10' : ''
      }`}
      onClick={onRead}
    >
      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-full ${colorClass} bg-opacity-10`}>
          <Icon className={`w-5 h-5 ${colorClass}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <img
              src={notification.actor.avatar_url || `https://api.dicebear.com/7.x/avatars/svg?seed=${notification.actor.id}`}
              alt={notification.actor.username}
              className="w-5 h-5 rounded-full"
            />
            <span className="font-bold text-black dark:text-white">
              {notification.actor.display_name || notification.actor.username}
            </span>
          </div>
          <p className="text-twitter-gray mt-1">
            {notification.type === 'like' && 'liked your tweet'}
            {notification.type === 'retweet' && 'retweeted your tweet'}
            {notification.type === 'follow' && 'followed you'}
            {notification.type === 'mention' && 'mentioned you'}
          </p>
          {notification.tweet && (
            <p className="mt-2 text-sm text-twitter-gray">
              {notification.tweet.content}
            </p>
          )}
          <span className="text-sm text-twitter-gray mt-2 block">
            {formatDistanceToNow(new Date(notification.created_at))} ago
          </span>
        </div>
      </div>
    </motion.div>
  );
}