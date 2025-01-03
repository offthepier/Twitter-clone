import { create } from 'zustand';
import * as searchService from '../services/searchService';
import type { Database } from '../types/supabase';
import { toast } from 'react-hot-toast';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Tweet = Database['public']['Tables']['tweets']['Row'];

interface SearchState {
  searchQuery: string;
  searchResults: {
    tweets: Tweet[];
    users: Profile[];
  };
  loading: boolean;
  setSearchQuery: (query: string) => void;
  search: () => Promise<void>;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  searchQuery: '',
  searchResults: {
    tweets: [],
    users: []
  },
  loading: false,

  setSearchQuery: (query) => set({ searchQuery: query }),

  search: async () => {
    const { searchQuery } = get();
    if (!searchQuery.trim()) {
      set({ searchResults: { tweets: [], users: [] } });
      return;
    }

    set({ loading: true });
    try {
      const [tweets, users] = await Promise.all([
        searchService.searchTweets(searchQuery),
        searchService.searchUsers(searchQuery)
      ]);
      set({ searchResults: { tweets, users } });
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to perform search');
    } finally {
      set({ loading: false });
    }
  }
}));