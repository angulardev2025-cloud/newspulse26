import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import InshortsFeed from '@/components/news/inshortsFeed';
import { newsSources, NewsSource } from '@/components/data/newsSources';
import { useNewsFeed } from '@/lib/hooks/useNewsFeed';
import { ArrowLeft } from 'lucide-react';
import { WordPressPost } from '@/components/data/newsTypes';
import GoogleLoader from '@/components/utility/loader';
import DailyRitualLoader from '@/components/utility/dailyRitualLoader';
import Header from '@/components/header/header';
import { useTheme } from '@/lib/context/ThemeContext';
import { useBookmarks } from '@/lib/context/BookmarkContext';

const allSource: NewsSource = {
  id: 'all',
  name: 'All Coastal & Kannada Feeds',
  kannadaName: 'ಎಲ್ಲಾ ಕರಾವಳಿ ಮತ್ತು ಕನ್ನಡ ಸುದ್ದಿ ಮೂಲಗಳು',
  endpoint: '',
  description: 'Combined live wire across all Coastal and Kannada API endpoints.',
  category: 'General',
  language: 'kn',
  type: 'wordpress',
  logo: '/assets/aistudio/images_8efc4be7.png'
};

export default function ReaderPage({ initialSourceId }: { initialSourceId?: string }) {
  const router = useRouter();
  const sourceId = router.query.sourceId || initialSourceId;
  const { posts, loading, error, clearError, hasMore, fetchMore } = useNewsFeed();
  const { darkMode, setDarkMode } = useTheme();
  const { savedPosts, savedCount, toggleBookmark, setSavedModalOpen } = useBookmarks();
  
  const [mounted, setMounted] = useState(false);
  const [selectedSource, setSelectedSource] = useState<NewsSource | null>(null);
  const [viewMode, setViewMode] = useState<'classic' | 'modern'>('classic');

  useEffect(() => {
    setMounted(true);
    try {
      const storedView = localStorage.getItem('news_view_mode') as 'classic' | 'modern';
      if (storedView) setViewMode(storedView);
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (mounted && router.isReady && sourceId) {
      const srcId = Array.isArray(sourceId) ? sourceId[0] : sourceId;
      if (srcId === 'all') {
        setSelectedSource(newsSources.find(s => s.id === 'all') || allSource);
        fetchMore('all', '', 1, false);
      } else {
        const source = newsSources.find(s => s.id === srcId);
        if (source) {
          setSelectedSource(source);
          fetchMore(source.id, '', 1, false);
        } else {
          // Fallback to all if source ID is not matched
          setSelectedSource(newsSources[0] || allSource);
          fetchMore('all', '', 1, false);
        }
      }
    }
  }, [sourceId, router.isReady, fetchMore, mounted]);

  const handleToggleBookmark = (post: WordPressPost) => {
    toggleBookmark(post);
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
      router.push('/').catch(() => {});
    }
  };

  // SSR & Router Preparation Fallback
  if (!mounted || !router.isReady) {
    return (
      <div className="h-screen w-full bg-stone-50 dark:bg-stone-950 flex items-center justify-center">
        <GoogleLoader size="md" />
      </div>
    );
  }

  if (!selectedSource && loading) {
    return <DailyRitualLoader sourceName="Live Wire" targetCount={200} />;
  }

  if (!selectedSource && !loading) {
    return (
       <div className="h-screen w-full bg-stone-50 dark:bg-stone-950 flex flex-col items-center justify-center gap-4">
         <p className="text-stone-500 font-medium">Source not found or loading...</p>
         <button 
           onClick={() => router.push('/').catch(() => {})} 
           className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold shadow-md transition-all"
         >
           Back to Home Page
         </button>
       </div>
    );
  }

  const breadcrumbs = [
    { label: 'Feeds', href: '/' },
    { label: selectedSource?.kannadaName || selectedSource?.name || 'News Reader', isCurrent: true },
  ];

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
          savedCount={savedCount}
          onOpenSaved={() => setSavedModalOpen(true)} 
          viewMode={viewMode}
          setViewMode={handleViewChange}
          breadcrumbs={breadcrumbs}
        />

        <div className="flex-1 relative overflow-hidden">
          <button 
            onClick={() => router.push('/').catch(() => {})}
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
            error={error}
            onRetry={() => {
              if (selectedSource) {
                clearError();
                fetchMore(selectedSource.id, '', 1, false);
              }
            }}
            sourceName={selectedSource?.kannadaName}
            language={selectedSource?.language as 'kn' | 'en'}
          />
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context: any) {
  const { sourceId } = context.params || {};
  return {
    props: {
      initialSourceId: sourceId || 'all',
    },
  };
}

