import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { AuthModal } from './components/auth/AuthModal';
import { TweetList } from './components/tweets/TweetList';
import { NewTweet } from './components/NewTweet';
import { Layout } from './components/layout/Layout';
import { ProfilePage } from './components/profile/ProfilePage';
import { SettingsPage } from './components/settings/SettingsPage';
import { SearchBar } from './components/search/SearchBar';
import { SearchResults } from './components/search/SearchResults';
import { MessageList } from './components/messages/MessageList';
import { MessageThread } from './components/messages/MessageThread';
import { NotificationCard } from './components/notifications/NotificationCard';
import { useAuthSession } from './hooks/useAuthSession';
import { useRealtimeTweets } from './hooks/useRealtime';
import { useNotificationStore } from './stores/notificationStore';

export function App() {
  const { user } = useAuthStore();
  const { notifications, markAsRead } = useNotificationStore();
  useAuthSession();
  useRealtimeTweets();

  return (
    <Router>
      <Layout>
        {user ? (
          <Routes>
            <Route path="/explore" element={
              <>
                <SearchBar />
                <SearchResults />
              </>
            } />
            <Route path="/notifications" element={
              <div className="divide-y divide-gray-200 dark:divide-twitter-border">
                {notifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onRead={() => markAsRead(notification.id)}
                  />
                ))}
              </div>
            } />
            <Route path="/messages" element={<MessageList />} />
            <Route path="/messages/:recipientId" element={<MessageThread />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/" element={
              <>
                <NewTweet />
                <TweetList />
              </>
            } />
          </Routes>
        ) : (
          <div className="p-4 text-center">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Welcome to Twitter Clone</h2>
            <AuthModal />
          </div>
        )}
      </Layout>
    </Router>
  );
}