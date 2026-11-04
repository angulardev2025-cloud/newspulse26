import React, { useEffect, useState } from 'react';
import GoogleLoader from './loader';
import { Newspaper, Sparkles, Zap, ShieldCheck } from 'lucide-react';

interface DailyRitualLoaderProps {
  sourceName?: string;
  targetCount?: number;
}

export default function DailyRitualLoader({
  sourceName = 'All Feeds',
  targetCount = 200,
}: DailyRitualLoaderProps) {
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    // Smoothly animate progress counter from 1 to targetCount (or 195) before API finishes
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= targetCount - 5) return prev;
        const bump = Math.floor(Math.random() * 15) + 5;
        return Math.min(targetCount, prev + bump);
      });
    }, 150);

    return () => clearInterval(interval);
  }, [targetCount]);

  const percentage = Math.min(100, Math.round((progress / targetCount) * 100));

  return (
    <div className="h-screen h-[100dvh] w-full flex flex-col items-center justify-center bg-stone-50 dark:bg-stone-950 px-6 select-none">
      <div className="max-w-md w-full bg-white dark:bg-stone-900 rounded-[2.5rem] p-8 border border-stone-200/80 dark:border-stone-800 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-600/10 blur-[50px] rounded-full pointer-events-none" />

        {/* Top Badge */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-100 dark:border-red-900/50 mb-6">
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>Daily Ritual Live Wire</span>
        </div>

        {/* Loader Ring */}
        <div className="my-4 relative">
          <GoogleLoader size="lg" />
          <div className="absolute inset-0 flex items-center justify-center text-red-600 dark:text-red-400">
            <Newspaper className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        {/* Counter Display: e.g. 145/200 */}
        <div className="mt-4 mb-2">
          <span className="text-4xl font-mono font-black text-stone-900 dark:text-stone-100 tracking-tight">
            {progress}
          </span>
          <span className="text-xl font-mono font-bold text-stone-400 dark:text-stone-500">
            /{targetCount}
          </span>
          <span className="ml-2 text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
            Loaded
          </span>
        </div>

        <p className="text-sm font-serif font-bold text-stone-800 dark:text-stone-200 mb-6">
          Remixing & sorting live news from all Coastal & Kannada APIs...
        </p>

        {/* Progress Bar Container */}
        <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-3.5 overflow-hidden p-0.5 border border-stone-200 dark:border-stone-700/80 mb-6">
          <div 
            className="bg-gradient-to-r from-red-600 via-orange-500 to-red-500 h-full rounded-full transition-all duration-200 ease-out shadow-sm"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Safety Note */}
        <div className="flex items-center justify-center gap-2 text-[11px] font-medium text-stone-500 dark:text-stone-400 bg-stone-50 dark:bg-stone-950/60 px-4 py-2 rounded-2xl w-full border border-stone-100 dark:border-stone-800">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Skipping offline sources & sorting by published time</span>
        </div>
      </div>
    </div>
  );
}
