import { useState, useCallback } from 'react';
import { fetchNewsFeed } from '@/services/newsService';
import { WordPressPost, ApiErrorInfo } from '@/components/data/newsTypes';

export const useNewsFeed = () => {
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiErrorInfo | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchMore = useCallback(async (
    sourceId: string, 
    searchQuery: string = '', 
    page: number = 1, 
    append: boolean = false
  ) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchNewsFeed(sourceId, searchQuery, page);
      if (result.error) {
        setError(result.error);
      }
      if (!result.posts || result.posts.length === 0) {
        setHasMore(false);
        if (!append && !result.error) {
          setError({
            status: 404,
            statusText: 'Not Found',
            message: `No news stories found for source "${sourceId}".`,
            endpoint: `/api/posts?source=${sourceId}&page=${page}`,
            sourceId,
            timestamp: new Date().toISOString(),
          });
        }
      } else {
        setPosts((prev) => (append ? [...prev, ...result.posts] : result.posts));
      }
    } catch (err: any) {
      setError({
        status: 500,
        statusText: 'Internal Error',
        message: err.message || 'An unexpected exception occurred while fetching news API.',
        endpoint: `/api/posts?source=${sourceId}&page=${page}`,
        sourceId,
        timestamp: new Date().toISOString(),
      });
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, []);

  return { posts, loading, error, setError, clearError, hasMore, fetchMore, setPosts };
};
