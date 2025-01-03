import { create } from 'zustand';
import * as tweetApi from '../api/tweetApi';
import type { Database } from '../types/supabase';

type Tweet = Database['public']['Tables']['tweets']['Row'];

interface TweetState {
  tweets: Tweet[];
  loading: boolean;
  createTweet: (content: string, imageUrl?: string) => Promise<void>;
  updateTweet: (id: string, content: string, imageUrl?: string) => Promise<void>;
  deleteTweet: (id: string) => Promise<void>;
  fetchTweets: () => Promise<void>;
  likeTweet: (tweetId: string) => Promise<void>;
  retweet: (tweetId: string) => Promise<void>;
  addTweet: (tweet: Tweet) => void;
  updateTweetInStore: (tweet: Tweet) => void;
  deleteTweetFromStore: (id: string) => void;
}

export const useTweetStore = create<TweetState>((set, get) => ({
  tweets: [],
  loading: false,

  createTweet: async (content, imageUrl) => {
    const tweet = await tweetApi.createTweet(content, imageUrl);
    set({ tweets: [tweet, ...get().tweets] });
  },

  updateTweet: async (id, content, imageUrl) => {
    const tweet = await tweetApi.updateTweet(id, content, imageUrl);
    set({
      tweets: get().tweets.map((t) => (t.id === id ? tweet : t)),
    });
  },

  deleteTweet: async (id) => {
    await tweetApi.deleteTweet(id);
    set({ tweets: get().tweets.filter((t) => t.id !== id) });
  },

  fetchTweets: async () => {
    set({ loading: true });
    try {
      const tweets = await tweetApi.fetchTweets();
      set({ tweets: tweets || [] });
    } finally {
      set({ loading: false });
    }
  },

  likeTweet: async (tweetId) => {
    await tweetApi.toggleLike(tweetId);
    await get().fetchTweets();
  },

  retweet: async (tweetId) => {
    await tweetApi.toggleRetweet(tweetId);
    await get().fetchTweets();
  },

  addTweet: (tweet) => {
    set({ tweets: [tweet, ...get().tweets] });
  },

  updateTweetInStore: (tweet) => {
    set({
      tweets: get().tweets.map((t) => (t.id === tweet.id ? tweet : t)),
    });
  },

  deleteTweetFromStore: (id) => {
    set({ tweets: get().tweets.filter((t) => t.id !== id) });
  },
}));