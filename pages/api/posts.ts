import { NextApiRequest, NextApiResponse } from 'next';
import { newsSources } from '../../components/data/newsSources';
import { fetchWordPress } from '../../lib/fetchers/wordpressFetcher';
import { fetchRest } from '../../lib/fetchers/restFetcher';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { source, page = '1', search = '' } = req.query;
  const pageNum = parseInt(page as string, 10) || 1;
  const searchQuery = search as string;
  const targetSource = newsSources.find(s => s.id === source);

  try {
    let posts: any[] = [];
    
    if (targetSource && targetSource.endpoint) {
      if (targetSource.type === 'wordpress') {
        posts = await fetchWordPress(targetSource.endpoint, pageNum);
      } else {
        posts = await fetchRest(targetSource.endpoint, pageNum);
      }
    } else {
      // Aggregate from multiple Coastal/Kannada sources
      // Filter for active news sources with endpoints
      const activeSources = newsSources.filter(s => s.id !== 'all' && s.endpoint);
      
      const results = await Promise.all(
        activeSources.map(s => 
          (s.type === 'wordpress' ? fetchWordPress(s.endpoint, pageNum) : fetchRest(s.endpoint, pageNum))
            .catch((err) => {
              console.error(`Fetch failed for source ${s.id}: ${err.message}`);
              return [];
            })
        )
      );
      
      // Flatten and sort by date
      posts = results.flat().sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    }

    // Client-side search filtering (if needed, though WordPress usually handles it via query params)
    // Here we just return what we got.
    
    return res.status(200).json(posts);
  } catch (error: any) {
    console.error('API Fetch Error:', error.message);
    return res.status(200).json([]);
  }
}
