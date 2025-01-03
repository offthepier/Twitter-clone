import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
}

async function createProfile(user: User) {
  const { error } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      username: user.email?.split('@')[0] || `user_${Math.random().toString(36).slice(2, 7)}`,
      display_name: user.email?.split('@')[0] || 'New User',
      avatar_url: `https://api.dicebear.com/7.x/avatars/svg?seed=${user.id}`,
    });

  if (error && error.code !== '23505') { // Ignore duplicate key errors
    throw error;
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  signIn: async (email, password) => {
    const { data: { user }, error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });
    if (error) throw error;
    if (user) {
      // Try to create profile in case it doesn't exist
      await createProfile(user);
    }
  },
  signUp: async (email, password) => {
    const { data: { user }, error } = await supabase.auth.signUp({ 
      email, 
      password 
    });
    if (error) throw error;
    if (user) {
      await createProfile(user);
    }
  },
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null });
  },
  setUser: (user) => set({ user, loading: false }),
}));