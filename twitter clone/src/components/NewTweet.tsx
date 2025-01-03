import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Smile, MapPin } from 'lucide-react';
import { useTweetStore } from '../stores/tweetStore';
import { useImageUpload } from '../hooks/useImageUpload';
import { toast } from 'react-hot-toast';

export function NewTweet() {
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const { createTweet } = useTweetStore();
  const { uploadImage, uploading } = useImageUpload();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    try {
      let imageUrl;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
      await createTweet(content, imageUrl);
      setContent('');
      setImageFile(null);
      setPreviewUrl(null);
      toast.success('Tweet posted!');
    } catch (error) {
      toast.error('Failed to post tweet');
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setImageFile(null);
    setPreviewUrl(null);
  };

  return (
    <div className="border-b border-gray-200 dark:border-twitter-border p-4">
      <div className="flex-1">
        <motion.div 
          animate={{ 
            y: isFocused ? -5 : 0,
            scale: isFocused ? 1.01 : 1
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25
          }}
          className="relative"
        >
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="What's happening?"
            className="w-full resize-none border-none focus:ring-0 focus:outline-none text-xl placeholder-twitter-gray bg-transparent dark:text-twitter-text min-h-[80px]"
          />
          <motion.div 
            className="absolute bottom-0 left-0 right-0 h-[2px] bg-twitter-blue origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isFocused ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          />
        </motion.div>
        <AnimatePresence>
          {previewUrl && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 relative"
            >
              <img
                src={previewUrl}
                alt="Preview"
                className="rounded-2xl max-h-48 object-cover"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={removeImage}
                className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
                aria-label="Remove image"
              >
                ×
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex items-center justify-between pt-4">
          <div className="flex space-x-2 text-twitter-blue">
            <motion.label
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="cursor-pointer p-2 rounded-full hover:bg-twitter-blue/10 transition-colors"
            >
              <Image className="w-5 h-5" />
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleImageSelect}
                className="hidden"
              />
            </motion.label>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full hover:bg-twitter-blue/10 transition-colors"
            >
              <Smile className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full hover:bg-twitter-blue/10 transition-colors"
            >
              <MapPin className="w-5 h-5" />
            </motion.button>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-twitter-blue text-white px-6 py-2 rounded-full font-bold hover:bg-twitter-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!content.trim() || uploading}
            onClick={handleSubmit}
          >
            {uploading ? 'Uploading...' : 'Tweet'}
          </motion.button>
        </div>
      </div>
    </div>
  );
}