import React from 'react';
import { motion } from 'framer-motion';
import { Pencil, Trash2 } from 'lucide-react';

interface TweetActionsProps {
  isAuthor: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export function TweetActions({ isAuthor, onEdit, onDelete }: TweetActionsProps) {
  if (!isAuthor) return null;

  return (
    <div className="flex space-x-2 absolute top-4 right-4">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onEdit}
        className="p-1 hover:bg-blue-50 rounded-full text-gray-500 hover:text-blue-500"
      >
        <Pencil className="w-4 h-4" />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onDelete}
        className="p-1 hover:bg-red-50 rounded-full text-gray-500 hover:text-red-500"
      >
        <Trash2 className="w-4 h-4" />
      </motion.button>
    </div>
  );
}