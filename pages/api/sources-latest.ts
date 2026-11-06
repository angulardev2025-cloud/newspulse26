import { NextApiRequest, NextApiResponse } from 'next';
import { newsSources } from '../../components/data/newsSources';
import { fetchWordPress } from '../../lib/fetchers/wordpressFetcher';
import { fetchRest } from '../../lib/fetchers/restFetcher';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Filter out 'all' source
    const activeSources = newsSources.filter(s => s.id !== 'all' && s.endpoint);

    const latestPosts = await Promise.all(
      activeSources.map(async (source) => {
        try {
          const posts = source.type === 'wordpress' 
            ? await fetchWordPress(source.endpoint, 1) 
            : await fetchRest(source.endpoint, 1);
          
          return {
            sourceId: source.id,
            latestPost: posts.length > 0 ? posts[0] : null
          };
        } catch (error: any) {
          console.error(`Fetch failed for ${source.id}: ${error.message}`);
          return {
            sourceId: source.id,
            latestPost: null
          };
        }
      })
    );

    return res.status(200).json(latestPosts);
  } catch (error: any) {
    const status = error.response?.status || 500;
    console.error('Sources Latest API Error:', error.message || error);
    return res.status(status).json({ 
      error: 'Failed to fetch latest posts',
      status,
      statusText: 'Internal Server Error',
      message: error.message || 'An unexpected error occurred while querying latest source posts.',
      endpoint: '/api/sources-latest',
      timestamp: new Date().toISOString()
    });
  }
}
