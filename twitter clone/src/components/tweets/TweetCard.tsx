import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Repeat2, Share, Image, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useImageUpload } from '../../hooks/useImageUpload';
import { useTweetStore } from '../../stores/tweetStore';
import { UserProfile } from '../users/UserProfile';
import type { TweetWithAuthor } from '../../types/tweet';
import { useAuthStore } from '../../stores/authStore';

interface TweetCardProps {
  tweet: TweetWithAuthor;
}

export function TweetCard({ tweet }: TweetCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const { likeTweet, retweet, deleteTweet, updateTweet } = useTweetStore();
  const { uploadImage, uploading } = useImageUpload();
  const [showImageUpload, setShowImageUpload] = useState(false);
  const { user } = useAuthStore();

  const isAuthor = user?.id === tweet.user_id;
  const isLiked = tweet.likes?.some(like => like.user_id === user?.id) ?? false;
  const isRetweeted = tweet.retweets?.some(rt => rt.user_id === user?.id) ?? false;
  const likesCount = tweet.likes?.length ?? 0;
  const retweetsCount = tweet.retweets?.length ?? 0;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const imageUrl = await uploadImage(e.target.files[0]);
    await updateTweet(tweet.id, tweet.content, imageUrl);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="border-b border-gray-200 dark:border-twitter-border p-4 hover:bg-gray-50 dark:hover:bg-twitter-darker transition-colors relative"
    >
      <div className="flex space-x-3">
        <div className="relative">
          <button
            onClick={() => setShowUserProfile(true)}
            className="hover:opacity-80 transition-opacity"
          >
            <img
              src={tweet.profiles.avatar_url || `https://api.dicebear.com/7.x/avatars/svg?seed=${tweet.profiles.id}`}
              alt={tweet.profiles.username}
              className="w-12 h-12 rounded-full"
            />
          </button>
          <AnimatePresence>
            {showUserProfile && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowUserProfile(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="absolute left-0 z-50 mt-2"
                >
                  <UserProfile
                    user={tweet.profiles}
                    onClose={() => setShowUserProfile(false)}
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowUserProfile(true)}
                className="hover:underline"
              >
                <span className="font-bold text-black dark:text-twitter-text">
                  {tweet.profiles.display_name || tweet.profiles.username}
                </span>
                <span className="text-twitter-gray ml-1">@{tweet.profiles.username}</span>
              </button>
              <span className="text-twitter-gray">·</span>
              <span className="text-twitter-gray">
                {formatDistanceToNow(new Date(tweet.created_at))}
              </span>
            </div>
            {isAuthor && (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowActions(!showActions)}
                  className="p-2 rounded-full hover:bg-twitter-blue/10 text-twitter-gray"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </motion.button>
                <AnimatePresence>
                  {showActions && (
                    <>
                      <div 
                        className="fixed inset-0 z-20" 
                        onClick={() => setShowActions(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-twitter-darker rounded-xl shadow-lg border border-gray-200 dark:border-twitter-border z-30"
                      >
                        <button
                          onClick={() => {
                            setIsEditing(true);
                            setShowActions(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-twitter-darkHover text-black dark:text-twitter-text"
                        >
                          Edit Tweet
                        </button>
                        <button
                          onClick={() => {
                            deleteTweet(tweet.id);
                            setShowActions(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                        >
                          Delete Tweet
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
          <p className="mt-2 text-black dark:text-twitter-text">{tweet.content}</p>
          {tweet.image_url && (
            <img
              src={tweet.image_url}
              alt="Tweet attachment"
              className="mt-3 rounded-2xl max-h-96 object-cover"
            />
          )}
          <div className="flex justify-between mt-4 text-twitter-gray max-w-md">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center space-x-2 group"
            >
              <MessageCircle className="w-5 h-5 group-hover:text-twitter-blue" />
              <span>0</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => retweet(tweet.id)}
              className={`flex items-center space-x-2 ${isRetweeted ? 'text-green-500' : ''}`}
            >
              <Repeat2 className="w-5 h-5 group-hover:text-green-500" />
              <span>{retweetsCount}</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => likeTweet(tweet.id)}
              className={`flex items-center space-x-2 ${isLiked ? 'text-pink-600' : ''}`}
            >
              <Heart className={`w-5 h-5 group-hover:text-pink-600 ${isLiked ? 'fill-current' : ''}`} />
              <span>{likesCount}</span>
            </motion.button>
            {isAuthor && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowImageUpload(!showImageUpload)}
                className="flex items-center space-x-2 group"
              >
                <Image className="w-5 h-5 group-hover:text-twitter-blue" />
              </motion.button>
            )}
          </div>
          <AnimatePresence>
            {showImageUpload && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3"
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="w-full"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}