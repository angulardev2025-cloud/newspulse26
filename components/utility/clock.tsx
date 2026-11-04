'use client';

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function CompactClock() {
  const [timeStr, setTimeStr] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
      setDateStr(
        now.toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
        }).toUpperCase()
      );
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!timeStr) return null;

  return (
    <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-white/80 dark:bg-stone-900/90 border border-stone-200/80 dark:border-stone-800 shadow-sm backdrop-blur-md">
      <div className="relative flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-red-600 animate-ping absolute opacity-75" />
        <div className="w-2 h-2 rounded-full bg-red-600 relative" />
      </div>

      <div className="flex items-center gap-1.5 font-mono text-xs font-black tracking-wider">
        <span className="text-[10px] font-sans font-bold text-stone-400 dark:text-stone-500 hidden xl:inline">
          {dateStr}
        </span>
        <span className="text-stone-300 dark:text-stone-700 hidden xl:inline">•</span>
        {/* Digital Linear Gradient Text */}
        <span className="bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 bg-clip-text text-transparent drop-shadow-sm font-extrabold">
          {timeStr}
        </span>
      </div>
    </div>
  );
}
