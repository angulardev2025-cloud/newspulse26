import { useState, useCallback } from 'react';
import { fetchNewsFeed } from '@/services/newsService';
import { WordPressPost } from '@/components/data/newsTypes';

export const useNewsFeed = () => {
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchMore = useCallback(async (
    sourceId: string, 
    searchQuery: string, 
    page: number, 
    append: boolean
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNewsFeed(sourceId, searchQuery, page);
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prev) => (append ? [...prev, ...data] : data));
      }
    } catch (err) {
      setError('Failed to fetch news.');
    } finally {
      setLoading(false);
    }
  }, []);

  return { posts, loading, error, hasMore, fetchMore, setPosts };
};
