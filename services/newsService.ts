import axios from 'axios';
import { WordPressPost, ApiErrorInfo } from '@/components/data/newsTypes';

const CACHE_PREFIX = 'np_news_cache_';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes TTL

interface CachePayload {
  timestamp: number;
  posts: WordPressPost[];
}

/**
 * Evicts expired or excessive news cache entries from localStorage to keep storage clean.
 */
const pruneCache = () => {
  if (typeof window === 'undefined') return;
  try {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) {
        keys.push(key);
      }
    }

    const now = Date.now();
    keys.forEach((key) => {
      try {
        const item = localStorage.getItem(key);
        if (item) {
          const parsed: CachePayload = JSON.parse(item);
          if (now - parsed.timestamp > CACHE_TTL_MS * 4) { // Remove entries older than 20 mins
            localStorage.removeItem(key);
          }
        }
      } catch (e) {
        localStorage.removeItem(key);
      }
    });
  } catch (e) {
    console.warn('Cache prune warning:', e);
  }
};

export interface FetchNewsResult {
  posts: WordPressPost[];
  error?: ApiErrorInfo | null;
}

/**
 * Smart fetcher with localStorage caching and stale-while-revalidate capabilities.
 * Reduces API calls by serving fresh cached feeds instantly.
 */
export const fetchNewsFeed = async (
  sourceId: string,
  searchQuery: string = '',
  page: number = 1,
  forceRefresh: boolean = false
): Promise<FetchNewsResult> => {
  const cacheKey = `${CACHE_PREFIX}${sourceId}_p${page}_q${searchQuery.trim().toLowerCase()}`;

  // 1. Try reading from localStorage cache if forceRefresh is false
  if (typeof window !== 'undefined' && !forceRefresh) {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed: CachePayload = JSON.parse(cached);
        const age = Date.now() - parsed.timestamp;
        
        if (age < CACHE_TTL_MS && Array.isArray(parsed.posts) && parsed.posts.length > 0) {
          // Serve instantly from local cache (0ms delay)
          return { posts: parsed.posts, error: null };
        }
      }
    } catch (e) {
      console.warn('Error reading local news cache:', e);
    }
  }

  // 2. Fetch fresh posts from API route
  try {
    const res = await axios.get('/api/posts', {
      params: {
        source: sourceId,
        search: searchQuery,
        page: page,
      },
    });

    const posts = Array.isArray(res.data) ? res.data : [];

    // Save response to localStorage cache if posts exist
    if (typeof window !== 'undefined' && posts.length > 0) {
      try {
        const payload: CachePayload = {
          timestamp: Date.now(),
          posts,
        };
        localStorage.setItem(cacheKey, JSON.stringify(payload));
        pruneCache();
      } catch (e) {
        console.warn('Failed to save posts to localStorage:', e);
      }
    }

    return { posts, error: null };
  } catch (error: any) {
    console.error('Service: Failed to fetch posts from API:', error);

    const responseData = error.response?.data;
    const status = responseData?.status || error.response?.status || (error.status ? parseInt(error.status, 10) : 500);
    const statusText = responseData?.statusText || error.response?.statusText || (
      status === 404 ? 'Not Found' :
      status === 403 ? 'Forbidden' :
      status === 401 ? 'Unauthorized' :
      status === 429 ? 'Too Many Requests' :
      status === 502 ? 'Bad Gateway' :
      status === 504 ? 'Gateway Timeout' : 'API Error'
    );
    const message = responseData?.message || responseData?.error || error.message || `API endpoint request failed with status ${status}`;

    const apiError: ApiErrorInfo = {
      status,
      statusText,
      message,
      endpoint: responseData?.endpoint || `/api/posts?source=${sourceId}&page=${page}`,
      sourceId,
      timestamp: responseData?.timestamp || new Date().toISOString(),
      details: responseData?.details || (responseData ? JSON.stringify(responseData, null, 2) : error.stack),
    };

    // 3. Offline / Error Fallback: Return stale cached data if available along with error
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const parsed: CachePayload = JSON.parse(cached);
          if (Array.isArray(parsed.posts) && parsed.posts.length > 0) {
            return { posts: parsed.posts, error: apiError };
          }
        }
      } catch (e) {}
    }

    return { posts: [], error: apiError };
  }
};
