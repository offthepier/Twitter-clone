import { Tweet } from '../types/tweet';

export const createTweet = (content: string): Tweet => ({
  id: crypto.randomUUID(),
  content,
  author: {
    name: 'Current User',
    handle: 'currentuser',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  likes: 0,
  retweets: 0,
  replies: 0,
  timestamp: new Date(),
  isLiked: false,
  isRetweeted: false
});