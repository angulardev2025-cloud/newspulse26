import { useRouter } from 'next/router';
import React, { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';
import InshortsFeed from '@/components/news/inshortsFeed';
import { newsSources, NewsSource } from '@/components/data/newsSources';
import { useNewsFeed } from '@/lib/hooks/useNewsFeed';
import { ArrowLeft } from 'lucide-react';
import { WordPressPost } from '@/components/data/newsTypes';
import GoogleLoader from '@/components/utility/loader';
import Header from '@/components/header/header';

export default function ReaderPage() {
  const router = useRouter();
  const { sourceId } = router.query;
  const { posts, loading, hasMore, fetchMore } = useNewsFeed();
  
  const [mounted, setMounted] = useState(false);
  const [selectedSource, setSelectedSource] = useState<NewsSource | null>(null);
  const [savedPosts, setSavedPosts] = useState<WordPressPost[]>([]);
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
    if (mounted && sourceId) {
      const source = newsSources.find(s => s.id === sourceId);
      if (source) {
        setSelectedSource(source);
        fetchMore(source.id, '', 1, false);
      } else if (sourceId === 'all') {
        setSelectedSource(newsSources[0]);
        fetchMore('all', '', 1, false);
      }
    }
  }, [sourceId, fetchMore, mounted]);

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

  const handleViewChange = (mode: 'classic' | 'modern') => {
    setViewMode(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('news_view_mode', mode);
      router.push('/');
    }
  };

  // SSR Fallback
  if (!mounted) {
    return (
      <div className="h-screen w-full bg-stone-50 dark:bg-stone-950 flex items-center justify-center">
        <GoogleLoader size="md" />
      </div>
    );
  }

  if (!selectedSource && !loading) {
    return (
       <div className="h-screen w-full bg-stone-50 dark:bg-stone-950 flex flex-col items-center justify-center gap-4">
         <p className="text-stone-500">Source not found or loading...</p>
         <button onClick={() => router.push('/')} className="px-6 py-2 bg-red-600 text-white rounded-full font-bold">Back to Home</button>
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
          onOpenSaved={() => {}} 
          viewMode={viewMode}
          setViewMode={handleViewChange}
        />

        <div className="flex-1 relative overflow-hidden">
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
