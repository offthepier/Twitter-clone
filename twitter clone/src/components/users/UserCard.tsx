import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useFollowStore } from '../../stores/followStore';
import type { Database } from '../../types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface UserCardProps {
  user: Profile;
  showUnfollowButton?: boolean;
}

export function UserCard({ user, showUnfollowButton = false }: UserCardProps) {
  const { user: currentUser } = useAuthStore();
  const { followingMap, followUser, unfollowUser, checkFollowStatus } = useFollowStore();
  const isFollowing = followingMap[user.id] || false;
  const showMessageButton = currentUser?.id !== user.id;

  React.useEffect(() => {
    if (user.id && currentUser?.id !== user.id) {
      checkFollowStatus(user.id);
    }
  }, [user.id, currentUser?.id, checkFollowStatus]);

  const handleFollowAction = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isFollowing) {
      await unfollowUser(user.id);
    } else {
      await followUser(user.id);
    }
  };

  if (currentUser?.id === user.id) return null;

  return (
    <div className="p-4 border-b border-gray-200 dark:border-twitter-border hover:bg-gray-50 dark:hover:bg-twitter-darker">
      <div className="flex items-start space-x-3">
        <img
          src={user.avatar_url || `https://api.dicebear.com/7.x/avatars/svg?seed=${user.id}`}
          alt={user.username}
          className="w-12 h-12 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-bold text-black dark:text-white">
                {user.display_name || user.username}
              </div>
              <div className="text-twitter-gray">@{user.username}</div>
            </div>
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFollowAction}
                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${
                  isFollowing
                    ? 'border border-twitter-gray text-black dark:text-white hover:border-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10'
                    : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100'
                }`}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </motion.button>
              {showMessageButton && (
                <Link to={`/messages/${user.id}`}>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full hover:bg-twitter-blue/10 text-twitter-blue"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </motion.button>
                </Link>
              )}
            </div>
          </div>
          {user.bio && (
            <p className="mt-2 text-black dark:text-white">{user.bio}</p>
          )}
        </div>
      </div>
    </div>
  );
}