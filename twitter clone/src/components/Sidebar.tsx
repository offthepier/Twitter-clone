import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  Search,
  Bell,
  Mail,
  Bookmark,
  User,
  Settings,
  Twitter,
} from 'lucide-react';

const menuItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Search, label: 'Explore', path: '/explore' },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
  { icon: Mail, label: 'Messages', path: '/messages' },
  { icon: Bookmark, label: 'Bookmarks', path: '/bookmarks' },
  { icon: User, label: 'Profile', path: '/profile' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className="fixed h-screen w-64 border-r border-gray-200 dark:border-twitter-border px-4">
      <div className="flex flex-col h-full py-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-4"
          onClick={() => navigate('/')}
        >
          <Twitter className="w-8 h-8 text-twitter-blue" />
        </motion.button>
        <nav className="flex-1">
          {menuItems.map((item) => (
            <motion.button
              key={item.label}
              whileHover={{ x: 5 }}
              onClick={() => navigate(item.path)}
              className="flex items-center space-x-4 p-4 w-full rounded-full hover:bg-gray-100 dark:hover:bg-twitter-darkHover transition-colors text-black dark:text-twitter-text"
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xl">{item.label}</span>
            </motion.button>
          ))}
        </nav>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-twitter-blue text-white w-full py-3 rounded-full font-bold hover:bg-twitter-hover transition-colors"
        >
          Tweet
        </motion.button>
      </div>
    </div>
  );
}