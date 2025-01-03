import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMessageStore } from '../../stores/messageStore';

interface MessageComposerProps {
  recipientId: string;
  onSent?: () => void;
}

export function MessageComposer({ recipientId, onSent }: MessageComposerProps) {
  const [content, setContent] = useState('');
  const { sendMessage } = useMessageStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await sendMessage(recipientId, content);
      setContent('');
      onSent?.();
    } catch (error) {
      // Error toast is handled in the store
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="sticky bottom-0 bg-white dark:bg-twitter-dark border-t border-gray-200 dark:border-twitter-border p-4">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-twitter-lightGray dark:bg-twitter-darker rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-twitter-blue dark:text-white"
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          type="submit"
          disabled={!content.trim()}
          className="p-2 rounded-full bg-twitter-blue text-white disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </motion.button>
      </form>
    </div>
  );
}