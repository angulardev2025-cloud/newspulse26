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
import { ArrowLeft, Globe, Newspaper, Shuffle, ArrowRight } from 'lucide-react';
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
                {/* Remix / All Feeds Card */}
                {!query && (
                  <div 
                    onClick={() => router.push('/reader/all').catch(() => {})} 
                    className="group p-8 bg-red-600 text-white rounded-[2.5rem] cursor-pointer hover:scale-[1.02] active:scale-95 transition-all flex flex-col justify-between shadow-2xl shadow-red-600/30 border border-red-500 min-h-[320px]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="p-4 bg-white/20 rounded-3xl backdrop-blur-md">
                        <LogoSVG name="ALL" logo="/assets/aistudio/images_8efc4be7.png" />
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/20">Remix Wire</div>
                        <div className="flex items-center gap-1 text-white/60">
                           <Shuffle className="w-3 h-3 text-white" />
                           <span className="text-[10px] font-bold uppercase tracking-wider">Daily Ritual</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-8">
                      <h3 className="text-2xl md:text-3xl font-bold font-serif leading-tight">Remix All News</h3>
                      <p className="text-white/80 text-sm mt-3 leading-relaxed">Combined live feed from all 30+ Coastal & Kannada publisher APIs. Sorted by real-time publish date.</p>
                      
                      <div className="mt-6 flex items-center justify-between">
                         <div className="flex flex-col">
                            <span className="text-[9px] font-bold uppercase text-white/60 tracking-widest">Experience</span>
                            <span className="text-xs font-bold text-white">Multi-Wire Remix</span>
                         </div>
                         <button className="px-6 py-2.5 bg-white text-red-600 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 group-hover:gap-3 transition-all">
                            <span>Start Remix</span>
                            <ArrowRight className="w-4 h-4" />
                         </button>
                      </div>
                    </div>
                  </div>
                )}

                {filteredSources.filter(s => s.id !== 'all').map((source) => (
                  <div 
                    key={source.id} 
                    onClick={() => handleSourceClick(source)} 
                    className="group p-8 bg-white dark:bg-stone-900 rounded-[2.5rem] border border-stone-200 dark:border-stone-800 cursor-pointer hover:border-red-500 hover:shadow-2xl hover:shadow-red-500/5 transition-all duration-300 flex flex-col justify-between min-h-[320px]"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-2xl group-hover:scale-105 transition-transform duration-300">
                        <LogoSVG name={source.kannadaName} logo={source.logo} />
                      </div>
                      <div className="px-2.5 py-1 bg-stone-100 dark:bg-stone-800 rounded-full text-[10px] font-black uppercase tracking-widest text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-stone-700/50">{source.category}</div>
                    </div>
                    <div>
                      <h3 className="font-black text-xl md:text-2xl group-hover:text-red-600 transition-colors font-serif leading-tight">{source.kannadaName}</h3>
                      <p className="text-sm text-stone-500 dark:text-stone-400 mt-2 font-medium line-clamp-2">{source.name}</p>
                      
                      <div className="mt-8 flex items-center justify-between border-t border-stone-100 dark:border-stone-800/60 pt-5">
                         <div className="flex flex-col">
                            <span className="text-[9px] font-bold uppercase text-stone-400 tracking-widest">Experience</span>
                            <span className="text-xs font-bold text-stone-900 dark:text-stone-200">Inshorts Reader</span>
                         </div>
                         <button className="px-5 py-2.5 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 group-hover:bg-red-600 group-hover:text-white transition-all">
                            <span>Read Now</span>
                            <ArrowRight className="w-4 h-4" />
                         </button>
                      </div>
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