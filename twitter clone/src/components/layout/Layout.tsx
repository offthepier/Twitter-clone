import React from 'react';
import { Toaster } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { Sidebar } from '../Sidebar';
import { ThemeToggle } from './ThemeToggle';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Home';
      case '/profile':
        return 'Profile';
      case '/explore':
        return 'Explore';
      case '/notifications':
        return 'Notifications';
      case '/messages':
        return 'Messages';
      case '/bookmarks':
        return 'Bookmarks';
      case '/settings':
        return 'Settings';
      default:
        return 'Twitter';
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-twitter-dark transition-colors">
      <Toaster />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 max-w-2xl border-x border-gray-200 dark:border-twitter-darkBorder">
          <header className="sticky top-0 bg-white/80 dark:bg-twitter-dark/80 backdrop-blur-sm border-b border-gray-200 dark:border-twitter-darkBorder p-4 flex justify-between items-center z-10">
            <h1 className="text-xl font-bold text-black dark:text-twitter-text">{getPageTitle()}</h1>
            <ThemeToggle />
          </header>
          {children}
        </main>
        <div className="hidden lg:block w-80 p-4">
          <div className="sticky top-4">
            <div className="bg-twitter-lightGray dark:bg-twitter-darker rounded-xl p-4">
              <h2 className="text-xl font-bold mb-4 text-black dark:text-twitter-text">What's happening</h2>
              <p className="text-twitter-dimText">Trending topics will appear here...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}