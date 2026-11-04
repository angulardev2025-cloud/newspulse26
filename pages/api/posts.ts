import { NextApiRequest, NextApiResponse } from 'next';
import { newsSources, extractDomainBadge } from '../../components/data/newsSources';
import { fetchWordPress } from '../../lib/fetchers/wordpressFetcher';
import { fetchRest } from '../../lib/fetchers/restFetcher';

// Server-side in-memory cache to optimize API hits across all requests
const SERVER_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const postsCache = new Map<string, { timestamp: number; data: any[] }>();

function getCachedPosts(key: string): any[] | null {
  const cached = postsCache.get(key);
  if (!cached) return null;
  if (Date.now() - cached.timestamp > SERVER_CACHE_TTL_MS) {
    postsCache.delete(key);
    return null;
  }
  return cached.data;
}

function setCachedPosts(key: string, data: any[]) {
  // Cap server cache entries to prevent memory overflow
  if (postsCache.size > 100) {
    const oldestKey = postsCache.keys().next().value;
    if (oldestKey) postsCache.delete(oldestKey);
  }
  postsCache.set(key, { timestamp: Date.now(), data });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { source = 'all', page = '1', search = '', refresh = 'false' } = req.query;
  const pageNum = parseInt(page as string, 10) || 1;
  const searchQuery = (search as string).trim().toLowerCase();
  const isForceRefresh = refresh === 'true';

  const cacheKey = `posts_${source}_p${pageNum}_q${searchQuery}`;

  // 1. Return from Server Memory Cache if fresh and not force-refreshed
  if (!isForceRefresh) {
    const cachedData = getCachedPosts(cacheKey);
    if (cachedData && cachedData.length > 0) {
      res.setHeader('X-Data-Source', 'Server-Cache');
      return res.status(200).json(cachedData);
    }
  }

  const targetSource = newsSources.find(s => s.id === source);

  try {
    let posts: any[] = [];
    
    if (targetSource && targetSource.endpoint) {
      const fetched = targetSource.type === 'wordpress' 
        ? await fetchWordPress(targetSource.endpoint, pageNum) 
        : await fetchRest(targetSource.endpoint, pageNum);

      posts = (fetched || []).map((item: any) => ({
        ...item,
        customSourceName: targetSource.kannadaName || targetSource.name,
        customSourceId: targetSource.id,
        customSourceLogo: targetSource.logo,
        customCategory: targetSource.category,
        customDomainBadge: extractDomainBadge(targetSource.endpoint || item.link),
      }));
    } else {
      // Aggregate, shuffle & remix from ALL active Coastal & Kannada publisher sources
      const activeSources = newsSources.filter(s => s.id !== 'all' && s.endpoint);
      
      const results = await Promise.all(
        activeSources.map(async (s) => {
          try {
            const fetched = s.type === 'wordpress' 
              ? await fetchWordPress(s.endpoint, pageNum) 
              : await fetchRest(s.endpoint, pageNum);

            if (!Array.isArray(fetched)) return [];

            return fetched.map((item: any) => ({
              ...item,
              customSourceName: s.kannadaName || s.name,
              customSourceId: s.id,
              customSourceLogo: s.logo,
              customCategory: s.category,
              customDomainBadge: extractDomainBadge(s.endpoint || item.link),
            }));
          } catch (err) {
            // Gracefully skip any source endpoint that is offline or failing
            return [];
          }
        })
      );
      
      // Flatten all returned items, filter non-null entries with dates
      const allFetched = results
        .flat()
        .filter((item): item is any => Boolean(item && item.date && item.title?.rendered));

      // Strictly sort by published timestamp (newest first)
      posts = allFetched.sort((a, b) => {
        const timeA = new Date(a.date).getTime() || 0;
        const timeB = new Date(b.date).getTime() || 0;
        return timeB - timeA;
      });
    }

    // Apply search filter if query provided
    if (searchQuery) {
      posts = posts.filter((item) => {
        const titleText = (item.title?.rendered || '').toLowerCase();
        const excerptText = (item.excerpt?.rendered || '').toLowerCase();
        return titleText.includes(searchQuery) || excerptText.includes(searchQuery);
      });
    }

    // Save to Server Memory Cache
    if (posts.length > 0) {
      setCachedPosts(cacheKey, posts);
    }
    
    res.setHeader('X-Data-Source', 'Live-API');
    return res.status(200).json(posts || []);
  } catch (error: any) {
    const status = error.response?.status || (error.status ? parseInt(error.status, 10) : 500);
    console.error(`API Fetch Error (${status}):`, error.message || error);

    // Fallback: If live fetch fails, try serving stale server cache if available
    const staleData = postsCache.get(cacheKey)?.data;
    if (staleData && staleData.length > 0) {
      res.setHeader('X-Data-Source', 'Stale-Cache');
      return res.status(200).json(staleData);
    }

    return res.status(status).json({ 
      error: 'Failed to fetch news', 
      status, 
      message: 'nothing to show to back to home page' 
    });
  }
}
