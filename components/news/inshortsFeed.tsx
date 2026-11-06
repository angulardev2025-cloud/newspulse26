'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Bookmark, Share2, ExternalLink, Clock, Check, ChevronUp, ChevronDown, AlertCircle, Home, Globe, BookOpen } from 'lucide-react';
import { dateFormat } from '../utility/dateFormat';
import { WordPressPost, ApiErrorInfo } from '@/components/data/newsTypes';
import { newsSources, extractDomainBadge } from '@/components/data/newsSources';
import { calculateReadingTime } from '@/lib/utility/readingTime';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import GoogleLoader from '../utility/loader';
import DailyRitualLoader from '../utility/dailyRitualLoader';
import { useRouter } from 'next/router';
import ReadingProgressBar from '../utility/readingProgressBar';
import ApiErrorBanner from '../utility/apiErrorBanner';

interface InshortsFeedProps {
  posts: WordPressPost[];
  savedPosts: WordPressPost[];
  onToggleBookmark: (post: WordPressPost) => void;
  onLoadMore: () => void;
  hasMore: boolean;
  loadingMore: boolean;
  error?: ApiErrorInfo | string | null;
  onRetry?: () => void;
  sourceName?: string;
  language?: 'kn' | 'en';
}

const stripHtml = (html: any) => {
  if (!html || typeof html !== 'string') return '';
  let text = html.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '');
  text = text.replace(/<\/?[^>]+(>|$)/g, '');
  text = text.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  return text.trim();
};

const cardVariants = {
  enter: (direction: number) => ({
    y: direction > 0 ? '100%' : '-100%',
    opacity: 1,
  }),
  center: {
    zIndex: 1,
    y: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    y: direction > 0 ? '-100%' : '100%',
    opacity: 1,
  }),
};

interface ArticleCardProps {
  post: WordPressPost; 
  isSaved: boolean; 
  onToggleBookmark: () => void; 
  onShare: () => void; 
  copied: boolean;
  language: 'kn' | 'en';
  index: number;
  total: number;
  sourceName: string;
  direction: number;
  onNext: () => void;
  onPrev: () => void;
}

const ArticleCard = React.forwardRef<HTMLDivElement, ArticleCardProps>(({ 
  post, 
  isSaved, 
  onToggleBookmark, 
  onShare, 
  copied, 
  language,
  index,
  total,
  sourceName,
  direction,
  onNext,
  onPrev,
}, ref) => {
  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const title = stripHtml(post.title?.rendered || 'News');
  const excerpt = stripHtml(post.excerpt?.rendered || '');
  const content = stripHtml(post.content?.rendered || '');
  
  const fullText = (excerpt + ' ' + content).split(/\s+/).slice(0, 80).join(' ');
  const readingEstimate = calculateReadingTime(content, excerpt, title);
  
  // Calculate dynamic batch count based on active sources
  const activeSourcesCount = newsSources.filter(s => s.id !== 'all' && s.endpoint).length;
  const isMultiWire = sourceName === 'All Feeds' || Boolean((post as any).customSourceName);
  const batchSize = isMultiWire ? Math.max(10, activeSourcesCount * 10) : 10;
  const batchLimit = Math.max(batchSize, Math.ceil((index + 1) / batchSize) * batchSize);

  // Extract domain badge from URL domain (e.g. UDUPITIMES, PUBLICTV, VIJAYAVANI)
  const domainBadge = (post as any).customDomainBadge || extractDomainBadge(post.link || '');

  return (
    <motion.div 
      ref={ref}
      custom={direction}
      variants={cardVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ 
        y: { type: "tween", duration: 0.3, ease: [0.25, 1, 0.5, 1] }
      }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.15}
      onDragEnd={(_e: unknown, { offset, velocity }: { offset: { x: number; y: number }; velocity: { x: number; y: number } }) => {
        if (offset.y < -40 || velocity.y < -200) {
          onNext();
        } else if (offset.y > 40 || velocity.y > 200) {
          onPrev();
        }
      }}
      className="absolute inset-0 w-full h-full flex flex-col bg-white dark:bg-stone-950 overflow-hidden select-none cursor-grab active:cursor-grabbing rounded-none sm:rounded-3xl border-0 sm:border border-stone-200 dark:border-stone-800 shadow-2xl"
    >
      {/* Featured Image Section (35-45%) */}
      <div className="relative w-full h-[42vh] min-h-[280px] bg-stone-200 dark:bg-stone-800 overflow-hidden">
        {featuredMedia ? (
          <motion.div 
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full relative"
          >
            <Image
              src={featuredMedia}
              alt={title}
              fill
              className="object-cover pointer-events-none"
              priority={index < 3}
              loading={index < 3 ? 'eager' : 'lazy'}
              quality={85}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 672px"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-600 to-red-900 text-white text-4xl font-bold">
            {sourceName.substring(0, 2).toUpperCase()}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30 pointer-events-none" />
        
        {/* Top Source Badge */}
        <div className="absolute top-safe pt-4 left-4 z-10">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-1.5 px-3 py-1 bg-red-600 text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-lg"
          >
            {(post as any).customSourceLogo && (
              <div className="relative w-3.5 h-3.5 rounded-full overflow-hidden shrink-0 border border-white/40">
                <Image src={(post as any).customSourceLogo} alt="Source" fill className="object-cover" referrerPolicy="no-referrer" />
              </div>
            )}
            <span>{(post as any).customSourceName || sourceName}</span>
          </motion.div>
        </div>

        {/* Story Index & Quick Bookmark */}
        <div className="absolute top-safe pt-4 right-4 z-10 flex items-center gap-2">
          <motion.button
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onToggleBookmark();
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-all active:scale-90 border shadow-md flex items-center justify-center ${
              isSaved
                ? 'bg-red-600 text-white border-red-500 shadow-red-600/30'
                : 'bg-black/60 text-white border-white/20 hover:bg-black/80'
            }`}
            title={isSaved ? 'Saved to collection (offline available)' : 'Bookmark for offline viewing'}
            aria-label={isSaved ? 'Saved to collection' : 'Bookmark article'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
          </motion.button>

          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold rounded-full border border-white/10 tracking-wider font-mono shadow-md"
          >
            {index + 1}/{batchLimit}
          </motion.span>
        </div>

        {/* Thumbnail URL Domain Badge (e.g. UDUPITIMES, PUBLICTV) */}
        {domainBadge && (
          <div className="absolute bottom-3 left-4 z-10">
            <motion.span 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black/80 backdrop-blur-md text-white text-[9px] font-mono font-black rounded-lg border border-white/20 uppercase tracking-widest shadow-md"
            >
              <Globe className="w-3 h-3 text-red-500 shrink-0" />
              <span>{domainBadge}</span>
            </motion.span>
          </div>
        )}

        {/* Reading Time Badge on Image */}
        <div className="absolute bottom-3 right-4 z-10">
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black/80 backdrop-blur-md text-white text-[10px] font-mono font-bold rounded-lg border border-white/20 uppercase tracking-wider shadow-md"
            title={`Estimated reading time: ${readingEstimate.text} (~${readingEstimate.words} words)`}
          >
            <BookOpen className="w-3 h-3 text-amber-400 shrink-0" />
            <span>{readingEstimate.text}</span>
          </motion.span>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col px-6 py-5 overflow-y-auto bg-white dark:bg-stone-950">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex items-center gap-2 text-[10px] text-stone-500 dark:text-stone-400 mb-2 uppercase tracking-wide font-mono flex-wrap"
        >
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-red-500" />
            <span>{dateFormat(post.date)}</span>
          </div>
          <span className="text-stone-300 dark:text-stone-700">·</span>
          <span className="inline-flex items-center gap-1 text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800/80 px-2 py-0.5 rounded-md text-[10px] font-semibold border border-stone-200/60 dark:border-stone-700/60">
            <BookOpen className="w-3 h-3 text-amber-500" />
            <span>{readingEstimate.text}</span>
            <span className="text-stone-400 dark:text-stone-500 font-normal">({readingEstimate.words} words)</span>
          </span>
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 leading-snug mb-3 font-serif"
        >
          {title}
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-stone-700 dark:text-stone-300 text-base sm:text-lg leading-relaxed font-sans mb-6"
        >
          {fullText}...
        </motion.p>

        {/* Swipe Guidance on first story */}
        {index === 0 && (
          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="mt-auto flex flex-col items-center text-stone-400 dark:text-stone-500 mb-2 pointer-events-none"
          >
            <ChevronUp className="w-5 h-5 text-red-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest mt-0.5">Swipe Up for Next Story</span>
          </motion.div>
        )}
      </div>

      {/* Action Bar (Pinned Bottom) */}
      <div className="p-4 bg-stone-50 dark:bg-stone-900/60 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between safe-bottom z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleBookmark(); }}
            className={`p-3 rounded-2xl transition-all active:scale-90 flex items-center gap-1.5 ${
              isSaved 
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20' 
                : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-100'
            }`}
            aria-label="Bookmark article"
            title={isSaved ? "Saved to Collection (Offline Available)" : "Save to Offline Collection"}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            <span className="text-xs font-bold hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onShare(); }}
            className="p-3 bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 rounded-2xl transition-all active:scale-90 hover:bg-stone-100"
            aria-label="Share article"
          >
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>

        <a 
          href={post.link} 
          target="_blank" 
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-xs font-bold transition-all shadow-md active:scale-95 uppercase tracking-wider"
        >
          <span>{language === 'kn' ? 'ಸಂಪೂರ್ಣ ಓದಿ' : 'Read Full Article'}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </motion.div>
  );
});
ArticleCard.displayName = 'ArticleCard';

export default function InshortsFeed({
  posts,
  savedPosts,
  onToggleBookmark,
  onLoadMore,
  hasMore,
  loadingMore,
  error,
  onRetry,
  sourceName = 'NewsPulse',
  language = 'kn',
}: InshortsFeedProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const isWheelingRef = useRef(false);

  const activeSourcesCount = newsSources.filter(s => s.id !== 'all' && s.endpoint).length;
  const isMultiWire = sourceName === 'All Feeds' || sourceName === 'ಎಲ್ಲಾ ಕರಾವಳಿ ಮತ್ತು ಕನ್ನಡ ಸುದ್ದಿ ಮೂಲಗಳು';
  const targetBatchTotal = isMultiWire ? Math.max(10, activeSourcesCount * 10) : 10;

  const nextCard = useCallback(() => {
    if (currentIndex < posts.length - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    } else if (hasMore && !loadingMore) {
      onLoadMore();
    }
  }, [currentIndex, posts.length, hasMore, loadingMore, onLoadMore]);

  const prevCard = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  // Pre-fetch next page when nearing end
  useEffect(() => {
    if (currentIndex >= posts.length - 2 && hasMore && !loadingMore) {
      onLoadMore();
    }
  }, [currentIndex, posts.length, hasMore, loadingMore, onLoadMore]);

  const handleShare = useCallback((post: WordPressPost) => {
    if (navigator.share) {
      navigator.share({
        title: stripHtml(post.title?.rendered || 'News'),
        text: stripHtml(post.excerpt?.rendered || ''),
        url: post.link,
      }).catch(() => {
        navigator.clipboard.writeText(post.link);
        setCopiedId(post.id);
        setTimeout(() => setCopiedId(null), 2000);
      });
    } else {
      navigator.clipboard.writeText(post.link);
      setCopiedId(post.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  }, []);

  // Keyboard Navigation (Up/Down)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        nextCard();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        prevCard();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextCard, prevCard]);

  // Wheel Navigation with threshold
  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    if (isWheelingRef.current) return;
    if (Math.abs(e.deltaY) > 30) {
      isWheelingRef.current = true;
      if (e.deltaY > 0) {
        nextCard();
      } else {
        prevCard();
      }
      setTimeout(() => {
        isWheelingRef.current = false;
      }, 500);
    }
  }, [nextCard, prevCard]);

  // Daily Ritual Loader during initial multi-wire sync
  if (loadingMore && (!posts || posts.length === 0)) {
    return <DailyRitualLoader sourceName={sourceName} targetCount={targetBatchTotal} />;
  }

  // Graceful Error & Empty state when no posts are available
  if (!loadingMore && (!posts || posts.length === 0)) {
    const errorInfo: ApiErrorInfo = error
      ? typeof error === 'string'
        ? { status: 500, message: error, timestamp: new Date().toISOString() }
        : error
      : {
          status: 404,
          statusText: 'No Stories Found',
          message: `No news posts found for "${sourceName}".`,
          sourceName,
          timestamp: new Date().toISOString(),
        };

    return (
      <div className="min-h-[80vh] w-full flex flex-col items-center justify-center bg-stone-50 dark:bg-stone-950 p-4 sm:p-8">
        <div className="max-w-lg w-full">
          <ApiErrorBanner
            error={errorInfo}
            onRetry={onRetry || onLoadMore}
            title={`Unable to load live wire for ${sourceName}`}
          />
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => router.push('/')}
              className="px-8 py-3 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-full font-bold text-xs uppercase tracking-wider shadow-md hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white transition-all flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home Wire</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentPost = posts[currentIndex] || posts[0];
  const progressPercent = posts.length > 0 ? Math.round(((currentIndex + 1) / posts.length) * 100) : 0;

  return (
    <div 
      onWheel={handleWheel}
      className="relative w-full h-[calc(100vh-65px)] h-[calc(100dvh-65px)] max-w-2xl mx-auto overflow-hidden bg-stone-100 dark:bg-stone-950 sm:py-4 flex flex-col"
    >
      <ReadingProgressBar progress={progressPercent} />

      {/* Floating Error Banner if live update failed but cached stories exist */}
      {error && (
        <div className="px-3 pt-2 z-20 shrink-0">
          <ApiErrorBanner
            error={error}
            compact
            onRetry={onRetry || onLoadMore}
            title="Live update warning"
          />
        </div>
      )}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        {currentPost && (
          <ArticleCard
            key={currentPost.id}
            post={currentPost}
            sourceName={sourceName}
            isSaved={savedPosts.some(s => s.id === currentPost.id)}
            onToggleBookmark={() => onToggleBookmark(currentPost)}
            onShare={() => handleShare(currentPost)}
            copied={copiedId === currentPost.id}
            language={language}
            index={currentIndex}
            total={posts.length}
            direction={direction}
            onNext={nextCard}
            onPrev={prevCard}
          />
        )}
      </AnimatePresence>

      {/* Desktop Navigation Helper Chevrons */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4 z-50">
        <button 
          onClick={prevCard}
          disabled={currentIndex === 0}
          className="p-3 bg-stone-900/80 hover:bg-stone-900 backdrop-blur-xl border border-white/10 rounded-full text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xl active:scale-90"
          aria-label="Previous story"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
        <button 
          onClick={nextCard}
          disabled={currentIndex === posts.length - 1 && !hasMore}
          className="p-3 bg-stone-900/80 hover:bg-stone-900 backdrop-blur-xl border border-white/10 rounded-full text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xl active:scale-90"
          aria-label="Next story"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
