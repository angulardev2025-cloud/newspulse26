import React, { useState } from 'react';
import Link from 'next/link';
import { Newspaper, Bookmark, Sun, Moon, LayoutGrid, LayoutList, Menu, X, Globe, Sparkles } from 'lucide-react';
import { PWAInstallButton } from '../utility/pwaInstall';
import CompactClock from '../utility/clock';
import Breadcrumbs, { BreadcrumbItem } from '../utility/breadcrumbs';
import { newsSources } from '../data/newsSources';
import { useRouter } from 'next/router';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  savedCount: number;
  onOpenSaved: () => void;
  viewMode: 'classic' | 'modern';
  setViewMode: (mode: 'classic' | 'modern') => void;
  breadcrumbs?: BreadcrumbItem[];
}

export default function Header({
  darkMode,
  setDarkMode,
  savedCount,
  onOpenSaved,
  viewMode,
  setViewMode,
  breadcrumbs,
}: HeaderProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="w-full border-b border-stone-200 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md sticky top-0 z-40 transition-colors">
        <div className="flex items-center justify-between gap-3 px-4 sm:px-8 md:px-12 py-3">
          {/* Zone 1: Brand Wordmark, Clock & Desktop Breadcrumbs */}
          <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
            <Link href="/" className="flex items-center gap-2 text-lg sm:text-xl font-serif font-bold tracking-tight text-stone-900 dark:text-stone-100 whitespace-nowrap shrink-0 group">
              <Newspaper className="w-6 h-6 text-red-600 group-hover:rotate-12 transition-transform" />
              <div className="flex items-baseline gap-1">
                <span>NewsPulse</span>
                <span className="text-[10px] font-sans font-black text-red-600 dark:text-red-500 bg-red-50 dark:bg-red-950/30 px-1.5 py-0.5 rounded uppercase tracking-tighter border border-red-100 dark:border-red-900/50">v1</span>
              </div>
            </Link>

            <div className="hidden lg:block shrink-0">
              <CompactClock />
            </div>

            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <div className="hidden md:flex items-center pl-3 border-l border-stone-200 dark:border-stone-800 overflow-hidden">
                <Breadcrumbs items={breadcrumbs} />
              </div>
            )}
          </div>

          {/* Zone 2: Desktop View Switcher */}
          <div className="hidden sm:flex p-1 bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
            <button
              onClick={() => setViewMode('classic')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                viewMode === 'classic' 
                  ? 'bg-white dark:bg-stone-900 text-red-600 shadow-sm' 
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Classic</span>
            </button>
            <button
              onClick={() => setViewMode('modern')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                viewMode === 'modern' 
                  ? 'bg-white dark:bg-stone-900 text-red-600 shadow-sm' 
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>Modern</span>
            </button>
          </div>

          {/* Zone 3: Actions & Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hidden sm:block">
              <PWAInstallButton />
            </div>

            <button
              onClick={onOpenSaved}
              className="relative flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors whitespace-nowrap min-h-[38px]"
              title="Saved Articles"
            >
              <Bookmark className="w-4 h-4" />
              <span className="hidden sm:inline">Saved</span>
              {savedCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 text-[10px] font-bold text-white bg-red-600 rounded-full">
                  {savedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="hidden sm:flex p-2 text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors min-h-[38px] min-w-[38px] items-center justify-center"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-red-600" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Sub-bar for Breadcrumbs on narrow screens if provided */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="md:hidden px-4 py-2 border-t border-stone-100 dark:border-stone-800/60 bg-stone-50/50 dark:bg-stone-950/50 overflow-x-auto whitespace-nowrap">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        )}
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 sm:hidden flex flex-col bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full bg-white dark:bg-stone-950 shadow-2xl border-b border-stone-200 dark:border-stone-800 flex flex-col max-h-[85vh] overflow-y-auto">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-red-600" />
                <span className="font-serif font-bold text-stone-900 dark:text-stone-100">NewsPulse Menu</span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* View Mode Section */}
            <div className="p-4 border-b border-stone-100 dark:border-stone-800">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">Display Layout</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setViewMode('classic'); setMobileMenuOpen(false); }}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    viewMode === 'classic' 
                      ? 'bg-red-600 text-white shadow-md' 
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span>Classic</span>
                </button>
                <button
                  onClick={() => { setViewMode('modern'); setMobileMenuOpen(false); }}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    viewMode === 'modern' 
                      ? 'bg-red-600 text-white shadow-md' 
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <LayoutList className="w-4 h-4" />
                  <span>Modern</span>
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setDarkMode(!darkMode); }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-xl text-xs font-bold"
                >
                  {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
                  <span>{darkMode ? 'Light Theme' : 'Dark Theme'}</span>
                </button>
              </div>

              <PWAInstallButton />
            </div>

            {/* News Sources Quick Nav */}
            <div className="p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">Quick News Feeds</div>
              <div className="grid grid-cols-1 gap-2">
                {newsSources.map((source) => (
                  <button
                    key={source.id}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      router.push(`/reader/${source.id}`);
                    }}
                    className="flex items-center justify-between p-3 rounded-xl bg-stone-50 hover:bg-red-50 dark:bg-stone-900/60 dark:hover:bg-red-950/20 text-left transition-colors border border-stone-200/60 dark:border-stone-800/60"
                  >
                    <div>
                      <div className="text-xs font-bold text-stone-900 dark:text-stone-100">{source.kannadaName}</div>
                      <div className="text-[10px] text-stone-500 font-medium">{source.name}</div>
                    </div>
                    <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                      {source.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
