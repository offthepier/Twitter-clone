import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';
import { useImageUpload } from '../../hooks/useImageUpload';
import { useProfileStore } from '../../stores/profileStore';
import { EditProfileModal } from './EditProfileModal';
import type { Database } from '../../types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface ProfileHeaderProps {
  profile: Profile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { uploadImage } = useImageUpload();
  const { updateProfile } = useProfileStore();

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await uploadImage(file);
      await updateProfile({
        id: profile.id,
        avatar_url: imageUrl
      });
    } catch (error) {
      console.error('Failed to update avatar:', error);
    }
  };

  return (
    <div className="border-b border-gray-200 dark:border-twitter-border">
      <div className="h-48 bg-twitter-lightGray dark:bg-twitter-darker"></div>
      <div className="px-4 pb-4">
        <div className="relative -mt-16 mb-4">
          <div className="relative inline-block">
            <img
              src={profile.avatar_url || `https://api.dicebear.com/7.x/avatars/svg?seed=${profile.id}`}
              alt={profile.username}
              className="w-32 h-32 rounded-full border-4 border-white dark:border-twitter-dark"
            />
            <label className="absolute bottom-0 right-0 p-2 bg-black/50 rounded-full cursor-pointer hover:bg-black/70 transition-colors">
              <Camera className="w-5 h-5 text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>
        </div>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold dark:text-twitter-text">
              {profile.display_name || profile.username}
            </h1>
            <p className="text-twitter-gray">@{profile.username}</p>
            {profile.bio && (
              <p className="mt-2 text-black dark:text-twitter-text">{profile.bio}</p>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 rounded-full border border-twitter-border dark:border-twitter-border text-black dark:text-twitter-text hover:bg-gray-50 dark:hover:bg-twitter-darker"
          >
            Edit profile
          </motion.button>
        </div>
      </div>
      <EditProfileModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        profile={profile}
      />
    </div>
  );
}