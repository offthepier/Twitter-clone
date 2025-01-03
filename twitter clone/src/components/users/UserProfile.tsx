import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useFollowStore } from '../../stores/followStore';
import type { Database } from '../../types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface UserProfileProps {
  user: Profile;
  onClose?: () => void;
}

export function UserProfile({ user, onClose }: UserProfileProps) {
  const { user: currentUser } = useAuthStore();
  const { followingMap, followUser, unfollowUser, checkFollowStatus } = useFollowStore();
  const isFollowing = followingMap[user.id] || false;
  const isCurrentUser = currentUser?.id === user.id;

  useEffect(() => {
    if (user.id && !isCurrentUser) {
      checkFollowStatus(user.id);
    }
  }, [user.id, isCurrentUser, checkFollowStatus]);

  const handleFollowClick = async () => {
    if (isFollowing) {
      await unfollowUser(user.id);
    } else {
      await followUser(user.id);
    }
  };

  return (
    <motion.div 
      className="bg-white dark:bg-twitter-dark rounded-xl shadow-lg overflow-hidden w-64"
      initial={{ opacity: 0, scale: 0.9, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {/* Header with background */}
      <motion.div 
        className="h-16 bg-twitter-lightGray dark:bg-twitter-darker"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      />
      
      {/* Profile content */}
      <div className="px-3 pb-3">
        {/* Avatar */}
        <motion.div 
          className="relative -mt-8 mb-2"
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.2 }}
        >
          <img
            src={user.avatar_url || `https://api.dicebear.com/7.x/avatars/svg?seed=${user.id}`}
            alt={user.username}
            className="w-16 h-16 rounded-full border-4 border-white dark:border-twitter-dark"
          />
        </motion.div>

        {/* User info */}
        <motion.div 
          className="space-y-0.5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="font-bold text-base text-black dark:text-white truncate">
            {user.display_name || user.username}
          </h3>
          <p className="text-twitter-gray text-sm truncate">@{user.username}</p>
        </motion.div>

        {/* Bio */}
        {user.bio && (
          <motion.p 
            className="mt-2 text-black dark:text-white text-sm line-clamp-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {user.bio}
          </motion.p>
        )}

        {/* Action buttons */}
        {!isCurrentUser && (
          <motion.div 
            className="flex items-center space-x-2 mt-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleFollowClick}
              className={`flex-1 py-1.5 px-3 rounded-full text-sm font-bold transition-colors ${
                isFollowing
                  ? 'bg-transparent border border-twitter-gray text-black dark:text-white hover:border-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10'
                  : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100'
              }`}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </motion.button>
            <Link to={`/messages/${user.id}`}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-twitter-blue/10 text-twitter-blue"
              >
                <MessageCircle className="w-4 h-4" />
              </motion.button>
            </Link>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}