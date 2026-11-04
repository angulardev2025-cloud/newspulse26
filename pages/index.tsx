import Head from 'next/head';
import React, { useEffect, useState, useCallback } from 'react';
import Footer from '@/components/footer/footer';
import Search from '@/components/search/search';
import Header from '@/components/header/header';
import ArticleModal from '@/components/news/articleModal';
import { useDebounce } from '@/components/utility/useDebounce';
import { OfflineIndicator } from '@/components/utility/pwaInstall';
import { newsSources, NewsSource } from '@/components/data/newsSources';
import { useNewsFeed } from '@/lib/hooks/useNewsFeed';
import LogoSVG from '@/components/utility/logo';
import { ArrowLeft, Globe, Newspaper } from 'lucide-react';
import { useRouter } from 'next/router';
import { NewsItem, WordPressPost } from '@/components/data/newsTypes';
import ModernSourceGrid from '@/components/news/modernSourceGrid';

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { posts, loading, hasMore, fetchMore } = useNewsFeed();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 400);
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  const [savedPosts, setSavedPosts] = useState<WordPressPost[]>([]);
  const [showSavedModal, setShowSavedModal] = useState(false);
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
      if (storedView === 'classic' || storedView === 'modern') setViewMode(storedView);
    } catch (e) {
      console.error('Failed to load view mode:', e);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('news_view_mode', viewMode);
    }
  }, [viewMode, mounted]);

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

  const handleSourceClick = (source: NewsSource) => {
    router.push(`/reader/${source.id}`).catch(() => {});
  };

  if (!mounted) return null;

  return (
    <>
      <Head>
        <title>NewsPulse: Coastal & Kannada News</title>
        <meta name="description" content="Premium Inshorts-style news reader for Coastal Karnataka and Kannada news." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover" />
      </Head>
      
      <div className="min-h-screen bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans transition-colors duration-500">
        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          savedCount={savedPosts.length}
          onOpenSaved={() => setShowSavedModal(true)}
          viewMode={viewMode}
          setViewMode={setViewMode}
          breadcrumbs={[{ label: viewMode === 'modern' ? 'Modern Wire' : 'Classic Wire', isCurrent: true }]}
        />

        <main className="max-w-5xl mx-auto px-4 py-12">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-serif font-black mb-6 tracking-tighter text-stone-900 dark:text-stone-100">
              ಸುದ್ದಿ ಪಲ್ಸ್
            </h1>
            <p className="text-stone-500 dark:text-stone-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">
              Coastal Karnataka & Kannada News — Real-time editorial wire powered by NewsPulse.
            </p>
            <div className="mt-10 max-w-xl mx-auto">
              <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </div>
          </div>

          {(() => {
            const query = debouncedQuery.toLowerCase().trim();
            const filteredSources = newsSources.filter((s) => {
              if (!query) return true;
              return (
                s.name.toLowerCase().includes(query) ||
                s.kannadaName.toLowerCase().includes(query) ||
                s.category.toLowerCase().includes(query) ||
                s.id.toLowerCase().includes(query)
              );
            });

            return viewMode === 'modern' ? (
              <ModernSourceGrid sources={filteredSources} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {/* All Feeds Card */}
                {!query && (
                  <div 
                    onClick={() => router.push('/reader/all').catch(() => {})} 
                    className="p-8 bg-red-600 text-white rounded-[2rem] cursor-pointer hover:scale-[1.02] active:scale-95 transition-all flex flex-col justify-between shadow-2xl shadow-red-600/20"
                  >
                    <div className="flex items-center justify-between">
                      <LogoSVG name="ALL" logo="/assets/aistudio/images_8efc4be7.png" />
                      <div className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">Live Multi-Wire</div>
                    </div>
                    <div className="mt-12">
                      <h3 className="text-2xl font-bold font-serif">ಎಲ್ಲಾ ಸುದ್ದಿಗಳು</h3>
                      <p className="text-white/70 text-sm mt-2">Combined live feed from all Coastal & Kannada publishers.</p>
                    </div>
                  </div>
                )}

                {filteredSources.filter(s => s.id !== 'all').map((source) => (
                  <div 
                    key={source.id} 
                    onClick={() => handleSourceClick(source)} 
                    className="group p-8 bg-white dark:bg-stone-900 rounded-[2rem] border border-stone-200 dark:border-stone-800 cursor-pointer hover:border-red-500 hover:shadow-2xl hover:shadow-red-500/5 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-12">
                      <LogoSVG name={source.kannadaName} logo={source.logo} />
                      <div className="px-2 py-1 bg-stone-100 dark:bg-stone-800 rounded-full text-[10px] font-bold uppercase tracking-widest text-stone-500">{source.category}</div>
                    </div>
                    <div>
                      <h3 className="font-bold text-xl group-hover:text-red-600 transition-colors font-serif">{source.kannadaName}</h3>
                      <p className="text-sm text-stone-500 mt-2 font-medium">{source.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </main>

        <ArticleModal 
          article={selectedArticle} 
          onClose={() => setSelectedArticle(null)} 
          isBookmarked={selectedArticle ? savedPosts.some((s) => s.link === selectedArticle.url) : false} 
          onToggleBookmark={(art) => { 
              const match = savedPosts.find((p) => p && p.link === art.url);
              if (match) handleToggleBookmark(match); 
          }} 
        />
        <OfflineIndicator />
        <Footer />
      </div>
    </>
  );
}