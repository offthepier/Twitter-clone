import React from 'react';
import { useSearchStore } from '../../stores/searchStore';
import { TweetCard } from '../tweets/TweetCard';
import { UserCard } from '../users/UserCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';

export function SearchResults() {
  const { searchResults, loading } = useSearchStore();

  if (loading) {
    return <div className="p-4 text-center text-twitter-gray">Searching...</div>;
  }

  return (
    <Tabs defaultValue="tweets" className="w-full">
      <TabsList className="border-b border-gray-200 dark:border-twitter-border">
        <TabsTrigger value="tweets">Tweets</TabsTrigger>
        <TabsTrigger value="people">People</TabsTrigger>
      </TabsList>
      
      <TabsContent value="tweets">
        {searchResults.tweets.map((tweet) => (
          <TweetCard key={tweet.id} tweet={tweet} />
        ))}
        {searchResults.tweets.length === 0 && (
          <div className="p-4 text-center text-twitter-gray">
            No tweets found
          </div>
        )}
      </TabsContent>

      <TabsContent value="people">
        {searchResults.users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
        {searchResults.users.length === 0 && (
          <div className="p-4 text-center text-twitter-gray">
            No users found
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}