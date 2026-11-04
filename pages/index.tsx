import Head from 'next/head';
import React, { useEffect, useState, useCallback } from 'react';
import InshortsFeed, { WordPressPost } from '@/components/news/inshortsFeed';
import Footer from '@/components/footer/footer';
import Search from '@/components/search/serach';
import Header from '@/components/header/header';
import ArticleModal from '@/components/news/articleModal';
import { useDebounce } from '@/components/utility/useDebounce';
import { OfflineIndicator } from '@/components/utility/pwaInstall';
import { newsSources, NewsSource } from '@/components/data/newsSources';
import axios from 'axios';
import { Newspaper, ArrowLeft, Globe, Radio } from 'lucide-react';
import { NewsItem } from '@/components/data/newsTypes';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [selectedSource, setSelectedSource] = useState<NewsSource | null>(null);
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 400);
  const [loading, setLoading] = useState(false);

  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  const [savedPosts, setSavedPosts] = useState<WordPressPost[]>([]);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('tv9_saved_posts');
    if (stored) setSavedPosts(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (mounted) {
      if (darkMode) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    }
  }, [darkMode, mounted]);

  const handleToggleBookmark = (post: WordPressPost) => {
    setSavedPosts((prev) => {
      const exists = prev.some((s) => s.id === post.id);
      const updated = exists ? prev.filter((s) => s.id !== post.id) : [...prev, post];
      localStorage.setItem('tv9_saved_posts', JSON.stringify(updated));
      return updated;
    });
  };

  const fetchPosts = useCallback(async (pageNum = 1, append = false) => {
    if (!append) setLoading(true);
    try {
      const res = await axios.get('/api/posts', {
        params: {
          source: selectedSource ? selectedSource.id : 'all',
          search: debouncedQuery,
          page: pageNum,
        },
      });
      const newPosts = res.data || [];
      if (newPosts.length === 0) setHasMore(false);
      else setPosts((prev) => (append ? [...prev, ...newPosts] : newPosts));
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedSource, debouncedQuery]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchPosts(1, false);
  }, [selectedSource, debouncedQuery, fetchPosts]);

  const loadMorePosts = () => {
    if (loading || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage, true);
  };

  const convertToNewsItem = (post: WordPressPost): NewsItem => {
    const stripHtml = (html: string) => (html ? html.replace(/<\/?[^>]+(>|$)/g, '') : '');
    return {
      name: stripHtml(post.title.rendered),
      url: post.link,
      image: { thumbnail: { contentUrl: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/assets/aistudio/image_a4df1d8f.png' } },
      description: stripHtml(post.excerpt.rendered),
      datePublished: post.date,
      provider: [{ name: selectedSource ? selectedSource.name : 'NewsPulse' }],
      content: stripHtml(post.content?.rendered || post.excerpt.rendered),
    };
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans">
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        savedCount={savedPosts.length}
        onOpenSaved={() => setShowSavedModal(true)}
      />

      <main className="max-w-5xl mx-auto px-4 py-6">
        {selectedSource ? (
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => setSelectedSource(null)} className="p-2 bg-stone-100 dark:bg-stone-800 rounded-xl">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold">{selectedSource.kannadaName}</h1>
          </div>
        ) : (
          <div className="text-center py-12">
            <h1 className="text-4xl font-bold mb-6">ಸುದ್ದಿ ಪಲ್ಸ್ — ಸುದ್ದಿ ಮೂಲಗಳು</h1>
            <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>
        )}

        {!selectedSource ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {newsSources.map((source) => (
              <div key={source.id} onClick={() => setSelectedSource(source)} className="p-6 bg-white dark:bg-stone-900 rounded-2xl cursor-pointer hover:border-red-500 border border-transparent">
                <h3 className="text-lg font-bold">{source.kannadaName}</h3>
                <p className="text-xs text-stone-500">{source.category} | {source.language.toUpperCase()}</p>
              </div>
            ))}
          </div>
        ) : (
          <InshortsFeed
            posts={posts}
            savedPosts={savedPosts}
            onToggleBookmark={handleToggleBookmark}
            onSelectPost={(post) => setSelectedArticle(convertToNewsItem(post))}
            onLoadMore={loadMorePosts}
            hasMore={hasMore}
            loadingMore={loading}
            sourceName={selectedSource.kannadaName}
            language={selectedSource.language}
          />
        )}
      </main>
      <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} isBookmarked={selectedArticle ? savedPosts.some((s) => s.link === selectedArticle.url) : false} onToggleBookmark={(art) => { const match = posts.find((p) => p.link === art.url); if (match) handleToggleBookmark(match); }} />
      <OfflineIndicator />
      <Footer />
    </div>
  );
}