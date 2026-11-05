'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ReadingProgressBarProps {
  /**
   * Optional explicit progress percentage (0 to 100).
   * If not provided, automatically tracks window scroll position.
   */
  progress?: number;
}

export default function ReadingProgressBar({ progress: customProgress }: ReadingProgressBarProps) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (typeof customProgress === 'number' && !isNaN(customProgress)) {
      setScrollProgress(Math.min(100, Math.max(0, customProgress)));
      return;
    }

    const calculateScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      const totalScrollable = documentHeight - windowHeight;
      if (totalScrollable <= 0) {
        setScrollProgress(100);
        return;
      }

      const percentage = (scrollTop / totalScrollable) * 100;
      setScrollProgress(Math.min(100, Math.max(0, percentage)));
    };

    calculateScroll();
    window.addEventListener('scroll', calculateScroll, { passive: true });
    window.addEventListener('resize', calculateScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', calculateScroll);
      window.removeEventListener('resize', calculateScroll);
    };
  }, [customProgress]);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-[60] bg-stone-200/40 dark:bg-stone-800/40 pointer-events-none">
      <motion.div
        className="h-full bg-gradient-to-r from-red-600 via-red-500 to-amber-500 shadow-[0_0_12px_rgba(220,38,38,0.8)]"
        style={{ width: `${scrollProgress}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${scrollProgress}%` }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
      />
    </div>
  );
}
