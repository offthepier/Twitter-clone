import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Repeat2, Share } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Tweet } from '../types/tweet';
import { TweetActions } from './TweetActions';
import { EditTweetModal } from './EditTweetModal';

interface TweetCardProps {
  tweet: Tweet;
  onLike: (id: string) => void;
  onRetweet: (id: string) => void;
  onEdit: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}

export function TweetCard({ tweet, onLike, onRetweet, onEdit, onDelete }: TweetCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const isAuthor = tweet.author.handle === 'currentuser';

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors relative"
      >
        <TweetActions
          isAuthor={isAuthor}
          onEdit={() => setIsEditing(true)}
          onDelete={() => onDelete(tweet.id)}
        />
        <div className="flex space-x-3">
          <img
            src={tweet.author.avatar}
            alt={tweet.author.name}
            className="w-12 h-12 rounded-full"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-bold">{tweet.author.name}</span>
              <span className="text-gray-500">@{tweet.author.handle}</span>
              <span className="text-gray-500">·</span>
              <span className="text-gray-500">
                {formatDistanceToNow(tweet.timestamp)}
              </span>
            </div>
            <p className="mt-2 text-gray-900">{tweet.content}</p>
            <div className="flex justify-between mt-4 text-gray-500 max-w-md">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex items-center space-x-2 group"
              >
                <MessageCircle className="w-5 h-5 group-hover:text-blue-500" />
                <span>{tweet.replies}</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`flex items-center space-x-2 group ${
                  tweet.isRetweeted ? 'text-green-500' : ''
                }`}
                onClick={() => onRetweet(tweet.id)}
              >
                <Repeat2 className="w-5 h-5 group-hover:text-green-500" />
                <span>{tweet.retweets}</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`flex items-center space-x-2 group ${
                  tweet.isLiked ? 'text-red-500' : ''
                }`}
                onClick={() => onLike(tweet.id)}
              >
                <Heart
                  className={`w-5 h-5 group-hover:text-red-500 ${
                    tweet.isLiked ? 'fill-current' : ''
                  }`}
                />
                <span>{tweet.likes}</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex items-center space-x-2 group"
              >
                <Share className="w-5 h-5 group-hover:text-blue-500" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
      <EditTweetModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onSave={(content) => onEdit(tweet.id, content)}
        initialContent={tweet.content}
      />
    </>
  );
}