import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMessageStore } from '../../stores/messageStore';
import { toast } from 'react-hot-toast';

interface NewMessageProps {
  recipientId: string;
  onSent?: () => void;
}

export function NewMessage({ recipientId, onSent }: NewMessageProps) {
  const [content, setContent] = useState('');
  const { sendMessage } = useMessageStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await sendMessage(recipientId, content);
      setContent('');
      onSent?.();
      toast.success('Message sent!');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-twitter-border">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start a new message"
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
      </div>
    </form>
  );
}