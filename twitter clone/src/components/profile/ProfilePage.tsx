import React, { useEffect } from 'react';
import { ProfileHeader } from './ProfileHeader';
import { ProfileTweets } from './ProfileTweets';
import { useAuthStore } from '../../stores/authStore';
import { useProfileStore } from '../../stores/profileStore';

export function ProfilePage() {
  const { user } = useAuthStore();
  const { profile, fetchProfile } = useProfileStore();

  useEffect(() => {
    if (user) {
      fetchProfile(user.id);
    }
  }, [user, fetchProfile]);

  if (!user) {
    return <div className="p-4 text-center dark:text-twitter-text">Please sign in to view your profile</div>;
  }

  if (!profile) {
    return <div className="p-4 text-center dark:text-twitter-text">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen">
      <ProfileHeader profile={profile} />
      <ProfileTweets userId={user.id} />
    </div>
  );
}