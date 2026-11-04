import { useRouter } from 'next/router';
import React, { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';
import InshortsFeed from '@/components/news/inshortsFeed';
import { newsSources, NewsSource } from '@/components/data/newsSources';
import { useNewsFeed } from '@/lib/hooks/useNewsFeed';
import { ArrowLeft, Share2 } from 'lucide-react';
import { WordPressPost } from '@/components/data/newsTypes';

import GoogleLoader from '@/components/utility/loader';

import Header from '@/components/header/header';

export default function ReaderPage() {
  const router = useRouter();
  const { sourceId } = router.query;
  const { posts, loading, hasMore, fetchMore } = useNewsFeed();
  const [selectedSource, setSelectedSource] = useState<NewsSource | null>(null);
  const [savedPosts, setSavedPosts] = useState<WordPressPost[]>([]);
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState<'classic' | 'modern'>('classic');

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem('tv9_saved_posts');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setSavedPosts(parsed);
      }
    } catch (e) {
      console.error('Failed to load saved posts:', e);
    }
    
    try {
      const storedView = localStorage.getItem('news_view_mode') as 'classic' | 'modern';
      if (storedView) setViewMode(storedView);
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (mounted) {
      if (darkMode) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    }
  }, [darkMode, mounted]);

  useEffect(() => {
    if (sourceId) {
      const source = newsSources.find(s => s.id === sourceId);
      if (source) {
        setSelectedSource(source);
        fetchMore(source.id, '', 1, false);
      } else if (sourceId === 'all') {
        setSelectedSource(newsSources[0]); // All feeds
        fetchMore('all', '', 1, false);
      }
    }
  }, [sourceId, fetchMore]);

  const handleToggleBookmark = (post: WordPressPost) => {
    setSavedPosts((prev) => {
      const exists = prev.some((s) => s.id === post.id);
      const updated = exists ? prev.filter((s) => s.id !== post.id) : [...prev, post];
      localStorage.setItem('tv9_saved_posts', JSON.stringify(updated));
      return updated;
    });
  };

  const loadMore = () => {
    if (selectedSource) {
      const nextPage = Math.floor(posts.length / 10) + 1;
      fetchMore(selectedSource.id, '', nextPage, true);
    }
  };

  if (!mounted || !selectedSource) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-stone-50 dark:bg-stone-950">
        <GoogleLoader size="md" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{selectedSource?.kannadaName || 'Reader'} — NewsPulse</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover" />
      </Head>

      <div className="h-screen w-full overflow-hidden flex flex-col bg-white dark:bg-black transition-colors duration-500">
        <Header 
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          savedCount={savedPosts.length}
          onOpenSaved={() => {}} // Could link to saved modal later
          viewMode={viewMode}
          setViewMode={(mode) => {
            setViewMode(mode);
            localStorage.setItem('news_view_mode', mode);
            router.push('/');
          }}
        />

        <div className="flex-1 relative overflow-hidden">
          {/* Floating Back Button (Mobile Helper) */}
          <button 
            onClick={() => router.push('/')}
            className="fixed bottom-safe mb-20 right-6 z-50 p-4 bg-red-600 text-white rounded-full shadow-2xl active:scale-90 transition-transform lg:hidden"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <InshortsFeed
            posts={posts}
            savedPosts={savedPosts}
            onToggleBookmark={handleToggleBookmark}
            onLoadMore={loadMore}
            hasMore={hasMore}
            loadingMore={loading}
            sourceName={selectedSource?.kannadaName}
            language={selectedSource?.language as 'kn' | 'en'}
          />
        </div>
      </div>
    </>
  );
}
