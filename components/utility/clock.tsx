'use client';

import React, { useState, useEffect } from 'react';

export default function CompactClock() {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return null;

  return (
    <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-stone-100 dark:bg-stone-800 rounded-lg text-[10px] font-mono font-bold text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-stone-700">
      <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
      <span>LIVE</span>
      <span className="text-stone-300 dark:text-stone-600">|</span>
      <span>{time}</span>
    </div>
  );
}
