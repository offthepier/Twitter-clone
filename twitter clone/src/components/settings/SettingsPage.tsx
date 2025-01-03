import React from 'react';
import { FollowingList } from './FollowingList';

export function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-twitter-dark">
      <FollowingList />
    </div>
  );
}