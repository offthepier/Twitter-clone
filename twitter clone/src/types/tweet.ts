import type { Database } from './supabase';

export type Tweet = Database['public']['Tables']['tweets']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row'];
  likes: { user_id: string }[] | null;
  retweets: { user_id: string }[] | null;
  _count?: {
    likes: number;
    retweets: number;
    replies: number;
  };
};

export type TweetWithAuthor = Tweet & {
  author: {
    id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };
};