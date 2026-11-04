import axios from 'axios';
import { WordPressPost } from '@/components/data/newsTypes';

export const fetchNewsFeed = async (
  sourceId: string,
  searchQuery: string,
  page: number
): Promise<WordPressPost[]> => {
  try {
    const res = await axios.get('/api/posts', {
      params: {
        source: sourceId,
        search: searchQuery,
        page: page,
      },
    });
    return res.data || [];
  } catch (error) {
    console.error('Service: Failed to fetch posts', error);
    return [];
  }
};
