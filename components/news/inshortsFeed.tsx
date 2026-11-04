'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Bookmark, Share2, ExternalLink, Clock, Check, ChevronUp, ChevronDown } from 'lucide-react';
import { dateFormat } from '../utility/dateFormat';
import { WordPressPost } from '@/components/data/newsTypes';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';

interface InshortsFeedProps {
  posts: WordPressPost[];
  savedPosts: WordPressPost[];
  onToggleBookmark: (post: WordPressPost) => void;
  onLoadMore: () => void;
  hasMore: boolean;
  loadingMore: boolean;
  sourceName?: string;
  language?: 'kn' | 'en';
}

const stripHtml = (html: any) => {
  if (!html || typeof html !== 'string') return '';
  // Remove script and style tags and their contents
  let text = html.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '');
  // Remove all other HTML tags
  text = text.replace(/<\/?[^>]+(>|$)/g, '');
  // Unescape entities
  text = text.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  return text.trim();
};

const ArticleCard = ({ 
  post, 
  isSaved, 
  onToggleBookmark, 
  onShare, 
  copied, 
  language,
  index,
  total,
  sourceName
}: { 
  post: WordPressPost; 
  isSaved: boolean; 
  onToggleBookmark: () => void; 
  onShare: () => void; 
  copied: boolean;
  language: 'kn' | 'en';
  index: number;
  total: number;
  sourceName: string;
}) => {
  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const title = stripHtml(post.title?.rendered || 'News');
  const excerpt = stripHtml(post.excerpt?.rendered || '');
  const content = stripHtml(post.content?.rendered || '');
  
  // Combine excerpt and content to get enough text for 50-80 words
  const fullText = (excerpt + ' ' + content).split(/\s+/).slice(0, 80).join(' ');

  return (
    <div className="relative h-[100dvh] w-full snap-start flex flex-col bg-white dark:bg-stone-950 overflow-hidden">
      {/* Featured Image Section (35-45%) */}
      <div className="relative w-full h-[40vh] min-h-[300px] bg-stone-200 dark:bg-stone-800">
        {featuredMedia ? (
          <Image
            src={featuredMedia}
            alt={title}
            fill
            className="object-cover"
            priority={index < 2}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-600 to-red-900 text-white text-4xl font-bold">
            {sourceName.substring(0, 2).toUpperCase()}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
        
        {/* Source Badge */}
        <div className="absolute top-safe pt-4 left-4 z-10">
          <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-lg">
            {sourceName}
          </span>
        </div>

        {/* Story Index */}
        <div className="absolute top-safe pt-4 right-4 z-10">
          <span className="px-3 py-1 bg-black/40 backdrop-blur-md text-white text-[10px] font-medium rounded-full">
            {index + 1} of {total}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col px-6 py-6 overflow-y-auto bg-white dark:bg-stone-950">
        <div className="flex items-center gap-2 text-[10px] text-stone-500 dark:text-stone-400 mb-2 uppercase tracking-wide">
          <Clock className="w-3 h-3" />
          <span>{dateFormat(post.date)}</span>
        </div>
        
        <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 leading-tight mb-4 font-serif">
          {title}
        </h2>

        <p className="text-stone-700 dark:text-stone-300 text-base sm:text-lg leading-relaxed font-sans mb-8">
          {fullText}...
        </p>

        {/* Navigation Indicator / Swipe Guidance */}
        {index === 0 && (
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="mt-auto flex flex-col items-center text-stone-400 dark:text-stone-500 mb-4"
          >
            <ChevronUp className="w-5 h-5" />
            <span className="text-[10px] uppercase tracking-widest mt-1">Swipe Up for More</span>
          </motion.div>
        )}
      </div>

      {/* Action Bar (Pinned Bottom) */}
      <div className="p-4 bg-stone-50 dark:bg-stone-900/50 border-t border-stone-100 dark:border-stone-800/50 flex items-center justify-between safe-bottom">
        <div className="flex items-center gap-4">
          <button 
            onClick={onToggleBookmark}
            className={`p-2.5 rounded-full transition-colors ${isSaved ? 'bg-red-600 text-white' : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700'}`}
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
          <button 
            onClick={onShare}
            className="p-2.5 bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700 rounded-full transition-colors"
          >
            {copied ? <Check className="w-5 h-5 text-green-600" /> : <Share2 className="w-5 h-5" />}
          </button>
        </div>

        <a 
          href={post.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm font-bold transition-all shadow-md active:scale-95"
        >
          {language === 'kn' ? 'ಸಂಪೂರ್ಣ ಓದಿ' : 'Read Full Article'}
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};

export default function InshortsFeed({
  posts,
  savedPosts,
  onToggleBookmark,
  onLoadMore,
  hasMore,
  loadingMore,
  sourceName = 'NewsPulse',
  language = 'kn',
}: InshortsFeedProps) {
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleShare = (post: WordPressPost) => {
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
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (loadingMore || !hasMore) return;
      
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight - 200) {
        onLoadMore();
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasMore, onLoadMore]);

  if (!posts || posts.length === 0) {
    return (
      <div className="h-[100dvh] flex items-center justify-center text-stone-500 bg-white dark:bg-stone-950 px-6 text-center">
        {loadingMore ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin" />
            <p className="text-sm font-medium animate-pulse">Loading latest news...</p>
          </div>
        ) : (
          <p>{language === 'kn' ? 'ಯಾವುದೇ ಸುದ್ದಿ ಲಭ್ಯವಿಲ್ಲ' : 'No news found'}</p>
        )}
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="h-[100dvh] w-full overflow-y-auto snap-y snap-mandatory scroll-smooth hide-scrollbar bg-black"
    >
      <div className="max-w-2xl mx-auto shadow-2xl relative">
        {posts.map((post, index) => (
          <ArticleCard
            key={`${post.id}-${index}`}
            post={post}
            sourceName={sourceName}
            isSaved={savedPosts.some(s => s.id === post.id)}
            onToggleBookmark={() => onToggleBookmark(post)}
            onShare={() => handleShare(post)}
            copied={copiedId === post.id}
            language={language}
            index={index}
            total={posts.length}
          />
        ))}
        
        {loadingMore && (
          <div className="h-20 flex items-center justify-center bg-white dark:bg-stone-950">
            <div className="w-6 h-6 border-2 border-red-600/20 border-t-red-600 rounded-full animate-spin" />
          </div>
        )}
      </div>
      
      {/* Desktop Navigation Helper */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4 z-50">
        <button 
          onClick={() => containerRef.current?.scrollBy({ top: -window.innerHeight, behavior: 'smooth' })}
          className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/10 rounded-full text-white transition-all"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
        <button 
          onClick={() => containerRef.current?.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
          className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/10 rounded-full text-white transition-all"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
