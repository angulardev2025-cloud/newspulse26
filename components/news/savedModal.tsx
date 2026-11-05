'use client';

import React, { useState, useMemo } from 'react';
import { useBookmarks } from '@/lib/context/BookmarkContext';
import { WordPressPost } from '@/components/data/newsTypes';
import { dateFormat } from '@/components/utility/dateFormat';
import { calculateReadingTime } from '@/lib/utility/readingTime';
import { 
  X, 
  Bookmark, 
  Trash2, 
  Search, 
  ExternalLink, 
  BookOpen, 
  ArrowLeft, 
  WifiOff, 
  Clock, 
  Sparkles,
  Share2,
  Check
} from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const stripHtml = (html: any) => {
  if (!html || typeof html !== 'string') return '';
  let text = html.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '');
  text = text.replace(/<\/?[^>]+(>|$)/g, '');
  text = text.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  return text.trim();
};

export default function SavedArticlesModal() {
  const { savedPosts, savedModalOpen, setSavedModalOpen, removeBookmark, clearAllBookmarks } = useBookmarks();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState<WordPressPost | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return savedPosts;
    const query = searchQuery.toLowerCase().trim();
    return savedPosts.filter((post) => {
      const title = stripHtml(post.title?.rendered || '').toLowerCase();
      const excerpt = stripHtml(post.excerpt?.rendered || '').toLowerCase();
      const source = (post.customSourceName || '').toLowerCase();
      return title.includes(query) || excerpt.includes(query) || source.includes(query);
    });
  }, [savedPosts, searchQuery]);

  if (!savedModalOpen) return null;

  const handleShare = (link: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link);
      setCopiedLink(link);
      setTimeout(() => setCopiedLink(null), 2000);
    }
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md"
        onClick={() => {
          setSavedModalOpen(false);
          setActiveArticle(null);
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
          className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white dark:bg-stone-900 rounded-[2rem] border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 sm:p-6 border-b border-stone-100 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-3">
              {activeArticle ? (
                <button
                  onClick={() => setActiveArticle(null)}
                  className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                  aria-label="Back to saved list"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              ) : (
                <div className="p-2.5 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/40">
                  <Bookmark className="w-5 h-5 fill-current" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-serif font-black text-stone-900 dark:text-stone-100">
                    {activeArticle ? 'Offline Story Reader' : 'Saved Collection'}
                  </h2>
                  {!activeArticle && (
                    <span className="px-2.5 py-0.5 text-xs font-bold font-mono rounded-full bg-red-600 text-white">
                      {savedPosts.length}
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                  {activeArticle
                    ? 'Saved to browser cache — available offline anytime'
                    : 'Persisted in localStorage for offline reading'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!activeArticle && savedPosts.length > 0 && (
                confirmClear ? (
                  <div className="flex items-center gap-1.5 animate-in fade-in">
                    <button
                      onClick={() => {
                        clearAllBookmarks();
                        setConfirmClear(false);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors shadow-sm"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setConfirmClear(false)}
                      className="px-2 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 text-xs font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmClear(true)}
                    className="p-2 text-stone-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30"
                    title="Clear all saved articles"
                    aria-label="Clear all saved articles"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )
              )}
              <button
                onClick={() => {
                  setSavedModalOpen(false);
                  setActiveArticle(null);
                }}
                className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Offline Banner Indicator */}
          <div className="px-5 py-2.5 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-100 dark:border-amber-900/30 flex items-center justify-between text-[11px] text-amber-800 dark:text-amber-300 font-medium">
            <div className="flex items-center gap-1.5">
              <WifiOff className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Offline Ready — Saved articles remain accessible even without an active internet connection.</span>
            </div>
            <span className="hidden sm:inline font-mono font-bold text-[10px] uppercase bg-amber-100 dark:bg-amber-900/50 px-2 py-0.5 rounded">
              Local Cache
            </span>
          </div>

          {/* Active Article Full View */}
          {activeArticle ? (
            <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
              {activeArticle._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
                <div className="relative w-full h-64 sm:h-96 rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 shadow-md">
                  <Image
                    src={activeArticle._embedded['wp:featuredmedia'][0].source_url}
                    alt={stripHtml(activeArticle.title?.rendered)}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-stone-500 dark:text-stone-400 flex-wrap">
                  <span className="font-bold text-red-600 dark:text-red-400">
                    {activeArticle.customSourceName || 'Coastal Wire'}
                  </span>
                  <span>·</span>
                  <span>{dateFormat(activeArticle.date)}</span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded text-[10px] font-semibold">
                    <BookOpen className="w-3 h-3 text-amber-500" />
                    {calculateReadingTime(activeArticle.content?.rendered, activeArticle.excerpt?.rendered, activeArticle.title?.rendered).text}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-serif font-black text-stone-900 dark:text-stone-100 leading-snug">
                  {stripHtml(activeArticle.title?.rendered)}
                </h1>
              </div>

              <div className="text-stone-700 dark:text-stone-300 font-sans leading-relaxed text-base sm:text-lg space-y-4 pt-4 border-t border-stone-100 dark:border-stone-800">
                <p className="font-medium text-stone-900 dark:text-stone-100 text-lg">
                  {stripHtml(activeArticle.excerpt?.rendered)}
                </p>
                {activeArticle.content?.rendered && stripHtml(activeArticle.content.rendered) !== stripHtml(activeArticle.excerpt?.rendered) && (
                  <p>{stripHtml(activeArticle.content.rendered)}</p>
                )}
              </div>

              <div className="pt-6 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                <button
                  onClick={() => removeBookmark(activeArticle.id)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Remove from Saved</span>
                </button>

                {activeArticle.link && (
                  <a
                    href={activeArticle.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 uppercase tracking-wider"
                  >
                    <span>Original Source</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Search & Filter Bar */}
              {savedPosts.length > 0 && (
                <div className="p-4 border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50">
                  <div className="relative">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search within saved articles..."
                      className="w-full pl-10 pr-4 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Saved Articles List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {savedPosts.length === 0 ? (
                  <div className="py-16 px-4 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-3xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center mb-4 border border-red-100 dark:border-red-900/40">
                      <Bookmark className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-serif font-black text-stone-900 dark:text-stone-100 mb-2">
                      No Saved Articles Yet
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-sm mb-6 leading-relaxed">
                      Tap the bookmark icon on any news card while browsing to save articles to this collection for instant offline reading.
                    </p>
                    <button
                      onClick={() => setSavedModalOpen(false)}
                      className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95"
                    >
                      Browse News Wire
                    </button>
                  </div>
                ) : filteredPosts.length === 0 ? (
                  <div className="py-12 text-center text-stone-500 dark:text-stone-400 text-sm">
                    No saved articles match &ldquo;{searchQuery}&rdquo;.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredPosts.map((post) => {
                      const title = stripHtml(post.title?.rendered || 'News Story');
                      const excerpt = stripHtml(post.excerpt?.rendered || '');
                      const content = stripHtml(post.content?.rendered || '');
                      const readingEstimate = calculateReadingTime(content, excerpt, title);
                      const image = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;

                      return (
                        <div
                          key={post.id || post.link}
                          onClick={() => setActiveArticle(post)}
                          className="group relative flex flex-col bg-white dark:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-700/80 p-4 hover:border-red-500 hover:shadow-xl transition-all cursor-pointer"
                        >
                          <div className="flex gap-4">
                            {/* Thumbnail */}
                            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-stone-100 dark:bg-stone-700">
                              {image ? (
                                <Image
                                  src={image}
                                  alt={title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-red-600 text-white font-serif font-bold text-xl">
                                  {(post.customSourceName || 'NP').substring(0, 2).toUpperCase()}
                                </div>
                              )}
                              {/* Reading time badge on image */}
                              <div className="absolute bottom-1 right-1">
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-black/80 text-white text-[9px] font-mono font-medium rounded border border-white/20">
                                  <BookOpen className="w-2.5 h-2.5 text-amber-400" />
                                  <span>{readingEstimate.minutes}m</span>
                                </span>
                              </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                              <div>
                                <div className="flex items-center justify-between text-[10px] text-stone-500 dark:text-stone-400 font-mono mb-1">
                                  <span className="font-bold text-red-600 dark:text-red-400 truncate max-w-[65%]">
                                    {post.customSourceName || 'Coastal Wire'}
                                  </span>
                                  <span>{dateFormat(post.date)}</span>
                                </div>
                                <h3 className="text-sm font-serif font-bold text-stone-900 dark:text-stone-100 line-clamp-2 leading-snug group-hover:text-red-600 transition-colors">
                                  {title}
                                </h3>
                                <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 mt-1 leading-relaxed">
                                  {excerpt || content}
                                </p>
                              </div>

                              {/* Card Actions */}
                              <div className="flex items-center justify-between pt-3 mt-2 border-t border-stone-100 dark:border-stone-700/60">
                                <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider group-hover:underline flex items-center gap-1">
                                  <span>Read Story</span>
                                  <ArrowLeft className="w-3 h-3 rotate-180" />
                                </span>

                                <div className="flex items-center gap-1">
                                  {post.link && (
                                    <button
                                      onClick={(e: React.MouseEvent) => handleShare(post.link, e)}
                                      className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
                                      title="Copy article link"
                                    >
                                      {copiedLink === post.link ? (
                                        <Check className="w-3.5 h-3.5 text-green-600" />
                                      ) : (
                                        <Share2 className="w-3.5 h-3.5" />
                                      )}
                                    </button>
                                  )}
                                  <button
                                    onClick={(e: React.MouseEvent) => {
                                      e.stopPropagation();
                                      removeBookmark(post.id || post.link);
                                    }}
                                    className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                                    title="Remove from saved"
                                    aria-label="Remove from saved"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Footer Bar */}
          <div className="p-3 sm:p-4 bg-stone-50 dark:bg-stone-900 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <span>{savedPosts.length} article{savedPosts.length === 1 ? '' : 's'} stored in browser</span>
            <button
              onClick={() => {
                setSavedModalOpen(false);
                setActiveArticle(null);
              }}
              className="px-4 py-1.5 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-200 font-bold hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
