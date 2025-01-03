import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useProfileStore } from '../../stores/profileStore';
import { toast } from 'react-hot-toast';
import type { Database } from '../../types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
}

export function EditProfileModal({ isOpen, onClose, profile }: EditProfileModalProps) {
  const [displayName, setDisplayName] = useState(profile.display_name || '');
  const [bio, setBio] = useState(profile.bio || '');
  const { updateProfile } = useProfileStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        id: profile.id,
        display_name: displayName,
        bio
      });
      toast.success('Profile updated successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-twitter-dark rounded-2xl p-4 w-full max-w-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold dark:text-twitter-text">Edit profile</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-twitter-darker"
              >
                <X className="w-5 h-5 dark:text-twitter-text" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-twitter-gray mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-twitter-border rounded-md dark:bg-twitter-dark dark:text-twitter-text"
                  maxLength={50}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-twitter-gray mb-1">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-twitter-border rounded-md dark:bg-twitter-dark dark:text-twitter-text"
                  rows={3}
                  maxLength={160}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-twitter-blue hover:bg-twitter-blue/10 rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-twitter-blue text-white rounded-full hover:bg-twitter-hover"
                >
                  Save
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}