import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTweetStore } from '../../stores/tweetStore';
import { TweetCard } from './TweetCard';

export function TweetList() {
  const { tweets, loading, fetchTweets } = useTweetStore();
  const { ref, inView } = useInView();

  useEffect(() => {
    fetchTweets();
  }, [fetchTweets]);

  if (loading && tweets.length === 0) {
    return <div className="p-4 text-center dark:text-white">Loading tweets...</div>;
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-twitter-border">
      <AnimatePresence mode="popLayout">
        {tweets.map((tweet) => (
          <motion.div
            key={tweet.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <TweetCard tweet={tweet} />
          </motion.div>
        ))}
      </AnimatePresence>
      {tweets.length === 0 && (
        <div className="p-4 text-center text-twitter-gray">
          No tweets yet. Be the first to tweet!
        </div>
      )}
      <div ref={ref} className="h-20" />
    </div>
  );
}