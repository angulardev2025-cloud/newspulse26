'use client';

import React from 'react';
import { useBookmarks } from '@/lib/context/BookmarkContext';
import { Bookmark, Check, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BookmarkToast() {
  const { toast } = useBookmarks();

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-stone-900/95 dark:bg-stone-100/95 text-white dark:text-stone-900 shadow-2xl backdrop-blur-md border border-stone-800 dark:border-stone-200 pointer-events-none"
        >
          <div className={`p-1.5 rounded-xl ${toast.type === 'add' ? 'bg-red-600 text-white' : 'bg-stone-700 dark:bg-stone-300 text-stone-200 dark:text-stone-800'}`}>
            {toast.type === 'add' ? <Bookmark className="w-4 h-4 fill-current" /> : <Trash2 className="w-4 h-4" />}
          </div>
          <span className="text-xs font-bold tracking-wide">
            {toast.message}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
