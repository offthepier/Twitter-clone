import { create } from 'zustand';
import * as profileApi from '../api/profileApi';
import type { Database } from '../types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface ProfileState {
  profile: Profile | null;
  loading: boolean;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  fetchProfile: (userId: string) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  loading: false,
  updateProfile: async (updates) => {
    const profile = await profileApi.updateProfile(updates);
    set({ profile });
  },
  fetchProfile: async (userId) => {
    set({ loading: true });
    try {
      const profile = await profileApi.getProfile(userId);
      set({ profile });
    } finally {
      set({ loading: false });
    }
  },
}));