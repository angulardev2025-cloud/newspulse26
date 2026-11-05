import React from 'react';
import { NextPageContext } from 'next';
import Link from 'next/link';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';

interface ErrorProps {
  statusCode?: number;
  message?: string;
}

function Error({ statusCode, message }: ErrorProps) {
  return (
    <div className="min-h-screen w-full bg-stone-50 dark:bg-stone-950 flex flex-col items-center justify-center p-6 text-stone-900 dark:text-stone-100 font-sans">
      <div className="max-w-md w-full bg-white dark:bg-stone-900 rounded-[2.5rem] p-8 border border-stone-200/80 dark:border-stone-800 shadow-2xl flex flex-col items-center text-center gap-6">
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center text-red-600 dark:text-red-400 shadow-inner">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-600 bg-red-50 dark:bg-red-950/40 px-3 py-1 rounded-full border border-red-100 dark:border-red-900/40">
            {statusCode ? `Error ${statusCode}` : 'Application Notice'}
          </span>
          <h1 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100 mt-4">
            {statusCode === 404 ? 'Page Not Found' : 'Something went wrong'}
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-2">
            {message || (statusCode === 404 ? 'The requested news feed or page does not exist.' : 'An unexpected error occurred while loading this page.')}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full">
          <button
            onClick={() => { if (typeof window !== 'undefined') window.location.reload(); }}
            className="flex-1 py-3 px-4 rounded-full border border-stone-200 dark:border-stone-700 font-bold text-xs uppercase tracking-wider hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
          <Link
            href="/"
            className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext): ErrorProps => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
