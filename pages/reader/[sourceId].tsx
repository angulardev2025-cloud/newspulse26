import { useRouter } from 'next/router';
import React, { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';
import InshortsFeed from '@/components/news/inshortsFeed';
import { newsSources, NewsSource } from '@/components/data/newsSources';
import { useNewsFeed } from '@/lib/hooks/useNewsFeed';
import { ArrowLeft, Share2 } from 'lucide-react';
import { WordPressPost } from '@/components/data/newsTypes';

export default function ReaderPage() {
  const router = useRouter();
  const { sourceId } = router.query;
  const { posts, loading, hasMore, fetchMore } = useNewsFeed();
  const [selectedSource, setSelectedSource] = useState<NewsSource | null>(null);
  const [savedPosts, setSavedPosts] = useState<WordPressPost[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('tv9_saved_posts');
    if (stored) setSavedPosts(JSON.parse(stored));
  }, []);

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
        <div className="w-8 h-8 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{selectedSource?.kannadaName || 'Reader'} — NewsPulse</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover" />
      </Head>

      <div className="h-screen w-full overflow-hidden bg-black">
        {/* Floating Back Button */}
        <button 
          onClick={() => router.back()}
          className="fixed top-safe mt-4 left-4 z-50 p-3 bg-black/20 backdrop-blur-xl border border-white/10 rounded-full text-white shadow-2xl active:scale-90 transition-transform lg:mt-8 lg:left-8"
          aria-label="Go back"
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
    </>
  );
}
