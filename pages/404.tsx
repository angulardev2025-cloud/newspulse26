import React from 'react';
import Link from 'next/link';
import { Newspaper, Home, AlertCircle } from 'lucide-react';

export default function Custom404() {
  return (
    <div className="min-h-screen w-full bg-stone-50 dark:bg-stone-950 flex flex-col items-center justify-center p-6 text-stone-900 dark:text-stone-100 font-sans">
      <div className="max-w-md w-full bg-white dark:bg-stone-900 rounded-[2.5rem] p-8 border border-stone-200/80 dark:border-stone-800 shadow-2xl flex flex-col items-center text-center gap-6">
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center text-red-600 dark:text-red-400 shadow-inner">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Newspaper className="w-5 h-5 text-red-600" />
            <span className="font-serif font-black text-lg">NewsPulse</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
            Page Not Found
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-2">
            nothing to show to back to home page
          </p>
        </div>

        <Link
          href="/"
          className="px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold text-sm transition-all shadow-lg active:scale-95 flex items-center gap-2.5"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home Page</span>
        </Link>
      </div>
    </div>
  );
}
