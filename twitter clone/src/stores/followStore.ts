import { create } from 'zustand';
import * as followService from '../services/followService';
import { toast } from 'react-hot-toast';

interface FollowState {
  followingMap: Record<string, boolean>;
  followUser: (userId: string) => Promise<void>;
  unfollowUser: (userId: string) => Promise<void>;
  checkFollowStatus: (userId: string) => Promise<void>;
}

export const useFollowStore = create<FollowState>((set, get) => ({
  followingMap: {},

  followUser: async (userId) => {
    try {
      await followService.followUser(userId);
      set((state) => ({
        followingMap: { ...state.followingMap, [userId]: true }
      }));
      toast.success('Successfully followed user');
    } catch (error) {
      console.error('Follow error:', error);
      toast.error('Failed to follow user');
    }
  },

  unfollowUser: async (userId) => {
    try {
      await followService.unfollowUser(userId);
      set((state) => ({
        followingMap: { ...state.followingMap, [userId]: false }
      }));
      toast.success('Successfully unfollowed user');
    } catch (error) {
      console.error('Unfollow error:', error);
      toast.error('Failed to unfollow user');
    }
  },

  checkFollowStatus: async (userId) => {
    try {
      const isFollowing = await followService.isFollowing(userId);
      set((state) => ({
        followingMap: { ...state.followingMap, [userId]: isFollowing }
      }));
    } catch (error) {
      console.error('Follow status check error:', error);
    }
  }
}));