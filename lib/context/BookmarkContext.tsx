'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { WordPressPost, NewsItem } from '@/components/data/newsTypes';

interface ToastState {
  message: string;
  type: 'add' | 'remove';
  id: number;
}

interface BookmarkContextType {
  savedPosts: WordPressPost[];
  savedCount: number;
  isSaved: (identifier: string | number | undefined) => boolean;
  toggleBookmark: (item: WordPressPost | NewsItem) => boolean;
  removeBookmark: (identifier: string | number) => void;
  clearAllBookmarks: () => void;
  savedModalOpen: boolean;
  setSavedModalOpen: (open: boolean) => void;
  toast: ToastState | null;
}

const BookmarkContext = createContext<BookmarkContextType>({
  savedPosts: [],
  savedCount: 0,
  isSaved: () => false,
  toggleBookmark: () => false,
  removeBookmark: () => {},
  clearAllBookmarks: () => {},
  savedModalOpen: false,
  setSavedModalOpen: () => {},
  toast: null,
});

const STORAGE_KEYS = ['newspulse_saved_articles', 'tv9_saved_posts'];

// Helper to normalize either WordPressPost or NewsItem into a uniform WordPressPost
export function normalizePost(item: WordPressPost | NewsItem): WordPressPost {
  if ('title' in item && typeof item.title === 'object' && item.title !== null) {
    return item as WordPressPost;
  }

  // Convert NewsItem to WordPressPost structure
  const news = item as NewsItem;
  // Generate a deterministic numeric id from URL
  const hash = Math.abs(
    (news.url || news.name || '')
      .split('')
      .reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
  );

  return {
    id: hash,
    date: news.datePublished || new Date().toISOString(),
    link: news.url || '',
    title: { rendered: news.name || 'News Story' },
    excerpt: { rendered: news.description || '' },
    content: { rendered: news.content || news.description || '' },
    _embedded: {
      'wp:featuredmedia': news.image?.thumbnail?.contentUrl
        ? [{ source_url: news.image.thumbnail.contentUrl }]
        : undefined,
    },
    customSourceName: news.provider?.[0]?.name || 'News Source',
  };
}

export const BookmarkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedPosts, setSavedPosts] = useState<WordPressPost[]>([]);
  const [savedModalOpen, setSavedModalOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true);
    try {
      let loaded: WordPressPost[] = [];
      for (const key of STORAGE_KEYS) {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            loaded = parsed;
            break;
          }
        }
      }
      if (loaded.length > 0) {
        setSavedPosts(loaded);
      }
    } catch (e) {
      console.warn('Failed to load bookmarks from localStorage:', e);
    }
  }, []);

  // Save to localStorage helper
  const persist = useCallback((posts: WordPressPost[]) => {
    setSavedPosts(posts);
    try {
      const json = JSON.stringify(posts);
      for (const key of STORAGE_KEYS) {
        localStorage.setItem(key, json);
      }
    } catch (e) {
      console.warn('Failed to persist bookmarks to localStorage:', e);
    }
  }, []);

  // Sync with changes from other tabs
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleStorage = (e: StorageEvent) => {
      if (e.key && STORAGE_KEYS.includes(e.key) && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setSavedPosts(parsed);
          }
        } catch (err) {}
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const triggerToast = useCallback((message: string, type: 'add' | 'remove') => {
    const id = Date.now();
    setToast({ message, type, id });
    setTimeout(() => {
      setToast((curr) => (curr?.id === id ? null : curr));
    }, 2800);
  }, []);

  const isSaved = useCallback(
    (identifier: string | number | undefined): boolean => {
      if (!identifier) return false;
      const strId = String(identifier).trim();
      return savedPosts.some(
        (p) =>
          String(p.id) === strId ||
          (p.link && p.link === strId) ||
          (p.title?.rendered && p.title.rendered === strId)
      );
    },
    [savedPosts]
  );

  const toggleBookmark = useCallback(
    (rawItem: WordPressPost | NewsItem): boolean => {
      const post = normalizePost(rawItem);
      const postLink = post.link || '';
      const postId = post.id;

      const existingIndex = savedPosts.findIndex(
        (p) =>
          (p.id && p.id === postId) ||
          (postLink && p.link === postLink) ||
          (p.title?.rendered && p.title.rendered === post.title.rendered)
      );

      if (existingIndex >= 0) {
        // Remove
        const updated = savedPosts.filter((_, idx) => idx !== existingIndex);
        persist(updated);
        triggerToast('Article removed from Saved Collection', 'remove');
        return false;
      } else {
        // Add to top of list
        const updated = [post, ...savedPosts];
        persist(updated);
        triggerToast('Saved to Collection for Offline Reading!', 'add');
        return true;
      }
    },
    [savedPosts, persist, triggerToast]
  );

  const removeBookmark = useCallback(
    (identifier: string | number) => {
      const strId = String(identifier).trim();
      const updated = savedPosts.filter(
        (p) =>
          String(p.id) !== strId &&
          (!p.link || p.link !== strId) &&
          (!p.title?.rendered || p.title.rendered !== strId)
      );
      persist(updated);
      triggerToast('Article removed from Saved Collection', 'remove');
    },
    [savedPosts, persist, triggerToast]
  );

  const clearAllBookmarks = useCallback(() => {
    persist([]);
    triggerToast('All saved articles cleared', 'remove');
  }, [persist, triggerToast]);

  return (
    <BookmarkContext.Provider
      value={{
        savedPosts,
        savedCount: savedPosts.length,
        isSaved,
        toggleBookmark,
        removeBookmark,
        clearAllBookmarks,
        savedModalOpen,
        setSavedModalOpen,
        toast,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = () => useContext(BookmarkContext);
