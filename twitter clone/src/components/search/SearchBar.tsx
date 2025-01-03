import React, { useState, useEffect } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { useSearchStore } from '../../stores/searchStore';
import { motion } from 'framer-motion';
import { useDebounce } from '../../hooks/useDebounce';

export function SearchBar() {
  const { searchQuery, setSearchQuery, search } = useSearchStore();
  const [isFocused, setIsFocused] = useState(false);
  const debouncedQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    if (debouncedQuery) {
      search();
    }
  }, [debouncedQuery, search]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    search();
  };

  return (
    <form onSubmit={handleSubmit} className="sticky top-0 p-4 bg-white dark:bg-twitter-dark border-b border-gray-200 dark:border-twitter-border">
      <div className={`relative rounded-full bg-twitter-lightGray dark:bg-twitter-darker ${
        isFocused ? 'ring-2 ring-twitter-blue' : ''
      }`}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
          <SearchIcon className="h-5 w-5 text-twitter-gray" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search Twitter"
          className="w-full bg-transparent py-3 pl-10 pr-4 text-black dark:text-white focus:outline-none"
        />
      </div>
    </form>
  );
}