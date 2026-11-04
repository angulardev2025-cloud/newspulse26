import React, { useState, useEffect, useCallback } from 'react';
import { Bookmark, Share2, ExternalLink, Sparkles, ChevronUp, ChevronDown, Check, Clock, Loader2 } from 'lucide-react';
import { dateFormat } from '../utility/dateFormat';
import { WordPressPost } from '@/components/data/newsTypes';

export type { WordPressPost };

interface InshortsFeedProps {
  posts: WordPressPost[];
  savedPosts: WordPressPost[];
  onToggleBookmark: (post: WordPressPost) => void;
  onSelectPost: (post: WordPressPost) => void;
  onLoadMore: () => void;
  hasMore: boolean;
  loadingMore: boolean;
  sourceName?: string;
  language?: 'kn' | 'en';
}

export default function InshortsFeed({
  posts,
  savedPosts,
  onToggleBookmark,
  onSelectPost,
  onLoadMore,
  hasMore,
  loadingMore,
  sourceName = 'NewsPulse Live',
  language = 'kn',
}: InshortsFeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const nextCard = useCallback(() => {
    if (currentIndex < posts.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (hasMore && !loadingMore) {
      onLoadMore();
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, posts.length, hasMore, loadingMore, onLoadMore]);

  const prevCard = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  // Keyboard navigation for Inshorts style up/down
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        nextCard();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        prevCard();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextCard, prevCard]);

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-20 text-stone-500 font-sans">
        {language === 'kn' ? 'ಯಾವುದೇ ಸುದ್ದಿ ಲಭ್ಯವಿಲ್ಲ' : 'No news posts found'}
      </div>
    );
  }

  const currentPost = posts[currentIndex] || posts[0];
  const isSaved = savedPosts.some((s) => s.id === currentPost.id);

  const stripHtml = (html: string) => {
    if (!html) return '';
    return html.replace(/<\/?[^>]+(>|$)/g, '');
  };

  const handleShare = (post: WordPressPost) => {
    navigator.clipboard.writeText(post.link);
    setCopiedId(post.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const imageUrl = '/assets/aistudio/image_a4df1d8f.png';

  return (
    <div className="w-full max-w-xl mx-auto my-4 sm:my-6 flex flex-col items-center px-3 sm:px-0">
      {/* Inshorts Top Status & Progress Bar */}
      <div className="w-full flex items-center justify-between mb-3 text-xs text-stone-500 font-mono px-1">
        <span className="font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">{sourceName}</span>
        <span>Story {currentIndex + 1} of {posts.length}</span>
      </div>

      {/* Inshorts Style Card */}
      <div className="w-full bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200/80 dark:border-stone-800 overflow-hidden flex flex-col transition-all duration-300">
        {/* Media Top Banner */}
        <div className="relative w-full h-72 sm:h-96 bg-stone-100 dark:bg-stone-800 overflow-hidden">
          <img
            src={imageUrl}
            alt={stripHtml(currentPost.title.rendered)}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-lg uppercase tracking-wider shadow">
              Shorts
            </span>
            <span className="px-3 py-1 bg-black/50 backdrop-blur-md text-white text-xs font-medium rounded-lg">
              1 min read
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 text-xs text-stone-300 mb-2">
              <Clock className="w-3.5 h-3.5 text-red-400" />
              <span>{dateFormat(currentPost.date)}</span>
            </div>
            <h2 
              onClick={() => onSelectPost(currentPost)}
              className="text-xl sm:text-2xl font-serif font-bold leading-snug cursor-pointer hover:text-red-300 transition-colors line-clamp-3"
            >
              {stripHtml(currentPost.title.rendered)}
            </h2>
          </div>
        </div>

        {/* Card Body Excerpt */}
        <div className="p-5 sm:p-7 flex flex-col flex-1 justify-between text-left">
          <p className="text-stone-700 dark:text-stone-300 font-sans text-base sm:text-lg leading-relaxed line-clamp-6">
            {stripHtml(currentPost.excerpt.rendered)}
          </p>

          {/* Action Footer inside card */}
          <div className="mt-8 pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => onToggleBookmark(currentPost)}
                className={`p-3 rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
                  isSaved
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
                title={isSaved ? "Saved" : "Save Story"}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={() => handleShare(currentPost)}
                className="p-3 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                title="Share Link"
              >
                {copiedId === currentPost.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => onSelectPost(currentPost)}
                className="flex items-center gap-1.5 px-3.5 py-3 text-xs font-medium bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-xl transition-colors min-h-[44px]"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">AI Insights</span>
              </button>
            </div>

            <a
              href={currentPost.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-3 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors shadow-sm min-h-[44px]"
            >
              <span>{language === 'kn' ? 'ಮೂಲ ಸುದ್ದಿ' : 'Read'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Card Navigation Controls (Up / Down & Infinite Scroll) */}
      <div className="flex flex-col items-center gap-3 mt-6 w-full">
        <div className="flex items-center justify-center gap-4 w-full">
          <button
            onClick={prevCard}
            disabled={currentIndex === 0}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-sm font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors disabled:opacity-40 shadow-sm min-h-[44px]"
          >
            <ChevronUp className="w-4 h-4" />
            <span>{language === 'kn' ? 'ಹಿಂದಿನ' : 'Prev'}</span>
          </button>

          <button
            onClick={nextCard}
            disabled={!hasMore && currentIndex === posts.length - 1}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-40 shadow-md min-h-[44px]"
          >
            {loadingMore ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{language === 'kn' ? 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...' : 'Loading...'}</span>
              </>
            ) : (
              <>
                <span>{language === 'kn' ? 'ಮುಂದಿನ' : 'Next'}</span>
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {hasMore && (
          <button
            onClick={onLoadMore}
            disabled={loadingMore}
            className="text-xs text-red-600 dark:text-red-400 hover:underline transition-colors py-2 font-medium"
          >
            {loadingMore ? 'Loading more stories...' : '↓ Load more stories (Infinite Scroll)'}
          </button>
        )}
      </div>
    </div>
  );
}
