import React from 'react';
import { useTweetStore } from '../../stores/tweetStore';
import { TweetCard } from '../tweets/TweetCard';

interface ProfileTweetsProps {
  userId: string;
}

export function ProfileTweets({ userId }: ProfileTweetsProps) {
  const { tweets } = useTweetStore();
  const userTweets = tweets.filter(tweet => tweet.user_id === userId);

  return (
    <div className="divide-y divide-gray-200 dark:divide-twitter-border">
      {userTweets.map((tweet) => (
        <TweetCard key={tweet.id} tweet={tweet} />
      ))}
      {userTweets.length === 0 && (
        <div className="p-4 text-center text-twitter-gray">
          No tweets yet
        </div>
      )}
    </div>
  );
}