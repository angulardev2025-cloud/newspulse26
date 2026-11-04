import React from 'react';
import Link from 'next/link';
import { Newspaper, Bookmark, Sun, Moon } from 'lucide-react';
import { PWAInstallButton } from '../utility/pwaInstall';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  savedCount: number;
  onOpenSaved: () => void;
}

export default function Header({
  darkMode,
  setDarkMode,
  savedCount,
  onOpenSaved,
}: HeaderProps) {
  return (
    <header className="w-full flex items-center justify-between gap-4 px-4 sm:px-8 md:px-12 py-4 border-b border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md sticky top-0 z-40 transition-colors">
      {/* Zone 1: Brand Wordmark */}
      <Link href="/" className="flex items-center gap-2 text-lg sm:text-xl font-serif font-bold tracking-tight text-stone-900 dark:text-stone-100 whitespace-nowrap shrink-0">
        <Newspaper className="w-6 h-6 text-red-600" />
        <span>NewsPulse</span>
      </Link>

      {/* Zone 2: Navigation Links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600 dark:text-stone-300">
        <Link href="/" className="hover:text-stone-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">
          TV9 & Multi-Wire
        </Link>
        <a href="#feed" className="hover:text-stone-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">
          Inshorts Feed
        </a>
        <a href="#about" className="hover:text-stone-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">
          Editorial Standards
        </a>
      </nav>

      {/* Zone 3: Primary Actions (Install, Saved & Theme Toggle) */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <PWAInstallButton />

        <button
          onClick={onOpenSaved}
          className="relative flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors whitespace-nowrap min-h-[38px]"
        >
          <Bookmark className="w-4 h-4" />
          <span className="hidden sm:inline">Reading List</span>
          {savedCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 text-[10px] font-bold text-white bg-red-600 rounded-full">
              {savedCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center"
          title="Toggle Theme"
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}
