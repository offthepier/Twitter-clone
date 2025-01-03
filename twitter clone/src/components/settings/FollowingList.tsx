import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import { UserCard } from '../users/UserCard';
import type { Database } from '../../types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

export function FollowingList() {
  const [following, setFollowing] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    async function fetchFollowing() {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('follows')
          .select(`
            following:following_id(
              id,
              username,
              display_name,
              avatar_url,
              bio
            )
          `)
          .eq('follower_id', user.id);

        if (error) throw error;

        const profiles = data.map(item => item.following) as Profile[];
        setFollowing(profiles);
      } catch (error) {
        console.error('Error fetching following:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFollowing();
  }, [user]);

  if (loading) {
    return (
      <div className="p-4 text-center text-twitter-gray">
        Loading following list...
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-twitter-border">
      <div className="p-4 bg-white dark:bg-twitter-dark border-b border-gray-200 dark:border-twitter-border">
        <h2 className="text-xl font-bold text-black dark:text-white">Following</h2>
        <p className="text-twitter-gray">People you follow</p>
      </div>
      <AnimatePresence mode="popLayout">
        {following.map((profile) => (
          <motion.div
            key={profile.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            layout
          >
            <UserCard user={profile} showUnfollowButton={true} />
          </motion.div>
        ))}
      </AnimatePresence>
      {following.length === 0 && (
        <div className="p-8 text-center text-twitter-gray">
          <p className="text-xl mb-2">You're not following anyone yet</p>
          <p>When you do, they'll be listed here.</p>
        </div>
      )}
    </div>
  );
}